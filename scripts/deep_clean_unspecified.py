import json, re

def clean_text(text):
    if not text or not isinstance(text, str):
        return text
    s = text

    # Remove all countries of origin
    s = re.sub(r'إيطالية الصنع', 'المعتمدة', s)
    s = re.sub(r'إيطالي[ة]?', 'المعتمدة', s)
    s = re.sub(r'ألماني[ة]?', 'المعتمدة', s)
    s = re.sub(r'أوروبي[ة]?', 'المعتمدة', s)
    s = re.sub(r'إسباني[ة]?', 'المعتمدة', s)

    # Remove all gas mentions
    s = re.sub(r'ومملوء بغاز الآرغون', '', s)
    s = re.sub(r'مملوء بغاز الآرغون', '', s)
    s = re.sub(r'بغاز الآرغون', '', s)
    s = re.sub(r'غاز الآرغون', '', s)
    s = re.sub(r'غاز', '', s)

    # Remove specific weights, measurements, and numbers
    s = re.sub(r'\b\d+\s*كغم\b', 'الأوزان الثقيلة', s)
    s = re.sub(r'حتى وزن \d+ كغم،', '', s)
    s = re.sub(r'تزن \d+ كغم', 'ذات الأوزان الكبيرة', s)
    s = re.sub(r'تتحمل حتى \d+ كغم', 'تتحمل الأوزان العالية', s)
    s = re.sub(r'بسماكة \d+\s*ملم', 'عالي الأمان', s)
    s = re.sub(r'سماكة \d+\s*ملم أو \d+\s*ملم', 'عالي الأمان', s)
    s = re.sub(r'بعرض \d+\s*ملم', 'متينة', s)
    s = re.sub(r'يصل إلى \d+\s*ديسيبل', 'فائق', s)
    s = re.sub(r'\b\d+\s*ملم\b', '', s)

    # Remove foreign acronyms and brands
    s = re.sub(r'\bSS\d+\b', '', s)
    s = re.sub(r'\bEPDM\b', '', s)
    s = re.sub(r'\bSTAC\b', '', s)
    s = re.sub(r'\bComunello\b', '', s)
    s = re.sub(r'\bLegend\s*\d*\b', '', s)
    s = re.sub(r'\b70LS\b', '', s)
    s = re.sub(r'\b50F\b', '', s)
    s = re.sub(r'لورينزو', 'الألمنيوم العازل', s)
    s = re.sub(r'ديكونينك', '', s)
    s = re.sub(r'ستائر وشترات زيب سكرين', 'ستائر وشترات الحماية الخارجية', s)
    s = re.sub(r'زيب سكرين', 'ستائر الحماية الخارجية', s)
    s = re.sub(r'كيرتن وول', 'الواجهات الهيكلية', s)

    # Remove any english words in parentheses or standalone
    s = re.sub(r'\([a-zA-Z0-9\s&/-]+\)', '', s)
    s = re.sub(r'[a-zA-Z]+', '', s)

    # Remove double adjectives or duplicate words created by replacements
    s = re.sub(r'المعتمدة المعتمدة', 'المعتمدة', s)
    s = re.sub(r'معتمدة معتمدة', 'معتمدة', s)
    s = re.sub(r'مع مع', 'مع', s)
    s = re.sub(r'دبل', 'مزدوج', s)
    s = re.sub(r'\s{2,}', ' ', s)
    s = re.sub(r'\s+([،.])', r'\1', s)
    s = re.sub(r'،\s*،', '،', s)
    s = re.sub(r'^\s*،\s*', '', s)
    s = s.strip()

    return s

# 1. Clean cms_homepage_section_slides_db.json
with open('cms_homepage_section_slides_db.json', 'r', encoding='utf8') as f:
    slides = json.load(f)

for s in slides:
    for field in ['name', 'arabicName', 'description', 'arabicDescription']:
        if field in s and s[field]:
            s[field] = clean_text(s[field])
    if 'translations' in s and 'ar' in s['translations']:
        for sub in ['name', 'title', 'description']:
            if sub in s['translations']['ar'] and s['translations']['ar'][sub]:
                s['translations']['ar'][sub] = clean_text(s['translations']['ar'][sub])

with open('cms_homepage_section_slides_db.json', 'w', encoding='utf8') as f:
    json.dump(slides, f, ensure_ascii=False, indent=2)

print('✓ Cleaned cms_homepage_section_slides_db.json without specifications!')

# 2. Clean and correct cms_gallery_db.json
with open('cms_gallery_db.json', 'r', encoding='utf8') as f:
    gal = json.load(f)

for it in gal:
    src = it.get('src', '')

    # Specific fix: photo_13 is a luxury villa with windows, NOT a car gate
    if 'photo_13' in src or it.get('id') == 'proj-photo-13':
        it['title'] = 'مشروع فيلا سكنية فاخرة بنوافذ وواجهات معمارية راقية'
        it['description'] = 'تنفيذ متكامل للنوافذ والواجهات المعمارية لفيلا سكنية بتصميم هندسي يجمع بين الفخامة والعزل الحراري والصوتي المتقن.'
        it['category'] = 'windows'
        it['translations'] = {
            'ar': { 'title': it['title'], 'description': it['description'] },
            'en': { 'title': 'Luxury Residential Villa Windows & Facades Project', 'description': 'Complete turnkey installation of architectural windows and insulated facades for a luxury private villa.' },
            'ckb': { 'title': 'پڕۆژەی پەنجەرە و ڕووکاری نژیاروانی بۆ ڤێلای مۆدێرن', 'description': 'جێبەجێکردنی تەواوی پەنجەرە و ڕووکاری شووشەیی بۆ ڤێلای مۆدێرن بە عەزلی گەرمی و دەنگ.' }
        }
        continue

    # Specific fix: photo_11 is a balcony glass balustrade, NOT a gate
    if 'photo_11' in src or it.get('id') == 'proj-photo-11':
        it['title'] = 'درابزين وحواجز شرفات زجاجية معمارية للفلل الحديثة'
        it['description'] = 'تركيب ميداني متقن لحواجز وشرفات زجاجية معمارية بقوائم ألمنيوم متينة وألواح زجاج مقوى يوفر حماية كاملة وإطلالة نقية مفتوحة على الحديقة والمحيط الخارجي.'
        it['category'] = 'shorfa'
        it['translations'] = {
            'ar': { 'title': it['title'], 'description': it['description'] },
            'en': { 'title': 'Architectural Glass Balcony & Terrace Railing Installation', 'description': 'Precision on-site installation of architectural glass balustrades with durable aluminum posts.' },
            'ckb': { 'title': 'حاجزی شووشەیی بۆ باڵکۆنی ڤێلای مۆدێرن', 'description': 'دانانی دەربزینی شووشەیی پارێزراو بۆ باڵکۆن و تەراس بە ئەلەمنیۆمی قایم.' }
        }
        continue

    # Specific fix: 12c6d25c is a commercial overview video of window solution systems
    if '12c6d25c' in src or it.get('id') == 'proj-photo-4':
        it['title'] = 'فيديو تعريفي لأنظمة وحلول النوافذ والواجهات المعمارية المتكاملة'
        it['description'] = 'استعراض شامل لأحدث حلول وأنظمة النوافذ والواجهات الزجاجية المعمارية العازلة، التي تجمع بين دقة الهندسة وحرية التصميم لتناسب الفلل والمشاريع السكنية والتجارية.'
        it['category'] = 'windows'
        it['translations'] = {
            'ar': { 'title': it['title'], 'description': it['description'] },
            'en': { 'title': 'Architectural Window & Facade Systems Overview Video', 'description': 'Comprehensive overview showcasing modern insulated window and facade systems.' },
            'ckb': { 'title': 'ڤیدیۆی ناساندنی سیستەمەکانی پەنجەرە و ڕووکاری نژیاروانی', 'description': 'پیشاندانی بەرفراوانی باشترین چارەسەرەکانی پەنجەرە و ڕووکاری شووشەیی بۆ بینا و ڤێلا مۆدێرنەکان.' }
        }
        continue

    # General clean
    for field in ['title', 'description']:
        if field in it and it[field]:
            it[field] = clean_text(it[field])
    if 'translations' in it and 'ar' in it['translations']:
        for sub in ['title', 'description']:
            if sub in it['translations']['ar'] and it['translations']['ar'][sub]:
                it['translations']['ar'][sub] = clean_text(it['translations']['ar'][sub])

with open('cms_gallery_db.json', 'w', encoding='utf8') as f:
    json.dump(gal, f, ensure_ascii=False, indent=2)

print('✓ Cleaned cms_gallery_db.json without specifications!')
