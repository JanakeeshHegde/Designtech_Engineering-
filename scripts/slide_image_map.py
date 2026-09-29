import zipfile, xml.etree.ElementTree as ET

def get_slide_images(pptx_path, label):
    result = {}
    with zipfile.ZipFile(pptx_path, 'r') as z:
        slides = sorted(
            [f for f in z.namelist()
             if f.startswith('ppt/slides/slide') and f.endswith('.xml')
             and 'slideLayout' not in f and 'slideMaster' not in f]
        )
        for slide in slides:
            slide_num = slide.rsplit('slide', 1)[1].replace('.xml','')
            try:
                int(slide_num)
            except ValueError:
                continue
            rel_path = 'ppt/slides/_rels/slide' + slide_num + '.xml.rels'
            images = []
            if rel_path in z.namelist():
                with z.open(rel_path) as f:
                    rel_tree = ET.fromstring(f.read())
                for rel in rel_tree:
                    t = rel.get('Type','')
                    target = rel.get('Target','')
                    if 'image' in t.lower() and target:
                        img_name = target.split('/')[-1]
                        images.append(img_name)

            with z.open(slide) as f:
                slide_tree = ET.fromstring(f.read())
            texts = []
            for t_elem in slide_tree.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}t'):
                if t_elem.text and t_elem.text.strip():
                    texts.append(t_elem.text.strip())

            if texts or images:
                result[slide_num] = {'texts': texts, 'images': images}
    return result

for fname, label in [
    (r'c:\Users\hegde\Desktop\Designtech_Engineering-\Designtech DBP-2026.pptx', '2026'),
    (r'c:\Users\hegde\Desktop\Designtech_Engineering-\Designtech DBP-2025.pptx', '2025'),
]:
    print('=== DBP-' + label + ' SLIDE-IMAGE MAP ===')
    info = get_slide_images(fname, label)
    for k in sorted(info.keys(), key=lambda x: int(x)):
        v = info[k]
        t_preview = v['texts'][:4]
        print('  Slide ' + k + ': text=' + str(t_preview) + ', images=' + str(v['images']))
    print()
