#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Helper script to elevate all subpage footers and meta descriptions with 
the Bab Bin Ghashir Factory and 5 Abu Salim Showrooms branding.
"""

from pathlib import Path

BASE_DIR = Path(r"d:\projects\dibaj")

# 1. Update index.html meta
index_path = BASE_DIR / "index.html"
index_content = index_path.read_text(encoding="utf-8")
old_index_meta = 'content="شركة الديباج لتصنيع وتفصيل الصالونات والمجالس الفاخرة بطرابلس، سوق أبوسليم محل 14 ومحل 76. خشب زان مصمت وإسفنج ضغط عالي، تفصيل على المقاس وبنفس القيمة بالشيك المصدق والبطاقة."'
new_index_meta = 'content="شركة الديباج لصناعة وتفصيل الصالونات والمجالس الفاخرة، مجمع مصانعنا بباب بن غشير و5 صالات عرض متخصصة بسوق أبوسليم طرابلس، وريادة استيراد الأقمشة النادرة الحصرية على مستوى ليبيا."'
if old_index_meta in index_content:
    index_content = index_content.replace(old_index_meta, new_index_meta)
    index_path.write_text(index_content, encoding="utf-8")
    print("Updated index.html meta description")

# 2. Update contact.html meta
contact_path = BASE_DIR / "contact.html"
contact_content = contact_path.read_text(encoding="utf-8")
old_contact_meta = 'content="تفضل بزيارة محلات وصالات عرض شركة الديباج بسوق أبوسليم طرابلس (محل 14 ومحل 76)، أو تواصل معنا مباشرة لتفصيل صالونك أو مجلسك."'
new_contact_meta = 'content="تفضل بزيارة مجمع مصانع الديباج بباب بن غشير وسلسلة صالات العرض الـ 5 بسوق أبوسليم طرابلس، أو تواصل معنا لتفصيل صالونك بأرقى الأقمشة النادرة مع توصيل لكافة مدن ليبيا."'
if old_contact_meta in contact_content:
    contact_content = contact_content.replace(old_contact_meta, new_contact_meta)
    contact_path.write_text(contact_content, encoding="utf-8")
    print("Updated contact.html meta description")

# 3. Update curtains measurement advice
curtains_path = BASE_DIR / "curtains.html"
curtains_content = curtains_path.read_text(encoding="utf-8")
old_curtains_tip = "عند زيارة محل 14 أو محل 76 في سوق أبوسليم"
new_curtains_tip = "عند زيارة معارضنا الـ 5 في سوق أبوسليم"
if old_curtains_tip in curtains_content:
    curtains_content = curtains_content.replace(old_curtains_tip, new_curtains_tip)
    curtains_path.write_text(curtains_content, encoding="utf-8")
    print("Updated curtains.html measurement tip")

# 4. Update footers across subpages: salons, majlis, corners, curtains, gallery
subpages = ["salons.html", "majlis.html", "corners.html", "curtains.html", "gallery.html"]

old_brand_p = "<p>صناعة وطنية متخصصة في الصالونات والجلسات العربية والموديلات العصرية في سوق أبوسليم – طرابلس.</p>"
new_brand_p = "<p>صرح صناعي وطني ليبي — مصنعنا المركزي في باب بن غشير و5 صالات عرض متخصصة بسوق أبوسليم، رواد استيراد وتوريد أرقى الأقمشة الحصرية النادرة لكافة مدن ليبيا.</p>"

old_contact_li = "<li>محل 14 ومحل 76: سوق أبوسليم، طرابلس</li>"
new_contact_li = (
    "<li>🏭 المصنع المركزي: باب بن غشير، طرابلس</li>\n"
    "            <li>🏬 المعارض: 5 صالات بسوق أبوسليم (منها 14 و76)</li>\n"
    "            <li>🚚 التوصيل: طرابلس وكافة مدن ليبيا</li>"
)

for sp_name in subpages:
    sp_path = BASE_DIR / sp_name
    if not sp_path.exists():
        continue
    content = sp_path.read_text(encoding="utf-8")
    changed = False
    if old_brand_p in content:
        content = content.replace(old_brand_p, new_brand_p)
        changed = True
    if old_contact_li in content:
        content = content.replace(old_contact_li, new_contact_li)
        changed = True
    if changed:
        sp_path.write_text(content, encoding="utf-8")
        print(f"Updated footer in {sp_name}")

print("All subpages updated successfully.")
