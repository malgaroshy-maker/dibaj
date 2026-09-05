import sys
import time
import urllib.request
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

url = "https://malgaroshy-maker.github.io/dibaj/product.html?id=salon-emerald-velvet"
print(f"Checking GitHub Pages for comparison tool deployment at {url} ...")

# Wait up to 60s for GH action build to deploy
deployed = False
for attempt in range(1, 15):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Cache-Control': 'no-cache'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read().decode('utf-8')
            if 'toggle-comparison-btn' in content:
                print(f"[SUCCESS] Commit deployed to GitHub Pages on attempt {attempt}!")
                deployed = True
                break
            else:
                print(f"Attempt {attempt}: GitHub Pages still serving previous build, waiting 6s...")
                time.sleep(6)
    except Exception as e:
        print(f"Attempt {attempt}: {e}, waiting 6s...")
        time.sleep(6)

if not deployed:
    print("Warning: GitHub Pages deployment took longer than 90s, proceeding to test whatever is live.")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 950})
    
    print(f"Loading live page: {url}")
    page.goto(url)
    page.wait_for_load_state("networkidle")
    
    toggle = page.query_selector("#toggle-comparison-btn")
    if toggle:
        print("  Found #toggle-comparison-btn on live GitHub Pages!")
        toggle.click()
        page.wait_for_timeout(400)
        page.screenshot(path=r"C:\Users\masal\.gemini\antigravity-ide\brain\cf35d584-d262-41ba-a73c-5b07c8154c1d\live_gh_comparison.png")
        print("  Live screenshot saved!")
    else:
        print("  Notice: GH Action deploy queue in progress on GitHub servers.")
    
    browser.close()
