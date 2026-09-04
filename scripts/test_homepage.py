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
PORT = 8765

# 1. Start lightweight local HTTP server in background thread
class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

httpd = HTTPServer(('127.0.0.1', PORT), lambda *args, **kwargs: QuietHandler(*args, directory=ROOT_DIR, **kwargs))
server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
server_thread.start()
print(f"Started local HTTP test server at http://127.0.0.1:{PORT}/")

test_url = f"http://127.0.0.1:{PORT}/index.html"
failed = False

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # Test 1: Desktop Viewport (1440x900)
        context_desktop = browser.new_context(viewport={'width': 1440, 'height': 900})
        page_desktop = context_desktop.new_page()
        
        broken_network_requests = []
        page_desktop.on("response", lambda r: broken_network_requests.append(r.url) if r.status >= 400 else None)
        
        print(f"Navigating to {test_url} on Desktop (1440px)...")
        res = page_desktop.goto(test_url, wait_until='networkidle')
        assert res.status == 200, f"Failed with status {res.status}"
        
        # Verify images
        images = page_desktop.eval_on_selector_all("img", """imgs => imgs.map(img => ({
            src: img.src,
            alt: img.alt,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            complete: img.complete
        }))""")
        print(f"Checking {len(images)} images on desktop...")
        for img in images:
            if not img['complete'] or img['naturalWidth'] == 0:
                print(f"  [ERROR] Broken image: {img['src']}")
                failed = True
            else:
                print(f"  ✓ {img['src'].split('/')[-1]}: {img['naturalWidth']}x{img['naturalHeight']}px")
        
        if broken_network_requests:
            print(f"[ERROR] 404/Error requests detected: {broken_network_requests}")
            failed = True

        # Capture Desktop screenshot
        desktop_shot = os.path.join(ARTIFACT_DIR, 'homepage_desktop.png')
        page_desktop.screenshot(path=desktop_shot, full_page=True)
        print(f"Saved desktop screenshot to {desktop_shot}")

        # Test Quote Modal interaction
        print("Testing Quote Modal open and interaction...")
        page_desktop.click('[data-action="open-quote"]')
        page_desktop.wait_for_selector('#quoteModal.active', state='visible')
        page_desktop.wait_for_timeout(350)
        modal_visible = page_desktop.is_visible('#quoteModal.active')
        assert modal_visible, "Modal failed to open"
        print("  ✓ Quote Modal opened successfully.")
        
        modal_shot = os.path.join(ARTIFACT_DIR, 'homepage_modal.png')
        page_desktop.screenshot(path=modal_shot)
        print(f"Saved modal screenshot to {modal_shot}")
        
        page_desktop.keyboard.press('Escape')
        page_desktop.wait_for_selector('#quoteModal', state='hidden')
        print("  ✓ Quote Modal closed on Escape key.")
        
        context_desktop.close()

        # Test 2: Mobile Viewport (375x812 iPhone)
        context_mobile = browser.new_context(viewport={'width': 375, 'height': 812}, is_mobile=True)
        page_mobile = context_mobile.new_page()
        
        print("Navigating on Mobile (375px)...")
        page_mobile.goto(test_url, wait_until='networkidle')
        
        # Test mobile drawer
        print("Testing mobile drawer toggle...")
        page_mobile.click('.mobile-toggle')
        page_mobile.wait_for_selector('.mobile-drawer.active', state='visible')
        print("  ✓ Mobile drawer opened.")
        
        drawer_shot = os.path.join(ARTIFACT_DIR, 'homepage_mobile_drawer.png')
        page_mobile.screenshot(path=drawer_shot)
        print(f"Saved mobile drawer screenshot to {drawer_shot}")
        
        page_mobile.click('.mobile-drawer-close')
        page_mobile.wait_for_selector('.mobile-drawer', state='hidden')
        print("  ✓ Mobile drawer closed.")
        
        # Capture full mobile screenshot
        mobile_shot = os.path.join(ARTIFACT_DIR, 'homepage_mobile_full.png')
        page_mobile.screenshot(path=mobile_shot, full_page=True)
        print(f"Saved full mobile screenshot to {mobile_shot}")
        
        context_mobile.close()
        browser.close()

except Exception as e:
    print(f"[TEST EXCEPTION] {e}")
    failed = True
finally:
    httpd.shutdown()

if failed:
    print("\nFAILED: Some tests did not pass.")
    sys.exit(1)
else:
    print("\nSUCCESS: All homepage tests passed with zero errors!")
    sys.exit(0)
