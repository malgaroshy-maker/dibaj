import os
from playwright.sync_api import sync_playwright

artifact_dir = r"C:\Users\masal\.gemini\antigravity-ide\brain\43607806-db2b-4224-af8c-3c01ff875aca"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1280, "height": 900})
    page = context.new_page()

    # 1. Index Page
    print("Navigating to index.html...")
    page.goto("http://localhost:5173/index.html", wait_until="networkidle")
    
    watermark = page.locator(".site-watermark-bg")
    assert watermark.count() > 0, "Global watermark element .site-watermark-bg not found on index.html!"
    img_src = watermark.locator("img").get_attribute("src")
    print(f"Watermark found with image: {img_src}")

    # Capture top of page and scroll down to capture gateway and payment sections
    page.screenshot(path=os.path.join(artifact_dir, "watermark_index_top.png"))
    
    # Scroll to split gateway and payment
    page.locator(".split-gateway-section").scroll_into_view_if_needed()
    page.screenshot(path=os.path.join(artifact_dir, "watermark_index_gateway.png"))

    page.locator(".payment-section").scroll_into_view_if_needed()
    banner_wm = page.locator(".banner-watermark")
    assert banner_wm.count() > 0, "Banner watermark not found on payment section!"
    page.screenshot(path=os.path.join(artifact_dir, "watermark_index_payment.png"))

    # Full page
    page.screenshot(path=os.path.join(artifact_dir, "watermark_full_index.png"), full_page=True)

    # 2. Salons Page
    print("Navigating to salons.html...")
    page.goto("http://localhost:5173/salons.html", wait_until="networkidle")
    assert page.locator(".site-watermark-bg").count() > 0, "Watermark not found on salons.html!"
    page.screenshot(path=os.path.join(artifact_dir, "watermark_salons.png"))

    # 3. Contact Page
    print("Navigating to contact.html...")
    page.goto("http://localhost:5173/contact.html", wait_until="networkidle")
    assert page.locator(".site-watermark-bg").count() > 0, "Watermark not found on contact.html!"
    page.screenshot(path=os.path.join(artifact_dir, "watermark_contact.png"))

    # 4. Mobile Viewport Verification
    print("Testing mobile viewport (375x812)...")
    page.set_viewport_size({"width": 375, "height": 812})
    page.goto("http://localhost:5173/index.html", wait_until="networkidle")
    page.screenshot(path=os.path.join(artifact_dir, "watermark_mobile.png"))

    browser.close()
    print("All watermark verifications and screenshots captured successfully!")
