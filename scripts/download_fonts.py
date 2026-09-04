import urllib.request
import re
import os

fonts_dir = r'd:\projects\dibaj\assets\fonts'
os.makedirs(fonts_dir, exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
}

fonts_spec = [
    {
        'name': 'amiri',
        'css_url': 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap'
    },
    {
        'name': 'ibm-plex-sans-arabic',
        'css_url': 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600&display=swap'
    }
]

for item in fonts_spec:
    name = item['name']
    req = urllib.request.Request(item['css_url'], headers=headers)
    with urllib.request.urlopen(req) as resp:
        css = resp.read().decode('utf-8')
    
    blocks = css.split('@font-face')
    for b in blocks:
        if not b.strip():
            continue
        # Find subset comment
        subset_match = re.search(r'/\*\s*([^*]+)\s*\*/', b)
        subset = subset_match.group(1).strip() if subset_match else 'default'
        
        # We need arabic or latin subset
        weight_m = re.search(r'font-weight:\s*(\d+)', b)
        src_m = re.search(r'url\((https://[^)]+\.woff2)\)', b)
        
        if weight_m and src_m and ('arabic' in subset.lower() or 'latin' in subset.lower()):
            weight = weight_m.group(1)
            font_url = src_m.group(1)
            clean_subset = re.sub(r'[^a-zA-Z0-9]', '_', subset.lower())
            filename = f"{name}-{weight}-{clean_subset}.woff2"
            dest = os.path.join(fonts_dir, filename)
            
            f_req = urllib.request.Request(font_url, headers=headers)
            with urllib.request.urlopen(f_req) as f_resp, open(dest, 'wb') as out:
                out.write(f_resp.read())
            print(f"Downloaded {filename}: {os.path.getsize(dest):,} bytes (subset: {subset})")

print("Font download complete.")
