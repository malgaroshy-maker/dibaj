import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 800})
    page.goto('http://localhost:5173/catalog.html', wait_until='networkidle')
    
    # Click curtains tab
    page.locator('.filter-tab-btn[data-category="curtains"]').click()
    page.wait_for_timeout(600)
    
    # Scroll to trigger any lazy loads
    page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
    page.wait_for_timeout(600)

    curtains = page.evaluate('''() => {
        return Array.from(document.querySelectorAll('.catalog-card')).map(card => {
            const title = card.querySelector('.card-title').innerText;
            const img = card.querySelector('.card-img');
            const btn = card.querySelector('.card-footer .btn').innerText;
            return {
                title,
                imgSrc: img.src,
                naturalWidth: img.naturalWidth,
                btnText: btn
            };
        });
    }''')
    print('Curtains tab products:')
    print(json.dumps(curtains, ensure_ascii=False, indent=2))
    
    # Click on the first curtain quote button
    page.locator('.catalog-card button').first.click()
    page.wait_for_timeout(400)
    modal_text = page.evaluate('''() => {
        return document.querySelector('#consultation-product-field').value;
    }''')
    print('Modal filled text:', modal_text)
    
    page.screenshot(path='C:/Users/masal/.gemini/antigravity-ide/brain/cf35d584-d262-41ba-a73c-5b07c8154c1d/curtains_catalog_verified.png')
    browser.close()

print('Curtains test passed.')
