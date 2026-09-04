import sys
import os
import urllib.parse
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

BRAIN_DIR = r"C:\Users\masal\.gemini\antigravity-ide\brain\cf35d584-d262-41ba-a73c-5b07c8154c1d"

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 950})
        
        errors = []
        page.on("pageerror", lambda err: errors.append(str(err)))
        
        print("1. Opening Customizer Studio at http://localhost:5173/product.html ...")
        page.goto("http://localhost:5173/product.html")
        page.wait_for_load_state("networkidle")
        
        # Verify Model Ribbon
        ribbon_cards = page.query_selector_all("#studio-model-ribbon .model-ribbon-card")
        print(f"  Found {len(ribbon_cards)} models in ribbon")
        assert len(ribbon_cards) > 10, f"Expected >10 models, got {len(ribbon_cards)}"
        
        # Verify Category Filter
        print("2. Testing category filters...")
        page.click("button.studio-filter-btn[data-filter='corners']")
        page.wait_for_timeout(300)
        corner_cards = page.query_selector_all("#studio-model-ribbon .model-ribbon-card")
        print(f"  Corners filter returned: {len(corner_cards)} models")
        assert len(corner_cards) >= 2, "Corners filter failed"
        
        # Click on Bouclé Corner card
        print("3. Switching model to Bouclé Corner...")
        boucle_card = page.query_selector(".model-ribbon-card[data-id='corner-boucle-showroom']")
        assert boucle_card is not None, "Bouclé corner card not found"
        boucle_card.click()
        page.wait_for_timeout(400)
        
        # Check active title and main image
        product_title = page.inner_text("#product-title")
        print(f"  Active model title: {product_title}")
        assert "البوكليه" in product_title, f"Expected Bouclé in title, got {product_title}"
        
        main_img = page.query_selector("#product-main-image")
        nw = main_img.evaluate("el => el.naturalWidth")
        print(f"  Main image naturalWidth: {nw}")
        assert nw > 0, "Main image failed to load after model switch"
        
        # Test Shape Selector
        print("4. Testing shape selector...")
        page.click(".shape-card[data-shape='u-shape']")
        page.wait_for_timeout(300)
        assert page.query_selector("#dim-side-c") is not None, "U-Shape side C input missing"
        
        page.click(".shape-card[data-shape='classic-set']")
        page.wait_for_timeout(300)
        assert page.query_selector("#dim-sofa-3") is not None, "Classic set sofa-3 input missing"
        
        page.click(".shape-card[data-shape='l-shape']")
        page.wait_for_timeout(300)
        assert page.query_selector("#dim-side-a") is not None, "L-Shape side A input missing"
        
        # Test Dynamic Calculation
        print("5. Testing dynamic calculations...")
        page.fill("#dim-side-a", "5.0")
        page.fill("#dim-side-b", "3.0")
        page.wait_for_timeout(300)
        
        meters_text = page.inner_text("#calc-result-meters")
        capacity_text = page.inner_text("#calc-result-capacity")
        print(f"  Calculated meters: {meters_text} | Capacity: {capacity_text}")
        assert "14.4" in meters_text, f"Expected 14.4 meters, got {meters_text}"
        
        # Test WhatsApp Link Encoding
        print("6. Testing WhatsApp order message...")
        wa_href = page.get_attribute("#product-wa-btn", "href")
        decoded_wa = urllib.parse.unquote(wa_href)
        print("  WhatsApp message snippet:\n" + "\n".join(decoded_wa.split("\n")[:7]))
        assert "ركنية البوكليه" in decoded_wa, "WhatsApp message missing model title"
        assert "شكل زاوية (L-Shape)" in decoded_wa, "WhatsApp message missing shape"
        assert "5م" in decoded_wa or "5.0" in decoded_wa or "5" in decoded_wa, "WhatsApp message missing dimensions"
        assert "إسفنج 35 D" in decoded_wa, "WhatsApp message missing foam spec"
        
        # Take verification screenshot
        shot_path = os.path.join(BRAIN_DIR, "verified_customizer_studio.png")
        page.screenshot(path=shot_path, full_page=False)
        print(f"7. Saved studio screenshot: {shot_path}")
        
        assert len(errors) == 0, f"Detected console errors: {errors}"
        browser.close()
        print("\nAll Customizer Studio tests passed successfully!")

if __name__ == "__main__":
    run()
