import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

BASE_URL = 'http://localhost:5173'

def run_tests():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        print("=== Test 1: Verify about.html Corporate Profile & Official Registry Table ===")
        res = page.goto(f"{BASE_URL}/about.html", wait_until="networkidle")
        assert res.status == 200, f"Expected 200 for about.html, got {res.status}"
        
        # Check title
        assert "شركة الديباج" in page.title() and "البيانات الرسمية" in page.title(), f"Title mismatch: {page.title()}"
        
        # Check legal registry table numbers
        page_text = page.content()
        assert "0501020247477" in page_text, "Commercial Reg number missing"
        assert "002546000567" in page_text, "Industrial Reg number missing"
        assert "72361" in page_text, "License number missing"
        assert "3883" in page_text, "Chamber number missing"
        assert "باب بن غشير" in page_text, "Bab Bin Ghashir missing"
        assert "سوق أبوسليم" in page_text, "Abu Salim missing"
        print("✓ about.html loaded with official registry table & pillars")

        # Screenshot about page
        page.screenshot(path="dist/about_desktop_preview.png")

        print("=== Test 2: Check 4 Canonical Nav Links across Key Pages ===")
        pages_to_test = [
            "/index.html",
            "/about.html",
            "/catalog.html",
            "/contact.html",
            "/product.html?id=salon-emerald-velvet",
            "/salons.html",
            "/majlis.html",
            "/corners.html",
            "/curtains.html",
            "/gallery.html"
        ]
        
        for p_url in pages_to_test:
            page.goto(f"{BASE_URL}{p_url}", wait_until="networkidle")
            # Look for links in desktop nav
            nav_links = page.locator("nav .nav-link, nav .nav-desktop .nav-link").all_text_contents()
            cleaned_links = [l.strip() for l in nav_links if l.strip()]
            assert "الرئيسية" in cleaned_links, f"الرئيسية missing in {p_url}: {cleaned_links}"
            assert "عن الشركة" in cleaned_links, f"عن الشركة missing in {p_url}: {cleaned_links}"
            assert any("المنتجات" in l or "خدمات" in l for l in cleaned_links), f"المنتجات missing in {p_url}: {cleaned_links}"
            assert any("التواصل" in l or "المواقع" in l for l in cleaned_links), f"المواقع والتواصل missing in {p_url}: {cleaned_links}"
            print(f"✓ {p_url} has canonical 4-item navigation")

        print("=== Test 3: Verify product.html Customizer Specification & No Speculative Badges ===")
        page.goto(f"{BASE_URL}/product.html?id=salon-emerald-velvet", wait_until="networkidle")
        
        # Verify old speculative badges are gone
        speculative_meters = page.locator("#calc-result-meters").count()
        speculative_days = page.locator("#calc-result-days").count()
        assert speculative_meters == 0, "Old #calc-result-meters should be gone"
        assert speculative_days == 0, "Old #calc-result-days should be gone"
        
        # Verify new factual Technical Order Specification fields exist
        assert page.locator("#summary-spec-fabric").is_visible(), "#summary-spec-fabric should be visible"
        assert page.locator("#summary-spec-shape").is_visible(), "#summary-spec-shape should be visible"
        assert page.locator("#summary-spec-dimensions").is_visible(), "#summary-spec-dimensions should be visible"
        assert page.locator("#summary-spec-foam").is_visible(), "#summary-spec-foam should be visible"
        
        fabric_text = page.locator("#summary-spec-fabric").text_content()
        assert "مخمل" in fabric_text, f"Expected velvet in summary, got: {fabric_text}"
        print(f"✓ product.html summary correctly shows: {fabric_text}")

        # Test toggling to "أحتاج مساعدة في المقاسات"
        help_radio = page.locator('input[name="dim-mode"][value="help"]')
        assert help_radio.count() > 0, "dim-mode=help radio missing"
        help_radio.check()
        
        # Dimension text should update to inspection request
        dim_text = page.locator("#summary-spec-dimensions").text_content()
        assert "معاينة فنية" in dim_text, f"Expected inspection text, got: {dim_text}"
        print(f"✓ Switching to 'أحتاج مساعدة' updated dimensions to: {dim_text}")

        # Test WhatsApp button href
        wa_href = page.locator("#product-wa-btn").get_attribute("href")
        assert "wa.me/218915601703" in wa_href, f"WhatsApp link invalid: {wa_href}"
        assert "%D8%B9%D8%B1%D8%B6%20%D8%B3%D8%B9%D8%B1%20%D8%B1%D8%B3%D9%85%D9%8A" in wa_href or "عرض سعر رسمي" in wa_href or "%D8%B1%D8%B3%D9%85%D9%8A" in wa_href, "WhatsApp draft should request official quote"
        print("✓ WhatsApp draft contains official quote request with custom specs")

        print("=== Test 4: Verify catalog.html Fabric Supply Activity Showcase ===")
        page.goto(f"{BASE_URL}/catalog.html", wait_until="networkidle")
        cat_text = page.content()
        assert "استيراد وتوريد أرقى الأقمشة" in cat_text or "توريد الأقمشة الفاخرة" in cat_text, "Fabric supply banner missing in catalog"
        assert "ورش تصنيع الأثاث" in cat_text, "Workshops missing in fabric section"
        assert "محلات" in cat_text, "Retail shops missing in fabric section"
        print("✓ catalog.html includes authentic Fabric Trade & Supply activity section")

        print("=== Test 5: Mobile Responsiveness (390px) & 0 Horizontal Overflow ===")
        page.set_viewport_size({"width": 390, "height": 844})
        page.goto(f"{BASE_URL}/about.html", wait_until="networkidle")
        
        scroll_width = page.evaluate("() => document.documentElement.scrollWidth")
        client_width = page.evaluate("() => document.documentElement.clientWidth")
        assert scroll_width <= client_width, f"Horizontal overflow on about.html: scrollWidth {scroll_width} > clientWidth {client_width}"
        print(f"✓ about.html mobile viewport 390px has ZERO horizontal overflow ({scroll_width} == {client_width})")

        page.screenshot(path="dist/about_mobile_390.png")

        # Test product.html mobile
        page.goto(f"{BASE_URL}/product.html?id=salon-emerald-velvet", wait_until="networkidle")
        p_scroll = page.evaluate("() => document.documentElement.scrollWidth")
        p_client = page.evaluate("() => document.documentElement.clientWidth")
        assert p_scroll <= p_client, f"Horizontal overflow on product.html: scrollWidth {p_scroll} > clientWidth {p_client}"
        print(f"✓ product.html mobile viewport 390px has ZERO horizontal overflow ({p_scroll} == {p_client})")

        print("=== Test 6: Verify Reconciled Showroom Hours & Friday Evening Schedule ===")
        page.goto(f"{BASE_URL}/contact.html", wait_until="networkidle")
        contact_html = page.content()
        assert "الجمعة: 4:30 م – 9:30 م" in contact_html or "الجمعة: 4:30 م - 9:30 م" in contact_html, "Friday evening schedule missing from contact.html"
        assert "الجمعة: عطلة" not in contact_html, "Obsolete 'الجمعة: عطلة' still found in contact.html"
        print("✓ contact.html correctly displays unified hours with Friday evening schedule")

        print("=== Test 7: Verify Contact Form Flow & Truthful WhatsApp Fallback ===")
        # Fill in contact form
        page.fill("#contact-name", "أ. عبد الرحمن")
        page.select_option("#contact-city", "طرابلس - أبوسليم")
        page.select_option("#contact-service", "تفصيل صالون عصري فاخر")
        page.fill("#contact-phone", "0915554433")
        page.fill("#contact-message", "استفسار بخصوص تفصيل صالون 4x5 متر")

        # Listen to dialogs or toast
        page.click("#contact-submit-btn")
        
        # Verify NO false "تم تسجيل طلبك" claim exists in page DOM or toasts
        assert "تم تسجيل طلبك" not in page.content(), "False claim 'تم تسجيل طلبك' found!"
        
        # Verify fallback container became visible and populated
        fallback_container = page.locator("#contact-fallback-container")
        assert fallback_container.is_visible(), "#contact-fallback-container should be visible after submit"
        
        fallback_text = page.locator("#contact-fallback-text").input_value()
        assert "مرحباً شركة الديباج" in fallback_text, f"Expected greeting in draft, got: {fallback_text}"
        assert "عبد الرحمن" in fallback_text, f"Expected name in draft, got: {fallback_text}"
        assert "تفصيل صالون عصري فاخر" in fallback_text, f"Expected service in draft, got: {fallback_text}"
        assert page.locator("#contact-copy-btn").is_visible(), "#contact-copy-btn should be visible"
        print("✓ Contact form generates truthful draft and fallback without false registration claims")

        print("=== Test 8: Verify Unknown Product ID Graceful Recovery Banner ===")
        page.goto(f"{BASE_URL}/product.html?id=nonexistent-model-xyz", wait_until="networkidle")
        recovery_banner = page.locator("#product-recovery-banner")
        assert recovery_banner.is_visible(), "#product-recovery-banner should be visible for unknown ID"
        banner_text = recovery_banner.text_content()
        assert "غير متوفر حالياً" in banner_text, f"Expected recovery text in banner, got: {banner_text}"
        print(f"✓ product.html gracefully handled invalid ID with banner: {banner_text.strip()[:60]}...")

        print("=== Test 9: Verify Recovery Banner Dismissal on User Selection ===")
        # Click the 2nd model card in ribbon
        ribbon_cards = page.locator(".model-ribbon-card")
        assert ribbon_cards.count() >= 2, "Expected at least 2 ribbon cards"
        ribbon_cards.nth(1).click()
        assert not recovery_banner.is_visible(), "#product-recovery-banner should be hidden after selecting a model"
        print("✓ Recovery banner cleanly dismissed when user selected an active model")

        browser.close()
        print("\n=======================================================")
        print("   ALL 9 BANK REVIEW READINESS TESTS PASSED 100%!     ")
        print("=======================================================")

if __name__ == "__main__":
    run_tests()
