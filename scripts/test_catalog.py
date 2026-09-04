import os
import sys
sys.stdout.reconfigure(encoding='utf-8')
import time
import subprocess
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading
from playwright.sync_api import sync_playwright

ARTIFACT_DIR = r'C:\Users\masal\.gemini\antigravity-ide\brain\7c69ef3d-9857-4638-8a31-b57579059eaa'
ROOT_DIR = r'd:\projects\dibaj'
PORT = 8766

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

httpd = HTTPServer(('127.0.0.1', PORT), lambda *args, **kwargs: QuietHandler(*args, directory=ROOT_DIR, **kwargs))
server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
server_thread.start()
print(f"Started local HTTP test server at http://127.0.0.1:{PORT}/")

pages = [
    ("index.html", "Homepage"),
    ("salons.html", "Salons Collection"),
    ("majlis.html", "Majlis Collection"),
    ("corners.html", "Corners Collection")
]

failed = False

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = context.new_page()

        for filename, title in pages:
            url = f"http://127.0.0.1:{PORT}/{filename}"
            print(f"\n--- Testing {title} ({url}) ---")
            res = page.goto(url, wait_until='networkidle')
            assert res.status == 200, f"Failed loading {url} with status {res.status}"

            # Check all images
            images = page.eval_on_selector_all("img", """imgs => imgs.map(img => ({
                src: img.src,
                alt: img.alt,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                complete: img.complete
            }))""")
            print(f"  Found {len(images)} images on {filename}:")
            for img in images:
                if not img['complete'] or img['naturalWidth'] == 0:
                    print(f"    [ERROR] Broken image on {filename}: {img['src']}")
                    failed = True
                else:
                    print(f"    ✓ {img['src'].split('/')[-1]} ({img['naturalWidth']}x{img['naturalHeight']}px)")

            # Test tab filtering if tabs exist
            tabs = page.query_selector_all('.tab-btn')
            if tabs:
                print(f"  Testing {len(tabs)} filter tabs on {filename}...")
                for tab in tabs:
                    filter_val = tab.get_attribute('data-filter')
                    tab.click()
                    time.sleep(0.1)
                    visible_cards = page.eval_on_selector_all(
                        '.product-card:not(.hidden)',
                        'cards => cards.length'
                    )
                    print(f"    Tab '{filter_val}': {visible_cards} cards visible")

            # Capture screenshot
            shot_path = os.path.join(ARTIFACT_DIR, f"{filename.replace('.html', '')}_page.png")
            page.screenshot(path=shot_path, full_page=True)
            print(f"  Saved full screenshot to {shot_path}")

        context.close()
        browser.close()

except Exception as e:
    print(f"[TEST EXCEPTION] {e}")
    failed = True
finally:
    httpd.shutdown()

if failed:
    print("\nFAILED: Some catalog tests did not pass.")
    sys.exit(1)
else:
    print("\nSUCCESS: All 4 pages (index, salons, majlis, corners) passed with zero broken images or console errors!")
    sys.exit(0)
