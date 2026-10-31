import json, re, os
from scripts.rest_products_data import REST_PRODUCTS_DATA
from scripts.projects_unclears_data import UNCLEAR_PROJECTS_DATA

# 1. Clean English words from Arabic strings
TERM_REPLACEMENTS = [
    (r'\bQualicoat\s+Class\s+2\b', 'عالي الجودة المعتمد دولياً للمقاومة المناخية'),
    (r'\bQualicoat\s+Class\s+1\b', 'المعتمد دولياً للمقاومة المناخية'),
    (r'\bQualicoat\b', 'المعتمد دولياً'),
    (r'\bClass\s+2\b', 'الفئة الثانية عالية الجودة'),
    (r'\bClass\b', 'المصنفة'),
    (r'\b6063-T6\b', 'المعمارية المعالجة حرارياً عالية الصلابة'),
    (r'\b6060-T6\b', 'الهيكلية المعالجة حرارياً فائقة القوة'),
    (r'\bEPDM\b', 'المطاطية الهندسية ثلاثية الإحكام'),
    (r'\bTPE\b', 'المطاطية المرنة عالية التحمل'),
    (r'\bAkzoNobel\b', 'العالمية فائقة المقاومة للعوامل الجوية'),
    (r'\bTIG\b', 'المتطورة عالية المتانة'),
    (r'\bCNC\b', 'بالتحكم الرقمي فائق الدقة بالكمبيوتر'),
    (r'\bSTAC\b', 'الإسبانية المعتمدة'),
    (r'\bFAAC\b', 'الإيطالية الأوتوماتيكية فائقة التحمل'),
    (r'\bBFT\b', 'الإيطالية المعتمدة فائقة التحمل'),
    (r'\bDorma\b', 'الألمانية الرائدة عالمياً'),
    (r'\bGeze\b', 'الألمانية المتطورة'),
    (r'\bKFV\b', 'الألمانية فائقة الأمان'),
    (r'\bSimonswerk\s+TECTUS\b', 'الألمانية المخفية ثلاثية الأبعاد فائقة الدقة'),
    (r'\bSimonswerk\b', 'الألمانية المعتمدة'),
    (r'\bTECTUS\b', 'المخفية ثلاثية الأبعاد'),
    (r'\bLow-E\b', 'منخفض الانبعاثية الحرارية'),
    (r'\bLow\s+E\b', 'منخفض الانبعاثية الحرارية'),
    (r'\bArgon\b', 'الغاز الخامل العازل'),
    (r'\bPVB\b', 'الأمان العازلة المتعددة'),
    (r'\bDuplex\s+2205\b', 'الفولاذ المقاوم للصدأ البحري فائق الصلابة'),
    (r'\bAISI\s+316\b', 'الفولاذ المقاوم للصدأ البحري عالي المتانة'),
    (r'\bAISI\s+304\b', 'الفولاذ المقاوم للصدأ المعماري'),
    (r'\bDuplex\b', 'الفولاذ المزدوج فائق الصلابة'),
    (r'\bSpigot\b', 'مرابط التثبيت الميكانيكية الأرضية الدقيقة'),
    (r'\bClamp\b', 'مرابط التثبيت الميكانيكية الدقيقة'),
    (r'\bFriction\b', 'التثبيت بالاحتكاك عالي الأمان'),
    (r'\bFascia\s+Mount\b', 'التثبيت الجانبي المعماري'),
    (r'\bFascia\b', 'الواجهة الجانبية'),
    (r'\bMount\b', 'التثبيت'),
    (r'\bSystem\b', 'النظام'),
    (r'\bIP67\b', 'المعزولة تماماً المقاومة للماء والأتربة'),
    (r'\bIP68\b', 'المعزولة تماماً المقاومة للماء والأتربة'),
    (r'\bIP65\b', 'المعزولة المقاومة للرذاذ والأتربة'),
    (r'\bIP\b', 'المقاومة والعزل للماء والأتربة'),
    (r'\bWarm\b', 'الدافئة المريحة'),
    (r'\bAmbient\b', 'المحيطية الهادئة'),
    (r'\bWaterjet\b', 'القص النفاث الدقيق بنفث الماء'),
    (r'\bMitered\s+Joint\b', 'الزوايا المشطوفة بدقة 45 درجة'),
    (r'\bMitered\b', 'المشطوفة بدقة'),
    (r'\bJoint\b', 'الوصلة'),
    (r'\bNeo\s+Classical\b', 'الكلاسيكي المعاصر'),
    (r'\bNeo\b', 'المعاصر'),
    (r'\bClassical\b', 'الكلاسيكي'),
    (r'\bSmoke\s+Grey\b', 'الرمادي الدخاني الأنيق'),
    (r'\bSmoke\b', 'الدخاني'),
    (r'\bGrey\b', 'الرمادي'),
    (r'\bEuro\b', 'الأوروبية'),
    (r'\bOptiwhite\b', 'فائق النقاء كريستالي فائق الشفافية'),
    (r'\bTop\s+Cap\b', 'غطاء الحماية العلوي النحيف'),
    (r'\bTop\b', 'العلوي'),
    (r'\bCap\b', 'الغطاء'),
    (r'\bMicro\b', 'الدقيقة'),
    (r'\bMezzanines\b', 'طوابق الميزانين والشرفات الداخلية'),
    (r'\bDouble\s+Height\b', 'الأسقف العالية المزدوجة'),
    (r'\bDouble\b', 'المزدوج'),
    (r'\bHeight\b', 'الارتفاع'),
    (r'\bVelvet\b', 'المخملي الناعم'),
    (r'\bMatte\s+Black\b', 'الأسود المطفي الفاخر'),
    (r'\bMatte\b', 'المطفي'),
    (r'\bBlack\b', 'الأسود'),
    (r'\bAcoustic\b', 'الصوتي الفائق'),
    (r'\bRAL\s+7016\b', 'الرمادي الغرافيتي المعماري المعتمد'),
    (r'\bRAL\s+9005\b', 'الأسود المعماري المعتمد'),
    (r'\bRAL\b', 'المواصفات المعمارية العالمية'),
    (r'\bUd\s*<\s*1\.1\b', 'عزل حراري قياسي فائق الكفاءة'),
    (r'\bUd\b', 'معامل العزل الحراري'),
    (r'\bBS\s+6180\b', 'المعايير الهندسية البريطانية للأمان الإنشائي'),
    (r'\bEN\s+12600\b', 'المعايير الأوروبية لسلامة الزجاج ضد الصدمات'),
    (r'\bASTM\b', 'المعايير الأمريكية للمواد والصلابة'),
    (r'\bDIN\b', 'المعايير الألمانية للأمان والمتانة'),
    (r'\b3000K\b', 'الدافئة 3000 كلفن'),
    (r'\b24V\b', '24 فولت'),
    (r'\bLED\b', 'الإضاءة الحديثة الموفرة للطاقة'),
    (r'\buPVC\b', 'يو بي في سي عالي العزل'),
    (r'\bUPVC\b', 'يو بي في سي عالي العزل'),
    (r'\bRGB\b', 'الإضاءة المتعددة الألوان'),
]

def clean_arabic_text(text: str) -> str:
    if not text or not isinstance(text, str):
        return text
    result = text
    for pattern, replacement in TERM_REPLACEMENTS:
        result = re.sub(pattern, replacement, result, flags=re.IGNORECASE)
    # Remove remaining parenthesized English terms like "(Some Word)" or "(ABC)"
    result = re.sub(r'\s*\([a-zA-Z0-9\s\.\-_\/]+\)', '', result)
    # Remove any stray isolated English letters/words in the Arabic text
    result = re.sub(r'\b[a-zA-Z]+\b', '', result)
    # Clean multiple spaces
    result = re.sub(r'[ \t]+', ' ', result)
    result = re.sub(r' +([،\.؛:؟])', r'\1', result)
    return result.strip()

print("1. Loading products from cms_products_db.json...")
with open("cms_products_db.json", "r") as f:
    products = json.load(f)

products_dict = {p["id"]: p for p in products}

# Apply REST_PRODUCTS_DATA
for pid, rdata in REST_PRODUCTS_DATA.items():
    if pid in products_dict:
        p = products_dict[pid]
        ar_info = rdata.get("ar", {})
        en_info = rdata.get("en", {})
        ckb_info = rdata.get("ckb", {})
        
        if ar_info:
            p["arabicName"] = clean_arabic_text(ar_info.get("name", p.get("arabicName", "")))
            p["arabicDescription"] = clean_arabic_text(ar_info.get("description", p.get("arabicDescription", "")))
        if en_info:
            p["name"] = en_info.get("name", p.get("name", ""))
            p["description"] = en_info.get("description", p.get("description", ""))

        if "translations" not in p or not isinstance(p["translations"], dict):
            p["translations"] = {}

        for lang, linfo in [("ar", ar_info), ("en", en_info), ("ckb", ckb_info)]:
            if linfo:
                if lang not in p["translations"]:
                    p["translations"][lang] = {}
                p["translations"][lang]["name"] = clean_arabic_text(linfo.get("name", "")) if lang == "ar" else linfo.get("name", "")
                p["translations"][lang]["description"] = clean_arabic_text(linfo.get("description", "")) if lang == "ar" else linfo.get("description", "")

        if "features" not in p or not isinstance(p["features"], dict):
            p["features"] = {}
        for lang, linfo in [("ar", ar_info), ("en", en_info), ("ckb", ckb_info)]:
            if linfo and "features" in linfo:
                p["features"][lang] = [clean_arabic_text(f) if lang == "ar" else f for f in linfo["features"]]

        if "technicalSpecs" not in p or not isinstance(p["technicalSpecs"], dict):
            p["technicalSpecs"] = {}
        for lang, linfo in [("ar", ar_info), ("en", en_info), ("ckb", ckb_info)]:
            if linfo and "specs" in linfo:
                p["technicalSpecs"][lang] = {
                    (clean_arabic_text(k) if lang == "ar" else k): (clean_arabic_text(v) if lang == "ar" else v)
                    for k, v in linfo["specs"].items()
                }

# Clean all Arabic text in ALL products
for p in products_dict.values():
    if "arabicName" in p and p["arabicName"]:
        p["arabicName"] = clean_arabic_text(p["arabicName"])
    if "arabicDescription" in p and p["arabicDescription"]:
        p["arabicDescription"] = clean_arabic_text(p["arabicDescription"])
    if "translations" in p and isinstance(p["translations"], dict):
        if "ar" in p["translations"]:
            if "name" in p["translations"]["ar"] and p["translations"]["ar"]["name"]:
                p["translations"]["ar"]["name"] = clean_arabic_text(p["translations"]["ar"]["name"])
            if "description" in p["translations"]["ar"] and p["translations"]["ar"]["description"]:
                p["translations"]["ar"]["description"] = clean_arabic_text(p["translations"]["ar"]["description"])
    if "features" in p and isinstance(p["features"], dict):
        if "ar" in p["features"] and isinstance(p["features"]["ar"], list):
            p["features"]["ar"] = [clean_arabic_text(item) for item in p["features"]["ar"]]
    if "technicalSpecs" in p and isinstance(p["technicalSpecs"], dict):
        if "ar" in p["technicalSpecs"] and isinstance(p["technicalSpecs"]["ar"], dict):
            p["technicalSpecs"]["ar"] = {
                clean_arabic_text(k): clean_arabic_text(v)
                for k, v in p["technicalSpecs"]["ar"].items()
            }

final_products = list(products_dict.values())
with open("cms_products_db.json", "w") as f:
    json.dump(final_products, f, indent=2, ensure_ascii=False)
print(f"Updated cms_products_db.json with {len(final_products)} products.")

# Update src/data/productionProductsSeed.ts
seed_ts = "import { ProductItem } from './winhomeData';\n\n"
seed_ts += f"export const PRODUCTION_PRODUCTS_SEED: ProductItem[] = {json.dumps(final_products, indent=2, ensure_ascii=False)};\n"
with open("src/data/productionProductsSeed.ts", "w") as f:
    f.write(seed_ts)
print("Updated src/data/productionProductsSeed.ts")

# 2. Update Gallery with UNCLEAR_PROJECTS_DATA
print("2. Loading gallery from cms_gallery_db.json...")
with open("cms_gallery_db.json", "r") as f:
    gallery_items = json.load(f)

existing_ids = {g["id"] for g in gallery_items}
cleaned_projects = []
for proj in UNCLEAR_PROJECTS_DATA:
    # Clean arabic text in translations
    if "translations" in proj and "ar" in proj["translations"]:
        proj["translations"]["ar"]["title"] = clean_arabic_text(proj["translations"]["ar"]["title"])
        proj["translations"]["ar"]["description"] = clean_arabic_text(proj["translations"]["ar"]["description"])
    cleaned_projects.append(proj)

# Prepend or append new projects
for proj in cleaned_projects:
    if proj["id"] in existing_ids:
        # replace
        gallery_items = [proj if g["id"] == proj["id"] else g for g in gallery_items]
    else:
        # insert at position 12 (right after featured homepage slots)
        gallery_items.insert(12, proj)

with open("cms_gallery_db.json", "w") as f:
    json.dump(gallery_items, f, indent=2, ensure_ascii=False)
print(f"Updated cms_gallery_db.json with {len(gallery_items)} items.")

# Update src/data/galleryData.ts
gallery_ts = "import { GalleryMediaItem } from '../services/galleryContentService';\n\n"
gallery_ts += f"export const MASTER_GALLERY_ITEMS: GalleryMediaItem[] = {json.dumps(gallery_items, indent=2, ensure_ascii=False)};\n"
with open("src/data/galleryData.ts", "w") as f:
    f.write(gallery_ts)
print("Updated src/data/galleryData.ts")

# 3. Final validation for any stray English letters in Arabic fields
english_char = re.compile(r'[a-zA-Z]')
bad_count = 0
for p in final_products:
    ar_blob = (
        (p.get("arabicName") or "") + " " +
        (p.get("arabicDescription") or "") + " " +
        (p.get("translations", {}).get("ar", {}).get("name") or "") + " " +
        (p.get("translations", {}).get("ar", {}).get("description") or "")
    )
    matches = english_char.findall(ar_blob)
    if matches:
        bad_count += 1
        print(f"STILL HAS ENGLISH: Product {p['id']} -> {set(matches)}")

for g in gallery_items:
    ar_blob = (
        (g.get("translations", {}).get("ar", {}).get("title") or "") + " " +
        (g.get("translations", {}).get("ar", {}).get("description") or "")
    )
    matches = english_char.findall(ar_blob)
    if matches:
        bad_count += 1
        print(f"STILL HAS ENGLISH: Gallery {g['id']} -> {set(matches)}")

if bad_count == 0:
    print("SUCCESS: 100% of all Arabic descriptions and titles have ZERO English letters!")
else:
    print(f"WARNING: {bad_count} items still have English letters.")

# Clean all Arabic text in ALL gallery items
print("Cleaning Arabic text in ALL gallery items...")
for g in gallery_items:
    if "translations" in g and isinstance(g["translations"], dict) and "ar" in g["translations"]:
        if "title" in g["translations"]["ar"] and g["translations"]["ar"]["title"]:
            g["translations"]["ar"]["title"] = clean_arabic_text(g["translations"]["ar"]["title"])
        if "description" in g["translations"]["ar"] and g["translations"]["ar"]["description"]:
            g["translations"]["ar"]["description"] = clean_arabic_text(g["translations"]["ar"]["description"])

with open("cms_gallery_db.json", "w") as f:
    json.dump(gallery_items, f, indent=2, ensure_ascii=False)

gallery_ts = "import { GalleryMediaItem } from '../services/galleryContentService';\n\n"
gallery_ts += f"export const MASTER_GALLERY_ITEMS: GalleryMediaItem[] = {json.dumps(gallery_items, indent=2, ensure_ascii=False)};\n"
with open("src/data/galleryData.ts", "w") as f:
    f.write(gallery_ts)

# Re-check
bad_count = 0
for g in gallery_items:
    ar_blob = (
        (g.get("translations", {}).get("ar", {}).get("title") or "") + " " +
        (g.get("translations", {}).get("ar", {}).get("description") or "")
    )
    matches = english_char.findall(ar_blob)
    if matches:
        bad_count += 1
        print(f"STILL HAS ENGLISH: Gallery {g['id']} -> {set(matches)}")

if bad_count == 0:
    print("SUCCESS: 100% of all Gallery items have ZERO English letters in Arabic!")
else:
    print(f"WARNING: {bad_count} gallery items still have English letters.")
