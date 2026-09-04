#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Playwright automated test to verify the complete brand elevation:
- Bab Bin Ghashir Factory
- 5 Abu Salim Showrooms
- Rare & Exclusive Imported Fabrics Showcase
- Seamless cross-Libya delivery
"""

import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:5173"

def run_tests():
    print(f"Starting Brand Elevation E2E Test Suite on {BASE_URL}...")
    errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # Capture console errors
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        # 1. TEST HOMEPAGE
        print("\n[1/4] Testing Homepage (index.html)...")
        page.goto(f"{BASE_URL}/index.html", wait_until="networkidle")
        
        # Check hero badge
        hero_badge = page.locator(".section-badge").first.inner_text()
        assert "باب بن غشير" in hero_badge, f"Hero badge missing factory: {hero_badge}"
        assert "5 صالات عرض" in hero_badge, f"Hero badge missing 5 showrooms: {hero_badge}"
        print(f"  ✓ Hero badge verified: '{hero_badge}'")

        # Check hero content
        hero_text = page.locator("main section").first.inner_text()
        assert "مصنع باب بن غشير" in hero_text
        assert "5 صالات" in hero_text
        assert "أقمشة نادرة" in hero_text
        assert "ليبيا" in hero_text
        print("  ✓ Hero section contains all enterprise pillars")

        # Check Rare Fabrics Prestige Section
        fabrics_section = page.locator("#rare-fabrics-prestige")
        assert fabrics_section.is_visible(), "Rare fabrics section is not visible!"
        title_text = fabrics_section.locator("h2").inner_text()
        assert "الأقمشة النادرة والحصرية في ليبيا" in title_text
        print(f"  ✓ Rare fabrics section found: '{title_text}'")

        # Check 4 pillars
        pillars = fabrics_section.locator("h3").all_inner_texts()
        print(f"  ✓ Found pillars: {pillars}")
        assert len(pillars) >= 4, f"Expected at least 4 pillars, found {len(pillars)}"

        # Check index footer
        footer_text = page.locator(".site-footer").inner_text()
        assert "باب بن غشير" in footer_text
        assert "5 صالات" in footer_text
        print("  ✓ Index footer verified with factory & 5 showrooms")

        # Take screenshot of prestige section
        page.locator("#rare-fabrics-prestige").screenshot(path="C:/Users/masal/.gemini/antigravity-ide/brain/cf35d584-d262-41ba-a73c-5b07c8154c1d/test_rare_fabrics_section.png")
        print("  ✓ Saved screenshot of rare fabrics section")

        # 2. TEST CONTACT PAGE
        print("\n[2/4] Testing Contact Page (contact.html)...")
        page.goto(f"{BASE_URL}/contact.html", wait_until="networkidle")

        contact_text = page.locator("main").inner_text()
        assert "المستوى الأول: قلب الصناعة الوطنية" in contact_text
        assert "مصنع وورش الديباج المركزية" in contact_text
        assert "باب بن غشير" in contact_text
        assert "المستوى الثاني: طرابلس — سوق أبوسليم" in contact_text
        assert "سلسلة صالات العرض الـ 5 المتخصصة" in contact_text
        assert "محل 14" in contact_text
        assert "محل 76" in contact_text
        assert "صالة الركنيات" in contact_text
        assert "مركز الأقمشة النادرة والستائر" in contact_text
        assert "جناح VIP" in contact_text
        assert "شحن وتوصيل لكافة المدن الليبية" in contact_text
        print("  ✓ Contact page contains Tier 1 Factory and all 5 Showrooms + Delivery")

        # Check city selector options
        city_options = page.locator("#contact-city option").all_inner_texts()
        assert any("باب بن غشير" in o for o in city_options)
        assert any("بنغازي" in o for o in city_options)
        assert any("مصراتة" in o for o in city_options)
        assert any("سبها" in o for o in city_options)
        print(f"  ✓ City selector contains {len(city_options)} regions across Libya")

        # Take screenshot of contact cards
        page.screenshot(path="C:/Users/masal/.gemini/antigravity-ide/brain/cf35d584-d262-41ba-a73c-5b07c8154c1d/test_contact_page_elevated.png")
        print("  ✓ Saved screenshot of elevated contact page")

        # 3. TEST PRODUCT STUDIO
        print("\n[3/4] Testing Product Studio (product.html)...")
        page.goto(f"{BASE_URL}/product.html?id=salon-emerald-velvet", wait_until="networkidle")

        product_body = page.locator("body").inner_text()
        assert "كفالة مصنع الديباج المركزي (باب بن غشير)" in product_body
        assert "صالات العرض الـ 5 بسوق أبوسليم" in product_body
        assert "مصنع الديباج (باب بن غشير) • أقمشة مستوردة حصرياً" in product_body
        assert "مصنع الديباج المركزي" in product_body
        print("  ✓ Product page specs and factory guarantee card verified")

        # Test WhatsApp button URL
        wa_href = page.locator("#product-wa-btn").get_attribute("href")
        assert "wa.me/218915601703" in wa_href
        print("  ✓ WhatsApp order button correctly generated")

        # Take screenshot of product studio
        page.screenshot(path="C:/Users/masal/.gemini/antigravity-ide/brain/cf35d584-d262-41ba-a73c-5b07c8154c1d/test_product_studio_elevated.png")
        print("  ✓ Saved screenshot of elevated product customizer")

        # 4. TEST ALL OTHER SUBPAGES
        print("\n[4/4] Testing Subpages (catalog, salons, majlis, corners, curtains, gallery)...")
        subpages = ["catalog.html", "salons.html", "majlis.html", "corners.html", "curtains.html", "gallery.html"]
        for sp in subpages:
            page.goto(f"{BASE_URL}/{sp}", wait_until="networkidle")
            content = page.locator(".site-footer").inner_text()
            assert "باب بن غشير" in content, f"{sp} footer missing Bab Bin Ghashir"
            assert "5 صالات" in content, f"{sp} footer missing 5 showrooms"
            
            # Check all images on page
            images = page.locator("img").all()
            for img in images:
                src = img.get_attribute("src")
                nw = img.evaluate("el => el.naturalWidth")
                assert nw > 0, f"Broken image on {sp}: {src}"
            print(f"  ✓ {sp} verified: footer correct, {len(images)} images loaded cleanly")

        # Check console errors
        if console_errors:
            print(f"WARNING: Console errors logged: {console_errors}")
        else:
            print("  ✓ Zero console errors across all tested pages")

        browser.close()

    print("\n🎉 ALL TESTS PASSED SUCCESSFULLY! The enterprise brand elevation is verified 100%.")

if __name__ == "__main__":
    try:
        run_tests()
    except Exception as e:
        print(f"Test failed with error: {e}", file=sys.stderr)
        sys.exit(1)
