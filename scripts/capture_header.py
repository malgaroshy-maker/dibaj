from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    page.goto("http://127.0.0.1:5173/index.html", wait_until="networkidle")
    header = page.locator(".site-header")
    header.screenshot(path="C:/Users/masal/.gemini/antigravity-ide/brain/43607806-db2b-4224-af8c-3c01ff875aca/header_preview.png")
    page.screenshot(path="C:/Users/masal/.gemini/antigravity-ide/brain/43607806-db2b-4224-af8c-3c01ff875aca/homepage_new_logo.png")
    browser.close()
    print("Screenshots captured successfully!")
