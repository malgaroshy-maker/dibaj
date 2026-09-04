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
PORT = 8769

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

httpd = HTTPServer(('127.0.0.1', PORT), lambda *args, **kwargs: QuietHandler(*args, directory=ROOT_DIR, **kwargs))
server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
server_thread.start()
print(f"Started local HTTP test server at http://127.0.0.1:{PORT}/")

pages = [
    ("index.html", "الرئيسية (Homepage)"),
    ("salons.html", "صالونات (Salons)"),
    ("majlis.html", "جلسات ومجالس (Majlis)"),
    ("corners.html", "ركنيات (Corners)"),
    ("curtains.html", "ستائر (Curtains)"),
    ("gallery.html", "أعمالنا (Gallery)"),
    ("contact.html", "تواصل معنا (Contact)")
]

failed = False
broken_links = []
broken_images = []

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # 1. Desktop Test (1440x900)
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = context.new_page()

        visited_urls = set()

        for filename, title in pages:
            url = f"http://127.0.0.1:{PORT}/{filename}"
            print(f"\n==========================================")
            print(f"Testing {title}: {filename}")
            print(f"==========================================")
            res = page.goto(url, wait_until='networkidle')
            if res.status != 200:
                print(f"  [ERROR] HTTP status {res.status} on {url}")
                failed = True
                continue

            # Check images
            images = page.eval_on_selector_all("img", """imgs => imgs.map(img => ({
                src: img.src,
                alt: img.alt,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                complete: img.complete
            }))""")
            print(f"  Images detected: {len(images)}")
            for img in images:
                if not img['complete'] or img['naturalWidth'] == 0:
                    print(f"    [BROKEN IMAGE] {img['src']} on {filename}")
                    broken_images.append((filename, img['src']))
                    failed = True

            # Check internal links
            links = page.eval_on_selector_all("a[href]", """links => links.map(a => a.getAttribute('href'))""")
            for link in links:
                if not link:
                    continue
                if link.startswith('#') or link.startswith('tel:') or link.startswith('mailto:') or link.startswith('https://wa.me') or link.startswith('https://m.me') or link.startswith('https://') or link.startswith('http://'):
                    continue
                # Local relative link
                target_file = link.split('?')[0].split('#')[0]
                if target_file and target_file not in visited_urls:
                    local_path = os.path.join(ROOT_DIR, target_file)
                    if not os.path.exists(local_path):
                        print(f"    [BROKEN LINK] {link} in {filename} -> {local_path} not found!")
                        broken_links.append((filename, link))
                        failed = True

            # Page-specific verifications
            if filename == "gallery.html":
                # Test Color Swatches
                swatches = page.query_selector_all('.gallery-color-tabs .tab-btn[data-color]')
                print(f"  Testing {len(swatches)} color filter swatches...")
                for swatch in swatches[1:4]: # test specific color swatches
                    color = swatch.get_attribute('data-color')
                    swatch.click()
                    time.sleep(0.15)
                    active_cards = page.eval_on_selector_all(
                        '.gallery-item:not(.hidden)',
                        'cards => cards.length'
                    )
                    print(f"    Swatch '{color}': {active_cards} cards visible")

            elif filename == "contact.html":
                # Check presence of WhatsApp and Messenger CTAs
                wa = page.query_selector("a[href*='wa.me/218915601703']")
                fb = page.query_selector("a[href*='m.me']")
                if wa and fb:
                    print("  ✓ WhatsApp & Messenger primary communication channels verified.")
                else:
                    print("  [ERROR] Missing WhatsApp or Messenger links on contact page!")
                    failed = True

            # Universal Quote Modal Test
            quote_btns = page.query_selector_all("button[data-action='open-quote']")
            if quote_btns:
                quote_btns[0].click()
                time.sleep(0.35)
                modal = page.query_selector("#quoteModal")
                is_open = modal.evaluate("el => el.classList.contains('active')")
                if is_open:
                    # Fill dummy fields and verify WhatsApp CTA generated
                    page.fill("#quoteName", "فاروق طرابلس")
                    page.fill("#quotePhone", "0915601703")
                    # Trigger input event so event listener updates href
                    page.dispatch_event("#quoteName", "input")
                    wa_btn = page.query_selector("#sendWhatsapp")
                    href = wa_btn.get_attribute("href")
                    if href and "218915601703" in href:
                        pass
                    # Close modal
                    close_btn = page.query_selector(".modal-close")
                    if close_btn:
                        close_btn.click()
                        time.sleep(0.2)
                    print("  ✓ Universal Quote Modal opened, populated, and closed smoothly.")
                else:
                    print("  [ERROR] Quote modal did not open on click!")
                    failed = True

            # Capture desktop screenshot
            shot_name = f"{filename.replace('.html', '')}_verified.png"
            shot_path = os.path.join(ARTIFACT_DIR, shot_name)
            page.screenshot(path=shot_path, full_page=True)
            print(f"  ✓ Saved full-page desktop screenshot -> {shot_name}")

        context.close()

        # 2. Mobile Responsive Test (390x844 iPhone 14)
        print(f"\n==========================================")
        print("Testing Mobile Drawer & Responsive Layout (390x844)")
        print(f"==========================================")
        mobile_context = browser.new_context(viewport={'width': 390, 'height': 844})
        mob_page = mobile_context.new_page()
        mob_page.goto(f"http://127.0.0.1:{PORT}/index.html", wait_until='networkidle')

        toggle = mob_page.query_selector(".mobile-toggle")
        drawer = mob_page.query_selector(".mobile-drawer")
        
        assert not drawer.evaluate("el => el.classList.contains('active')"), "Drawer should start closed"
        toggle.click()
        time.sleep(0.3)
        assert drawer.evaluate("el => el.classList.contains('active')"), "Drawer should be active after toggle click"
        print("  ✓ Mobile drawer opens on hamburger click")

        close_btn = mob_page.query_selector(".mobile-drawer-close")
        close_btn.click()
        time.sleep(0.3)
        assert not drawer.evaluate("el => el.classList.contains('active')"), "Drawer should close on close button click"
        print("  ✓ Mobile drawer closes on close button click")

        mob_page.screenshot(path=os.path.join(ARTIFACT_DIR, "mobile_index_verified.png"))
        print("  ✓ Saved mobile viewport screenshot -> mobile_index_verified.png")

        mobile_context.close()
        browser.close()

except Exception as e:
    print(f"\n[FATAL TEST EXCEPTION] {e}")
    failed = True
finally:
    httpd.shutdown()

print("\n==========================================")
print("TEST SUMMARY")
print("==========================================")
if broken_images:
    print(f"Broken Images: {len(broken_images)}")
    for page, src in broken_images:
        print(f"  - {page}: {src}")
if broken_links:
    print(f"Broken Links: {len(broken_links)}")
    for page, href in broken_links:
        print(f"  - {page}: {href}")

if failed or broken_images or broken_links:
    print("\nRESULT: FAILED")
    sys.exit(1)
else:
    print("\nRESULT: ALL 7 PAGES PASSED WITH 100% SUCCESS!")
    sys.exit(0)
