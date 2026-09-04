import sys
import os
import urllib.parse
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

BRAIN_DIR = r"C:\Users\masal\.gemini\antigravity-ide\brain\cf35d584-d262-41ba-a73c-5b07c8154c1d"

def test_comparison_studio():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 950})
        
        errors = []
        page.on("pageerror", lambda err: errors.append(str(err)))
        
        print("1. Navigating to Customizer Studio with Emerald Velvet...")
        page.goto("http://localhost:5173/product.html?id=salon-emerald-velvet")
        page.wait_for_load_state("networkidle")
        
        # Verify initial state: comparison split wrapper is hidden
        split_wrapper = page.query_selector("#comparison-split-wrapper")
        assert split_wrapper is not None, "Comparison split wrapper DOM missing"
        is_hidden = page.evaluate("el => getComputedStyle(el).display === 'none'", split_wrapper)
        print(f"  Comparison wrapper initially hidden: {is_hidden}")
        assert is_hidden, "Comparison wrapper should be hidden initially"
        
        # Click Toggle Comparison button
        print("2. Activating Comparison Mode...")
        toggle_btn = page.query_selector("#toggle-comparison-btn")
        assert toggle_btn is not None, "Toggle comparison button missing"
        toggle_btn.click()
        page.wait_for_timeout(300)
        
        # Verify active state
        is_active = page.evaluate("el => el.classList.contains('active')", toggle_btn)
        print(f"  Toggle button has 'active' class: {is_active}")
        assert is_active, "Toggle button should have active class"
        
        wrapper_display = page.evaluate("el => getComputedStyle(el).display", split_wrapper)
        print(f"  Comparison wrapper display style: {wrapper_display}")
        assert wrapper_display != 'none', "Comparison wrapper should be visible"
        
        # Check initial labels
        base_label = page.inner_text("#slider-base-text")
        compare_label = page.inner_text("#slider-compare-text")
        print(f"  Base label: {base_label} | Compare label: {compare_label}")
        assert "الزمردي" in base_label, "Base label should mention emerald"
        
        # Verify handle and dragging
        print("3. Testing slider handle dragging...")
        handle = page.query_selector("#comparison-handle")
        assert handle is not None, "Slider handle missing"
        
        # Test keyboard navigation on handle
        handle.focus()
        page.keyboard.press("ArrowRight")
        page.keyboard.press("ArrowRight")
        page.wait_for_timeout(100)
        val = handle.get_attribute("aria-valuenow")
        print(f"  Slider aria-valuenow after ArrowRight: {val}")
        assert int(val) >= 55, f"Expected slider position >= 55, got {val}"
        
        # Test color swatch switching in comparison bar
        print("4. Testing swatch chip selection in color comparison...")
        chips = page.query_selector_all("#comparison-target-bar .comp-swatch-chip")
        print(f"  Found {len(chips)} comparison swatches")
        assert len(chips) >= 2, "Expected at least 2 comparison swatches"
        
        # Click on Chesterfield cream swatch
        chips[1].click()
        page.wait_for_timeout(200)
        updated_compare_label = page.inner_text("#slider-compare-text")
        print(f"  Updated compare label: {updated_compare_label}")
        
        # Take screenshot of Color Comparison
        color_comp_path = os.path.join(BRAIN_DIR, "verified_color_comparison.png")
        page.screenshot(path=color_comp_path)
        print(f"  Screenshot saved: {color_comp_path}")
        
        # Switch to Curtains Coordination Mode
        print("5. Testing Curtains Coordination Mode...")
        curtain_tab = page.query_selector("#comp-mode-curtain-btn")
        assert curtain_tab is not None, "Curtains mode tab missing"
        curtain_tab.click()
        page.wait_for_timeout(300)
        
        # Verify coordinated curtains card is visible
        curtain_card = page.query_selector("#coordinated-curtains-card")
        assert curtain_card is not None, "Coordinated curtains card missing"
        card_display = page.evaluate("el => getComputedStyle(el).display", curtain_card)
        print(f"  Coordinated curtains card display: {card_display}")
        assert card_display != 'none', "Curtains card should be visible"
        
        curtain_title = page.inner_text("#curtain-card-title")
        print(f"  Curated curtain title: {curtain_title}")
        assert "ستائر" in curtain_title, f"Expected curtain in title, got {curtain_title}"
        
        # Test changing window width
        print("6. Testing window width input and fabric calculation...")
        width_input = page.query_selector("#curtain-window-width")
        assert width_input is not None, "Window width input missing"
        width_input.fill("4.5")
        page.wait_for_timeout(200)
        
        hint_text = page.inner_text("#curtain-meters-hint")
        print(f"  Curtain meters hint: {hint_text}")
        assert "9.9" in hint_text, f"Expected 9.9 meters (4.5 * 2.2), got {hint_text}"
        
        # Check summary badge
        curtain_badge = page.query_selector("#summary-curtains-badge")
        assert curtain_badge is not None, "Curtains summary badge missing"
        badge_val = page.inner_text("#calc-result-curtains")
        print(f"  Summary curtains badge text: {badge_val}")
        assert "9.9" in badge_val, f"Expected 9.9 in summary badge, got {badge_val}"
        
        # Verify WhatsApp link content
        print("7. Verifying WhatsApp consultation link bundling...")
        wa_btn = page.query_selector("#product-wa-btn")
        assert wa_btn is not None, "WhatsApp button missing"
        wa_href = wa_btn.get_attribute("href")
        unquoted_wa = urllib.parse.unquote(wa_href)
        print(f"  WhatsApp text snippet: {unquoted_wa[:250]}...")
        assert "الموديل: صالون المخمل الزمردي" in unquoted_wa, "WA message missing salon title"
        assert "الستائر المرافقة المنسقة:" in unquoted_wa, "WA message missing curtain title"
        assert "عرض نافذة الستائر التقديري: 4.5" in unquoted_wa, "WA message missing window width"
        assert "9.9" in unquoted_wa, "WA message missing curtain fabric meters"
        
        # Screenshot of Curtain Coordination
        curtain_comp_path = os.path.join(BRAIN_DIR, "verified_curtain_coordination.png")
        page.screenshot(path=curtain_comp_path)
        print(f"  Screenshot saved: {curtain_comp_path}")
        
        # Mobile Viewport Test (390px)
        print("8. Testing Mobile Responsiveness (390px iPhone viewport)...")
        mobile_page = browser.new_page(viewport={"width": 390, "height": 844})
        mobile_page.goto("http://localhost:5173/product.html?id=salon-emerald-velvet")
        mobile_page.wait_for_load_state("networkidle")
        
        # Check horizontal overflow
        scroll_w = mobile_page.evaluate("() => document.documentElement.scrollWidth")
        client_w = mobile_page.evaluate("() => document.documentElement.clientWidth")
        print(f"  Mobile scrollWidth: {scroll_w} | clientWidth: {client_w}")
        assert scroll_w <= client_w, f"Horizontal overflow detected: {scroll_w} > {client_w}"
        
        # Toggle comparison on mobile
        m_toggle = mobile_page.query_selector("#toggle-comparison-btn")
        m_toggle.click()
        mobile_page.wait_for_timeout(300)
        
        m_scroll_w = mobile_page.evaluate("() => document.documentElement.scrollWidth")
        assert m_scroll_w <= client_w, f"Horizontal overflow after toggle: {m_scroll_w} > {client_w}"
        
        # Switch to curtain on mobile
        mobile_page.click("#comp-mode-curtain-btn")
        mobile_page.wait_for_timeout(300)
        
        mobile_path = os.path.join(BRAIN_DIR, "mobile_comparison_curtains_390.png")
        mobile_page.screenshot(path=mobile_path)
        print(f"  Mobile screenshot saved: {mobile_path}")
        
        assert len(errors) == 0, f"Page errors encountered: {errors}"
        print("ALL TESTS PASSED WITH 0 ERRORS!")
        browser.close()

if __name__ == "__main__":
    test_comparison_studio()
