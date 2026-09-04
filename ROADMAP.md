# شركة الديباج (ALDIBAJ) — Luxury Design System & Assets Roadmap

> **Design Direction:** Restoring the First Luxury Aesthetic (Tajawal Font, Damask Ivory & Chocolate Palette, Royal NA Crest Watermarks, Wave Ribbons, and Concierge Styling) combined with 100% Brand-New Ultra-High-Resolution Studio Assets.  
> **Core Architecture:** 4-Item Luxury Navigation (`index.html`, `catalog.html`, `product.html`, `contact.html`).  
> **Business Facts:** Showrooms 14 & 76 Abu Salim Market, Tripoli. Direct WhatsApp & Messenger parity, same price payment guarantee.

---

## Roadmap Phases

```
Phase 1: Ultra-High-Resolution Studio Asset Generation (Zero low-res crops)
  │
Phase 2: Luxury Design System & Typography Restoration (Tajawal, Damask, Watermarks)
  │
Phase 3: Homepage Rebuild (Hero Carousel, Concierge Banner, Majlis Feature, Showrooms)
  │
Phase 4: Full Catalog Rebuild (catalog.html with Salons, Majlis, Corners, Curtains tabs)
  │
Phase 5: Product Customizer & Estimator (product.html)
  │
Phase 6: Contact Hub & Showrooms (contact.html with WhatsApp, Messenger, Phones)
  │
Phase 7: Full Automated Playwright Verification & Vite Live Validation
```

---

### Phase 1: High-Resolution Studio Photography Generation
- [ ] `hero_palace_drapery.webp`: Double-height palace living room with luxury drapery and salon seating.
- [ ] `salon_emerald_velvet_studio.webp`: Emerald velvet 3-piece channel salon with wingback chairs and brass legs.
- [ ] `salon_cream_chesterfield_studio.webp`: Cream Chesterfield salon with deep tufting and barrel chairs.
- [ ] `majlis_gold_carved_studio.webp`: Carved beechwood gold-leaf traditional Arabic majlis with damask upholstery.
- [ ] `majlis_sage_chenille_studio.webp`: Low floor majlis in textured sage chenille with CNC laser-engraved table.
- [ ] `corner_boucle_studio.webp`: Curved architectural modular sectional sofa in textured cream boucle.
- [ ] `corner_suede_studio.webp`: Distressed bronze & charcoal suede L-shaped sectional.
- [ ] `curtains_luxury_studio.webp`: Silk and embroidered chiffon sheer curtains with handcrafted bronze tiebacks.

---

### Phase 2: Design System & Styling Restoration
- [ ] Restore `Tajawal` and `Almarai` Google Fonts typography hierarchy.
- [ ] Restore `--color-damask-warm` (`#FAF7F2`) and subtle tactile background texture overlay.
- [ ] Restore `--color-chocolate-dark` (`#5A3A22`) and `--color-gold-deep` (`#9A7A18`) tokens.
- [ ] Restore `.site-watermark-bg` and `.banner-watermark` royal NA crest seals.
- [ ] Restore `.wave-ribbon` multi-tone golden wave trim under the header.
- [ ] Restore luxury pill badges (`.badge-pill`), glowing buttons, and floating WhatsApp pill.

---

### Phase 3: Homepage (`index.html`)
- [ ] Top header with NA crest, golden brand text, 4-item nav, and "اطلب عرض سعر" CTA.
- [ ] Luxury Hero Carousel with the palace drapery and emerald velvet studio masters.
- [ ] Split Majlis Customisation Feature Card ("خدمة التخصيص الكامل للمجالس").
- [ ] Dark Chocolate Concierge Consultation Banner ("هل ترغب في استشارة شخصية لمشروعك السكني أو التجاري؟").
- [ ] Payment Guarantee Banner: نقبل الشيكات المصدقة والحوالات والبطاقة المصرفية بنفس القيمة.
- [x] Abu Salim Showrooms (5 صالات عرض متخصصة) & مصنع باب بن غشير المركزي.
- [x] صرح استيراد وتوريد الأقمشة النادرة والحصرية في ليبيا (4 ركائز فخامة).

---

### Phase 4: Product Catalog (`catalog.html`)
- [x] Interactive Category Tabs:
  - صالونات فاخرة (Salons)
  - مجالس وجلسات عربية (Majlis)
  - ركنيات عصرية (Corners)
  - ستائر ملكية مكملة (Curtains)
- [x] Product cards with high-res studio assets, fabric specifications, and consultation triggers.

---

### Phase 5: Visual Customizer (`product.html`)
- [x] Interactive customizer with real-time swatch picker, room preview, and yardage/seating calculator.

---

### Phase 6: Contact & Showrooms (`contact.html`)
- [x] Equal visual weight for WhatsApp (`wa.me`), Facebook Messenger (`m.me`), and direct phone calls.
- [x] Two-tier departmental structure: Tier 1 Bab Bin Ghashir Central Factory + Tier 2 5 Specialized Abu Salim Showrooms مع أرقام السجلين التجاري والصناعي.

---

### Phase 7: Verification & Hardening
- [ ] Comprehensive Playwright automated test suite across all pages.
- [ ] Zero broken images (`naturalWidth > 0`).
- [ ] Mobile responsive verification (390px iPhone 14) and desktop (1440px).
- [ ] Live verification on Vite dev server (`http://localhost:5173/`).
