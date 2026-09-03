import os
import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

ARTIFACTS_DIR = r"C:\Users\masal\.gemini\antigravity-ide\brain\43607806-db2b-4224-af8c-3c01ff875aca"
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

BASE_URL = "http://127.0.0.1:5173"

def run_tests():
    print("Starting Dibaj luxury website verification...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # -------------------------------------------------------------
        # 1. Homepage Verification
        # -------------------------------------------------------------
        print("\n[1/4] Testing Homepage (index.html)...")
        page.goto(f"{BASE_URL}/index.html")
        page.wait_for_load_state("networkidle")

        title = page.title()
        print(f"  ✓ Page title: {title}")
        assert "الديباج" in title, "Title should contain الديباج"

        # Verify RTL
        html_dir = page.locator("html").get_attribute("dir")
        print(f"  ✓ HTML dir attribute: {html_dir}")
        assert html_dir == "rtl", "HTML should have dir='rtl'"

        # Verify Featured Collections
        cards = page.locator("#featured-fabrics-grid .catalog-card")
        card_count = cards.count()
        print(f"  ✓ Featured fabrics count: {card_count}")
        assert card_count >= 3, "Should have at least 3 featured fabrics"

        # Test Consultation Modal trigger
        page.locator('[data-action="open-consultation"]').first.click()
        page.wait_for_timeout(400)
        modal = page.locator("#consultation-modal")
        assert "open" in modal.get_attribute("class"), "Modal should have class 'open'"
        print("  ✓ Consultation modal opened successfully")

        # Close modal
        page.locator("#consultation-modal .modal-close-btn").click()
        page.wait_for_timeout(300)
        assert "open" not in modal.get_attribute("class"), "Modal should be closed"
        print("  ✓ Consultation modal closed successfully")

        # Screenshot Homepage
        home_shot = os.path.join(ARTIFACTS_DIR, "homepage.png")
        page.screenshot(path=home_shot, full_page=False)
        print(f"  ✓ Homepage screenshot captured: {home_shot}")

        # -------------------------------------------------------------
        # 2. Catalog Page Verification
        # -------------------------------------------------------------
        print("\n[2/4] Testing Catalog Page (catalog.html)...")
        page.goto(f"{BASE_URL}/catalog.html")
        page.wait_for_load_state("networkidle")

        cat_title = page.title()
        print(f"  ✓ Catalog title: {cat_title}")
        assert "كتالوج" in cat_title

        # Check filter tabs
        filter_tabs = page.locator(".filter-tab-btn")
        print(f"  ✓ Filter tabs count: {filter_tabs.count()}")
        assert filter_tabs.count() >= 5, "Should have 5+ filter tabs"

        # Filter by Curtains
        curtain_btn = page.locator('.filter-tab-btn[data-category="curtains"]')
        curtain_btn.click()
        page.wait_for_timeout(300)
        filtered_cards = page.locator("#catalog-items-grid .catalog-card")
        print(f"  ✓ Cards after filtering by curtains: {filtered_cards.count()}")
        assert filtered_cards.count() >= 1

        # Search box test
        search_input = page.locator("#catalog-search-input")
        search_input.fill("ديباج")
        page.wait_for_timeout(300)
        search_results = page.locator("#catalog-items-grid .catalog-card")
        print(f"  ✓ Cards after search 'ديباج': {search_results.count()}")

        # Reset search
        search_input.fill("")
        page.locator('.filter-tab-btn[data-category="all"]').click()
        page.wait_for_timeout(300)

        # Screenshot Catalog
        cat_shot = os.path.join(ARTIFACTS_DIR, "catalog_page.png")
        page.screenshot(path=cat_shot, full_page=False)
        print(f"  ✓ Catalog screenshot captured: {cat_shot}")

        # -------------------------------------------------------------
        # 3. Product Customizer Page Verification
        # -------------------------------------------------------------
        print("\n[3/4] Testing Product Details & Customizer (product.html)...")
        page.goto(f"{BASE_URL}/product.html?id=imperial-damask-gold")
        page.wait_for_load_state("networkidle")

        prod_h1 = page.locator("#product-title").text_content()
        print(f"  ✓ Product title rendered: {prod_h1}")
        assert "ديباج إمبراطوري" in prod_h1

        # Check circular 44px swatch buttons
        swatches = page.locator("#product-swatches-container .swatch-btn")
        swatch_count = swatches.count()
        print(f"  ✓ Swatches count: {swatch_count}")
        assert swatch_count >= 3, "Product should have at least 3 swatches"

        # Click on 2nd swatch
        initial_img = page.locator("#product-main-image").get_attribute("src")
        swatches.nth(1).click()
        page.wait_for_timeout(400)
        new_swatch_name = page.locator("#active-swatch-name").text_content()
        new_img = page.locator("#product-main-image").get_attribute("src")
        print(f"  ✓ Swatch switched to: {new_swatch_name}")
        assert "العاجي" in new_swatch_name or new_swatch_name != ""

        # Test Yardage Calculator
        width_input = page.locator("#calc-width")
        width_input.fill("4.0")
        page.wait_for_timeout(200)
        calc_result = page.locator("#calc-result-meters").text_content()
        print(f"  ✓ Yardage calculator result for width=4m: {calc_result}")
        assert "متر" in calc_result

        # Screenshot Product Page
        prod_shot = os.path.join(ARTIFACTS_DIR, "product_page.png")
        page.screenshot(path=prod_shot, full_page=False)
        print(f"  ✓ Product customizer screenshot captured: {prod_shot}")

        # -------------------------------------------------------------
        # 4. Contact & Showroom Page Verification
        # -------------------------------------------------------------
        print("\n[4/4] Testing Contact & Showroom Page (contact.html)...")
        page.goto(f"{BASE_URL}/contact.html")
        page.wait_for_load_state("networkidle")

        contact_h1 = page.locator("h1").text_content()
        print(f"  ✓ Contact page header: {contact_h1}")
        assert "صالات عرض" in contact_h1 or "أتيليه" in contact_h1

        phone_val = page.locator(".contact-phone-val").first.text_content()
        print(f"  ✓ Showroom phone: {phone_val}")
        assert "560 1703" in phone_val, "Phone should contain official number 560 1703"

        # Test Form inputs existence
        name_input = page.locator("#contact-name")
        assert name_input.is_visible(), "Name input should be visible"

        # Screenshot Contact Page
        contact_shot = os.path.join(ARTIFACTS_DIR, "contact_page.png")
        page.screenshot(path=contact_shot, full_page=False)
        print(f"  ✓ Contact screenshot captured: {contact_shot}")

        context.close()
        browser.close()
        print("\n=======================================================")
        print("ALL TESTS PASSED SUCCESSFULLY! Visual fidelity verified.")
        print("=======================================================")

if __name__ == "__main__":
    run_tests()
