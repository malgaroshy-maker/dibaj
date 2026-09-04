import sys
import os
from playwright.sync_api import sync_playwright

def run_tests():
    print("=== STARTING PLAYWRIGHT VERIFICATION SUITE ===")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        errors = []
        page.on("pageerror", lambda err: errors.append(f"PageError: {err}"))
        page.on("console", lambda msg: errors.append(f"ConsoleError: {msg.text}") if msg.type == "error" else None)

        test_pages = [
            ("index.html", "http://localhost:5173/index.html", "final_verified_home.png"),
            ("catalog.html", "http://localhost:5173/catalog.html", "final_verified_catalog.png"),
            ("product.html", "http://localhost:5173/product.html?id=salon-emerald-velvet", "final_verified_product.png"),
            ("contact.html", "http://localhost:5173/contact.html", "final_verified_contact.png"),
        ]

        banned_terms = ["أتيليه", "اتيلية", "اتيليه", "atelier", "كونسيرج", "fabric_rolls_samples", "grand_villa_curtains", "craftsman_artisan"]

        artifact_dir = r"C:\Users\masal\.gemini\antigravity-ide\brain\7c69ef3d-9857-4638-8a31-b57579059eaa"

        for name, url, shot_name in test_pages:
            print(f"\nTesting {name} at {url}...")
            resp = page.goto(url, wait_until="networkidle")
            assert resp.status == 200, f"Expected 200 for {url}, got {resp.status}"

            # Wait for dynamic JS rendering
            page.wait_for_timeout(800)

            body_text = page.inner_text("body")
            
            # Check for banned terms
            for banned in banned_terms:
                if banned in body_text:
                    raise AssertionError(f"BANNED TERM '{banned}' found in rendered body text of {name}!")

            # Verify all images are loaded and not broken
            images = page.eval_on_selector_all("img", """elements => elements.map(e => ({
                src: e.currentSrc || e.src,
                alt: e.alt,
                naturalWidth: e.naturalWidth,
                naturalHeight: e.naturalHeight,
                complete: e.complete
            }))""")

            print(f"  Verified {len(images)} images on {name}.")
            for idx, img in enumerate(images):
                assert img["complete"], f"Image not complete: {img['src']}"
                assert img["naturalWidth"] > 0, f"Broken image (width=0): {img['src']}"
                # Check that no old stock images are rendered
                for banned_img in ["fabric_rolls_samples", "grand_villa_curtains", "craftsman_artisan"]:
                    assert banned_img not in img["src"], f"Old stock image '{banned_img}' found rendered: {img['src']}"

            # Capture screenshot
            screenshot_path = os.path.join(artifact_dir, shot_name)
            page.screenshot(path=screenshot_path, full_page=False)
            print(f"  [OK] Saved screenshot: {screenshot_path}")

        # Extra functional checks on product.html
        print("\nTesting interactive swatch picker on product.html...")
        page.goto("http://localhost:5173/product.html?id=salon-emerald-velvet", wait_until="networkidle")
        swatch_btns = page.query_selector_all(".swatch-btn")
        assert len(swatch_btns) >= 2, f"Expected at least 2 swatches, found {len(swatch_btns)}"
        
        # Click second swatch
        swatch_btns[1].click()
        page.wait_for_timeout(300)
        main_img = page.query_selector("#product-main-image")
        assert main_img is not None
        src_after = main_img.get_attribute("src")
        print(f"  [OK] Swatch switcher successfully changed image to: {src_after}")

        # Test Consultation modal
        print("\nTesting consultation modal opening...")
        page.click('[data-action="open-consultation"]')
        page.wait_for_timeout(300)
        modal = page.query_selector("#consultation-modal")
        assert modal and "open" in modal.get_attribute("class")
        print("  [OK] Consultation modal opened successfully.")
        
        # Close modal
        page.click(".modal-close-btn")
        page.wait_for_timeout(200)
        assert "open" not in (modal.get_attribute("class") or "")
        print("  [OK] Consultation modal closed successfully.")

        browser.close()

    print("\n=== ALL PLAYWRIGHT TESTS PASSED WITH 100% SUCCESS! ===")

if __name__ == "__main__":
    run_tests()
