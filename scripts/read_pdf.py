import pypdf
try:
    reader = pypdf.PdfReader('Designtech Eng.pdf')
    print(f"Total pages: {len(reader.pages)}")
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        print(f"--- Page {i+1} ---")
        print(text[:300] if text else "[No text]")
except Exception as e:
    print("Error:", e)
