from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 800})
    
    # 1. Curtains page
    page.goto('http://localhost:5173/curtains.html', wait_until='networkidle')
    page.screenshot(path='C:/Users/masal/.gemini/antigravity-ide/brain/cf35d584-d262-41ba-a73c-5b07c8154c1d/verified_curtains_page.png')

    # 2. Index page curtains spotlight
    page.goto('http://localhost:5173/index.html', wait_until='networkidle')
    section = page.locator('section:has-text("تنسيق الستائر بنفس قماش صالونك")')
    if section.count() > 0:
        section.screenshot(path='C:/Users/masal/.gemini/antigravity-ide/brain/cf35d584-d262-41ba-a73c-5b07c8154c1d/verified_home_curtains.png')
    
    # 3. Catalog page curtains tab
    page.goto('http://localhost:5173/catalog.html', wait_until='networkidle')
    page.locator('.filter-tab-btn[data-category="curtains"]').click()
    page.wait_for_timeout(600)
    page.screenshot(path='C:/Users/masal/.gemini/antigravity-ide/brain/cf35d584-d262-41ba-a73c-5b07c8154c1d/verified_catalog_curtains.png')

    browser.close()
print('All screenshots saved.')
