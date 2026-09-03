import os
from PIL import Image

src_path = r"C:\Users\masal\.gemini\antigravity-ide\brain\43607806-db2b-4224-af8c-3c01ff875aca\dibaj_na_logo_1788479095876.jpg"
dst_path = r"d:\projects\dibaj\public\assets\logo_crest.png"
master_path = r"d:\projects\dibaj\public\assets\logo_na_master.png"

img = Image.open(src_path).convert("RGBA")
width, height = img.size

# Flood fill outer white areas to transparent
# We can use Image.floodfill or a custom BFS flood fill from all 4 corners
pixels = img.load()

visited = set()
queue = [(0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1),
         (width // 2, 0), (0, height // 2), (width - 1, height // 2), (width // 2, height - 1)]

# Threshold for near white background
def is_white(r, g, b):
    return r > 240 and g > 240 and b > 240

for start in queue:
    if start not in visited:
        r, g, b, a = pixels[start[0], start[1]]
        if is_white(r, g, b):
            q = [start]
            visited.add(start)
            while q:
                x, y = q.pop()
                pixels[x, y] = (0, 0, 0, 0)
                for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
                    if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                        nr, ng, nb, _ = pixels[nx, ny]
                        if is_white(nr, ng, nb):
                            visited.add((nx, ny))
                            q.append((nx, ny))

img.save(dst_path, "PNG")
img.save(master_path, "PNG")
print(f"Successfully saved transparent logo to {dst_path} ({width}x{height})")
