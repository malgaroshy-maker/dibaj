import os
import urllib.request
import shutil
from PIL import Image

ROOT_DIR = r'd:\projects\dibaj'
ASSETS_DIR = os.path.join(ROOT_DIR, 'assets')
FONTS_DIR = os.path.join(ASSETS_DIR, 'fonts')
IMAGES_DIR = os.path.join(ASSETS_DIR, 'images')
CSS_DIR = os.path.join(ASSETS_DIR, 'css')
JS_DIR = os.path.join(ASSETS_DIR, 'js')

for d in [FONTS_DIR, IMAGES_DIR, CSS_DIR, JS_DIR]:
    os.makedirs(d, exist_ok=True)

# 1. Empty .nojekyll
nojekyll_path = os.path.join(ROOT_DIR, '.nojekyll')
with open(nojekyll_path, 'w') as f:
    pass
print("Created .nojekyll")

# 2. Download the 4 canonical Arabic WOFF2 fonts
fonts = [
    ('amiri-400.woff2', 'https://fonts.gstatic.com/s/amiri/v30/J7aRnpd8CGxBHpUrtLMA7w.woff2'),
    ('amiri-700.woff2', 'https://fonts.gstatic.com/s/amiri/v30/J7acnpd8CGxBHp2VkaY6zp5yGw.woff2'),
    ('ibm-plex-sans-arabic-400.woff2', 'https://fonts.gstatic.com/s/ibmplexsansarabic/v15/Qw3CZRtWPQCuHme67tEYUIx3Kh0PHR9N6Ys43PWrfQ.woff2'),
    ('ibm-plex-sans-arabic-600.woff2', 'https://fonts.gstatic.com/s/ibmplexsansarabic/v15/Qw3NZRtWPQCuHme67tEYUIx3Kh0PHR9N6YPi-OCRXMR5Kw.woff2')
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36'}
for fname, url in fonts:
    dest = os.path.join(FONTS_DIR, fname)
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp, open(dest, 'wb') as out:
        out.write(resp.read())
    print(f"Font saved: {fname} ({os.path.getsize(dest):,} bytes)")

# 3. Optimize generated images to WebP
ARTIFACTS_DIR = r'C:\Users\masal\.gemini\antigravity-ide\brain\7c69ef3d-9857-4638-8a31-b57579059eaa'

image_mappings = [
    ('hero-emerald.webp', os.path.join(ARTIFACTS_DIR, 'hero_emerald_macro_1788485976065.jpg'), 1920, 78),
    ('hero-magenta.webp', os.path.join(ARTIFACTS_DIR, 'hero_magenta_macro_1788486690375.jpg'), 1920, 78),
    ('hero-damask.webp', os.path.join(ARTIFACTS_DIR, 'hero_damask_macro_1788486713516.jpg'), 1920, 78),
    ('salon-taupe-hairpin.webp', os.path.join(ARTIFACTS_DIR, 'salon_taupe_hairpin_1788485997241.jpg'), 1200, 80),
    ('majlis-sage-chenille.webp', os.path.join(ARTIFACTS_DIR, 'majlis_sage_chenille_1788486016445.jpg'), 1200, 80),
    ('swatch-terracotta.webp', os.path.join(ARTIFACTS_DIR, 'terracotta_fabric_macro_1788486075068.jpg'), 600, 82),
]

for out_name, src_path, max_w, quality in image_mappings:
    dest = os.path.join(IMAGES_DIR, out_name)
    with Image.open(src_path) as img:
        # Resize maintaining aspect ratio if larger than max_w
        if img.size[0] > max_w:
            w = max_w
            h = int(img.size[1] * (max_w / img.size[0]))
            img = img.resize((w, h), Image.Resampling.LANCZOS)
        img.save(dest, 'WEBP', quality=quality, method=6)
    print(f"Optimized {out_name}: {img.size[0]}x{img.size[1]}px ({os.path.getsize(dest)//1024} KB)")

# Copy logo crest
crest_src = os.path.join(ROOT_DIR, 'public', 'assets', 'logo_crest.png')
crest_dest = os.path.join(IMAGES_DIR, 'logo_crest.png')
if os.path.exists(crest_src):
    # Optimize/resize logo crest so it's not a 1MB huge PNG
    with Image.open(crest_src) as img:
        img_thumb = img.copy()
        img_thumb.thumbnail((256, 256), Image.Resampling.LANCZOS)
        img_thumb.save(crest_dest, 'PNG', optimize=True)
    print(f"Optimized logo_crest.png: {os.path.getsize(crest_dest)//1024} KB")

print("Asset preparation complete.")
