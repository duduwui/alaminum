import json, re, os

# Words to replace
REPLACEMENTS = [
    (r'\(Guillotine Glass System\)', ''),
    (r'\(Guillotine System\)', ''),
    (r'\(Guillotine Glass\)', ''),
    (r'\(Guillotine\)', ''),
    (r'Guillotine', 'المقصلة الزجاجية'),
    (r'\(Bi-Folding\)', 'القابلة للطي والتطبيق'),
    (r'Bi-Folding', 'القابلة للطي'),
    (r'\(Projected\)', 'البارزة للخارج'),
    (r'Projected', 'البارزة'),
    (r'Lift & Slide', 'السحاب والرفع المعماري'),
    (r'Lift and Slide', 'السحاب والرفع المعماري'),
    (r'\(Thermal Break\)', 'العازل للحرارة والصوت'),
    (r'Thermal Break', 'العازل للحرارة والصوت'),
    (r'\(Low-E\)', 'منخفض الانبعاثية الحرارية'),
    (r'Low-E', 'منخفض الانبعاثية الحرارية'),
    (r'\(Argon\)', 'الغاز الخامل العازل'),
    (r'Argon', 'الغاز الخامل العازل'),
    (r'\(PDF\)', 'المخطط الهندسي'),
    (r'PDF', 'المخطط الهندسي'),
    (r'\(CAD\)', 'المخططات الهندسية المعمارية'),
    (r'CAD', 'المخططات الهندسية'),
    (r'\(CNC\)', 'بالتحكم الرقمي فائق الدقة بالكمبيوتر'),
    (r'CNC', 'بالتحكم الرقمي فائق الدقة'),
    (r'uPVC', 'يو بي في سي عالي العزل'),
    (r'UPVC', 'يو بي في سي عالي العزل'),
    (r'WIEK', 'الألمانية المعتمدة'),
    (r'STAC', 'الإسبانية المعتمدة'),
    (r'70LS', '70 للسحب المعماري'),
    (r'51LS', '51 للسحب النحيف'),
    (r'58TT', '58 المعزول حرارياً'),
    (r'HS76', '76 فائق العزل'),
    (r'50F', '50 للواجهات الزجاجية'),
    (r'Lorenzo', 'لورنزو'),
    (r'Deceuninck', 'ديكونينك العالمية'),
    (r'Winsa', 'وينسا'),
    (r'Alumil', 'ألوميل العالمية'),
    (r'Somfy', 'سومفي الذكية'),
    (r'Dorma', 'دورما الألمانية'),
    (r'Geze', 'غيزه الألمانية'),
    (r'KFV', 'كي إف في الألمانية'),
    (r'Winkhaus', 'وينكهاوس الألمانية'),
    (r'FritsJurgens', 'الهولندية الفاخرة'),
    (r'Interpon', 'العالمية المعتمدة'),
    (r'Simonswerk TECTUS', 'الألمانية المخفية ثلاثية الأبعاد'),
    (r'Simonswerk', 'الألمانية المعتمدة'),
    (r'TECTUS', 'المخفية ثلاثية الأبعاد'),
    (r'EPDM', 'المطاط الهندسي ثلاثي الإحكام'),
    (r'TPE', 'المطاط المرن فائق العزل'),
    (r'Class S', 'المقاومة للمناخ القاسي'),
    (r'Class 2', 'الفئة الثانية عالية الجودة'),
    (r'Class 1', 'الفئة الأولى المعتمدة'),
    (r'Qualicoat', 'المعتمد دولياً'),
    (r'6063-T6', 'المعمارية المعالجة حرارياً عالية الصلابة'),
    (r'6060-T6', 'الهيكلية المعالجة حرارياً فائقة القوة'),
    (r'AISI 316', 'الفولاذ المقاوم للصدأ البحري 316'),
    (r'AISI 304', 'الفولاذ المقاوم للصدأ 304'),
    (r'AISI', 'الفولاذ المقاوم للصدأ'),
    (r'European Groove', 'المجرى القياسي الأوروبي'),
    (r'LED', 'الموفرة للطاقة'),
    (r'RGB', 'متعددة الألوان'),
    (r'Tuya', 'الذكية المعتمدة'),
    (r'IP67', 'المعزولة تماماً ضد الماء والأتربة'),
    (r'IP68', 'المعزولة تماماً ضد الماء والأتربة'),
    (r'IP65', 'المعزولة ضد الرذاذ والأتربة'),
    (r'IP', 'المعزولة المقاومة'),
    (r'RAL 7016', 'الرمادي الغرافيتي المعماري'),
    (r'RAL 9005', 'الأسود المعماري'),
    (r'RAL', 'المواصفات المعمارية'),
    (r'PVB', 'الأمان العازلة المتعددة'),
    (r'EN 1627', 'المعايير الأوروبية للأمان ومقاومة السطو'),
    (r'EN 12600', 'المعايير الأوروبية لسلامة الزجاج'),
    (r'BS 6180', 'المعايير البريطانية للسلامة الإنشائية'),
    (r'RC2', 'المستوى الثاني لمقاومة السطو'),
    (r'RC3', 'المستوى الثالث لمقاومة السطو'),
    (r'PA66', 'البولي أميد عالي الكثافة'),
    (r'POM', 'البوليمر الهندسي المتين'),
    (r'Optiwhite', 'فائق النقاء كريستالي فائق الشفافية'),
    (r'Duplex 2205', 'الفولاذ المقاوم للصدأ البحري المزدوج'),
    (r'Duplex', 'الفولاذ المزدوج فائق الصلابة'),
    (r'Spigot', 'مرابط التثبيت الأرضية الدقيقة'),
    (r'Mitered', 'المشطوفة بدقة'),
    (r'Ud < 1.1', 'عزل حراري فائق الكفاءة'),
    (r'Ud', 'معامل العزل الحراري'),
    (r'\(Doorhome\)', ''),
    (r'Doorhome', 'دور هوم'),
]

def clean_eastern_string(s: str) -> str:
    if not isinstance(s, str) or not s:
        return s
    # Only clean if the string contains Arabic/Kurdish characters
    if not re.search(r'[\u0600-\u06FF]', s):
        return s
    res = s
    for pat, rep in REPLACEMENTS:
        res = re.sub(pat, rep, res, flags=re.IGNORECASE)
    # Remove any remaining parenthesized english: (Some English 123)
    res = re.sub(r'\s*\([a-zA-Z0-9\s\.\-_\/]+\)', '', res)
    # Remove any standalone english word of 2+ letters
    res = re.sub(r'\b[a-zA-Z]{2,}\b', '', res)
    # Clean multiple spaces and dangling punctuation
    res = re.sub(r'[ \t]+', ' ', res)
    res = re.sub(r' +([،\.؛:؟\)])', r'\1', res)
    res = re.sub(r'(\() +', r'\1', res)
    return res.strip()

def clean_data_structure(data):
    if isinstance(data, dict):
        new_dict = {}
        for k, v in data.items():
            new_k = clean_eastern_string(k) if isinstance(k, str) else k
            new_dict[new_k] = clean_data_structure(v)
        return new_dict
    elif isinstance(data, list):
        return [clean_data_structure(item) for item in data]
    elif isinstance(data, str):
        return clean_eastern_string(data)
    else:
        return data

# Process cms_homepage_section_slides_db.json
print("Processing cms_homepage_section_slides_db.json...")
with open("cms_homepage_section_slides_db.json") as f:
    slides = json.load(f)
slides = clean_data_structure(slides)
with open("cms_homepage_section_slides_db.json", "w") as f:
    json.dump(slides, f, indent=2, ensure_ascii=False)
with open("src/data/homepageSectionItemsSeed.ts", "w") as f:
    f.write("import { ProductItem } from './winhomeData';\n\nexport const HOMEPAGE_SECTION_ITEMS_SEED: ProductItem[] = " + json.dumps(slides, indent=2, ensure_ascii=False) + ";\n")

# Process cms_products_db.json
print("Processing cms_products_db.json...")
with open("cms_products_db.json") as f:
    products = json.load(f)
products = clean_data_structure(products)
with open("cms_products_db.json", "w") as f:
    json.dump(products, f, indent=2, ensure_ascii=False)
with open("src/data/productionProductsSeed.ts", "w") as f:
    f.write("import { ProductItem } from './winhomeData';\n\nexport const PRODUCTION_PRODUCTS_SEED: ProductItem[] = " + json.dumps(products, indent=2, ensure_ascii=False) + ";\n")

# Process cms_gallery_db.json
print("Processing cms_gallery_db.json...")
with open("cms_gallery_db.json") as f:
    gallery = json.load(f)
gallery = clean_data_structure(gallery)
with open("cms_gallery_db.json", "w") as f:
    json.dump(gallery, f, indent=2, ensure_ascii=False)
with open("src/data/galleryData.ts", "w") as f:
    f.write("import { GalleryMediaItem } from '../services/galleryContentService';\n\nexport const MASTER_GALLERY_ITEMS: GalleryMediaItem[] = " + json.dumps(gallery, indent=2, ensure_ascii=False) + ";\n")

# Process cms_arch_showcase_db.json
print("Processing cms_arch_showcase_db.json...")
with open("cms_arch_showcase_db.json") as f:
    arch = json.load(f)
arch = clean_data_structure(arch)
with open("cms_arch_showcase_db.json", "w") as f:
    json.dump(arch, f, indent=2, ensure_ascii=False)

# Process cms_divisions_db.json
print("Processing cms_divisions_db.json...")
with open("cms_divisions_db.json") as f:
    divs = json.load(f)
divs = clean_data_structure(divs)
with open("cms_divisions_db.json", "w") as f:
    json.dump(divs, f, indent=2, ensure_ascii=False)

print("Purge completed! Now scanning all 5 JSON stores for any leftover English inside Arabic strings...")
check_pattern = re.compile(r'[\u0600-\u06FF]{2,}[^\n\r\"\']{0,30}\b([a-zA-Z]{2,})\b[^\n\r\"\']{0,30}[\u0600-\u06FF]{2,}')

for path in ["cms_homepage_section_slides_db.json", "cms_products_db.json", "cms_gallery_db.json", "cms_arch_showcase_db.json", "cms_divisions_db.json"]:
    with open(path) as f:
        txt = f.read()
    matches = check_pattern.findall(txt)
    print(f"{path}: {len(matches)} occurrences found -> {set(matches)}")
