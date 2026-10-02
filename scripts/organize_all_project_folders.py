import os
import shutil

BASE_DIR = r"c:\Users\hegde\Desktop\Designtech_Engineering-"
PUBLIC_PROJ = os.path.join(BASE_DIR, "public", "projects")
DBP2026 = os.path.join(BASE_DIR, "src", "extracted_ppt_images", "dbp2026")
DBP2025 = os.path.join(BASE_DIR, "src", "extracted_ppt_images", "dbp2025")

# All 16 projects
ALL_PROJECTS = [
    "hotel-country-inn",
    "st-josephs-college",
    "cmr-pu-college",
    "cross-winds-apartment",
    "taurus-jcb",
    "complex-mangalore",
    "gallery-ksca-alur",
    "convention-center-ksca-alur",
    "sagittarius-metals",
    "puttur-commercial-apartment",
    "harohalli-industrial",
    "bellary-apartment",
    "silent-shores-solar",
    "devadiga-sangha-rr-nagar",
    "industrial-kumbalagodu",
    "commercial-complex-kanakapura",
]

# Ensure every project has main and gallery directory
for pid in ALL_PROJECTS:
    p_dir = os.path.join(PUBLIC_PROJ, pid)
    os.makedirs(os.path.join(p_dir, "main"), exist_ok=True)
    os.makedirs(os.path.join(p_dir, "gallery"), exist_ok=True)

# 1. Puttur
puttur_main = os.path.join(DBP2026, "image11.jpeg")
if os.path.exists(puttur_main):
    shutil.copy2(puttur_main, os.path.join(PUBLIC_PROJ, "puttur-commercial-apartment", "main", "main.jpg"))

puttur_gallery = ["image12.jpeg", "image13.png", "image14.jpeg", "image15.png", "image16.png", "image17.png"]
for idx, img in enumerate(puttur_gallery):
    src = os.path.join(DBP2026, img)
    if os.path.exists(src):
        ext = os.path.splitext(img)[1]
        dst = os.path.join(PUBLIC_PROJ, "puttur-commercial-apartment", "gallery", f"0{idx+1}{ext}")
        shutil.copy2(src, dst)

# 2. Harohalli
harohalli_main = os.path.join(DBP2026, "image18.jpeg")
if os.path.exists(harohalli_main):
    shutil.copy2(harohalli_main, os.path.join(PUBLIC_PROJ, "harohalli-industrial", "main", "main.jpg"))

harohalli_gallery = ["image19.png", "image20.png"]
for idx, img in enumerate(harohalli_gallery):
    src = os.path.join(DBP2026, img)
    if os.path.exists(src):
        ext = os.path.splitext(img)[1]
        dst = os.path.join(PUBLIC_PROJ, "harohalli-industrial", "gallery", f"0{idx+1}{ext}")
        shutil.copy2(src, dst)

# 3. Commercial Complex Kanakapura
kanakapura_main = os.path.join(DBP2026, "image21.jpeg")
if os.path.exists(kanakapura_main):
    shutil.copy2(kanakapura_main, os.path.join(PUBLIC_PROJ, "commercial-complex-kanakapura", "main", "main.jpg"))

kanakapura_gallery = ["image22.jpeg", "image23.jpeg", "image24.jpeg"]
for idx, img in enumerate(kanakapura_gallery):
    src = os.path.join(DBP2026, img)
    if os.path.exists(src):
        ext = os.path.splitext(img)[1]
        dst = os.path.join(PUBLIC_PROJ, "commercial-complex-kanakapura", "gallery", f"0{idx+1}{ext}")
        shutil.copy2(src, dst)

# 4. Bellary
bellary_main = os.path.join(DBP2026, "image25.jpeg")
if os.path.exists(bellary_main):
    shutil.copy2(bellary_main, os.path.join(PUBLIC_PROJ, "bellary-apartment", "main", "main.jpg"))

bellary_gallery = ["image26.png", "image27.jpeg", "image28.jpeg"]
for idx, img in enumerate(bellary_gallery):
    src = os.path.join(DBP2026, img)
    if os.path.exists(src):
        ext = os.path.splitext(img)[1]
        dst = os.path.join(PUBLIC_PROJ, "bellary-apartment", "gallery", f"0{idx+1}{ext}")
        shutil.copy2(src, dst)

print("All 16 project folders created and organized!")
for d in sorted(os.listdir(PUBLIC_PROJ)):
    p = os.path.join(PUBLIC_PROJ, d)
    if os.path.isdir(p):
        main_files = os.listdir(os.path.join(p, "main")) if os.path.exists(os.path.join(p, "main")) else []
        gal_files = os.listdir(os.path.join(p, "gallery")) if os.path.exists(os.path.join(p, "gallery")) else []
        print(f"  {d}: main={main_files}, gallery={gal_files}")
