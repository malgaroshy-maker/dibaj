import sys
import os
import json
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "https://malgaroshy-maker.github.io/dibaj"
BRAIN_DIR = r"C:\Users\masal\.gemini\antigravity-ide\brain\cf35d584-d262-41ba-a73c-5b07c8154c1d"

def check_images(page, page_name):
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.wait_for_timeout(600)
    images = page.query_selector_all("img")
    broken = []
    total = len(images)
    for img in images:
        src = img.get_attribute("src") or ""
        nw = img.evaluate("el => el.naturalWidth")
        if nw == 0:
            broken.append(src)
    print(f"[{page_name}] Checked {total} images. Broken: {len(broken)}")
    if broken:
        print(f"  Broken URLs on {page_name}: {broken}")
    assert len(broken) == 0, f"Found broken images on {page_name}: {broken}"

def run():
    results = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # Listen for console errors
        errors = []
        page.on("pageerror", lambda err: errors.append(str(err)))

        # 1. Homepage
        print(f"\n1. Testing Homepage at {BASE_URL}/ ...")
        res = page.goto(f"{BASE_URL}/")
        assert res.status == 200, f"Homepage returned status {res.status}"
        page.wait_for_load_state("networkidle")
        check_images(page, "Homepage")
        home_shot = os.path.join(BRAIN_DIR, "live_gh_homepage.png")
        page.screenshot(path=home_shot, full_page=False)
        print(f"Saved: {home_shot}")

        # 2. Corners Page
        print(f"\n2. Testing Corners page at {BASE_URL}/corners.html ...")
        res = page.goto(f"{BASE_URL}/corners.html")
        assert res.status == 200, f"Corners page returned status {res.status}"
        page.wait_for_load_state("networkidle")
        check_images(page, "Corners")
        corner_shot = os.path.join(BRAIN_DIR, "live_gh_corners.png")
        page.screenshot(path=corner_shot, full_page=False)
        print(f"Saved: {corner_shot}")

        # 3. Product Page (Bouclé Corner)
        print(f"\n3. Testing Product page at {BASE_URL}/product.html?id=corner-boucle-showroom ...")
        res = page.goto(f"{BASE_URL}/product.html?id=corner-boucle-showroom")
        assert res.status == 200, f"Product page returned status {res.status}"
        page.wait_for_load_state("networkidle")
        check_images(page, "Product (Initial)")
        
        main_img = page.query_selector("#product-main-image")
        swatches = page.query_selector_all(".swatch-btn")
        print(f"Testing {len(swatches)} swatches/angles on live product page...")
        for i, sw in enumerate(swatches):
            sw.click()
            page.wait_for_timeout(350)
            src = main_img.get_attribute("src")
            nw = main_img.evaluate("el => el.naturalWidth")
            print(f"  Swatch {i+1}: src={src} | naturalWidth={nw}")
            assert nw > 0, f"Swatch image broken on live site: {src}"

        product_shot = os.path.join(BRAIN_DIR, "live_gh_product_boucle.png")
        page.screenshot(path=product_shot, full_page=False)
        print(f"Saved: {product_shot}")

        # 4. Curtains Page
        print(f"\n4. Testing Curtains page at {BASE_URL}/curtains.html ...")
        res = page.goto(f"{BASE_URL}/curtains.html")
        assert res.status == 200, f"Curtains page returned status {res.status}"
        page.wait_for_load_state("networkidle")
        check_images(page, "Curtains")
        curtains_shot = os.path.join(BRAIN_DIR, "live_gh_curtains.png")
        page.screenshot(path=curtains_shot, full_page=False)
        print(f"Saved: {curtains_shot}")

        # 5. Catalog Page
        print(f"\n5. Testing Catalog page at {BASE_URL}/catalog.html ...")
        res = page.goto(f"{BASE_URL}/catalog.html")
        assert res.status == 200, f"Catalog page returned status {res.status}"
        page.wait_for_load_state("networkidle")
        check_images(page, "Catalog")
        catalog_shot = os.path.join(BRAIN_DIR, "live_gh_catalog.png")
        page.screenshot(path=catalog_shot, full_page=False)
        print(f"Saved: {catalog_shot}")

        # 6. Gallery Page
        print(f"\n6. Testing Gallery page at {BASE_URL}/gallery.html ...")
        res = page.goto(f"{BASE_URL}/gallery.html")
        assert res.status == 200, f"Gallery page returned status {res.status}"
        page.wait_for_load_state("networkidle")
        check_images(page, "Gallery")
        gallery_shot = os.path.join(BRAIN_DIR, "live_gh_gallery.png")
        page.screenshot(path=gallery_shot, full_page=False)
        print(f"Saved: {gallery_shot}")

        print(f"\nConsole errors detected: {len(errors)}")
        if errors:
            print("Errors:", errors)
        assert len(errors) == 0, f"Page had JS errors: {errors}"

        browser.close()
        print("\nAll live GitHub Pages verified successfully!")

if __name__ == "__main__":
    run()
