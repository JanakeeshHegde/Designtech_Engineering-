import os, shutil

os.makedirs('public/projects/cross-winds', exist_ok=True)
src_dir = 'src/extracted_ppt_images/dbp2025'

# slide 15: image18.JPG is hero
# slide 16: image19.jpeg is construction, image20.jpeg is img1
# slide 18: image23.jpg is completed

if os.path.exists(f'{src_dir}/image18.JPG'):
    shutil.copy(f'{src_dir}/image18.JPG', 'public/projects/cross-winds/hero.jpg')
if os.path.exists(f'{src_dir}/image19.jpeg'):
    shutil.copy(f'{src_dir}/image19.jpeg', 'public/projects/cross-winds/construction1.jpg')
if os.path.exists(f'{src_dir}/image20.jpeg'):
    shutil.copy(f'{src_dir}/image20.jpeg', 'public/projects/cross-winds/img1.jpg')
if os.path.exists(f'{src_dir}/image23.jpg'):
    shutil.copy(f'{src_dir}/image23.jpg', 'public/projects/cross-winds/completed.jpg')

print("Cross winds images copied successfully.")
