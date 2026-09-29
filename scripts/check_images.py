import os
import re

with open('src/data/projects.ts', 'r', encoding='utf-8') as f:
    content = f.read()

images = re.findall(r"['\"](/projects/[^'\"]+)['\"]", content)
print(f"Total image references: {len(images)}")
missing = []
found = []
for img in sorted(set(images)):
    disk_path = os.path.normpath(os.path.join('public', img.lstrip('/')))
    if os.path.exists(disk_path):
        found.append(img)
    else:
        missing.append((img, disk_path))

print(f"Found: {len(found)}")
print(f"Missing: {len(missing)}")
for m, dp in missing:
    print("  Missing:", m)
