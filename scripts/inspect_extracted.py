import zipfile
import os

print("Checking dbp2025 extracted images:")
for f in sorted(os.listdir('src/extracted_ppt_images/dbp2025')):
    print(" ", f, os.path.getsize(f'src/extracted_ppt_images/dbp2025/{f}'))

print("\nChecking dbp2026 extracted images:")
for f in sorted(os.listdir('src/extracted_ppt_images/dbp2026')):
    print(" ", f, os.path.getsize(f'src/extracted_ppt_images/dbp2026/{f}'))
