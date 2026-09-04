import re

path = r"d:\projects\dibaj\src\data\fabrics.js"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

new_origin = "origin: 'مصنع الديباج (باب بن غشير) • أقمشة مستوردة حصرياً لشركة الديباج'"
content = re.sub(r"origin:\s*['\"][^'\"]+['\"]", new_origin, content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated all origin entries in fabrics.js")
