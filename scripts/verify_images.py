import sys
from playwright.sync_api import sync_playwright

pages_to_test = [
    ("index.html", "Homepage"),
    ("catalog.html", "Catalog"),
    ("product.html?id=imperial-damask-gold", "Product Detail"),
    ("contact.html", "Contact")
]

failed_images = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    for path, name in pages_to_test:
        url = f"http://127.0.0.1:5173/{path}"
        print(f"Checking images on {name} ({url})...")
        response = page.goto(url, wait_until="networkidle")
        if response.status != 200:
            print(f"Failed to load {url}: status {response.status}")
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

    browser.close()

if failed_images:
    print(f"\nFAILED: {len(failed_images)} broken image(s) detected!")
    sys.exit(1)
else:
    print("\nSUCCESS: All images loaded with full resolution across all pages!")
    sys.exit(0)
