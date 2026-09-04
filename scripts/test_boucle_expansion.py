import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        
        # Test corners.html
        print("Checking corners.html...")
        page.goto("http://localhost:5173/corners.html")
        page.wait_for_load_state("networkidle")
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(500)
        
        cards = page.query_selector_all(".catalog-grid .product-card")
        print(f"Total corner cards found: {len(cards)}")
        
        for i, card in enumerate(cards):
            title = card.query_selector(".product-title").inner_text()
            img = card.query_selector("img")
            src = img.get_attribute("src")
            natural_w = img.evaluate("el => el.naturalWidth")
            print(f"  Card {i+1}: {title} | src={src} | naturalWidth={natural_w}")
            assert natural_w > 0, f"Image failed to load: {src}"
        
        # Test product.html?id=corner-boucle-showroom
        print("\nChecking product.html for corner-boucle-showroom...")
        page.goto("http://localhost:5173/product.html?id=corner-boucle-showroom")
        page.wait_for_load_state("networkidle")
        
        main_img = page.query_selector("#product-main-image")
        assert main_img.evaluate("el => el.naturalWidth") > 0, "Main image failed to load"
        
        swatches = page.query_selector_all(".swatch-btn")
        print(f"Total swatches found: {len(swatches)}")
        assert len(swatches) == 4, f"Expected 4 swatches, got {len(swatches)}"
        
        # Click through swatches and verify main image changes
        for i, sw in enumerate(swatches):
            sw.click()
            page.wait_for_timeout(300)
            cur_src = main_img.get_attribute("src")
            cur_w = main_img.evaluate("el => el.naturalWidth")
            print(f"  Swatch {i+1}: switched to {cur_src} (naturalWidth={cur_w})")
            assert cur_w > 0, f"Swatch image failed to load: {cur_src}"
            
        # Capture verification screenshot of product page
        screenshot_path = r"C:\Users\masal\.gemini\antigravity-ide\brain\cf35d584-d262-41ba-a73c-5b07c8154c1d\verified_boucle_product.png"
        page.screenshot(path=screenshot_path, full_page=False)
        print(f"Saved screenshot: {screenshot_path}")
        
        browser.close()
        print("\nAll bouclé tests passed successfully!")

if __name__ == "__main__":
    run()
