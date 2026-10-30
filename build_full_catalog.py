# -*- coding: utf-8 -*-
import json
import os

# Complete 61 Products Catalog Generation Script
# Strictly according to Doorhome products&assets folders:
# accessories: 3
# balconies: 3
# shorfa: 6
# stairs: 5
# windows: 6
# doors: 38
# Total: 61 products (NO DUPLICATES, NO DOORS/ACCESSORIES IN WINDOWS, NO UNCLEAR ITEMS)

products = []

# ==========================================
# 1. ACCESSORIES (3 Products)
# ==========================================
products.append({
    "id": "acc-stac-multipoint-lock",
    "name": "High-Security Multi-Point Mortise Locking Mechanism by STAC Spain for Architectural Doors & Windows",
    "arabicName": "آلية القفل المحكم متعدد النقاط للأبواب والنوافذ المعمارية من STAC الإسبانية",
    "category": "accessories",
    "division": "accessories",
    "subCategory": "Architectural Locking Systems",
    "modelNumber": "DH-ACC-STAC-5P",
    "material": "Grade 304 Stainless Steel & Anti-Corrosion Zamak Alloy",
    "brand": "STAC Architectural Systems",
    "image": "/products-assets/accessories/photo_4_2026-09-26_07-36-01.jpg",
    "fallbackImage": "/products-assets/accessories/photo_4_2026-09-26_07-36-01.jpg",
    "features": [
        "Multi-Point Perimeter Deadbolt Locking",
        "Certified European Anti-Burglary Resistance Class RC2/RC3",
        "Dual Reversible Latch for Left or Right Handing",
        "High Salt-Spray Corrosion Resistance (Grade 5 DIN EN 1670)"
    ],
    "specs": {
        "Cylinder Type": "European Profile Euro-Groove",
        "Backset": "35 mm / 45 mm Optional",
        "Faceplate Width": "16 mm / 24 mm Stainless Steel",
        "Cycle Testing": "200,000 Continuous Operation Cycles"
    },
    "description": "Engineered by STAC Spain for high-traffic architectural openings, delivering impenetrable multi-point perimeter compression and seamless security for modern doors and thermal window systems.",
    "translations": {
        "ar": {
            "name": "آلية القفل المحكم متعدد النقاط للأبواب والنوافذ المعمارية من STAC الإسبانية",
            "subCategory": "أنظمة الأقفال المعمارية",
            "description": "نظام إغلاق محكم متعدد النقاط صُمم وهُندس من قبل شركة STAC الإسبانية لتوفير أعلى مستويات الأمان ومقاومة السطو والعزل المحكم ضد الرياح والأتربة."
        },
        "ckb": {
            "name": "سیستەمی قفڵی فرە-خاڵی پێشکەوتوو بۆ دەرگا و پەنجەرە لە براندی STACی ئیسپانی",
            "subCategory": "سیستەمەکانی قفڵی نژیاروانی",
            "description": "سیستەمێکی قفڵی پێشکەوتووی فرە-خاڵ کە لەلایەن STACی ئیسپانییەوە بەرهەمهێنراوە بۆ دابینکردنی بەرزترین ئاستی سەلامەتی و پاراستنی دەرگا و پەنجەرەکان."
        },
        "en": {
            "name": "High-Security Multi-Point Mortise Locking Mechanism by STAC Spain for Architectural Doors & Windows",
            "subCategory": "Architectural Locking Systems",
            "description": "Engineered by STAC Spain for high-traffic architectural openings, delivering impenetrable multi-point perimeter compression and seamless security for modern doors and thermal window systems."
        }
    }
})

products.append({
    "id": "acc-thermal-profile-section",
    "name": "Multi-Chamber Thermal Break Polyamide-Insulated Aluminum Architectural Profile System",
    "arabicName": "قطاع ألمنيوم معماري معزول حرارياً بحواجز البولي أميد متعددة الحجرات",
    "category": "accessories",
    "division": "accessories",
    "subCategory": "Architectural Extrusions & Thermal Profiles",
    "modelNumber": "DH-ACC-THM-80",
    "material": "Architectural 6063-T6 Extruded Aluminum with 34 mm PA66 GF25 Polyamide Bars",
    "brand": "Doorhome Systems",
    "image": "/products-assets/accessories/photo_57_2026-09-26_07-36-01.jpg",
    "fallbackImage": "/products-assets/accessories/photo_57_2026-09-26_07-36-01.jpg",
    "features": [
        "Precision Engineered 34 mm Polyamide Thermal Barrier",
        "Three-Level EPDM Acoustic & Weather Gasket Channels",
        "Qualicoat Seaside Class 2 Anodized Electrostatic Powder Coating",
        "Exceptional Structural Rigidity for Oversized Facade Modules"
    ],
    "specs": {
        "Profile Depth": "80 mm System Frame / 88 mm Sash",
        "Thermal Transmission (Uf)": "Up to 1.3 W/m²K",
        "Wall Thickness": "2.0 mm Heavy-Duty Structural Extrusion",
        "Acoustic Reduction": "Sound Insulation up to 48 dB with Acoustic Glazing"
    },
    "description": "A masterclass in modern thermal break metallurgy. Combines precision-extruded architectural aluminum with advanced glass-fiber reinforced polyamide insulation to completely eliminate thermal bridging.",
    "translations": {
        "ar": {
            "name": "قطاع ألمنيوم معماري معزول حرارياً بحواجز البولي أميد متعددة الحجرات",
            "subCategory": "قطاعات وبروفايلات الألمنيوم العازل",
            "description": "قطاع هندسي متطور يجمع بين الألمنيوم المعماري عالي المتانة وجسور البولي أميد الألمانية العازلة للحرارة والصوت لضمان أقصى كفاءة طاقية ومنع انتقال الحرارة."
        },
        "ckb": {
            "name": "پڕۆفایلی ئەلەمنیۆمی نژیاروانی عەزلی گەرمی بە بەربەستی پۆلیامیدی فرە-ژوور",
            "subCategory": "پڕۆفایلەکانی ئەلەمنیۆمی عەزلکراو",
            "description": "پڕۆفایلێکی نژیاروانی پێشکەوتوو کە ئەلەمنیۆمی پتەو و پردی پۆلیامیدی ئەڵمانی عازلی گەرمی کۆدەکاتەوە بۆ دابینکردنی بەرزترین ئاستی پاراستنی وزە و عەزلی دەنگ."
        },
        "en": {
            "name": "Multi-Chamber Thermal Break Polyamide-Insulated Aluminum Architectural Profile System",
            "subCategory": "Architectural Extrusions & Thermal Profiles",
            "description": "A masterclass in modern thermal break metallurgy. Combines precision-extruded architectural aluminum with advanced glass-fiber reinforced polyamide insulation to completely eliminate thermal bridging."
        }
    }
})

products.append({
    "id": "acc-master-matte-handle",
    "name": "Ergonomic Matte Black Architectural Handle for Modern Windows & Doors by Master Italy",
    "arabicName": "مقبض معماري مريح باللون الأسود المطفي للأبواب والنوافذ من Master Italy",
    "category": "accessories",
    "division": "accessories",
    "subCategory": "Architectural Handles & Cremone Hardware",
    "modelNumber": "DH-ACC-MST-BLK",
    "material": "Solid Die-Cast Aluminum with Deep Anodized Velvet Matte Finish",
    "brand": "Master Italy Hardware",
    "image": "/products-assets/accessories/photo_63_2026-09-26_07-36-01.jpg",
    "fallbackImage": "/products-assets/accessories/photo_63_2026-09-26_07-36-01.jpg",
    "features": [
        "Ergonomic Sculpted Grip Form with Soft-Radius Edges",
        "Velvet Touch Scratch-Resistant Matte Powder Coating",
        "Heavy-Duty Internal Positioning Spring with 90° Indexing",
        "Direct Screw-Through Fastening for Zero Handle Wobble"
    ],
    "specs": {
        "Spindle Size": "7 mm High-Tensile Steel Spindle",
        "Finish Standard": "AAMA 2604 Ultra-Durable Architectural Coating",
        "Compatibility": "Tilt-Turn, Side-Hung, Sliding & Entrance Units",
        "Durability": "Tested to Exceed 50,000 Complete Turns"
    },
    "description": "Italian craftsmanship meets minimalist perfection. Master Italy ergonomic handle delivers tactile luxury, whisper-quiet operation, and enduring mechanical precision for high-end residential joinery.",
    "translations": {
        "ar": {
            "name": "مقبض معماري مريح باللون الأسود المطفي للأبواب والنوافذ من Master Italy",
            "subCategory": "المقابض والإكسسوارات المعمارية",
            "description": "تصميم إيطالي انسيابي يجمع بين الفخامة والراحة عند الاستخدام. طلاء أسود مطفي فائق النعومة ومقاوم للخدوش مع آلية دوران داخلية قوية تدوم لسنوات طويلة."
        },
        "ckb": {
            "name": "دەسکی نژیاروانی مۆدێرن بە ڕەنگی ڕەشی مات بۆ دەرگا و پەنجەرە لە Master Italy",
            "subCategory": "دەسک و کەلوپەلی نژیاروانی",
            "description": "دیزاینێکی ناوازەی ئیتاڵی کە کەشخەیی و ئاسوودەیی بەکارهێنان تێکەڵ دەکات، بە ڕووپۆشی ڕەشی ماتی دژە-ڕووشان و میکانیزمی ناوەوەی پۆڵاینی بەهێز."
        },
        "en": {
            "name": "Ergonomic Matte Black Architectural Handle for Modern Windows & Doors by Master Italy",
            "subCategory": "Architectural Handles & Cremone Hardware",
            "description": "Italian craftsmanship meets minimalist perfection. Master Italy ergonomic handle delivers tactile luxury, whisper-quiet operation, and enduring mechanical precision for high-end residential joinery."
        }
    }
})

# ==========================================
# 2. BALCONIES (3 Products)
# ==========================================
products.append({
    "id": "balcony-travertine-dual-level",
    "name": "Double-Tier Tinted Tempered Glass Balcony Railing for Luxury Travertine Stone Villas",
    "arabicName": "دربزين بلكونة زجاجي مصفح مزدوج لفلل الحجر والترافرتين مع إضاءة سبوتلايت دافئة",
    "category": "balconies",
    "division": "balconies",
    "subCategory": "Frameless Villa Glass Balconies",
    "modelNumber": "DH-BAL-TRV-31",
    "material": "10+10 mm Dark Tinted Tempered Laminated Glass with Natural Travertine Cladding Integration",
    "brand": "Doorhome Architectural",
    "image": "/products-assets/balconies/photo_31_2026-09-26_07-36-01.jpg",
    "fallbackImage": "/products-assets/balconies/photo_31_2026-09-26_07-36-01.jpg",
    "features": [
        "Monolithic Two-Tier Frameless Glass Facade Integration",
        "Concealed Bottom Structural Shoe Anchored into Solid Concrete Slab",
        "Deep Smoke Grey Tinting for Exceptional Daytime Privacy & Solar Glare Control",
        "Integrated Warm Recessed LED Soffit Lighting Illuminating Villa Terrace",
        "Zero Top Rail Design for Unbroken Panoramic Vistas"
    ],
    "specs": {
        "Glass Specification": "10 mm Toughened + 1.52 mm PVB + 10 mm Toughened Grey Tint",
        "Linear Load Capacity": "1.5 kN/m Verified High-Wind Residential Testing",
        "Mounting Style": "Concealed Fascia-Mount Extruded Aluminum Sub-Base",
        "Thermal & UV Resistance": "Blocks 99% UV Radiation with Acoustic Dampening"
    },
    "description": "Engineered for high-end private residences, this double-tier balustrade pairs warm natural stone architecture with cool, smoked tempered laminated glass to forge an ultra-luxurious modern facade presence.",
    "translations": {
        "ar": {
            "name": "دربزين بلكونة زجاجي مصفح مزدوج لفلل الحجر والترافرتين مع إضاءة سبوتلايت دافئة",
            "subCategory": "دربزينات بلكونات الفلل الزجاجية",
            "description": "نظام دربزين زجاجي راقٍ يندمج بسلاسة مع واجهات الحجر الطبيعي والترافرتين للفلل الحديثة. زجاج مصفح رمادي داكن يمنحك خصوصية كاملة وإطلالة بانورامية ساحرة مع إضاءة سفلية دافئة."
        },
        "ckb": {
            "name": "دەربزینی باڵکۆنی شووشەیی دەبڵ بە تیشکی داپۆشراو بۆ ڤێلاکانی بەردی تراڤەرتین",
            "subCategory": "دەربزینی شووشەیی باڵکۆنی ڤێلا",
            "description": "سیستەمێکی دەربزینی شووشەیی شاهانە کە بە شێوەیەکی سەردەمیانە لەگەڵ بەردی سروشتی ڤێلاکەت یەکدەگرێتەوە، بە شووشەی تاریکی ئەستوور بۆ پاراستنی تایبەتمەندی و ڕووناکیی لید."
        },
        "en": {
            "name": "Double-Tier Tinted Tempered Glass Balcony Railing for Luxury Travertine Stone Villas",
            "subCategory": "Frameless Villa Glass Balconies",
            "description": "Engineered for high-end private residences, this double-tier balustrade pairs warm natural stone architecture with cool, smoked tempered laminated glass to forge an ultra-luxurious modern facade presence."
        }
    }
})

products.append({
    "id": "balcony-indoor-mezzanine-gallery",
    "name": "Interior Mezzanine & Courtyard Frameless Glass Balustrade with Flush Aluminum Cap",
    "arabicName": "دربزين شرفة وبلكونة خارجية بزجاج إنشائي وإضاءة مخفية في فناء الفيلا",
    "category": "balconies",
    "division": "balconies",
    "subCategory": "Mezzanine & Open-Gallery Balustrades",
    "modelNumber": "DH-BAL-GLR-67",
    "material": "12+12 mm Ultra-Clear Structural Safety Glass with Slimline Anodized Aluminum Top Cap",
    "brand": "Doorhome Architectural",
    "image": "/products-assets/balconies/photo_67_2026-09-26_07-36-01.jpg",
    "fallbackImage": "/products-assets/balconies/photo_67_2026-09-26_07-36-01.jpg",
    "features": [
        "Continuous Clear Glass Spans Across Dual Storey Open Well",
        "Slim Anodized Micro Top Rail in Satin Black Anodized Finish",
        "Concealed Expansion Joints for Perfectly Aligned Long Runs",
        "Structural Dry-Glazed Gasket Clamping System for Zero Mess",
        "Crystal Optic Transparency Accentuating High-Ceiling Architecture"
    ],
    "specs": {
        "Height": "1100 mm Standard Safety Code Compliance",
        "Base Profile": "Heavy-Duty Continuous 6063-T6 Aluminum Channel",
        "Fixing Method": "Heavy-Duty Hilti M12 Expansion Anchors into Concrete Slab",
        "Safety Rating": "Category B Structural Occupancy Load Rated"
    },
    "description": "A pristine architectural balustrade designed for interior light wells, courtyards, and mezzanine living areas, emphasizing verticality, transparency, and serene open-plan continuity.",
    "translations": {
        "ar": {
            "name": "دربزين شرفة وبلكونة خارجية بزجاج إنشائي وإضاءة مخفية في فناء الفيلا",
            "subCategory": "دربزينات الأفنية والبلكونات الإنشائية",
            "description": "حاجز زجاجي شفاف فائق النقاء مصمم للبلكونات الداخلية والمطلات العلوية، يمنحك شعوراً بالاتساع والرحابة وانسيابية الضوء في أرجاء المكان مع أعلى معايير الأمان الإنشائي."
        },
        "ckb": {
            "name": "دەربزینی شووشەی بێ-چوارچێوە بۆ باڵکۆنی ناوەوە و حەوشەی ڤێلا",
            "subCategory": "دەربزینی باڵکۆن و هۆڵی کراوە",
            "description": "دەربزینێکی شووشەیی ڕوونی سەردەمی بۆ باڵکۆن و هۆڵە بەرزەکان، کە هەستی فراوانی و ڕووناکی بێسنوور دەبەخشێت بە خانووەکەت لەگەڵ بەرزترین مەرجی سەلامەتی ئەندازیاری."
        },
        "en": {
            "name": "Interior Mezzanine & Courtyard Frameless Glass Balustrade with Flush Aluminum Cap",
            "subCategory": "Mezzanine & Open-Gallery Balustrades",
            "description": "A pristine architectural balustrade designed for interior light wells, courtyards, and mezzanine living areas, emphasizing verticality, transparency, and serene open-plan continuity."
        }
    }
})

products.append({
    "id": "balcony-cantilever-dark-glass",
    "name": "Cantilevered Villa Glass Balcony Railing with Dark Tinted Laminated Glass & Concealed Base Profile",
    "arabicName": "بلكونة معمارية كابولية بارزة بزجاج داكن للخصوصية ومثبتة ببروفايل أرضي مخفي",
    "category": "balconies",
    "division": "balconies",
    "subCategory": "Cantilever Balconies & Exterior Railings",
    "modelNumber": "DH-BAL-DRK-68",
    "material": "High-Impact Laminated Dark Tinted Glass with Concealed Heavy Extruded Base Channel",
    "brand": "Doorhome Architectural",
    "image": "/products-assets/balconies/photo_68_2026-09-26_07-36-01.jpg",
    "fallbackImage": "/products-assets/balconies/photo_68_2026-09-26_07-36-01.jpg",
    "features": [
        "Cantilever Structural Geometry Matching Modernist Cube Architecture",
        "Reflective Tinted Glass Providing Absolute Privacy from Exterior Street Angles",
        "Completely Flush Bottom Attachment into Travertine Balcony Soffit",
        "Hydrophobic Self-Cleaning Glass Nano-Coating Resisting Dust & Water Spots",
        "Wind Pressure Rating Exceeding 2.0 kPa"
    ],
    "specs": {
        "Total Thickness": "21.52 mm (10 mm Glass + 1.52 mm Black PVB + 10 mm Glass)",
        "Finish Options": "Onyx Black, Deep Bronze, or Mirror Smoke",
        "Drainage": "Integrated Concealed Water Weep Channels",
        "Glass Edge": "Machine Flat Polished and Arris Beveled Edges"
    },
    "description": "A daring cantilevered balcony statement featuring dark mirrored structural glass that harmonizes with stone and dark wood rainscreen cladding while providing impenetrable privacy for upper-level master suites.",
    "translations": {
        "ar": {
            "name": "بلكونة معمارية كابولية بارزة بزجاج داكن للخصوصية ومثبتة ببروفايل أرضي مخفي",
            "subCategory": "بلكونات معمارية كابولية",
            "description": "تصميم جريء ومستقبلي للبلكونات البارزة لغرف النوم الرئيسية. زجاج مصفح أسود داكن يمنحك عزلاً بصرياً كاملاً من الخارج مع الحفاظ على الإطلالة المفتوحة من الداخل وثبات إنشائي فائق."
        },
        "ckb": {
            "name": "باڵکۆنی نژیاروانی دەرپەڕیو بە شووشەی تاریکی مۆدێرن و پڕۆفایلی شاراوە",
            "subCategory": "باڵکۆنی دەرپەڕیوی شووشەیی",
            "description": "دیزاینێکی پێشکەوتوو بۆ باڵکۆنە دەرپەڕیوەکانی نهۆمی سەرەوە، بە شووشەی تاریکی ئەستوور کە لە دەرەوە ناوەوە دیار نییە و پەستانێکی بێوێنەی با ڕادەگرێت."
        },
        "en": {
            "name": "Cantilevered Villa Glass Balcony Railing with Dark Tinted Laminated Glass & Concealed Base Profile",
            "subCategory": "Cantilever Balconies & Exterior Railings",
            "description": "A daring cantilevered balcony statement featuring dark mirrored structural glass that harmonizes with stone and dark wood rainscreen cladding while providing impenetrable privacy for upper-level master suites."
        }
    }
})

# ==========================================
# 3. SHORFA (6 Products)
# ==========================================
products.append({
    "id": "shorfa-terrace-panoramic-open",
    "name": "Panoramic Outdoor Terrace Glass Balustrade with Minimal Posts & Unobstructed Horizon Views",
    "arabicName": "حاجز شرفة وتراس زجاجي خارجي بإطلالة بانورامية واسعة وأعمدة تثبيت أنيقة",
    "category": "shorfa",
    "division": "shorfa",
    "subCategory": "Outdoor Terrace Glass Systems",
    "modelNumber": "DH-SHR-TER-11",
    "material": "Structural 16 mm Clear Tempered Glass with Heavy-Duty Powder-Coated Aluminum Uprights",
    "brand": "Doorhome Architectural",
    "image": "/products-assets/shorfa/photo_11_2026-09-26_07-36-01.jpg",
    "fallbackImage": "/products-assets/shorfa/photo_11_2026-09-26_07-36-01.jpg",
    "features": [
        "Unobstructed Wide-Span Glass Panels for Expansive Garden & Horizon Views",
        "Heavy-Duty Slim Architectural Uprights in Matte Black Finish",
        "Engineered for High-Exposure Rooftop & Upper Terrace Wind Conditions",
        "Concealed Bottom Clamping Gaskets Preventing Vibration & Rattle",
        "UV-Resistant Dual-Sealed Safety Edge Interlayers"
    ],
    "specs": {
        "Glass Thickness": "16 mm Heavy Structural Tempered Glass",
        "Post Spacing": "Up to 1.5 m Modular Center-to-Center Spans",
        "Height": "1100 mm Building Code Verified",
        "Corrosion Resistance": "C4 Marine Grade Coating Rating"
    },
    "description": "Transform your villa terrace or penthouse roof garden into a boundless outdoor lounge. This minimalist glass balustrade keeps wind at bay while maximizing pristine landscape panoramas.",
    "translations": {
        "ar": {
            "name": "حاجز شرفة وتراس زجاجي خارجي بإطلالة بانورامية واسعة وأعمدة تثبيت أنيقة",
            "subCategory": "أنظمة شرفات وتراسات خارجية",
            "description": "حوّل تراس منزلك أو حديقة السطح إلى واحة استرخاء مفتوحة على الأفق. يوفر هذا النظام حماية ممتازة من الرياح مع إطلالة مفتوحة 100% دون أي عوائق بصرية."
        },
        "ckb": {
            "name": "دەربزینی شووشەیی تراس و شرفەی دەرەوە بە دیمەنی پانۆرامای کراوە",
            "subCategory": "سیستەمی شرفە و تراسەکان",
            "description": "تراسەکەت بکە بە شوێنێکی دڵڕفێن بە شووشەی ئەستووری پارێزراو لە با کە دیمەنێکی پانۆرامای تەواو لە سروشت و دەوروبەر پێشکەش دەکات بەبێ هیچ بەربەستێک."
        },
        "en": {
            "name": "Panoramic Outdoor Terrace Glass Balustrade with Minimal Posts & Unobstructed Horizon Views",
            "subCategory": "Outdoor Terrace Glass Systems",
            "description": "Transform your villa terrace or penthouse roof garden into a boundless outdoor lounge. This minimalist glass balustrade keeps wind at bay while maximizing pristine landscape panoramas."
        }
    }
})

products.append({
    "id": "shorfa-wall-mounted-soffit-led",
    "name": "Wall-Mounted Structural Glass Shorfa Railing with Integrated Soffit Ambient LED Lighting",
    "arabicName": "دربزين شرفة زجاجي مثبت على جدار مع إضاءة ليد مخفية وزجاج مصفح عازل",
    "category": "shorfa",
    "division": "shorfa",
    "subCategory": "Illuminated Architectural Shorfa Systems",
    "modelNumber": "DH-SHR-LED-20",
    "material": "12+12 mm Extra-Tough Safety Glass with Heavy-Duty Architectural Clamping Posts",
    "brand": "Doorhome Architectural",
    "image": "/products-assets/shorfa/photo_20_2026-09-26_07-36-01.jpg",
    "fallbackImage": "/products-assets/shorfa/photo_20_2026-09-26_07-36-01.jpg",
    "features": [
        "Continuous Under-Mounted Warm Ambient LED Lighting Channel",
        "Side Parapet-Mounted Base Integration for Maximum Walkable Floor Space",
        "Deep Smoke Tinted Glass Providing Sleek Contrast Against Light Walls",
        "High-Strength Clamping System Resisting Over 1.8 kN/m Point Load",
        "Concealed Electrical Conduit Pass-Through"
    ],
    "specs": {
        "Mounting": "Heavy Parapet Wall Fascia Mount with 316 Stainless Anchors",
        "Lighting": "IP67 Waterproof 3000K Warm Architectural Strip LED",
        "Glass Spec": "12 mm Toughened + 1.52 mm Smoke SentryGlas + 12 mm Toughened",
        "Warranty": "10-Year Structural Integrity Guarantee"
    },
    "description": "An exquisite integration of light and architectural glass. Mounted directly to perimeter terrace parapets, it creates a floating perimeter illuminated by glowing warm light lines at night.",
    "translations": {
        "ar": {
            "name": "دربزين شرفة زجاجي مثبت على جدار مع إضاءة ليد مخفية وزجاج مصفح عازل",
            "subCategory": "شرفات معمارية مضيئة",
            "description": "تناغم مذهل بين الإضاءة والزجاج الإنشائي. يثبت مباشرة على حافة جدار التراس أو الشرفة ليمنحك مساحة حركة أكبر مع خطوط إضاءة دافئة ساحرة ليلاً."
        },
        "ckb": {
            "name": "دەربزینی شرفەی شووشەیی دیواری بە ڕووناکیی لیدی دڵڕفێنی شاردراوە",
            "subCategory": "شرفەی شووشەیی ڕووناکیکراو",
            "description": "تێکەڵەیەکی جوان لە شووشەی تاریک و ڕووناکیی لیدی شاردراوە کە لەسەر دیواری شرفە جێگیر دەکرێت و شەوانە دیمەنێکی شاهانە و درەوشاوە بە خانووەکەت دەبەخشێت."
        },
        "en": {
            "name": "Wall-Mounted Structural Glass Shorfa Railing with Integrated Soffit Ambient LED Lighting",
            "subCategory": "Illuminated Architectural Shorfa Systems",
            "description": "An exquisite integration of light and architectural glass. Mounted directly to perimeter terrace parapets, it creates a floating perimeter illuminated by glowing warm light lines at night."
        }
    }
})

products.append({
    "id": "shorfa-corridor-spigot-balustrade",
    "name": "Continuous Glass Corridor Shorfa Balustrade with Stainless Steel Spigots",
    "arabicName": "دربزين شرفة وممر زجاجي بدون إطار بنظام سبیگوت ستانلس ستيل فائق النقاء",
    "category": "shorfa",
    "division": "shorfa",
    "subCategory": "Spigot Mounted Corridor Shorfa",
    "modelNumber": "DH-SHR-SPG-35",
    "material": "12 mm Optiwhite Crystal Toughened Glass with Duplex 2205 Marine Grade Stainless Spigots",
    "brand": "Doorhome Architectural",
    "image": "/products-assets/shorfa/photo_35_2026-09-26_07-36-01.jpg",
    "fallbackImage": "/products-assets/shorfa/photo_35_2026-09-26_07-36-01.jpg",
    "features": [
        "Friction-Fit Core-Drilled Duplex 2205 Stainless Steel Floor Spigots",
        "Zero Glass Holes Required Ensuring Zero Stress Concentration Points",
        "Continuous 20 mm Drainage Gap Beneath Glass for Rapid Rainwater Evacuation",
        "Crystal Optiwhite Glass with Zero Green Edge Tint",
        "Ideal for Long Villa Gallery Corridors & Upper Connecting Bridges"
    ],
    "specs": {
        "Spigot Alloy": "Duplex 2205 Stainless (Superior Corrosion Resistance)",
        "Spigot Height": "160 mm Above Floor Level",
        "Glass Height": "1000 mm / 1100 mm Standard",
        "Adjustment": "Tilt-Adjustable Alignment Screws (± 2.5° Alignment Precision)"
    },
    "description": "Seamless, transparent, and mechanically pure. Spigot-mounted corridor balustrades offer the ultimate floating glass aesthetic, allowing natural flooring stones to continue beneath the glass line without interruption.",
    "translations": {
        "ar": {
            "name": "دربزين شرفة وممر زجاجي بدون إطار بنظام سبیگوت ستانلس ستيل فائق النقاء",
            "subCategory": "دربزينات الممرات والشرفات الطولية",
            "description": "نظام زجاجي عائم يثبت بقواعد سبیگوت من الستانلس ستيل المقاوم للصدأ. يمنح الممرات والشرفات مظهراً عصرياً انسيابياً مع فتحة تصريف مياه مستمرة أسفل الزجاج."
        },
        "ckb": {
            "name": "دەربزینی شووشەیی ڕێڕەو و شرفەی درێژ بە سیستەمی سپیگۆتی ستیل",
            "subCategory": "دەربزینی شووشەیی مۆدێرن بە سپیگۆت",
            "description": "سیستەمێکی شووشەیی سەرنجڕاکێش بە پایەی ستیلی دژە-ژەنگ کە ڕێگە دەدات ئاو و باران لە ژێر شووشەکەوە دەربچێت و دیمەنێکی تەواو شەفاف دەبەخشێت."
        },
        "en": {
            "name": "Continuous Glass Corridor Shorfa Balustrade with Stainless Steel Spigots",
            "subCategory": "Spigot Mounted Corridor Shorfa",
            "description": "Seamless, transparent, and mechanically pure. Spigot-mounted corridor balustrades offer the ultimate floating glass aesthetic, allowing natural flooring stones to continue beneath the glass line without interruption."
        }
    }
})

products.append({
    "id": "shorfa-fluted-aluminum-posts",
    "name": "Architectural Shorfa Balustrade with Fluted Aluminum Posts and Smoke Glass",
    "arabicName": "دربزين شرفة وتراس بأعمدة ألمنيوم مضلعة وزجاج رمادي مدخن فائق القوة",
    "category": "shorfa",
    "division": "shorfa",
    "subCategory": "Fluted Post Shorfa Systems",
    "modelNumber": "DH-SHR-FLT-49",
    "material": "Architectural Extruded Aluminum with Fluted Classical Geometry & Dark Smoke Glass",
    "brand": "Doorhome Architectural",
    "image": "/products-assets/shorfa/photo_49_2026-09-26_07-36-01.jpg",
    "fallbackImage": "/products-assets/shorfa/photo_49_2026-09-26_07-36-01.jpg",
    "features": [
        "Fluted Architectural Post Columns Blending Modern & Neoclassical Lines",
        "Electrostatic Deep Satin Black Finish Resisting Weather & Sun Oxidation",
        "Impact-Resistant Laminated Tinted Glass Panels with Precision Channel Glazing",
        "Concealed Heavy-Gauge Base Anchor Flanges with Decorative Skirting",
        "Robust Structural Rigidity for Expansive Villa Balconies"
    ],
    "specs": {
        "Post Profile": "80 x 80 mm Fluted Architectural Aluminum Column",
        "Glass Thickness": "12 mm (6+6 mm Laminated Tinted PVB)",
        "Height": "1150 mm",
        "Coating": "AkzoNobel Interpon D2525 Ultra-Durable Powder Coating"
    },
    "description": "A refined architectural synthesis combining neoclassical fluted column profiles with dark smoked safety glass, adding rhythmic sophistication and enduring strength to villa elevations.",
    "translations": {
        "ar": {
            "name": "دربزين شرفة وتراس بأعمدة ألمنيوم مضلعة وزجاج رمادي مدخن فائق القوة",
            "subCategory": "شرفات معمارية بأعمدة مضلعة",
            "description": "يجمع هذا النظام بين فخامة الأعمدة المضلعة الكلاسيكية والعصرية وزجاج الأمان المدخن لحماية متكاملة ومظهر معماري فخم يتناسب مع الفلل الكلاسيكية والحديثة."
        },
        "ckb": {
            "name": "دەربزینی شرفە و تراس بە ستوونی ئەلەمنیۆمی مۆدێرن و شووشەی دووکەڵی",
            "subCategory": "سیستەمی شرفە بە ستوونی ئەلەمنیۆم",
            "description": "شاکارێکی دیزاین کە ستوونی ئەلەمنیۆمی ڕەشی پتەو و شووشەی تاریکی پارێزەر کۆدەکاتەوە بۆ بەخشینی هەیبەت و جوانی بە ڕووکاری دەرەوەی بیناکەت."
        },
        "en": {
            "name": "Architectural Shorfa Balustrade with Fluted Aluminum Posts and Smoke Glass",
            "subCategory": "Fluted Post Shorfa Systems",
            "description": "A refined architectural synthesis combining neoclassical fluted column profiles with dark smoked safety glass, adding rhythmic sophistication and enduring strength to villa elevations."
        }
    }
})

products.append({
    "id": "shorfa-corner-cantilever-privacy",
    "name": "Corner Cantilevered Villa Shorfa with Dark Tinted Privacy Glass",
    "arabicName": "شرفة كابولية زاوية بزجاج مظلل للخصوصية الفائقة وتشطيب رخامي ناعم",
    "category": "shorfa",
    "division": "shorfa",
    "subCategory": "Corner Cantilever Shorfa",
    "modelNumber": "DH-SHR-CRN-55",
    "material": "10+10 mm Dark Tinted Tempered Safety Glass with Concealed Corner Clamp Shoe",
    "brand": "Doorhome Architectural",
    "image": "/products-assets/shorfa/photo_55_2026-09-26_07-36-01.jpg",
    "fallbackImage": "/products-assets/shorfa/photo_55_2026-09-26_07-36-01.jpg",
    "features": [
        "Frameless 90° Glass-to-Glass Mitered Corner Junction",
        "High Privacy Dark Smoked Lamination Blocking Sightlines from Street",
        "Concealed Flush Anchor Base Concealed Inside Marble Balcony Screed",
        "UV Protection Factor UPF 50+ Reducing Solar Heat Transfer to Interiors",
        "Engineered for Severe Regional Thermal Expansion & Contraction"
    ],
    "specs": {
        "Corner Type": "90° Frameless Structural Miter with Clear UV Silicone Bond",
        "Glass Construction": "10 mm Dark Grey Tempered + 1.52 mm PVB + 10 mm Clear Tempered",
        "Height": "1100 mm",
        "Impact Resistance": "Meets ASTM E2358 Class 3 Impact Standards"
    },
    "description": "Designed for private corner terraces and master suites, this seamless corner balustrade delivers an unobstructed 270-degree vista from inside while shielding occupants behind a dark reflective privacy veil from below.",
    "translations": {
        "ar": {
            "name": "شرفة كابولية زاوية بزجاج مظلل للخصوصية الفائقة وتشطيب رخامي ناعم",
            "subCategory": "شرفات زاوية كابولية",
            "description": "مصممة خصيصاً لزوايا الشرفات وغرف النوم الماستر. اتصال زجاجي زاوي بدون أعمدة يعطيك زاوية رؤية واسعة 270 درجة مع حجب الرؤية تماماً من الشارع لضمان خصوصيتك."
        },
        "ckb": {
            "name": "شرفەی گۆشەی دەرپەڕیو بە شووشەی تاریکی پارێزەری تایبەتمەندی",
            "subCategory": "شرفەی گۆشەی شووشەیی",
            "description": "بۆ گۆشەی تراس و ژووری ماستەر، بە بەیەکگەیشتنی شووشە بە بێ ستوون کە بینینی ٢٧٠ پلەی پانۆراما دەبەخشێت و لە خوارەوە ناوەوە بە تەواوی دەشارێتەوە."
        },
        "en": {
            "name": "Corner Cantilevered Villa Shorfa with Dark Tinted Privacy Glass",
            "subCategory": "Corner Cantilever Shorfa",
            "description": "Designed for private corner terraces and master suites, this seamless corner balustrade delivers an unobstructed 270-degree vista from inside while shielding occupants behind a dark reflective privacy veil from below."
        }
    }
})

products.append({
    "id": "shorfa-villa-interior-mezzanine-glass",
    "name": "Luxury Villa Interior Mezzanine Glass Balustrade with Matte Black Spigots & Smoked Safety Glass",
    "arabicName": "دربزين شرفة وصالة داخلية بزجاج مدخن وقواعد سبیگوت سوداء على أرضيات الرخام الفاخرة",
    "category": "shorfa",
    "division": "shorfa",
    "subCategory": "Interior Mezzanine Shorfa Systems",
    "modelNumber": "DH-SHR-INT-510",
    "material": "12+12 mm Smoked Laminated Architectural Safety Glass with Precision CNC Milled Black Stainless Spigots",
    "brand": "Doorhome Architectural",
    "image": "/products-assets/shorfa/shorfa_mezzanine_villa.jpg",
    "fallbackImage": "/products-assets/shorfa/shorfa_mezzanine_villa.jpg",
    "features": [
        "Smoked Dark Glass Imparting Rich Contemporary Contrast to White Marble Floors",
        "Precision Solid Matte Black Stainless Steel Floor Spigot Anchors",
        "Flush Zero-Obstruction Top Line Ensuring Light Floods the Ground Floor Hall",
        "Engineered for Indoor Void Protection Across Multi-Level Villa Foyers",
        "Silent Gasket-Cushioned Glazing with Zero Creaking Under Load"
    ],
    "specs": {
        "Glass Thickness": "25.52 mm (12 mm Tempered + 1.52 mm Dark Interlayer + 12 mm Tempered)",
        "Spigot Material": "Grade 316 Stainless Steel with Hard Anodized Matte Black Ceramic Coating",
        "Height": "1100 mm Compliant with Interior Residential Drop Codes",
        "Base Mounting": "Dual M12 Chemically Anchored Threaded Rods per Spigot"
    },
    "description": "An interior architectural showpiece custom-crafted for double-height villa mezzanines. Features smoky tinted safety glass held securely by sculpted matte black floor mounts, framing open halls with breathtaking sophistication.",
    "translations": {
        "ar": {
            "name": "دربزين شرفة وصالة داخلية بزجاج مدخن وقواعد سبیگوت سوداء على أرضيات الرخام الفاخرة",
            "subCategory": "دربزينات الشرفات والصالات الداخلية",
            "description": "تحفة هندسية معمارية مخصصة للصالات العلوية والمطلات الداخلية للفلل. زجاج مدخن فخم مثبت بقواعد سبیگوت سوداء أنيقة ليعكس بريق الرخام ويمنح صالتك اتساعاً وفخامة لا مثيل لها."
        },
        "ckb": {
            "name": "دەربزینی شووشەیی شرفەی هۆڵی ناوەوە بە سپیگۆتی ڕەشی مات و شووشەی تاریک",
            "subCategory": "دەربزینی شرفەی ناوەوەی ڤێلا",
            "description": "دیزاینێکی ناوازە بۆ هۆڵە بەرزەکان و شرفەی ناوەوەی نهۆمی سەرەوەی ڤێلا، بە شووشەی تاریکی مۆدێرن و پایەی سپیگۆتی ڕەشی مات لەسەر مەڕمەڕی سپی."
        },
        "en": {
            "name": "Luxury Villa Interior Mezzanine Glass Balustrade with Matte Black Spigots & Smoked Safety Glass",
            "subCategory": "Interior Mezzanine Shorfa Systems",
            "description": "An interior architectural showpiece custom-crafted for double-height villa mezzanines. Features smoky tinted safety glass held securely by sculpted matte black floor mounts, framing open halls with breathtaking sophistication."
        }
    }
})

# ==========================================
# 4. STAIRS (5 Products)
# ==========================================
products.append({
    "id": "stair-floating-wood-glass",
    "name": "Structural Frameless Glass Railing for Floating Cantilevered Timber Staircases",
    "arabicName": "سلم معلق عائم بأدراج خشبية طبيعية وحاجز زجاجي إنشائي بدون إطار",
    "category": "stairs",
    "division": "stairs",
    "subCategory": "Floating Cantilever Stair Systems",
    "modelNumber": "DH-STR-FLT-16",
    "material": "12+12 mm SentryGlas Structural Glass with Solid European White Oak Treads",
    "brand": "Doorhome Architectural",
    "image": "/products-assets/stairs/photo_16_2026-09-26_07-36-01.jpg",
    "fallbackImage": "/products-assets/stairs/photo_16_2026-09-26_07-36-01.jpg",
    "features": [
        "Self-Supporting Glass Balustrade Acting as Stringer Structural Reinforcement",
        "Cantilevered Solid Oak Treads Seemingly Defying Gravity from Hidden Wall Chassis",
        "Slanted Continuous Oak Top Cap Handrail Matching Tread Color",
        "Ultra-Clear Low-Iron Glass Eliminating Visual Clutter in Foyer Spaces",
        "Certified 1.5 kN/m Heavy-Duty Stairway Impact & Lateral Safety Rating"
    ],
    "specs": {
        "Tread Thickness": "80 mm Solid European White Oak with Matte Polyurethane Seal",
        "Glass Specification": "12 mm Low-Iron Tempered + 1.52 mm SentryGlas + 12 mm Low-Iron Tempered",
        "Fixing Detail": "Heavy Concealed Structural Steel Spine Embedded in Concrete Load-Bearing Wall",
        "Handrail": "Integrated Grooved Solid Oak Cap 45 x 45 mm"
    },
    "description": "The pinnacle of architectural stair design. Floating solid timber treads jut effortlessly from the wall, guarded by crystal-clear structural glass balustrades with continuous matching wood handrails.",
    "translations": {
        "ar": {
            "name": "سلم معلق عائم بأدراج خشبية طبيعية وحاجز زجاجي إنشائي بدون إطار",
            "subCategory": "السلالم العائمة المعلقة",
            "description": "قمة الابتكار المعماري للفلل العصرية. درجات خشب البلوط الطبيعي العائمة في الهواء مسنودة بحاجز زجاجي إنشائي متين وهاندريل خشبي أنيق يمنح صالتك اتساعاً وجمالاً ساحراً."
        },
        "ckb": {
            "name": "قادرمەی هەڵواسراوی مۆدێرن بە پلەی تەختەی سروشتی و دەربزینی شووشەی بەهێز",
            "subCategory": "قادرمەی هەڵواسراوی نژیاروانی",
            "description": "لووتکەی دیزاینی نژیاروانی بۆ ڤێلاکان، پلەکانی تەختەی سروشتی وەک ئەوەی لە هەوادا مەلە بکەن بە دەربزینی شووشەی ئەستووری بێ چوارچێوە و دەسکی داری هاوتا."
        },
        "en": {
            "name": "Structural Frameless Glass Railing for Floating Cantilevered Timber Staircases",
            "subCategory": "Floating Cantilever Stair Systems",
            "description": "The pinnacle of architectural stair design. Floating solid timber treads jut effortlessly from the wall, guarded by crystal-clear structural glass balustrades with continuous matching wood handrails."
        }
    }
})

products.append({
    "id": "stair-tinted-mezzanine-landing",
    "name": "Tinted Tempered Glass Balustrade for Mezzanine Landings & Stair Voids with Slim Top Cap",
    "arabicName": "دربزين صالة ومهبط درج بزجاج داكن وقواعد تثبيت دائرية مع إطار علوي نحيف",
    "category": "stairs",
    "division": "stairs",
    "subCategory": "Mezzanine & Void Stair Railings",
    "modelNumber": "DH-STR-MZZ-41",
    "material": "10+10 mm Smoked Tempered Laminated Glass with Anodized Brushed Stainless Cap",
    "brand": "Doorhome Architectural",
    "image": "/products-assets/stairs/photo_41_2026-09-26_07-36-01.jpg",
    "fallbackImage": "/products-assets/stairs/photo_41_2026-09-26_07-36-01.jpg",
    "features": [
        "Smoked Glass Enhancing Spatial Depth and Interior Lighting Drama",
        "Duplex Point-Fixed Clamping Spigots Anchored into Reinforced Concrete Curb",
        "Continuous Thin-Line Stainless Top Handrail for Tactile Security",
        "Engineered for Overlooking Grand Double-Height Living Halls",
        "Acoustic PVB Core Muffling Sound Transmission Across Floor Levels"
    ],
    "specs": {
        "Total Height": "1050 mm Above Finished Floor Level",
        "Glass Thickness": "21.52 mm Structural Laminate",
        "Spigot Material": "Grade 316 Stainless Steel with PVD Titanium Black Finish",
        "Wind & Load Class": "Class 2 Heavy Domestic & Commercial Void Protection"
    },
    "description": "Guarding multi-storey mezzanine stair openings with unmatched poise. Its deep smoked glass panes add depth and sophistication while framing upper level galleries with razor-sharp structural lines.",
    "translations": {
        "ar": {
            "name": "دربزين صالة ومهبط درج بزجاج داكن وقواعد تثبيت دائرية مع إطار علوي نحيف",
            "subCategory": "دربزينات مهابط الدرج والصالات المفتوحة",
            "description": "حماية أنيقة لمهابط السلالم والصالات المفتوحة ذات الأسقف المرتفعة. زجاج رمادي مدخن مصفح يضفي عمقاً وفخامة مع قواعد تثبيت دائرية مقاومة للصدمات."
        },
        "ckb": {
            "name": "دەربزینی شووشەی تاریک بۆ هۆڵی قادرمە و نێوان نهۆمەکان بە پایەی بازنەیی",
            "subCategory": "دەربزینی هۆڵ و قادرمەی کراوە",
            "description": "پارێزەرێکی شاهانە بۆ کراوەیی نێوان نهۆمەکان بە شووشەی تاریکی ئەستوور و پایەی ستیلی پتەو کە ڕوویەکی جوان بە بۆشایی قادرمەکەت دەبەخشێت."
        },
        "en": {
            "name": "Tinted Tempered Glass Balustrade for Mezzanine Landings & Stair Voids with Slim Top Cap",
            "subCategory": "Mezzanine & Void Stair Railings",
            "description": "Guarding multi-storey mezzanine stair openings with unmatched poise. Its deep smoked glass panes add depth and sophistication while framing upper level galleries with razor-sharp structural lines."
        }
    }
})

products.append({
    "id": "stair-marble-tinted-spigot",
    "name": "Panoramic Glass Railing for Marble Staircases with Timber Top Rail & 316 Stainless Spigots",
    "arabicName": "دربزين درج رخامي بزجاج مصفح وهاندريل خشب طبيعي وقواعد سبیگوت ستانلس",
    "category": "stairs",
    "division": "stairs",
    "subCategory": "Marble Stair Glass Systems",
    "modelNumber": "DH-STR-MRB-60",
    "material": "12 mm Crystal Clear Toughened Glass with Walnut Timber Handrail & 316 Spigots",
    "brand": "Doorhome Architectural",
    "image": "/products-assets/stairs/photo_60_2026-09-26_07-36-01.jpg",
    "fallbackImage": "/products-assets/stairs/photo_60_2026-09-26_07-36-01.jpg",
    "features": [
        "Sculpted Solid Natural Walnut Handrail Slotted Directly onto Glass Edge",
        "Minimalist Floor Spigots Preserving Pristine Polish of White Marble Treads",
        "Raked Custom Glass Paneling Following Staircase Angle Perfectly",
        "Dual PVB Safety Interlayer Providing Superior Impact Toughness",
        "Easy-Clean Nano-Sealed Glass Resisting Fingerprints and Dust"
    ],
    "specs": {
        "Angle of Ascent": "Custom CNC Cut to 32°–38° Stair Pitch",
        "Handrail Profile": "Ergonomic 50 x 30 mm Solid Walnut with Soft Eased Edges",
        "Spigot Anchor": "High-Load Chemical Resin Anchoring (Zero Tile Cracking)",
        "Safety Standard": "Meets BS 6180:2011 Barriers in and about Buildings"
    },
    "description": "An intimate dialogue between polished marble, warm natural walnut, and crystal glass. Hand-finished timber rails welcome the touch while transparent glass panels keep the stairway bright and weightless.",
    "translations": {
        "ar": {
            "name": "دربزين درج رخامي بزجاج مصفح وهاندريل خشب طبيعي وقواعد سبیگوت ستانلس",
            "subCategory": "دربزينات السلالم الرخامية الفاخرة",
            "description": "انسجام ساحر بين رخام الدرج الفاخر وهاندريل خشب الجوز الطبيعي مع زجاج إنشائي نقي وقواعد سبیگوت ستانلس ستيل تحافظ على جمال الرخام دون إخفائه."
        },
        "ckb": {
            "name": "دەربزینی شووشەیی قادرمەی مەڕمەڕ بە دەسکی داری گوێزی سروشتی و پایەی ستیل",
            "subCategory": "دەربزینی شووشەیی بۆ قادرمەی مەڕمەڕ",
            "description": "هەماهەنگییەکی بێوێنە لە نێوان مەڕمەڕی سپی، دار گوێزی سروشتی و شووشەی ڕوون بۆ دروستکردنی کەشێکی شاهانە لە قادرمەی ڤێلاکەتدا."
        },
        "en": {
            "name": "Panoramic Glass Railing for Marble Staircases with Timber Top Rail & 316 Stainless Spigots",
            "subCategory": "Marble Stair Glass Systems",
            "description": "An intimate dialogue between polished marble, warm natural walnut, and crystal glass. Hand-finished timber rails welcome the touch while transparent glass panels keep the stairway bright and weightless."
        }
    }
})

products.append({
    "id": "stair-black-aluminum-post",
    "name": "Contemporary Black Aluminum Post-and-Rail Interior Staircase Balustrade",
    "arabicName": "حاجز سلالم معدني بنمط شبكي هندسي عصري بطلاء أسود مطفي متين",
    "category": "stairs",
    "division": "stairs",
    "subCategory": "Geometric Grid Stair Balustrades",
    "modelNumber": "DH-STR-GRD-69",
    "material": "Heavy Structural Aluminum Extrusion with Welded Geometric Grid & Fine Texture Powder Coat",
    "brand": "Doorhome Architectural",
    "image": "/products-assets/stairs/photo_69_2026-09-26_07-36-01.jpg",
    "fallbackImage": "/products-assets/stairs/photo_69_2026-09-26_07-36-01.jpg",
    "features": [
        "Striking Square-Lattice Architectural Grid Pattern for Distinctive Character",
        "Sturdy Square Newel Posts Anchored Firmly into Concrete Tread Substructure",
        "Scratch-Resistant Micro-Textured Fine Grain Jet Black Architectural Coating",
        "Zero Glass Cleaning Required — 100% Solid Welded Aluminum Joinery",
        "Child-Safe Spacing Compliant with International 100 mm Sphere Safety Codes"
    ],
    "specs": {
        "Newel Post Profile": "70 x 70 mm Structural Aluminum Core Column",
        "Grid Slat Dimensions": "20 x 20 mm Solid Extruded Aluminum Bars",
        "Finish": "Qualicoat Class 1 Textured Black Powder Coating",
        "Rigidity": "Zero Lateral Flexing Across Continuous Long Flights"
    },
    "description": "Bespoke metal craftsmanship for modern homes seeking bold graphic definition. This geometric grid balustrade delivers industrial-chic elegance, unyielding rigidity, and effortless maintenance.",
    "translations": {
        "ar": {
            "name": "حاجز سلالم معدني بنمط شبكي هندسي عصري بطلاء أسود مطفي متين",
            "subCategory": "حواجز السلالم المعدنية الهندسية",
            "description": "تصميم هندسي عصري مبتكر بنمط شبكي يضفي طابعاً معمارياً فريداً على السلالم الداخلية. هيكل ألمنيوم صلب ملحوم بدقة بطلاء بودرة أسود مطفي مقاوم للخدش وسهل التنظيف."
        },
        "ckb": {
            "name": "دەربزینی قادرمەی ئەلەمنیۆمی مۆدێرن بە دیزاینی تۆڕی ئەندازەیی ڕەشی مات",
            "subCategory": "دەربزینی ئەندازەیی قادرمە",
            "description": "دیزاینێکی ئەندازەیی مۆدێرن بە شێوازی تۆڕی ئەلەمنیۆمی پتەوی ڕەش، کە کەسایەتییەکی بەهێز و تایبەت دەبەخشێتە قادرمەکان و پێویستی بە هیچ پاککردنەوەیەکی زۆر نییە."
        },
        "en": {
            "name": "Contemporary Black Aluminum Post-and-Rail Interior Staircase Balustrade",
            "subCategory": "Geometric Grid Stair Balustrades",
            "description": "Bespoke metal craftsmanship for modern homes seeking bold graphic definition. This geometric grid balustrade delivers industrial-chic elegance, unyielding rigidity, and effortless maintenance."
        }
    }
})

products.append({
    "id": "stair-grand-spiral-spigot",
    "name": "Frameless Tempered Glass Balustrade for Grand Marble Curved Staircases",
    "arabicName": "دربزين سلم رخامي حلزوني بزجاج كريستالي بدون فواصل وقواعد تثبيت مخفية",
    "category": "stairs",
    "division": "stairs",
    "subCategory": "Curved & Spiral Grand Staircases",
    "modelNumber": "DH-STR-SPR-08",
    "material": "12+12 mm Custom Curved SentryGlas Structural Glass with Mirror Polished Spigots",
    "brand": "Doorhome Architectural",
    "image": "/products-assets/stairs/photo_8_2026-09-26_07-36-01.jpg",
    "fallbackImage": "/products-assets/stairs/photo_8_2026-09-26_07-36-01.jpg",
    "features": [
        "Custom Radius CNC Thermal Slump Curved Glass Matching Precise Stair Arc",
        "Frameless Top Edge Allowing Marble Steps to Flow Into Open Double-Height Foyers",
        "Concealed Low-Profile Floor Clamps Bolted into Hard Marble Substrates",
        "Laminated SentryGlas Ensuring Structural Rigidity Even in Accidental Breakage",
        "Optical Clarity Low-Iron Glass Accentuating Pure White & Grey Marble Veins"
    ],
    "specs": {
        "Glass Thickness": "25.52 mm Heavy Curved Laminated Security Glass",
        "Radius Capability": "Custom Radius from 1200 mm to Infinite Tangent Curves",
        "Height": "1100 mm Uniform Rake Height",
        "Testing": "Static Line Load Tested to 3.0 kN/m"
    },
    "description": "The monumental centerpiece of luxury villa architecture. Custom thermally curved structural glass traces the sweeping arc of marble stairs, delivering grandeur without obscuring a single inch of stone artistry.",
    "translations": {
        "ar": {
            "name": "دربزين سلم رخامي حلزوني بزجاج كريستالي بدون فواصل وقواعد تثبيت مخفية",
            "subCategory": "دربزينات السلالم الحلزونية والمنحنية",
            "description": "تحفة السلالم الملكية المنحنية والحلزونية. زجاج إنشائي مقسى ومقوس حرارياً ليتتبع انحناءات السلم الرخامي بدقة متناهية وبدون أي فواصل بصرية تعيق الفخامة."
        },
        "ckb": {
            "name": "دەربزینی شووشەی کێرڤکراو بۆ قادرمەی مەڕمەڕی کەوانەیی شاهانە",
            "subCategory": "دەربزینی شووشەی کەوانەیی قادرمە",
            "description": "تایبەت بە قادرمە کەوانەییە شاهانەکان. شووشەی گەرمکراوی کێرڤکراو بە پێوانەی وردی قادرمەکەت کە ڕێگە دەدات جوانی و نەخشی مەڕمەڕەکە بە تەواوی بدرەوشێتەوە."
        },
        "en": {
            "name": "Frameless Tempered Glass Balustrade for Grand Marble Curved Staircases",
            "subCategory": "Curved & Spiral Grand Staircases",
            "description": "The monumental centerpiece of luxury villa architecture. Custom thermally curved structural glass traces the sweeping arc of marble stairs, delivering grandeur without obscuring a single inch of stone artistry."
        }
    }
})

# ==========================================
# 5. WINDOWS (6 Products - All from windows folder, distinct images, no doors, no accessories)
# ==========================================
products.append({
    "id": "win-guillotine-panoramic",
    "name": "Automated Guillotine Glass Window & Panoramic Terrace Enclosure System",
    "arabicName": "نظام الزجاج البانورامي الجلوتين الأوتوماتيكي للمطاعم والتراسات المعمارية",
    "category": "windows",
    "division": "windows",
    "subCategory": "Motorized Guillotine Panoramic Windows",
    "modelNumber": "DH-WIN-GLT-03",
    "material": "Thermal Break Architectural Aluminum with 8+12A+8 mm Double Insulated Glass & Somfy Motor",
    "brand": "Doorhome Architectural",
    "image": "/products-assets/windows/photo_3_2026-09-26_07-36-01.jpg",
    "fallbackImage": "/products-assets/windows/photo_3_2026-09-26_07-36-01.jpg",
    "features": [
        "Motorized Vertical Sliding Glass Panels with Somfy Smart Remote Control",
        "Converts Effortlessly from a Complete Glass Balustrade into a Floor-to-Ceiling Weather Wall",
        "Double-Glazed Argon-Filled Thermal Insulation Shielding Against Heat & Wind",
        "Heavy-Duty Steel Chain Lift Mechanism with Obstacle Detection Safety Sensors",
        "Engineered for Commercial Restaurants, Cafes, Luxury Villas, and Panoramic Pergolas"
    ],
    "specs": {
        "Max Width per Module": "Up to 4.5 Meters Wide Spans",
        "Max Height": "Up to 3.8 Meters",
        "Glass Options": "8+12A+8 mm Double Glazed / Triple Glazed Low-E",
        "Wind Resistance": "Class 4 (EN 12210)",
        "Automation": "Somfy RTS / IO Motor with Multi-Channel Remote & Smartphone App"
    },
    "description": "The definitive luxury panoramic enclosure. Engineered with automated guillotine sashes that slide silently at the press of a button, transitioning indoor hospitality spaces into open-air terraces in seconds.",
    "translations": {
        "ar": {
            "name": "نظام الزجاج البانورامي الجلوتين الأوتوماتيكي للمطاعم والتراسات المعمارية",
            "subCategory": "أنظمة الجلوتين البانورامية المتحركة",
            "description": "نظام زجاج بانورامي أوتوماتيكي متطور يعمل بمحركات صامتة للتحكم الرأسي بالزجاج عبر الريموت. يتحول بلمسة زر من حاجز زجاجي أنيق إلى جدار عازل متكامل للرياح والحرارة والأمطار."
        },
        "ckb": {
            "name": "سیستەمی شووشەی پانۆرامای گیۆتینی ئۆتۆماتیکی بۆ چێشتخانە و تراس",
            "subCategory": "پەنجەرە و شووشەی پانۆرامای ئۆتۆماتیک",
            "description": "سیستەمێکی پێشکەوتووی شووشەی پانۆراما بە کۆنتڕۆڵ، کە لە چەند چرکەیەکدا بە جووڵەی ستوونی لە دەربزینی باڵکۆنەوە دەبێتە پەنجەرە و دیواری شووشەیی تەواو عازل."
        },
        "en": {
            "name": "Automated Guillotine Glass Window & Panoramic Terrace Enclosure System",
            "subCategory": "Motorized Guillotine Panoramic Windows",
            "description": "The definitive luxury panoramic enclosure. Engineered with automated guillotine sashes that slide silently at the press of a button, transitioning indoor hospitality spaces into open-air terraces in seconds."
        }
    }
})

products.append({
    "id": "win-sliding-thermal-break",
    "name": "Architectural Thermal Break Sliding Window System with Multi-Point Locking",
    "arabicName": "نظام النوافذ المعمارية السحابة المعزولة حرارياً مع إغلاق أمان متعدد النقاط",
    "category": "windows",
    "division": "windows",
    "subCategory": "Thermal Sliding Windows",
    "modelNumber": "DH-WIN-SLD-10",
    "material": "Extruded 6063-T6 Aluminum with 24 mm Polyamide Thermal Break & Double Sealed Brush Gaskets",
    "brand": "Doorhome Systems",
    "image": "/products-assets/windows/win_sliding_thermal.jpg",
    "fallbackImage": "/products-assets/windows/win_sliding_thermal.jpg",
    "videoUrl": "/products-assets/windows/video_2026-09-26_07-36-00 (10).mp4",
    "features": [
        "Heavy-Duty Stainless Steel Precision Rollers for Feather-Light Sliding Motion",
        "Concealed Multi-Point Security Locking Mechanism along the Entire Sash Height",
        "Integrated High-Tensile Stainless Steel Insect & Security Screen Track",
        "Multi-Chamber Water Drainage Channel Preventing Rain Infiltration Under High Winds",
        "Certified Thermal Insulation Suitable for Extreme Middle Eastern Summer Climates"
    ],
    "specs": {
        "Frame Depth": "120 mm Heavy Dual-Track System",
        "Sash Width": "45 mm Slim Sightline Profile",
        "Max Sash Weight": "Up to 250 kg per Sliding Leaf",
        "Glazing Thickness": "Accommodates 20 mm to 32 mm Double/Triple Glazing",
        "Air Permeability": "Class 4 (EN 12207)"
    },
    "description": "Combining expansive glass areas with effortless gliding operation. Features heavy-duty thermal break aluminum profiles and precision tandem stainless rollers to deliver enduring acoustic and thermal insulation.",
    "translations": {
        "ar": {
            "name": "نظام النوافذ المعمارية السحابة المعزولة حرارياً مع إغلاق أمان متعدد النقاط",
            "subCategory": "النوافذ السحابة الحرارية",
            "description": "نظام شبابيك سحاب معماري فائق الانسيابية مع جسور عزل حراري تمنع دخول حرارة الصيف والغبار، وعجلات ستانلس ستيل تتحمل أوزاناً ثقيلة بحركة صامتة وسلسة."
        },
        "ckb": {
            "name": "سیستەمی پەنجەرەی سلایدینگی ئەلەمنیۆمی عەزلکراوی گەرمی (سیستەم سلایدینگ)",
            "subCategory": "پەنجەرەی سلایدینگی عەزلکراو",
            "description": "پەنجەرەی سلایدینگی نژیاروانی بە ئەلەمنیۆمی عازلی گەرمی، بە ڕۆڵەری ستیلی بەهێز کە بە پەنجەیەک دەجووڵێت و دەنگ و تۆزوبای دەرەوە بە تەواوی دەبەستێت."
        },
        "en": {
            "name": "Architectural Thermal Break Sliding Window System with Multi-Point Locking",
            "subCategory": "Thermal Sliding Windows",
            "description": "Combining expansive glass areas with effortless gliding operation. Features heavy-duty thermal break aluminum profiles and precision tandem stainless rollers to deliver enduring acoustic and thermal insulation."
        }
    }
})

products.append({
    "id": "win-magnetic-blinds-double-glass",
    "name": "Insulated Double Glazed Window with Integrated Internal Magnetic Louver Blinds",
    "arabicName": "نظام النوافذ المعزولة بستائر مغناطيسية داخلية مدمجة بين طبقات الزجاج",
    "category": "windows",
    "division": "windows",
    "subCategory": "Integrated Blind Window Systems",
    "modelNumber": "DH-WIN-MGB-03",
    "material": "Hermetically Sealed 16mm/22mm Double Glazing with Internal Micro-Aluminum Louvers & Neodymium Magnetic Slider",
    "brand": "Doorhome Architectural",
    "image": "/products-assets/windows/win_magnetic_blinds.jpg",
    "fallbackImage": "/products-assets/windows/win_magnetic_blinds.jpg",
    "videoUrl": "/products-assets/windows/video_2026-09-26_07-36-00 (3).mp4",
    "features": [
        "Internal Micro Louver Blinds Permanently Sealed Inside Argon-Filled Cavity",
        "Zero Dust, Zero Moisture, and Zero Cleaning Required for Lifetime of Window",
        "External Wireless Neodymium Magnetic Slider for Precision Tilting & Raising",
        "Superior Solar Heat Gain Coefficient (SHGC) Blocking Harsh Sun Glare",
        "Full Privacy at Will with Sleek Architectural Transparency When Opened"
    ],
    "specs": {
        "Cavity Width": "16 mm or 22 mm Hermetic Internal Blind Airspace",
        "Glass Setup": "6 mm Tempered Low-E + 22 mm Gas Filled Cavity + 6 mm Tempered Clear",
        "Control": "Dual-Function Magnetic Slider (Tilt Louvers & Lift/Drop)",
        "Longevity": "Tested to 100,000 Continuous Operating Cycles"
    },
    "description": "The ultimate solution for hygienic, zero-maintenance shading. Micro-louvers rest inside the hermetically sealed gas chamber of the window, actuated effortlessly through the glass by external magnetic controls.",
    "translations": {
        "ar": {
            "name": "نظام النوافذ المعزولة بستائر مغناطيسية داخلية مدمجة بين طبقات الزجاج",
            "subCategory": "نوافذ الستائر المغناطيسية المدمجة",
            "description": "وداعاً لتنظيف الستائر وتجمع الأتربة. ستائر ألمنيوم دقيقة مدمجة بإحكام داخل حجرة الزجاج المزدوج العازل، يتم التحكم بها بسلاسة عبر مقبض مغناطيسي خارجي ذكي."
        },
        "ckb": {
            "name": "سیستەمی پەنجەرەی شووشەی دووقات بە پەردەی موگناتیسی ناوەکی (سیستەم موگناتیس)",
            "subCategory": "پەنجەرە بە پەردەی ناوەکی موگناتیسی",
            "description": "پەردەی ئەلەمنیۆمی تایبەت کە لە نێوان دوو چینی شووشەکەدا بە تەواوی بەستراوە، هیچ تۆز و شێی لێ نانیشێت و بە موگناتیسی سەر شووشەکە بە ئاسانی کۆنتڕۆڵ دەکرێت."
        },
        "en": {
            "name": "Insulated Double Glazed Window with Integrated Internal Magnetic Louver Blinds",
            "subCategory": "Integrated Blind Window Systems",
            "description": "The ultimate solution for hygienic, zero-maintenance shading. Micro-louvers rest inside the hermetically sealed gas chamber of the window, actuated effortlessly through the glass by external magnetic controls."
        }
    }
})

products.append({
    "id": "win-motorized-remote-guillotine",
    "name": "Motorized Electric Guillotine Window System with Somfy Smart Remote Control",
    "arabicName": "نظام النوافذ الكهربائية الأوتوماتيكية بالريموت كنترول ومحركات صامتة فائقة العزم",
    "category": "windows",
    "division": "windows",
    "subCategory": "Smart Motorized Window Systems",
    "modelNumber": "DH-WIN-MTR-09",
    "material": "High-Grade Architectural Aluminum Frame with High-Torque Motor & Low-E Laminated Safety Glass",
    "brand": "Doorhome Automation",
    "image": "/products-assets/windows/win_motorized_remote.jpg",
    "fallbackImage": "/products-assets/windows/win_motorized_remote.jpg",
    "videoUrl": "/products-assets/windows/video_2026-09-26_07-36-00 (9).mp4",
    "features": [
        "Fully Automated Touch-Button Vertical Opening via Handheld Wireless Remote",
        "Whisper-Quiet Internal Tubular Motor Completely Concealed Inside Header Box",
        "Anti-Pinch Infrared Safety Photocell Automatically Halting Motion Upon Obstruction",
        "Smart Home Integration Ready (Compatible with Alexa, Google Home & Zigbee Hubs)",
        "Double Weatherstrip EPDM Gaskets Providing Total Acoustic & Water Tightness"
    ],
    "specs": {
        "Motor Specs": "230V High-Torque Tubular Motor with Electronic Limit Switches",
        "Operation Speed": "Smooth 12 cm/second Vertical Travel Speed",
        "Frame Dimension": "140 mm Heavy Structural Header Profile",
        "Safety Sensor": "Dual Bottom Beam Obstacle Detection"
    },
    "description": "Elevate your architectural facade to modern smart luxury. Controlled by a dedicated remote or smart phone, this motorized system raises and lowers heavy insulated glass panels with whisper-quiet grace.",
    "translations": {
        "ar": {
            "name": "نظام النوافذ الكهربائية الأوتوماتيكية بالريموت كنترول ومحركات صامتة فائقة العزم",
            "subCategory": "نوافذ كهربائية ذكية",
            "description": "قمة التطور والراحة المعمارية. نظام شبابيك كهربائي يرفع ويخفض الزجاج بلمسة زر على الريموت أو الهاتف الذكي، مع حساسات أمان متطورة تمنع الإغلاق في حال وجود أي عائق."
        },
        "ckb": {
            "name": "سیستەمی پەنجەرەی کارەبایی ئۆتۆماتیکی بە کۆنتڕۆڵی زیرەک (سیستەم ماطور)",
            "subCategory": "پەنجەرەی کارەبایی و مۆتۆڕدار",
            "description": "لووتکەی تەکنەلۆژیای مۆدێرن بۆ پەنجەرە، بە مۆتۆڕی بێدەنگ کە لە ڕێگەی کۆنتڕۆڵ یان مۆبایلەوە پەنجەرەکە دەکاتەوە و دادەخات بە بەرزترین ئاستی سەلامەتی."
        },
        "en": {
            "name": "Motorized Electric Guillotine Window System with Somfy Smart Remote Control",
            "subCategory": "Smart Motorized Window Systems",
            "description": "Elevate your architectural facade to modern smart luxury. Controlled by a dedicated remote or smart phone, this motorized system raises and lowers heavy insulated glass panels with whisper-quiet grace."
        }
    }
})

products.append({
    "id": "win-tilt-turn-german-thermal",
    "name": "German Tilt & Turn Thermal Break Architectural Casement Window System",
    "arabicName": "نظام النوافذ الألمانية قلاب ومفصلي حراري مع عزل صوتي متكامل للأجواء القاسية",
    "category": "windows",
    "division": "windows",
    "subCategory": "Tilt & Turn Casement Windows",
    "modelNumber": "DH-WIN-TTN-07",
    "material": "Qualicoat Architectural Aluminum with 34 mm Polyamide Thermal Break & Siegenia Multi-Lock Hardware",
    "brand": "Doorhome Architectural",
    "image": "/products-assets/windows/win_tilt_turn_german.jpg",
    "fallbackImage": "/products-assets/windows/win_tilt_turn_german.jpg",
    "videoUrl": "/products-assets/windows/video_2026-09-26_07-36-00 (7).mp4",
    "features": [
        "Dual-Action German Engineering: Tilt Inwards from Top for Ventilation, Turn Inward 180° for Cleaning",
        "Perimeter Multi-Point Locking Compressing Gaskets Against All 4 Sides of Frame",
        "Class 9A Water Tightness Resisting Driving Monsoon & Desert Rainstorms",
        "Heavy-Duty Concealed Hinges Supporting Triple-Glazed Heavy Acoustic Units",
        "Thermal Insulation Value Uf Reaching 1.2 W/m²K for Maximum Energy Savings"
    ],
    "specs": {
        "Frame Depth": "75 mm High-Performance Thermal Extrusion",
        "Hardware": "Siegenia Titan AF Multi-Point Concealed Perimeter Hardware",
        "Gasket System": "Three Perimeter Continuous EPDM Gaskets (Central Gasket Seal)",
        "Sound Reduction": "Sound Reduction up to 45 dB (Rw)"
    },
    "description": "The gold standard of European window engineering. Operates in two distinct modes: tilting from the top for secure draft-free room ventilation, and opening inward fully for effortless glass cleaning.",
    "translations": {
        "ar": {
            "name": "نظام النوافذ الألمانية قلاب ومفصلي حراري مع عزل صوتي متكامل للأجواء القاسية",
            "subCategory": "النوافذ الألمانية القلابة والمفصلية",
            "description": "المعيار الذهبي للنوافذ الأوروبية العازلة. تعمل بوضعيتين ذكيتين: إمالة علوية قلابة للتهوية الآمنة دون دخول المطر، وفتح مفصلي كامل للداخل لسهولة التنظيف التامة."
        },
        "ckb": {
            "name": "سیستەمی پەنجەرەی ئەڵمانی دوو-جووڵەیی (قەلاب و کراوە) بە عەزلی گەرمی بەهێز",
            "subCategory": "پەنجەرەی قەلاب و مفصەڵی",
            "description": "پێوەرە ستانداردە ئەوروپییەکە بۆ پەنجەرەی بەهێز، بە دوو شێوازی کرانەوە: قەلاب لە سەرەوە بۆ هەواگۆڕکێی ئارام و کرانەوەی تەواو بۆ پاککردنەوەی ئاسان."
        },
        "en": {
            "name": "German Tilt & Turn Thermal Break Architectural Casement Window System",
            "subCategory": "Tilt & Turn Casement Windows",
            "description": "The gold standard of European window engineering. Operates in two distinct modes: tilting from the top for secure draft-free room ventilation, and opening inward fully for effortless glass cleaning."
        }
    }
})

products.append({
    "id": "win-automated-skylight-roof",
    "name": "Automated Architectural Roof & Skylight Window System with Rain & Wind Sensors",
    "arabicName": "نظام نوافذ السقف المعمارية الأوتوماتيكية مع حساسات المطر والرياح الذكية",
    "category": "windows",
    "division": "windows",
    "subCategory": "Roof Skylights & Atrium Windows",
    "modelNumber": "DH-WIN-SKY-11",
    "material": "Reinforced Structural Aluminum Profile with Triple Laminated Solar Reflective Glass & Linear Actuator",
    "brand": "Doorhome Architectural",
    "image": "/products-assets/windows/win_automated_skylight.jpg",
    "fallbackImage": "/products-assets/windows/win_automated_skylight.jpg",
    "videoUrl": "/products-assets/windows/video_2026-09-26_07-36-00 (11).mp4",
    "features": [
        "Heavy-Duty Electric Chain Linear Actuator Opening Sashes to 45° for Thermal Chimney Venting",
        "Built-In Optical Rain Sensor & Anemometer Wind Sensor Closing Window Automatically During Storms",
        "High-Impact Triple Laminated Glass Safe from Hail, Heavy Downpours and Falling Debris",
        "Solar Control Low-E Coating Reflecting 78% of Solar Infrared Heat while Passing Day Light",
        "Thermally Broken Welded Curb System Eliminating Condensation and Roof Leaks"
    ],
    "specs": {
        "Drive System": "24V DC Linear Spindle / Chain Actuator (Push Force up to 600N)",
        "Glass Make-Up": "8 mm Solar Heat Reflective Toughened + 16 mm Argon + 10 mm Laminated PVB Safety Glass",
        "Waterproofing": "Double Welded EPDM Flashing Collar for Direct Membrane Integration",
        "Control": "Wall Switch, Remote, and Automatic Weather Station Interface"
    },
    "description": "Bring natural sunlight and fresh air into deep villa floor plans and attic living rooms. Engineered with intelligent weather sensors that automatically close the window at the first drop of rain.",
    "translations": {
        "ar": {
            "name": "نظام نوافذ السقف المعمارية الأوتوماتيكية مع حساسات المطر والرياح الذكية",
            "subCategory": "نوافذ الأسقف والمناور الزجاجية",
            "description": "أدخل ضوء الشمس الطبيعي والهواء النقي إلى قلب منزلك. نظام نوافذ سقف متطور مزود بحساسات ذكية للمطر والرياح تقوم بإغلاق النافذة تلقائياً فور هطول أول قطرة مطر."
        },
        "ckb": {
            "name": "سیستەمی پەنجەرەی سەربانی ئۆتۆماتیکی (سکای لایت) بە هەستەوەری باران و با",
            "subCategory": "پەنجەرەی سەربان و سکای لایت",
            "description": "ڕووناکی سروشتی هەتاو و هەوای پاک بهێنە ناو دڵی ڤێلاکەت بە پەنجەرەی سەربانی ئۆتۆماتیک، کە بە یەکەم دڵۆپی باران یان بای بەهێز خۆکارانە دادەخرێت."
        },
        "en": {
            "name": "Automated Architectural Roof & Skylight Window System with Rain & Wind Sensors",
            "subCategory": "Roof Skylights & Atrium Windows",
            "description": "Bring natural sunlight and fresh air into deep villa floor plans and attic living rooms. Engineered with intelligent weather sensors that automatically close the window at the first drop of rain."
        }
    }
})

# ==========================================
# 6. DOORS (38 Products - All from doors folder, deduplicated)
# ==========================================
doors_raw = [
    ("DH-GT-02", "photo_2_2026-09-26_07-36-01.jpg", "Modern Driveway Gate with Horizontal Louvers & Dual Frosted Glass", "بوابة فيلا عصرية بشرائح ألمنيوم أفقية ومداخل زجاجية بلورية مزدوجة", "دەروازەی مۆدێرنی ڤێلا بە شریتی ئەلەمنیۆم و شووشەی سەوزباو"),
    ("DH-GT-06", "photo_6_2026-09-26_07-36-01.jpg", "Contemporary Sliding Driveway Gate with Vertical Warm Teak Handles", "بوابة سحابة فاخرة بمقابض خشب تيك طبيعي عمودية وتصميم ألمنيوم متين", "دەروازەی خلیسکێنەی شاهانە بە دەسکی تەختەی تیکی سروشتی"),
    ("DH-GT-14", "photo_14_2026-09-26_07-36-01.jpg", "Architectural Sliding Gate with Charcoal Louvers & Vertical Timber Inlays", "بوابة ألمنيوم فحمية بشرائح أفقية مع لمسات خشبية رأسية وباب مشاة مدمج", "دەروازەی نژیاروانی بە شریتی ڕەژوویی و تێکەڵەی تەختەی سروشتی"),
    ("DH-GT-15", "photo_15_2026-09-26_07-36-01.jpg", "Horizontal Slat Security Gate with Translucent Glass Accent Panel", "بوابة فيلا عصرية بشرائح حماية أفقية ونافذة زجاجية مضيئة أنيقة", "دەروازەی مۆدێرن بە پەنجەرەی شووشەیی ڕووناك لە تەنیشتەوە"),
    ("DH-GT-17", "photo_17_2026-09-26_07-36-01.jpg", "Modernist Entrance Gate with Matte Black Aluminum & Vertical Wood Siding", "بوابة مدخل رئيسية تجمع بين الألمنيوم الأسود المطفي وكسوة الخشب الطبيعي", "دەروازەی سەرەکی بە شێوازی تێکەڵ لە ئەلەمنیۆمی ڕەش و تەختەی ستوونی"),
    ("DH-GT-19", "photo_19_2026-09-26_07-36-01.jpg", "Sculptural Angular Architectural Gate with Illuminated Geometric Grid", "بوابة معمارية مجسمة بنمط هندسي زاوِي مع لوحات زجاجية مضيئة ساحرة", "دەروازەی ئەندازەیی تایبەت بە لێواری لێژ و شووشەی ڕووناکیکراو"),
    ("DH-GT-21", "photo_21_2026-09-26_07-36-01.jpg", "Modern Black Villa Gate with Inlaid Polished Stainless Steel 316 Stripes", "بوابة فيلا سوداء عصرية بشرائط ستانلس ستيل مصقولة وباب مشاة متناسق", "دەروازەی ڕەشی ڤێلا بە هێڵی ستیلی بریسکەدار و دەرگای پیادە"),
    ("DH-GT-22", "photo_22_2026-09-26_07-36-01.jpg", "Sliding Driveway Gate with Horizontal Louvers & Vertical Timber Mosaic", "بوابة سحاب عريضة بشرائح رمادية مطفية مع باب مشاة بتطعيمات خشبية دافئة", "دەروازەی سلایدینگی فراوان بە شریتی ئاسۆیی و دیزاینی تەختەی چوارگۆشە"),
    ("DH-GT-23", "photo_23_2026-09-26_07-36-01.jpg", "Contemporary Matte Black Gate with 3 Horizontal Glass Accent Windows", "بوابة سوداء فاخرة بثلاث نوافذ زجاجية أفقية بإطارات بيضاء تباينية", "دەروازەی ڕەشی مۆدێرن بە سێ پەنجەرەی ئاسۆیی شووشەیی سەرنجڕاکێش"),
    ("DH-GT-25", "photo_25_2026-09-26_07-36-01.jpg", "Architectural Slat Gate with Vertical Slat Pedestrian Entry & Horizontal Driveway", "بوابة مركبات بشرائح عريضة مع بوابة مشاة متناغمة بشرائح رأسية أنيقة", "دەروازەی جووت بە شریتی ستوونی پیادە و شریتی ئاسۆیی ئۆتۆمبێل"),
    ("DH-GT-27", "photo_27_2026-09-26_07-36-01.jpg", "Double Swing Modern Gate with Stainless Steel Linear Inlays & Ergonomic Pulls", "بوابة مزدوجة بدرفتين بمقابض ستانلس طولية وخطوط ستانلس متوازية", "دەروازەی دوو-پەڕەیی بە هێڵەکانی ستیلی دژە-ژەنگ و دەسکی درێژ"),
    ("DH-GT-29", "photo_29_2026-09-26_07-36-01.jpg", "Dual-Tone Driveway Gate with Central Vertical Warm Timber Siding", "بوابة ثنائية اللون تجمع بين رمادي الغرافيت والخشب الطبيعي بالوسط", "دەروازەی دوو-ڕەنگ بە تەختەی سروشتی لە ناوەڕاست و ئەلەمنیۆمی تۆخ"),
    ("DH-DR-30", "photo_30_2026-09-26_07-36-01.jpg", "Commercial Showroom Panoramic Double Glass Partition Door with Frosted Privacy Bands", "أبواب صالات ومعارض زجاجية بانورامية مزدوجة بشرائط خصوصية بلورية مثلجة", "دەرگای شووشەیی دووقاتی پێشانگا بە هێڵی ماتکراوی پارێزەری تایبەتمەندی"),
    ("DH-GT-32", "photo_32_2026-09-26_07-36-01.jpg", "Sleek Minimalist Sliding Gate with Horizontal Panel Accents & Pedestrian Door", "بوابة سحابة مينيمالية حديثة بألواح ألمنيوم أفقية وباب مشاة مندمج", "دەروازەی خلیسکێنەی سادە و مۆدێرن بە پەڕەی ئەلەمنیۆمی ئاسۆیی"),
    ("DH-GT-33", "photo_33_2026-09-26_07-36-01.jpg", "Luxury Estate Black Aluminum Gate with Side Pedestrian Door", "بوابة قصر سوداء فخمة بشرائح ألمنيوم معزولة وباب مدخل شخصي جانبي", "دەروازەی ڕەشی شاهانە بۆ کۆشک و ڤێلا بە دەرگای پیادەی تەواوکەر"),
    ("DH-GT-34", "photo_34_2026-09-26_07-36-01.jpg", "Double Swing Villa Gate with Silver Horizontal Reveal Lines", "بوابة فيلا مزدوجة بلون فضي مع خطوط سوداء هندسية تباينية رائعة", "دەروازەی دوو-لەنگەیی بە ڕەنگی زیوی و هێڵە ڕەشە ئەندازەییەکان"),
    ("DH-GT-38", "photo_38_2026-09-26_07-36-01.jpg", "Minimalist Horizontal Slat Gate Built into Natural Travertine Stone Portal", "بوابة شرائح أفقية ناعمة مدمجة في مدخل بوابة حجر الترافرتين الطبيعي", "دەروازەی شریتی ئاسۆیی کە لەناو چوارچێوەی بەردی تراڤەرتین دانراوە"),
    ("DH-GT-40", "photo_40_2026-09-26_07-36-01.jpg", "Modern Charcoal Sliding Gate with Stainless Horizontal Strips & Glass Side Door", "بوابة سحابة بلون الفحم مع خطوط ستانلس براقة وباب مشاة بزجاج مثلج", "دەروازەی خلیسکێنەی ڕەنگی خەڵوزی بە هێڵی ستیل و دەرگای شووشەدار"),
    ("DH-GT-42", "photo_42_2026-09-26_07-36-01.jpg", "Contoured Wave Privacy Gate with Dynamic Curved Louvers & Integrated Pedestrian Door", "بوابة الخصوصية بانحناءات موجية انسيابية مع باب مشاة مدمج بسلاسة", "دەروازەی پاراستنی تەواو بە شریتی شەپۆلاوی و دەرگای پیادەی هاوتا"),
    ("DH-GT-44", "photo_44_2026-09-26_07-36-01.jpg", "Double Swing Gate with Natural Vertical Hardwood Slats & Matte Black Frame", "بوابة درفتين بشرائح خشب طبيعي معالج محاطة بهيكل ألمنيوم أسود مطفي", "دەروازەی دوو-لەنگە بە تەختەی سروشتی دار و چوارچێوەی ئەلەمنیۆمی ڕەش"),
    ("DH-GT-46", "photo_46_2026-09-26_07-36-01.jpg", "Modern Sliding Driveway Gate with Wide Horizontal Aluminum Panels", "بوابة سحاب عصرية بألواح ألمنيوم عريضة انسيابية وقفل أمان أوتوماتيكي", "دەروازەی خلیسکێنەی مۆدێرن بە پەڕەی ئەلەمنیۆمی فراوان"),
    ("DH-DR-47", "photo_47_2026-09-26_07-36-01.jpg", "Luxury Architectural Pivot Villa Entrance Door in Thermal Aluminum & Treated Teak", "باب فيلا محوري فاخر من خشب التيك المعالج وألمنيوم ثيرمال بريك", "دەرگای ڤێلای تەوەرەیی (پێڤۆت) شاهانە لە تەختەی تیک و ئەلەمنیۆم"),
    ("DH-GT-48", "photo_48_2026-09-26_07-36-01.jpg", "Full Privacy Louvered Sliding Driveway Gate in Anthracite Grey", "بوابة سحابة بشرائح حماية خصوصية كاملة بلون رمادي أنثراسايت أنيق", "دەروازەی خلیسکێنەی پارێزەری تایبەتمەندی بە ڕەنگی ئەنتراسایتی تۆخ"),
    ("DH-GT-50", "photo_50_2026-09-26_07-36-01.jpg", "Modern Villa Gate with Horizontal Privacy Louvers & Matching Pedestrian Entry", "بوابة فيلا متناسقة بشرائح خصوصية مائلة وباب مشاة مستقل بنفس التصميم", "دەروازەی ڤێلا بە شریتی لار بۆ ڕێگری لە بینین و دەرگای تەنیشت"),
    ("DH-DR-51", "photo_51_2026-09-26_07-36-01.jpg", "Contemporary Villa Entrance Door with Vertical Natural Wood Paneling & Matte Surround", "باب مدخل فيلا عصري بكسوة خشبية رأسية دافئة وإطار أسود عازل فخم", "دەرگای سەرەکی ڤێلا بە ڕووکەشی تەختەی ستوونی و چوارچێوەی ڕەشی شاهانە"),
    ("DH-GT-52", "photo_52_2026-09-26_07-36-01.jpg", "Heavy-Duty Black Steel Security Gate with Modern Translucent Window Grid", "بوابة حماية صلبة عالية الأمان باللون الأسود ونافذة مربعات زجاجية", "دەروازەی ئەمنیی پتەو بە پەنجەرەی چوارگۆشەی شووشەی مات"),
    ("DH-GT-53", "photo_53_2026-09-26_07-36-01.jpg", "Wide Horizontal Slat Villa Gate with Frosted Architectural Glass Reveal", "بوابة عريضة بشرائح ألمنيوم متتالية مع فاصل زجاجي مصنفر طولي وباب جانبي", "دەروازەی پان بە شریتی یەکبەدوایەک و هێڵی شووشەی ماتکراو"),
    ("DH-GT-54", "photo_54_2026-09-26_07-36-01.jpg", "High-Contrast Modern Gate with Matte Black Horizontal Louvers & White Marble Columns", "بوابة سوداء بتباين فاخر مع أعمدة الرخام الأبيض وباب مشاة مدمج", "دەروازەی ڕەشی کاتیۆدی لە نێوان ستوونی مەڕمەڕی سپی شاهانەدا"),
    ("DH-DR-58", "photo_58_2026-09-26_07-36-01.jpg", "Architectural Full-Height Glass Entrance Door with Integrated Vertical Black Pull", "باب مدخل زجاجي معماري بكامل الارتفاع مع مقبض ألمنيوم أسود ممتد", "دەرگای سەرەکی شووشەیی باڵابەرز بە دەسکی ستوونی ڕەشی درێژ"),
    ("DH-GT-61", "photo_61_2026-09-26_07-36-01.jpg", "Modern Horizontal Privacy Gate with Warm Natural Wood Pedestrian Inlay", "بوابة خصوصية بشرائح أفقية داكنة مع باب مشاة مكسو بخشب التيك الدافئ", "دەروازەی پارێزەری تایبەتمەندی بە دەرگای پیادەی تەختەی تیکی جوان"),
    ("DH-GT-62", "photo_62_2026-09-26_07-36-01.jpg", "Luxury Estate Double Swing Gate with Alternating Natural Wood & Anodized Metallic Tiles", "بوابة قصر مزدوجة بتصميم فسيفسائي فاخر يجمع بين الخشب والمعدن المؤكسد", "دەروازەی دوو-پەڕەیی قەسر بە تێکەڵەی تەختەی مۆزایک و ئەلەمنیۆم"),
    ("DH-GT-65", "photo_65_2026-09-26_07-36-01.jpg", "High-Security Vertical Slat Aluminum Gate with Seamlessly Integrated Pedestrian Access", "بوابة ألمنيوم أمنية بشرائح رأسية متقاربة مع باب مشاة مدمج بدون فواصل", "دەروازەی ئەلەمنیۆمی ئەمنی بە شریتی ستوونی و دەرگای پیادەی شاردراوە"),
    ("DH-GT-66", "photo_66_2026-09-26_07-36-01.jpg", "Modern Dark Sliding Gate with Integrated Sidelight Pedestrian Portal", "بوابة سحابة داكنة فخمة بجوار مدخل مشاة زجاجي معمارِي مضيء", "دەروازەی خلیسکێنەی تۆخ لەگەڵ دەروازەی پیادەی شووشەدار"),
    ("DH-GT-71", "photo_71_2026-09-26_07-36-01.jpg", "Two-Tone Architectural Gate with Warm Natural Timber Paneling & Slate Grey Aluminum", "بوابة معمارية بدرجتين لونيتين تجمع بين ألواح الخشب الدافئة ورمادي الإردواز", "دەروازەی دوو-ڕەنگی نژیاروانی بە تەختەی گەرم و ئەلەمنیۆمی خۆڵەمێشی"),
    ("DH-DR-72", "photo_72_2026-09-26_07-36-01.jpg", "Modern Villa Entrance Door with Full-Height Architectural Glass Sidelight & Extended Pull Handle", "باب مدخل فيلا عصري مع زجاج جانبي بكامل الارتفاع ومقبض طولي فاخر", "دەرگای سەرەکی مۆدێرنی ڤێلا بە پەنجەرەی شووشەیی درێژ و دەسکی شاهانە"),
    ("DH-GT-73", "photo_73_2026-09-26_07-36-01.jpg", "Monolithic Matte Black Driveway Gate Framed by Polished Black Marble Columns", "بوابة سوداء مصمتة فخمة بإطار أعمدة الرخام الأسود المصقول الفاخر", "دەروازەی ڕەشی پۆڵایین لە نێوان کۆڵەکەکانی مەڕمەڕی ڕەشی بریقەدار"),
    ("DH-GT-74", "photo_74_2026-09-26_07-36-01.jpg", "Architectural Estate Gate with CNC Laser-Cut Geometric Screens & Natural Timber Framing", "بوابة قصر معمارية بنقوش قص ليزر هندسية مفرغة وأطر خشبية دافئة", "دەروازەی شاهانەی قەسر بە نەخشی ئەندازەیی لەیزەر و چوارچێوەی دار"),
    ("DH-GT-77", "photo_77_2026-09-26_07-36-01.jpg", "Architectural Vertical Louver Gate with Integrated Warm Ambient LED Light Channels", "بوابة شرائح رأسية معمارية مع قنوات إضاءة ليد دافئة متوهجة من الأسفل", "دەروازەی شریتی ستوونی بە ڕووناکیی لیدی زەردی دڵڕفێنی ژێرەوە")
]

for model, img_file, title_en, title_ar, title_ckb in doors_raw:
    p_id = f"door-{model.lower()}"
    products.append({
        "id": p_id,
        "name": title_en,
        "arabicName": title_ar,
        "category": "doors",
        "division": "doors",
        "subCategory": "Architectural Doors & Driveway Gates",
        "modelNumber": model,
        "material": "High-Grade Architectural 6063-T6 Aluminum with Anti-Corrosion Electrostatic Powder Coating",
        "brand": "Doorhome Architectural",
        "image": f"/products-assets/doors/{img_file}",
        "fallbackImage": f"/products-assets/doors/{img_file}",
        "features": [
            "Heavy-Duty Weatherproof Architectural Aluminum Chassis",
            "Multi-Point High Security Mortise Lock & Anti-Sag Adjustable Hinges",
            "Qualicoat Marine-Grade Electrostatic Powder Coating (Resists UV & Desert Heat)",
            "Integrated Weather Seals & Impact Dampeners for Whisper-Quiet Closing",
            "Automation Ready: Compatible with Italian BFT & Somfy Heavy-Duty Motor Arms"
        ],
        "specs": {
            "Frame Depth": "75 mm – 100 mm Structural Aluminum Core",
            "Inlay Options": "Natural Kiln-Dried Teak, Laser-Cut Aluminum, or Frosted Tempered Glass",
            "Warranty": "10-Year Structural Integrity & Surface Coating Guarantee",
            "Finish": "Fine-Textured Matte Finish in Anthracite, Jet Black, or Custom RAL"
        },
        "description": f"{title_en}. Expertly engineered by Doorhome for demanding architectural residential entrances, combining massive structural strength with luxurious contemporary design.",
        "translations": {
            "ar": {
                "name": title_ar,
                "subCategory": "أبواب وبوابات المداخل المعمارية",
                "description": f"{title_ar}. صُنعت وهُندست بأعلى درجات الدقة والمتانة لتمنح مدخل فيلتك فخامة استثنائية وأماناً مطلقاً يدوم لسنوات طويلة مع مقاومة كاملة للشمس والعوامل الجوية."
            },
            "ckb": {
                "name": title_ckb,
                "subCategory": "دەرگا و دەروازە نژیاروانییەکان",
                "description": f"{title_ckb}. بە ئەلەمنیۆمی پتەو و دیزاینی نایابی سەردەمی بۆ بەخشینی بەرزترین ئاستی جوانی، هەیبەت و پارێزگاری بە دەروازەی سەرەکی ڤێلاکەت."
            },
            "en": {
                "name": title_en,
                "subCategory": "Architectural Doors & Driveway Gates",
                "description": f"{title_en}. Expertly engineered by Doorhome for demanding architectural residential entrances, combining massive structural strength with luxurious contemporary design."
            }
        }
    })

print(f"Generated {len(products)} products total.")

# Category counts
counts = {}
for p in products:
    c = p["category"]
    counts[c] = counts.get(c, 0) + 1

for c, count in sorted(counts.items()):
    print(f"  {c}: {count}")

# Verify all images exist
base_dir = "products&assets"
missing = []
used_images = set()
duplicates = []
for p in products:
    rel_img = p["image"].replace("/products-assets/", "")
    full_path = os.path.join(base_dir, rel_img)
    if not os.path.exists(full_path):
        missing.append((p["id"], full_path))
    if p["image"] in used_images:
        duplicates.append((p["id"], p["image"]))
    used_images.add(p["image"])

if missing:
    print("ERROR - Missing files:", missing)
else:
    print("All image files exist perfectly on disk!")

if duplicates:
    print("ERROR - Duplicate images:", duplicates)
else:
    print("Zero duplicates! Every product has a 100% unique image.")

# Save to cms_products_db.json
with open("cms_products_db.json", "w", encoding="utf-8") as f:
    json.dump(products, f, ensure_ascii=False, indent=2)
print("Saved cms_products_db.json successfully!")

# Save to src/data/productionProductsSeed.ts
seed_ts = 'import type { ProductItem } from "./winhomeData";\n\nexport const PRODUCTION_PRODUCTS_SEED: ProductItem[] = ' + json.dumps(products, ensure_ascii=False, indent=2) + ';\n'
with open("src/data/productionProductsSeed.ts", "w", encoding="utf-8") as f:
    f.write(seed_ts)
print("Saved src/data/productionProductsSeed.ts successfully!")
