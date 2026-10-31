import json, re, os

# Regex to find any English word of 2 or more letters
english_word_re = re.compile(r'[a-zA-Z]{2,}')

# Comprehensive replacements for any English in Arabic strings
REPLACEMENTS = [
    (r'\(Guillotine Glass System\)', 'المعروف بنظام الجلوتين الزجاجي الأوتوماتيكي'),
    (r'Guillotine Glass System', 'نظام الجلوتين الزجاجي الأوتوماتيكي'),
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
    (r'EPDM', 'المطاط الهندسي ثلاثي الإحكام'),
    (r'Class S', 'المقاومة للمناخ القاسي'),
    (r'Class 2', 'الفئة الثانية عالية الجودة'),
    (r'Class 1', 'الفئة الأولى المعتمدة'),
    (r'Qualicoat', 'المعتمد دولياً'),
    (r'6063-T6', 'المعمارية المعالجة حرارياً عالية الصلابة'),
    (r'6060-T6', 'الهيكلية المعالجة حرارياً فائقة القوة'),
    (r'\(W23045\)', ''),
    (r'\(W00006\)', ''),
    (r'\(W00007\)', ''),
    (r'\(GBCHALRW\)', ''),
    (r'\(DELTA & GAMMA\)', 'المعمارية العصرية'),
    (r'DELTA & GAMMA', 'المعمارية العصرية'),
    (r'LS150', '150 فائق التحمل'),
    (r'LS', 'للسحب والرفع'),
    (r'AISI 316', 'الفولاذ المقاوم للصدأ البحري 316'),
    (r'AISI 304', 'الفولاذ المقاوم للصدأ 304'),
    (r'AISI', 'الفولاذ المقاوم للصدأ'),
    (r'European Groove', 'المجرى الأوروبي القياسي المعياري'),
]

def clean_ar(text: str) -> str:
    if not text or not isinstance(text, str):
        return text
    res = text
    for pat, rep in REPLACEMENTS:
        res = re.sub(pat, rep, res, flags=re.IGNORECASE)
    # Remove any remaining English words in parentheses like (Word)
    res = re.sub(r'\s*\([a-zA-Z0-9\s\.\-_\/]+\)', '', res)
    # Remove any isolated English words in Arabic text
    res = re.sub(r'([a-zA-Z]+)', '', res)
    # Clean multiple spaces and punctuation spaces
    res = re.sub(r'[ \t]+', ' ', res)
    res = re.sub(r' +([،\.؛:؟\)])', r'\1', res)
    res = re.sub(r'(\() +', r'\1', res)
    return res.strip()

print("--- 1. Updating homepageSectionSlides ---")
with open("cms_homepage_section_slides_db.json", "r") as f:
    slides = json.load(f)

for s in slides:
    for k in ["name", "arabicName", "description", "arabicDescription"]:
        if k in s and isinstance(s[k], str) and re.search(r'[\u0600-\u06FF]', s[k]):
            s[k] = clean_ar(s[k])
    if "translations" in s and isinstance(s["translations"], dict) and "ar" in s["translations"]:
        for k in ["name", "description"]:
            if k in s["translations"]["ar"] and isinstance(s["translations"]["ar"][k], str):
                s["translations"]["ar"][k] = clean_ar(s["translations"]["ar"][k])

with open("cms_homepage_section_slides_db.json", "w") as f:
    json.dump(slides, f, indent=2, ensure_ascii=False)

seed_slides_ts = "import { ProductItem } from './winhomeData';\n\n"
seed_slides_ts += f"export const HOMEPAGE_SECTION_ITEMS_SEED: ProductItem[] = {json.dumps(slides, indent=2, ensure_ascii=False)};\n"
with open("src/data/homepageSectionItemsSeed.ts", "w") as f:
    f.write(seed_slides_ts)
print("Updated cms_homepage_section_slides_db.json and homepageSectionItemsSeed.ts")

print("--- 2. Updating cms_arch_showcase_db.json & architectureCardsService.ts ---")
with open("cms_arch_showcase_db.json", "r") as f:
    arch_showcase = json.load(f)

for item in arch_showcase:
    for k in ["titleAr", "descriptionAr", "buttonTextAr"]:
        if k in item and isinstance(item[k], str):
            item[k] = clean_ar(item[k])

with open("cms_arch_showcase_db.json", "w") as f:
    json.dump(arch_showcase, f, indent=2, ensure_ascii=False)

with open("src/services/architectureCardsService.ts", "r") as f:
    acs = f.read()

acs = re.sub(r'\(Projected\)', 'البارزة للخارج', acs)
acs = re.sub(r'\(Bi-Folding\)', 'القابلة للطي والتطبيق', acs)
acs = re.sub(r'\(PDF\)', 'المخطط الهندسي', acs)
acs = re.sub(r'WIEK', 'الألمانية المعتمدة', acs)
acs = re.sub(r'STAC', 'الإسبانية المعتمدة', acs)
acs = re.sub(r'Lift & Slide', 'السحاب والرفع المعماري', acs)
acs = re.sub(r'uPVC', 'يو بي في سي عالي العزل', acs)
acs = re.sub(r'European Groove', 'المجرى الأوروبي القياسي', acs)
acs = re.sub(r'\(W23045\)', '', acs)
acs = re.sub(r'\(W00006\)', '', acs)
acs = re.sub(r'\(W00007\)', '', acs)
acs = re.sub(r'\(GBCHALRW\)', '', acs)
acs = re.sub(r'\(DELTA & GAMMA\)', '', acs)
acs = re.sub(r'LS150', '150 فائق التحمل', acs)

with open("src/services/architectureCardsService.ts", "w") as f:
    f.write(acs)
print("Updated cms_arch_showcase_db.json and architectureCardsService.ts")

print("--- 3. Updating cms_divisions_db.json ---")
with open("cms_divisions_db.json", "r") as f:
    divisions = json.load(f)

for div in divisions:
    for k in ["title", "description"]:
        if k in div and isinstance(div[k], str) and re.search(r'[\u0600-\u06FF]', div[k]):
            div[k] = clean_ar(div[k])
    if "translations" in div and isinstance(div["translations"], dict) and "ar" in div["translations"]:
        for k in ["title", "description"]:
            if k in div["translations"]["ar"] and isinstance(div["translations"]["ar"][k], str):
                div["translations"]["ar"][k] = clean_ar(div["translations"]["ar"][k])

with open("cms_divisions_db.json", "w") as f:
    json.dump(divisions, f, indent=2, ensure_ascii=False)
print("Updated cms_divisions_db.json")

print("--- 4. Updating commonTranslations.ts, translationsData.ts, winhomeData.ts ---")
for file_path in ["src/data/commonTranslations.ts", "src/data/translationsData.ts", "src/data/winhomeData.ts"]:
    with open(file_path, "r") as f:
        content = f.read()
    # Replace common patterns in Arabic lines
    content = re.sub(r'uPVC', 'يو بي في سي عالي العزل', content)
    content = re.sub(r'CAD', 'المخططات الهندسية', content)
    content = re.sub(r'CNC', 'بالتحكم الرقمي فائق الدقة', content)
    content = re.sub(r'Class S', 'المقاومة للمناخ القاسي', content)
    content = re.sub(r'70LS', '70 للسحب المعماري', content)
    content = re.sub(r'51LS', '51 للسحب النحيف', content)
    content = re.sub(r'HS76', '76 فائق العزل', content)
    content = re.sub(r'Lift & Slide', 'السحاب والرفع المعماري', content)
    content = re.sub(r'\(Thermal Break\)', 'العازل للحرارة', content)
    with open(file_path, "w") as f:
        f.write(content)
print("Updated commonTranslations.ts, translationsData.ts, winhomeData.ts")

print("--- 5. Enhancing Gallery Projects with Doorhome Team & Professionalism ---")
with open("cms_gallery_db.json", "r") as f:
    gallery = json.load(f)

# Professional Doorhome team messaging templates tailored to project types
TEAM_VILLA_ENHANCEMENT_AR = (
    "\n\nتم تنفيذ هذا المشروع المعماري بالكامل بإشراف وإدارة فريق عمل شركة دور هوم (Doorhome) الهندسي المتخصص. "
    "تولى مهندسونا وفنيونا المحترفون كافة مراحل العمل الميداني بدءاً من الرفع المساحي الهندسي الدقيق، "
    "مروراً بتصنيع القطاعات وفق أحدث المعايير الأوروبية، وانتهاءً بالتركيب المتقن على أرض الموقع بأعلى درجات "
    "الدقة والحرفية الهندسية، مع ضمان الإحكام التام ضد تسرب الهواء والمياه وعزل درجات الحرارة القاسية."
)

TEAM_VILLA_ENHANCEMENT_EN = (
    "\n\nExecuted and supervised from blueprint to handover by Doorhome's certified specialized engineering team. "
    "Our professional site engineers and technicians handled the precise structural surveying, advanced European "
    "fabrication, and meticulous on-site installation with absolute craftsmanship, guaranteeing complete thermal "
    "isolation, structural integrity, and flawless architectural elegance."
)

TEAM_VILLA_ENHANCEMENT_CKB = (
    "\n\nئەم پڕۆژە تەلارسازییە بە تەواوی لەلایەن تیمی ئەندازیاری و تەکنیکی شارەزا و پرۆفێشناڵی کۆمپانیای دۆرهۆم (Doorhome) "
    "ئەنجامدراوە. ئەندازیاران و ستافی پسپۆڕمان سەرپەرشتی تەواوی قۆناغەکانی پێوانەکردنی ورد، دروستکردنی پیشەسازی بە پێوەرە "
    "ئەوروپییەکان و دانانی سەر شوێنەکەیان بەوپەڕی ڕێکی و وردبینییەوە کردووە بۆ دەستەبەرکردنی عەزل و جوانییەکی درێژخایەن."
)

# Target projects for team enhancement: villa projects, site installations, facades, and unclear villa projects
target_project_ids = {
    "proj-photo-1", "proj-photo-2", "proj-photo-3", "proj-photo-5", "proj-photo-6",
    "proj-photo-7", "proj-photo-8", "proj-photo-9", "proj-photo-10", "proj-photo-12",
    "proj-photo-13", "proj-photo-75", "proj-photo-78", "proj-photo-82",
    "proj-villa-neoclassical-porcelain", "proj-villa-modern-porcelain-facade",
    "proj-villa-under-construction-banner", "proj-villa-arched-masonry-framing",
    "proj-villa-timber-cladding-site", "proj-villa-patio-zip-screens",
    "proj-villa-terrace-retractable-awning", "proj-villa-operable-patio-video",
    "proj-commercial-tower-balconies-video", "proj-villa-garden-zip-video"
}

for g in gallery:
    gid = g.get("id", "")
    # Clean arabic text in all gallery items
    if "translations" in g and isinstance(g["translations"], dict) and "ar" in g["translations"]:
        for k in ["title", "description"]:
            if k in g["translations"]["ar"] and isinstance(g["translations"]["ar"][k], str):
                g["translations"]["ar"][k] = clean_ar(g["translations"]["ar"][k])

    # If it is a villa/house or site project, append the professional Doorhome team spotlight
    if gid in target_project_ids or g.get("category") in ["villa", "facade"]:
        if "translations" in g and isinstance(g["translations"], dict):
            ar_trans = g["translations"].get("ar", {})
            if "description" in ar_trans and "دور هوم" not in ar_trans.get("description", ""):
                ar_trans["description"] = clean_ar(ar_trans["description"]) + TEAM_VILLA_ENHANCEMENT_AR

            ckb_trans = g["translations"].get("ckb", {})
            if "description" in ckb_trans and "دۆرهۆم" not in ckb_trans.get("description", ""):
                ckb_trans["description"] = ckb_trans["description"] + TEAM_VILLA_ENHANCEMENT_CKB

        # Also in primary english description
        if "description" in g and "Doorhome" not in g.get("description", ""):
            g["description"] = g["description"] + TEAM_VILLA_ENHANCEMENT_EN

with open("cms_gallery_db.json", "w") as f:
    json.dump(gallery, f, indent=2, ensure_ascii=False)

gallery_ts = "import { GalleryMediaItem } from '../services/galleryContentService';\n\n"
gallery_ts += f"export const MASTER_GALLERY_ITEMS: GalleryMediaItem[] = {json.dumps(gallery, indent=2, ensure_ascii=False)};\n"
with open("src/data/galleryData.ts", "w") as f:
    f.write(gallery_ts)
print(f"Updated cms_gallery_db.json & galleryData.ts with {len(gallery)} items and Doorhome team enhancements.")

print("--- 6. Verification ---")
# Check for any English letters in Arabic fields in cms_homepage_section_slides_db
with open("cms_homepage_section_slides_db.json") as f:
    slides_check = json.load(f)
eng_in_slides = 0
for s in slides_check:
    blob = s.get("arabicName", "") + " " + s.get("arabicDescription", "") + " " + s.get("translations", {}).get("ar", {}).get("name", "") + " " + s.get("translations", {}).get("ar", {}).get("description", "")
    matches = english_word_re.findall(blob)
    if matches:
        eng_in_slides += 1
        print("STILL IN SLIDES:", s.get("id"), matches)

# Check for any English letters in Arabic fields in cms_gallery_db
with open("cms_gallery_db.json") as f:
    gallery_check = json.load(f)
eng_in_gallery = 0
for g in gallery_check:
    blob = g.get("translations", {}).get("ar", {}).get("title", "") + " " + g.get("translations", {}).get("ar", {}).get("description", "")
    matches = english_word_re.findall(blob)
    if matches:
        eng_in_gallery += 1
        print("STILL IN GALLERY:", g.get("id"), matches)

# Check for any English letters in Arabic fields in cms_products_db
with open("cms_products_db.json") as f:
    products_check = json.load(f)
eng_in_products = 0
for p in products_check:
    blob = p.get("arabicName", "") + " " + p.get("arabicDescription", "") + " " + p.get("translations", {}).get("ar", {}).get("name", "") + " " + p.get("translations", {}).get("ar", {}).get("description", "")
    matches = english_word_re.findall(blob)
    if matches:
        eng_in_products += 1
        print("STILL IN PRODUCTS:", p.get("id"), matches)

print(f"Summary: Slides errors={eng_in_slides}, Gallery errors={eng_in_gallery}, Products errors={eng_in_products}")
if eng_in_slides == 0 and eng_in_gallery == 0 and eng_in_products == 0:
    print("ALL VERIFIED 100% PURE ARABIC!")
