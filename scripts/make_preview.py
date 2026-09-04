import os
from PIL import Image

folder = 'improvement'
files = [f for f in os.listdir(folder) if f.lower().endswith(('.jpg', '.png', '.jpeg')) and not f.startswith('gallery_preview')]

html = ['<!DOCTYPE html><html><head><meta charset="utf-8"><title>Improvement Images</title>',
'<style>body{font-family:sans-serif;background:#222;color:#fff;display:flex;flex-wrap:wrap;gap:20px;padding:20px;}',
'.card{background:#333;padding:10px;border-radius:8px;width:320px;box-sizing:border-box;}',
'img{width:100%;height:220px;object-fit:cover;display:block;border-radius:4px;}',
'p{margin:5px 0;font-size:12px;word-break:break-all;}',
'</style></head><body>']

for f in sorted(files):
    p = os.path.join(folder, f)
    with Image.open(p) as img:
        w, h = img.size
        sz = os.path.getsize(p) // 1024
    html.append(f'<div class="card"><img src="{f}"><p><b>{f}</b></p><p>{w}x{h}px | {sz}KB</p></div>')

html.append('</body></html>')
preview_path = os.path.join(folder, 'preview.html')
with open(preview_path, 'w', encoding='utf-8') as out:
    out.write('\n'.join(html))
print(f'Created {preview_path} with {len(files)} images')
