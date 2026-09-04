import os
from PIL import Image, ImageDraw, ImageFont

folder = 'improvement'
files = sorted([f for f in os.listdir(folder) if f.lower().endswith(('.jpg', '.png')) and not f.startswith(('preview', 'contact_sheet'))])

cols = 4
rows = (len(files) + cols - 1) // cols
cell_w = 400
cell_h = 320

sheet = Image.new('RGB', (cols * cell_w, rows * cell_h), color=(30, 30, 30))
draw = ImageDraw.Draw(sheet)

for idx, f in enumerate(files):
    r = idx // cols
    c = idx % cols
    p = os.path.join(folder, f)
    x = c * cell_w
    y = r * cell_h
    try:
        with Image.open(p) as img:
            thumb = img.copy()
            thumb.thumbnail((cell_w - 20, cell_h - 60))
            tw, th = thumb.size
            sheet.paste(thumb, (x + (cell_w - tw)//2, y + 10))
            prefix = f.split('_')[0]
            draw.text((x + 10, y + cell_h - 45), f"{idx+1}. {prefix}...", fill=(255, 255, 255))
            draw.text((x + 10, y + cell_h - 25), f"{img.size[0]}x{img.size[1]} ({os.path.getsize(p)//1024}KB)", fill=(200, 200, 150))
    except Exception as e:
        print(f"Error {f}: {e}")

sheet.save(os.path.join(folder, 'contact_sheet.jpg'), quality=85)
print("Saved contact_sheet.jpg")
