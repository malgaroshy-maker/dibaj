from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.goto("http://127.0.0.1:5173/index.html", wait_until="networkidle")

    # Capture Hero section with watermark
    hero = page.locator("section.section").first
    hero.screenshot(path="C:/Users/masal/.gemini/antigravity-ide/brain/43607806-db2b-4224-af8c-3c01ff875aca/hero_watermark.png")

    # Capture Consultation banner with watermark
    banner = page.locator("section:has(.banner-watermark)")
    banner.screenshot(path="C:/Users/masal/.gemini/antigravity-ide/brain/43607806-db2b-4224-af8c-3c01ff875aca/banner_watermark.png")

    # Capture full page view
    page.screenshot(path="C:/Users/masal/.gemini/antigravity-ide/brain/43607806-db2b-4224-af8c-3c01ff875aca/watermark_full_page.png")

    browser.close()
    print("Watermark screenshots captured successfully!")
