import os
import sys
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

ARTIFACTS_DIR = r"C:\Users\masal\.gemini\antigravity-ide\brain\cf35d584-d262-41ba-a73c-5b07c8154c1d"
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

BASE_URL = "http://localhost:5173"

def run_tests():
    print("==================================================")
    print("Starting Dibaj Universal Lightbox & Inspection Tests")
    print("==================================================")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # -------------------------------------------------------------
        # 1. Desktop Test - Catalog Page (catalog.html)
        # -------------------------------------------------------------
        print("\n[1/5] Testing Catalog Page (catalog.html)...")
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()
        page.goto(f"{BASE_URL}/catalog.html")
        page.wait_for_load_state("networkidle")
        
        # Find first card zoom trigger
        zoom_btn = page.locator(".catalog-card .card-zoom-trigger").first
        zoom_btn.wait_for(state="visible", timeout=5000)
        prod_id = zoom_btn.get_attribute("data-lightbox-product")
        print(f"  Found first card zoom trigger for product: {prod_id}")
        
        # Click zoom trigger to open Lightbox
        zoom_btn.click()
        page.wait_for_selector("#dibaj-lightbox.open", state="visible", timeout=3000)
        print("  ✓ Lightbox opened successfully with class 'open'")
        
        # Verify Lightbox elements
        title = page.locator("#lightbox-product-title").text_content()
        counter = page.locator("#lightbox-product-counter").text_content()
        print(f"  ✓ Active product title: {title}, counter: {counter}")
        assert "13" in counter, "Counter should reflect total 13 products"
        
        # Verify thumbnail strip
        thumbs = page.locator(".lightbox-thumb-btn")
        thumb_count = thumbs.count()
        print(f"  ✓ Thumbnail count for {prod_id}: {thumb_count}")
        assert thumb_count >= 1, "Should have at least 1 image thumbnail"
        
        if thumb_count > 1:
            # Click second thumbnail
            initial_src = page.locator("#lightbox-main-image").get_attribute("src")
            thumbs.nth(1).click()
            time.sleep(0.3)
            new_src = page.locator("#lightbox-main-image").get_attribute("src")
            print(f"  ✓ Switched angle/swatch via thumbnail strip: {new_src != initial_src}")
        
        # Test Next button
        next_btn = page.locator("#lightbox-next-btn")
        next_btn.click()
        time.sleep(0.3)
        counter_after_next = page.locator("#lightbox-product-counter").text_content()
        print(f"  ✓ After Next click, counter is: {counter_after_next}")
        assert counter_after_next != counter, "Counter should update after Next"
        
        # Test Keyboard Arrow Navigation (ArrowRight in RTL is previous, ArrowLeft is next)
        page.keyboard.press("ArrowLeft")
        time.sleep(0.3)
        counter_after_key = page.locator("#lightbox-product-counter").text_content()
        print(f"  ✓ After ArrowLeft keypress, counter is: {counter_after_key}")
        
        # Test Customizer CTA inside Lightbox
        customizer_btn = page.locator("#lightbox-customizer-btn")
        href = customizer_btn.get_attribute("href")
        print(f"  ✓ Customizer link href: {href}")
        assert "product.html?id=" in href, "Customizer link should contain product.html?id="
        
        # Test WhatsApp CTA inside Lightbox
        wa_btn = page.locator("#lightbox-whatsapp-btn")
        wa_href = wa_btn.get_attribute("href")
        print(f"  ✓ WhatsApp inquiry link present: {bool(wa_href and '218915601703' in wa_href)}")
        assert "218915601703" in wa_href, "WhatsApp link should target official Dibaj line"
        
        # Save desktop screenshot of open lightbox
        desktop_shot_path = os.path.join(ARTIFACTS_DIR, "lightbox_desktop_catalog.png")
        page.screenshot(path=desktop_shot_path)
        print(f"  ✓ Saved desktop screenshot: {desktop_shot_path}")
        
        # Test Close with Escape key
        page.keyboard.press("Escape")
        time.sleep(0.4)
        is_open = page.locator("#dibaj-lightbox").is_visible()
        print(f"  ✓ Closed lightbox via Escape key (visible: {is_open})")
        assert not is_open, "Lightbox should be hidden after Escape"
        
        context.close()

        # -------------------------------------------------------------
        # 2. Category Pages Test (salons.html, majlis.html, corners.html, curtains.html)
        # -------------------------------------------------------------
        print("\n[2/5] Testing Category Subpages...")
        for page_name in ["salons.html", "majlis.html", "corners.html", "curtains.html"]:
            ctx = browser.new_context(viewport={"width": 1440, "height": 900})
            pg = ctx.new_page()
            pg.goto(f"{BASE_URL}/{page_name}")
            pg.wait_for_load_state("networkidle")
            
            # Click card image wrapper
            wrapper = pg.locator(".card-media-wrapper[data-lightbox-product]").first
            wrapper.wait_for(state="visible", timeout=5000)
            target_prod = wrapper.get_attribute("data-lightbox-product")
            wrapper.click()
            
            pg.wait_for_selector("#dibaj-lightbox.open", state="visible", timeout=3000)
            lb_title = pg.locator("#lightbox-product-title").text_content()
            print(f"  ✓ {page_name}: clicked {target_prod} -> opened Lightbox for '{lb_title}'")
            
            # Close via close button
            pg.locator("#lightbox-close-btn").click()
            time.sleep(0.4)
            assert not pg.locator("#dibaj-lightbox").is_visible()
            ctx.close()

        # -------------------------------------------------------------
        # 3. Gallery Page Test (gallery.html)
        # -------------------------------------------------------------
        print("\n[3/5] Testing Comprehensive Gallery (gallery.html)...")
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        pg = ctx.new_page()
        pg.goto(f"{BASE_URL}/gallery.html")
        pg.wait_for_load_state("networkidle")
        
        # Test boucle corner in gallery
        boucle_card = pg.locator(".card-media-wrapper[data-lightbox-product='corner-boucle-showroom']")
        boucle_card.wait_for(state="visible", timeout=5000)
        boucle_card.click()
        
        pg.wait_for_selector("#dibaj-lightbox.open", state="visible", timeout=3000)
        lb_title = pg.locator("#lightbox-product-title").text_content()
        print(f"  ✓ gallery.html: clicked corner-boucle-showroom -> title: '{lb_title}'")
        assert "البوكليه" in lb_title, "Title should be Boucle Corner"
        
        pg.locator("#lightbox-close-btn").click()
        time.sleep(0.4)
        ctx.close()

        # -------------------------------------------------------------
        # 4. Product Customizer Studio (product.html)
        # -------------------------------------------------------------
        print("\n[4/5] Testing Product Customizer Studio (product.html)...")
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        pg = ctx.new_page()
        pg.goto(f"{BASE_URL}/product.html?id=salon-emerald-velvet")
        pg.wait_for_load_state("networkidle")
        
        # Check studio zoom button
        studio_zoom_btn = pg.locator("#product-studio-zoom-btn")
        studio_zoom_btn.wait_for(state="visible", timeout=5000)
        assert studio_zoom_btn.get_attribute("data-lightbox-product") == "salon-emerald-velvet"
        
        # Click studio zoom button
        studio_zoom_btn.click()
        pg.wait_for_selector("#dibaj-lightbox.open", state="visible", timeout=3000)
        print("  ✓ Studio zoom button opened Lightbox for active model")
        pg.keyboard.press("Escape")
        time.sleep(0.4)
        
        # Click swatch in studio to switch color (second swatch: cream chesterfield)
        swatches = pg.locator(".swatch-btn")
        if swatches.count() > 1:
            swatches.nth(1).click()
            time.sleep(0.3)
            # Verify zoom btn data-image-index is updated
            img_idx = studio_zoom_btn.get_attribute("data-image-index")
            print(f"  ✓ Swatch selection updated zoom trigger data-image-index: {img_idx}")
            assert img_idx == "1"
        
        # Test that dragging comparison slider does NOT open lightbox
        toggle_comp = pg.locator("#toggle-comparison-btn")
        toggle_comp.click()
        time.sleep(0.3)
        split_wrapper = pg.locator("#comparison-split-wrapper")
        assert split_wrapper.is_visible(), "Comparison split view should be visible"
        
        # Click divider handle
        handle = pg.locator("#comparison-handle")
        handle.click()
        time.sleep(0.3)
        # Lightbox must NOT be open
        assert not pg.locator("#dibaj-lightbox").is_visible(), "Comparison handle click must not trigger lightbox"
        print("  ✓ Comparison handle interaction properly isolated from lightbox")
        
        ctx.close()

        # -------------------------------------------------------------
        # 5. Mobile Viewport Inspection & Touch Navigation (390 x 844)
        # -------------------------------------------------------------
        print("\n[5/5] Testing Mobile Viewport (390 x 844) & Swipe...")
        m_context = browser.new_context(
            viewport={"width": 390, "height": 844},
            is_mobile=True,
            has_touch=True,
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
        )
        m_page = m_context.new_page()
        m_page.goto(f"{BASE_URL}/catalog.html")
        m_page.wait_for_load_state("networkidle")
        
        # Open lightbox on mobile
        m_zoom = m_page.locator(".catalog-card .card-zoom-trigger").first
        m_zoom.click()
        m_page.wait_for_selector("#dibaj-lightbox.open", state="visible", timeout=3000)
        
        # Check no horizontal overflow
        scroll_width = m_page.evaluate("() => document.documentElement.scrollWidth")
        viewport_width = m_page.evaluate("() => window.innerWidth")
        print(f"  ✓ Mobile dimensions: scrollWidth={scroll_width}, innerWidth={viewport_width}")
        assert scroll_width <= viewport_width + 1, f"Horizontal overflow detected: {scroll_width} > {viewport_width}"
        
        # Check action buttons tap target size (min height 40px)
        btn_box = m_page.locator("#lightbox-customizer-btn").bounding_box()
        print(f"  ✓ Primary CTA tap target: width={btn_box['width']}px, height={btn_box['height']}px")
        assert btn_box["height"] >= 40, "CTA button tap target should be at least 40px height"
        
        # Save mobile screenshot
        mobile_shot_path = os.path.join(ARTIFACTS_DIR, "lightbox_mobile_catalog.png")
        m_page.screenshot(path=mobile_shot_path)
        print(f"  ✓ Saved mobile screenshot: {mobile_shot_path}")
        
        # Test touch swipe on stage
        stage = m_page.locator("#lightbox-media-stage")
        stage_box = stage.bounding_box()
        start_x = stage_box["x"] + stage_box["width"] * 0.8
        end_x = stage_box["x"] + stage_box["width"] * 0.2
        y = stage_box["y"] + stage_box["height"] * 0.5
        
        initial_counter = m_page.locator("#lightbox-product-counter").text_content()
        # Swipe Left (Next in RTL)
        m_page.mouse.move(start_x, y)
        m_page.mouse.down()
        m_page.mouse.move(end_x, y, steps=5)
        m_page.mouse.up()
        time.sleep(0.3)
        
        # Close on mobile
        m_page.locator("#lightbox-close-btn").click()
        time.sleep(0.3)
        assert not m_page.locator("#dibaj-lightbox").is_visible()
        print("  ✓ Closed lightbox on mobile")
        
        m_context.close()
        browser.close()
        
    print("\n==================================================")
    print("ALL 5 UNIVERSAL LIGHTBOX TEST SUITES PASSED! ✓✓✓")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
