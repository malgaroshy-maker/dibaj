import sys
from playwright.sync_api import sync_playwright

base_url = "https://malgaroshy-maker.github.io/dibaj"

pages_to_test = [
    (f"{base_url}/index.html", "Homepage"),
    (f"{base_url}/catalog.html", "Catalog"),
    (f"{base_url}/product.html?id=imperial-damask-gold", "Product Detail"),
    (f"{base_url}/contact.html", "Contact")
]

failed_images = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    for url, name in pages_to_test:
        print(f"Testing LIVE page: {name} ({url})...")
        response = page.goto(url, wait_until="networkidle")
        if response.status != 200:
            print(f"  [ERROR] Page failed: status {response.status}")
            failed_images.append(url)
            continue

        images = page.eval_on_selector_all("img", """imgs => imgs.map(img => ({
            src: img.src,
            alt: img.alt,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            complete: img.complete
        }))""")

        print(f"  Found {len(images)} images.")
        for img in images:
            if not img['complete'] or img['naturalWidth'] == 0:
                print(f"  [ERROR] BROKEN IMAGE: {img['src']}")
                failed_images.append((name, img['src']))
            else:
                print(f"  [OK] Loaded: {img['src'].split('/')[-1]} ({img['naturalWidth']}x{img['naturalHeight']}px)")

    # Capture live homepage screenshot as proof
    page.goto(f"{base_url}/index.html", wait_until="networkidle")
    page.screenshot(path="C:/Users/masal/.gemini/antigravity-ide/brain/43607806-db2b-4224-af8c-3c01ff875aca/live_github_pages.png", full_page=True)
    browser.close()

if failed_images:
    print(f"\nFAILED: {len(failed_images)} broken image(s) on LIVE GitHub Pages!")
    sys.exit(1)
else:
    print("\nSUCCESS: All images loaded perfectly on LIVE GitHub Pages!")
    sys.exit(0)
