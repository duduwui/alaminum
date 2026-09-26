import React, { createContext, useContext, useState, useEffect } from 'react';
import { APP_TRANSLATIONS } from '../data/translationsData';
import { getCommonText } from '../data/commonTranslations';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  flagImage?: string;
  region: 'middle_east' | 'europe' | 'americas' | 'asia_global';
  regionLabel: string;
  country: string;
  popular?: boolean;
}

export const REGIONS = [
  { id: 'all', label: 'All Regions' },
  { id: 'middle_east', label: 'Middle East' },
  { id: 'europe', label: 'Europe' },
  { id: 'americas', label: 'Americas' },
  { id: 'asia_global', label: 'Asia & Global' }
] as const;

export const SUPPORTED_LANGUAGES: Language[] = [
  // 1. Middle East Region
  {
    code: 'ckb',
    name: 'Sorani',
    nativeName: 'سۆرانی',
    flag: '🏳️',
    flagImage: '/assets/flags/kurdish_flag.png',
    region: 'middle_east',
    regionLabel: 'Erbil / Sulaymaniyah / Duhok',
    country: 'Kurdistan',
    popular: true
  },
  {
    code: 'kmr',
    name: 'Kurmanji',
    nativeName: 'Kurmancî',
    flag: '🏳️',
    flagImage: '/assets/flags/kurdish_flag.png',
    region: 'middle_east',
    regionLabel: 'Duhok / Rojava / North',
    country: 'Kurdistan',
    popular: true
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'عربی',
    flag: '🇮🇶',
    region: 'middle_east',
    regionLabel: 'Iraq & Middle East',
    country: 'Iraq',
    popular: true
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    region: 'middle_east',
    regionLabel: 'Turkey',
    country: 'Turkey',
    popular: true
  },
  {
    code: 'fa',
    name: 'Irani',
    nativeName: 'فارسی',
    flag: '🇮🇷',
    region: 'middle_east',
    regionLabel: 'Iran',
    country: 'Iran',
    popular: true
  },

  // 2. Europe
  {
    code: 'en-GB',
    name: 'English (UK)',
    nativeName: 'English',
    flag: '🇬🇧',
    region: 'europe',
    regionLabel: 'United Kingdom',
    country: 'United Kingdom',
    popular: true
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    region: 'europe',
    regionLabel: 'Germany',
    country: 'Germany',
    popular: true
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    region: 'europe',
    regionLabel: 'France',
    country: 'France',
    popular: true
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    region: 'europe',
    regionLabel: 'Italy',
    country: 'Italy'
  },
  {
    code: 'el',
    name: 'Greek',
    nativeName: 'Ελληνικά',
    flag: '🇬🇷',
    region: 'europe',
    regionLabel: 'Greece',
    country: 'Greece'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    region: 'europe',
    regionLabel: 'Spain',
    country: 'Spain'
  },
  {
    code: 'ro',
    name: 'Romanian',
    nativeName: 'Română',
    flag: '🇷🇴',
    region: 'europe',
    regionLabel: 'Romania',
    country: 'Romania'
  },
  {
    code: 'bg',
    name: 'Bulgarian',
    nativeName: 'Български',
    flag: '🇧🇬',
    region: 'europe',
    regionLabel: 'Bulgaria',
    country: 'Bulgaria'
  },
  {
    code: 'sr',
    name: 'Serbian',
    nativeName: 'Srpski',
    flag: '🇷🇸',
    region: 'europe',
    regionLabel: 'Serbia',
    country: 'Serbia'
  },
  {
    code: 'bs',
    name: 'Bosnian',
    nativeName: 'Bosanski',
    flag: '🇧🇦',
    region: 'europe',
    regionLabel: 'Bosnia',
    country: 'Bosnia'
  },
  {
    code: 'hr',
    name: 'Croatian',
    nativeName: 'Hrvatski',
    flag: '🇭🇷',
    region: 'europe',
    regionLabel: 'Croatia',
    country: 'Croatia'
  },
  {
    code: 'sq',
    name: 'Albanian',
    nativeName: 'Shqip',
    flag: '🇦🇱',
    region: 'europe',
    regionLabel: 'Albania',
    country: 'Albania'
  },
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    region: 'europe',
    regionLabel: 'Netherlands',
    country: 'Netherlands'
  },
  {
    code: 'sv',
    name: 'Swedish',
    nativeName: 'Svenska',
    flag: '🇸🇪',
    region: 'europe',
    regionLabel: 'Sweden',
    country: 'Sweden'
  },
  {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    flag: '🇵🇱',
    region: 'europe',
    regionLabel: 'Poland',
    country: 'Poland'
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    region: 'europe',
    regionLabel: 'Portugal',
    country: 'Portugal'
  },

  // 3. Americas
  {
    code: 'en-US',
    name: 'English (US)',
    nativeName: 'English',
    flag: '🇺🇸',
    region: 'americas',
    regionLabel: 'United States',
    country: 'United States',
    popular: true
  },
  {
    code: 'es-MX',
    name: 'Spanish (LatAm)',
    nativeName: 'Español',
    flag: '🇲🇽',
    region: 'americas',
    regionLabel: 'Mexico',
    country: 'Mexico'
  },
  {
    code: 'pt-BR',
    name: 'Portuguese (BR)',
    nativeName: 'Português',
    flag: '🇧🇷',
    region: 'americas',
    regionLabel: 'Brazil',
    country: 'Brazil'
  },

  // 4. Asia & Global
  {
    code: 'zh-CN',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    region: 'asia_global',
    regionLabel: 'China',
    country: 'China',
    popular: true
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    region: 'asia_global',
    regionLabel: 'Russia',
    country: 'Russia'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    region: 'asia_global',
    regionLabel: 'India',
    country: 'India'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    region: 'asia_global',
    regionLabel: 'Japan',
    country: 'Japan'
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    region: 'asia_global',
    regionLabel: 'South Korea',
    country: 'South Korea'
  },
  {
    code: 'kk',
    name: 'Kazakh',
    nativeName: 'Қазақша',
    flag: '🇰🇿',
    region: 'asia_global',
    regionLabel: 'Kazakhstan',
    country: 'Kazakhstan'
  },
  {
    code: 'en',
    name: 'International',
    nativeName: 'Global (English)',
    flag: '🌐',
    region: 'asia_global',
    regionLabel: 'International',
    country: 'International',
    popular: true
  }
];

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    nav_home: 'Home',
    nav_products: 'Products',
    nav_solutions: 'Solutions',
    nav_typologies: 'Typologies',
    nav_projects: 'Projects',
    nav_why_winhome: 'Why Doorhome',
    nav_downloads: 'Downloads',
    nav_catalogs: 'Catalogs',
    nav_contact: 'Contact',
    nav_help_choose: 'Help me choose',
    nav_find_showroom: 'Find a showroom',
    nav_plan_project: 'Plan your project',
    nav_request_quote: 'Request a Quote',
    nav_my_account: 'My Account / Sign In',
    nav_search: 'Search',
    nav_cart: 'Quotation Cart',
    hero_title: 'Minimalist Panorama & German Engineering',
    hero_subtitle: 'Lorenzo 70LS & Alumil Panorama Sliding Systems',
    hero_explore: 'Explore System',
    hero_custom_quote: 'Request Custom Quotation',
    shop_all: 'All Systems',
    shop_aluminum: 'Thermal Aluminium',
    shop_upvc: 'uPVC 6-Chamber',
    shop_accessories: 'Hardware & Accessories',
    add_to_cart: 'Add to Request Cart',
    submit_request: 'Submit RFQ Request',
    address_line: 'Baghdad, Iraq • 33.3118611° N, 44.4608056° E',
    newsletter_title: 'Subscribe to Doorhome Technical Bulletins',
    newsletter_btn: 'Subscribe',
    footer_rights: 'Doorhome Company (Nafza Al-Manzl Holding). All rights reserved.',
    language_label: 'Language'
  },
  'en-GB': {
    nav_home: 'Home',
    nav_products: 'Products',
    nav_solutions: 'Solutions',
    nav_typologies: 'Typologies',
    nav_projects: 'Projects',
    nav_why_winhome: 'Why Doorhome',
    nav_downloads: 'Downloads',
    nav_catalogs: 'Catalogs',
    nav_contact: 'Contact',
    nav_help_choose: 'Help me choose',
    nav_find_showroom: 'Find a showroom',
    nav_plan_project: 'Plan your project',
    nav_request_quote: 'Request a Quote',
    nav_my_account: 'My Account / Sign In',
    nav_search: 'Search',
    nav_cart: 'Quotation Cart',
    hero_title: 'Minimalist Panorama & German Engineering',
    hero_subtitle: 'Lorenzo 70LS & Alumil Panorama Sliding Systems',
    hero_explore: 'Explore System',
    hero_custom_quote: 'Request Custom Quotation',
    shop_all: 'All Systems',
    shop_aluminum: 'Thermal Aluminium',
    shop_upvc: 'uPVC 6-Chamber',
    shop_accessories: 'Hardware & Accessories',
    add_to_cart: 'Add to Request Cart',
    submit_request: 'Submit RFQ Request',
    address_line: 'Baghdad, Iraq • 33.3118611° N, 44.4608056° E',
    newsletter_title: 'Subscribe to Doorhome Technical Bulletins',
    newsletter_btn: 'Subscribe',
    footer_rights: 'Doorhome Company (Nafza Al-Manzl Holding). All rights reserved.',
    language_label: 'Language'
  },
  'en-US': {
    nav_home: 'Home',
    nav_products: 'Products',
    nav_solutions: 'Solutions',
    nav_typologies: 'Typologies',
    nav_projects: 'Projects',
    nav_why_winhome: 'Why Doorhome',
    nav_downloads: 'Downloads',
    nav_catalogs: 'Catalogs',
    nav_contact: 'Contact',
    nav_help_choose: 'Help me choose',
    nav_find_showroom: 'Find a showroom',
    nav_plan_project: 'Plan your project',
    nav_request_quote: 'Request a Quote',
    nav_my_account: 'My Account / Sign In',
    nav_search: 'Search',
    nav_cart: 'Quotation Cart',
    hero_title: 'Minimalist Panorama & Precision Engineering',
    hero_subtitle: 'Lorenzo 70LS & Alumil Panorama Sliding Systems',
    hero_explore: 'Explore System',
    hero_custom_quote: 'Request Custom Quotation',
    shop_all: 'All Systems',
    shop_aluminum: 'Thermal Aluminum',
    shop_upvc: 'uPVC 6-Chamber',
    shop_accessories: 'Hardware & Accessories',
    add_to_cart: 'Add to Request Cart',
    submit_request: 'Submit RFQ Request',
    address_line: 'Baghdad, Iraq • 33.3118611° N, 44.4608056° E',
    newsletter_title: 'Subscribe to Doorhome Technical Bulletins',
    newsletter_btn: 'Subscribe',
    footer_rights: 'Doorhome Company (Nafza Al-Manzl Holding). All rights reserved.',
    language_label: 'Language'
  },
  ckb: {
    nav_home: 'سەرەتا',
    nav_products: 'بەرهەمەکان',
    nav_solutions: 'چارەسەرە تەلارسازییەکان',
    nav_typologies: 'جۆرەکانی باڵەخانە',
    nav_projects: 'پڕۆژەکان',
    nav_why_winhome: 'بۆچی دۆرهۆم',
    nav_downloads: 'داگرتنەکان',
    nav_catalogs: 'کەتەلۆگەکان',
    nav_contact: 'پەیوەندی',
    nav_help_choose: 'ڕێبەری هەڵبژاردن',
    nav_find_showroom: 'پێشانگاکانمان',
    nav_plan_project: 'پڕۆژەکەت دابڕێژە',
    nav_request_quote: 'داواکاری نرخی تایبەت',
    nav_my_account: 'هەژماری من / چوونەژوورەوە',
    nav_search: 'گەڕان',
    nav_cart: 'سەبەتەی داواکاری',
    hero_title: 'ئەندازیاری ئەڵمانی و پەنجەرەی پانۆراما',
    hero_subtitle: 'سیستەمی سلایدینگی لۆرێنزۆ ٧٠ و ئەلومیل',
    hero_explore: 'بەرهەمەکە بپشکنە',
    hero_custom_quote: 'داواکاری نەخشە و خەمڵاندن',
    shop_all: 'هەموو سیستەمەکان',
    shop_aluminum: 'ئەلۆمنیۆمی عەزل',
    shop_upvc: 'یو پی ڤی سی ٦-خانە',
    shop_accessories: 'ئێکسسوارات و قوفڵی ئیتاڵی',
    add_to_cart: 'زیادکردن بۆ داواکاری',
    submit_request: 'ناردنی داواکاری نرخ',
    address_line: 'بەغدا، عێراق • 33.3118611° N, 44.4608056° E',
    newsletter_title: 'بەشداری لە گۆڤاری ئەندازیاری دۆرهۆم بکە',
    newsletter_btn: 'بەشداربوون',
    footer_rights: 'کۆمپانیای دۆرهۆم (گروپی نەفزە المنزڵ). هەموو مافەکان پارێزراون.',
    language_label: 'زمان'
  },
  kmr: {
    nav_home: 'Destpêk',
    nav_products: 'Berhem',
    nav_solutions: 'Çareseriyên Mîmarî',
    nav_typologies: 'Cureyên Avahiyan',
    nav_projects: 'Projeyên Me',
    nav_why_winhome: 'Çima Doorhome',
    nav_downloads: 'Daxistin',
    nav_catalogs: 'Katalog',
    nav_contact: 'Têkilî',
    nav_help_choose: 'Alîkariya Hilbijartinê',
    nav_find_showroom: 'Pêşangehan Bibîne',
    nav_plan_project: 'Projeya Xwe Plan Bike',
    nav_request_quote: 'Daxwaza Bihayê',
    nav_my_account: 'Hesabê Min / Têketin',
    nav_search: 'Lêgerîn',
    nav_cart: 'Selika Daxwazê',
    hero_title: 'Mîmariya Minimalîst û Endezyariya Almanî',
    hero_subtitle: 'Pergalên Xilskî yên Lorenzo 70LS & Alumil',
    hero_explore: 'Pergalê Bibîne',
    hero_custom_quote: 'Daxwaza Nirxandina Taybet',
    shop_all: 'Hemû Pergal',
    shop_aluminum: 'Alumînyûma Germî',
    shop_upvc: 'uPVC 6-Ode',
    shop_accessories: 'Hêman û Qifilên Îtalî',
    add_to_cart: 'Têxe Selika Daxwazê',
    submit_request: 'Daxwazê Bişîne',
    address_line: 'Bexda, Iraq • 33.3118611° N, 44.4608056° E',
    newsletter_title: 'Aboneyê Bultena Teknîkî ya Doorhome Bibe',
    newsletter_btn: 'Abonetî',
    footer_rights: 'Pargîdaniya Doorhome (Koma Nafza Al-Manzl). Hemû maf parastî ne.',
    language_label: 'Ziman'
  },
  ar: {
    nav_home: 'الرئيسية',
    nav_products: 'المنتجات',
    nav_solutions: 'الحلول المعمارية',
    nav_typologies: 'نماذج المباني',
    nav_projects: 'المشاريع',
    nav_why_winhome: 'لماذا دور هوم',
    nav_downloads: 'التحميلات',
    nav_catalogs: 'الكتالوجات',
    nav_contact: 'اتصل بنا',
    nav_help_choose: 'ساعدني في الاختيار',
    nav_find_showroom: 'فروع المعارض',
    nav_plan_project: 'خطط لمشروعك',
    nav_request_quote: 'طلب عرض سعر',
    nav_my_account: 'حسابي / تسجيل الدخول',
    nav_search: 'بحث',
    nav_cart: 'سلة طلبات التسعير',
    hero_title: 'بانوراما معمارية وهندسة ألمانية فائقة',
    hero_subtitle: 'أنظمة لورينزو 70LS وألوميل للسحب الحراري',
    hero_explore: 'استكشف النظام',
    hero_custom_quote: 'طلب تسعير مخصص',
    shop_all: 'جميع الأنظمة',
    shop_aluminum: 'ألمنيوم عازل للحرارة',
    shop_upvc: 'يو بي في سي 6-حجرات',
    shop_accessories: 'إكسسوارات ومقابض أوروبية',
    add_to_cart: 'إضافة إلى طلب السعر',
    submit_request: 'إرسال طلب التسعير',
    address_line: 'بغداد، العراق • 33.3118611° N, 44.4608056° E',
    newsletter_title: 'اشترك في النشرة الهندسية لدور هوم',
    newsletter_btn: 'اشتراك',
    footer_rights: 'شركة دور هوم (مجموعة نفذة المنزل). جميع الحقوق محفوظة.',
    language_label: 'اللغة'
  },
  tr: {
    nav_home: 'Ana Sayfa',
    nav_products: 'Ürünler',
    nav_solutions: 'Çözümler',
    nav_typologies: 'Bina Tipolojileri',
    nav_projects: 'Projeler',
    nav_why_winhome: 'Neden Doorhome',
    nav_downloads: 'İndirmeler',
    nav_catalogs: 'Kataloglar',
    nav_contact: 'İletişim',
    nav_help_choose: 'Seçimime yardım et',
    nav_find_showroom: 'Showroom Bul',
    nav_plan_project: 'Projeyi Planla',
    nav_request_quote: 'Fiyat Teklifi Al',
    nav_my_account: 'Hesabım / Giriş Yap',
    nav_search: 'Ara',
    nav_cart: 'Teklif Sepeti',
    hero_title: 'Minimalist Panorama ve Alman Mühendisliği',
    hero_subtitle: 'Lorenzo 70LS & Alumil Panorama Sürme Sistemleri',
    hero_explore: 'Sistemi Keşfet',
    hero_custom_quote: 'Özel Teklif İste',
    shop_all: 'Tüm Sistemler',
    shop_aluminum: 'Isı Yalıtımlı Alüminyum',
    shop_upvc: 'uPVC 6 Odacıklı Profil',
    shop_accessories: 'Donanım ve Aksesuarlar',
    add_to_cart: 'Teklif Sepetine Ekle',
    submit_request: 'Teklif Talebini Gönder',
    address_line: 'Bağdat, Irak • 33.3118611° N, 44.4608056° E',
    newsletter_title: 'Doorhome Teknik Bültenine Abone Olun',
    newsletter_btn: 'Abone Ol',
    footer_rights: 'Doorhome Şirketi (Nafza Al-Manzl Holding). Tüm hakları saklıdır.',
    language_label: 'Dil'
  },
  de: {
    nav_home: 'Startseite',
    nav_products: 'Produkte',
    nav_solutions: 'Lösungen',
    nav_typologies: 'Gebäudetypologien',
    nav_projects: 'Projekte',
    nav_why_winhome: 'Über Doorhome',
    nav_downloads: 'Downloads',
    nav_catalogs: 'Kataloge',
    nav_contact: 'Kontakt',
    nav_help_choose: 'Systemberater',
    nav_find_showroom: 'Showroom finden',
    nav_plan_project: 'Projekt planen',
    nav_request_quote: 'Angebot anfordern',
    nav_my_account: 'Mein Konto / Anmelden',
    nav_search: 'Suchen',
    nav_cart: 'Anfragekorb',
    hero_title: 'Minimalistisches Panorama & Deutsche Ingenieurskunst',
    hero_subtitle: 'Lorenzo 70LS & Alumil Panorama Schiebesysteme',
    hero_explore: 'System entdecken',
    hero_custom_quote: 'Individuelles Angebot',
    shop_all: 'Alle Systeme',
    shop_aluminum: 'Thermisch getrenntes Aluminium',
    shop_upvc: 'uPVC 6-Kammer-Profile',
    shop_accessories: 'Beschläge & Zubehör',
    add_to_cart: 'Zum Anfragekorb hinzufügen',
    submit_request: 'Anfrage absenden',
    address_line: 'Bagdad, Irak • 33.3118611° N, 44.4608056° E',
    newsletter_title: 'Doorhome Technische Bulletins abonnieren',
    newsletter_btn: 'Abonnieren',
    footer_rights: 'Doorhome Company (Nafza Al-Manzl Holding). Alle Rechte vorbehalten.',
    language_label: 'Sprache'
  },
  fr: {
    nav_home: 'Accueil',
    nav_products: 'Produits',
    nav_solutions: 'Solutions',
    nav_typologies: 'Typologies',
    nav_projects: 'Projets',
    nav_why_winhome: 'Pourquoi Doorhome',
    nav_downloads: 'Téléchargements',
    nav_catalogs: 'Catalogues',
    nav_contact: 'Contact',
    nav_help_choose: 'Guide de choix',
    nav_find_showroom: 'Trouver un showroom',
    nav_plan_project: 'Planifiez votre projet',
    nav_request_quote: 'Demander un devis',
    nav_my_account: 'Mon Compte / Connexion',
    nav_search: 'Recherche',
    nav_cart: 'Panier de devis',
    hero_title: 'Panorama Minimaliste et Ingénierie de Précision',
    hero_subtitle: 'Systèmes Coulissants Lorenzo 70LS & Alumil',
    hero_explore: 'Explorer le système',
    hero_custom_quote: 'Demander un devis sur mesure',
    shop_all: 'Tous les systèmes',
    shop_aluminum: 'Aluminium à rupture thermique',
    shop_upvc: 'uPVC 6 chambres',
    shop_accessories: 'Ferrures et accessoires',
    add_to_cart: 'Ajouter à la demande',
    submit_request: 'Envoyer la demande',
    address_line: 'Bagdad, Irak • 33.3118611° N, 44.4608056° E',
    newsletter_title: 'Abonnez-vous aux bulletins techniques Doorhome',
    newsletter_btn: "S'abonner",
    footer_rights: 'Société Doorhome (Holding Nafza Al-Manzl). Tous droits réservés.',
    language_label: 'Langue'
  },
  it: {
    nav_home: 'Home',
    nav_products: 'Prodotti',
    nav_solutions: 'Soluzioni',
    nav_typologies: 'Tipologie Edilizie',
    nav_projects: 'Progetti',
    nav_why_winhome: 'Perché Doorhome',
    nav_downloads: 'Download',
    nav_catalogs: 'Cataloghi',
    nav_contact: 'Contatto',
    nav_help_choose: 'Aiutami a scegliere',
    nav_find_showroom: 'Trova showroom',
    nav_plan_project: 'Pianifica il tuo progetto',
    nav_request_quote: 'Richiedi Preventivo',
    nav_my_account: 'Il mio account / Accedi',
    nav_search: 'Cerca',
    nav_cart: 'Carrello Richieste',
    hero_title: 'Panorama Minimalista & Ingegneria di Precisione',
    hero_subtitle: 'Sistemi Scorrevoli Termici Lorenzo 70LS & Alumil',
    hero_explore: 'Esplora il sistema',
    hero_custom_quote: 'Richiedi preventivo su misura',
    shop_all: 'Tutti i sistemi',
    shop_aluminum: 'Alluminio a taglio termico',
    shop_upvc: 'uPVC a 6 camere',
    shop_accessories: 'Ferramenta e Accessori',
    add_to_cart: 'Aggiungi alla richiesta',
    submit_request: 'Invia richiesta preventivo',
    address_line: 'Baghdad, Iraq • 33.3118611° N, 44.4608056° E',
    newsletter_title: 'Iscriviti ai bollettini tecnici Doorhome',
    newsletter_btn: 'Iscriviti',
    footer_rights: 'Doorhome Company (Nafza Al-Manzl Holding). Tutti i diritti riservati.',
    language_label: 'Lingua'
  },
  el: {
    nav_home: 'Αρχική',
    nav_products: 'Προϊόντα',
    nav_solutions: 'Λύσεις',
    nav_typologies: 'Τυπολογίες',
    nav_projects: 'Έργα',
    nav_why_winhome: 'Γιατί Doorhome',
    nav_downloads: 'Λήψεις',
    nav_catalogs: 'Κατάλογοι',
    nav_contact: 'Επικοινωνία',
    nav_help_choose: 'Οδηγός επιλογής',
    nav_find_showroom: 'Εκθέσεις',
    nav_plan_project: 'Σχεδιάστε το έργο σας',
    nav_request_quote: 'Ζητήστε Προσφορά',
    nav_my_account: 'Ο Λογαριασμός μου / Σύνδεση',
    nav_search: 'Αναζήτηση',
    nav_cart: 'Καλάθι Προσφοράς',
    hero_title: 'Μινιμαλιστικό Πανόραμα & Γερμανική Μηχανική',
    hero_subtitle: 'Συρόμενα Συστήματα Lorenzo 70LS & Alumil',
    hero_explore: 'Εξερευνήστε το Σύστημα',
    hero_custom_quote: 'Ζητήστε Εξατομικευμένη Προσφορά',
    shop_all: 'Όλα τα Συστήματα',
    shop_aluminum: 'Θερμοδιακοπτόμενο Αλουμίνιο',
    shop_upvc: 'uPVC 6 Θαλάμων',
    shop_accessories: 'Εξαρτήματα & Μηχανισμοί',
    add_to_cart: 'Προσθήκη στο Καλάθι',
    submit_request: 'Υποβολή Αιτήματος',
    address_line: 'Βαγδάτη, Ιράκ • 33.3118611° N, 44.4608056° E',
    newsletter_title: 'Εγγραφείτε στα Τεχνικά Δελτία της Doorhome',
    newsletter_btn: 'Εγγραφή',
    footer_rights: 'Εταιρεία Doorhome (Nafza Al-Manzl Holding). Με την επιφύλαξη παντός δικαιώματος.',
    language_label: 'Γλώσσα'
  },
  es: {
    nav_home: 'Inicio',
    nav_products: 'Productos',
    nav_solutions: 'Soluciones',
    nav_typologies: 'Tipologías de Edificios',
    nav_projects: 'Proyectos',
    nav_why_winhome: 'Por qué Doorhome',
    nav_downloads: 'Descargas',
    nav_catalogs: 'Catálogos',
    nav_contact: 'Contacto',
    nav_help_choose: 'Ayúdame a elegir',
    nav_find_showroom: 'Encontrar showroom',
    nav_plan_project: 'Planifica tu proyecto',
    nav_request_quote: 'Solicitar Presupuesto',
    nav_my_account: 'Mi Cuenta / Acceder',
    nav_search: 'Buscar',
    nav_cart: 'Carrito de Cotización',
    hero_title: 'Panorama Minimalista e Ingeniería Alemana',
    hero_subtitle: 'Sistemas Correderos Térmicos Lorenzo 70LS & Alumil',
    hero_explore: 'Explorar Sistema',
    hero_custom_quote: 'Solicitar Cotización',
    shop_all: 'Todos los Sistemas',
    shop_aluminum: 'Aluminio con Rotura de Puente Térmico',
    shop_upvc: 'uPVC 6 Cámaras',
    shop_accessories: 'Herrajes y Accesorios',
    add_to_cart: 'Añadir a la Solicitud',
    submit_request: 'Enviar Solicitud',
    address_line: 'Bagdad, Irak • 33.3118611° N, 44.4608056° E',
    newsletter_title: 'Suscríbete a los boletines técnicos de Doorhome',
    newsletter_btn: 'Suscribirse',
    footer_rights: 'Compañía Doorhome (Nafza Al-Manzl Holding). Todos los derechos reservados.',
    language_label: 'Idioma'
  },
  fa: {
    nav_home: 'صفحه اصلی',
    nav_products: 'محصولات',
    nav_solutions: 'راهکارهای معماری',
    nav_typologies: 'گونه‌شناسی ساختمان',
    nav_projects: 'پروژه‌ها',
    nav_why_winhome: 'چرا دور هوم',
    nav_downloads: 'دانلودها',
    nav_catalogs: 'کاتالوگ‌ها',
    nav_contact: 'تماس با ما',
    nav_help_choose: 'راهنمای انتخاب سیستم',
    nav_find_showroom: 'یافتن نمایشگاه',
    nav_plan_project: 'برنامه‌ریزی پروژه شما',
    nav_request_quote: 'درخواست پیش‌فاکتور',
    nav_my_account: 'حساب کاربری / ورود',
    nav_search: 'جستجو',
    nav_cart: 'سبد استعلام قیمت',
    hero_title: 'پانورامای مینیمال و مهندسی دقیق آلمانی',
    hero_subtitle: 'سیستم‌های کشویی لورنزو 70LS و آلومیل',
    hero_explore: 'بررسی سیستم',
    hero_custom_quote: 'درخواست قیمت سفارشی',
    shop_all: 'تمام سیستم‌ها',
    shop_aluminum: 'آلومینیوم ترمال بریک',
    shop_upvc: 'یو پی وی سی ۶ حفره‌ای',
    shop_accessories: 'یراق‌آلات و اتصالات اروپایی',
    add_to_cart: 'افزودن به سبد استعلام',
    submit_request: 'ارسال درخواست استعلام',
    address_line: 'بغداد، عراق • 33.3118611° N, 44.4608056° E',
    newsletter_title: 'عضویت در خبرنامه تخصصی وین‌هوم',
    newsletter_btn: 'عضویت',
    footer_rights: 'شرکت وین‌هوم (هلدینگ نفذة المنزل). تمامی حقوق محفوظ است.',
    language_label: 'زبان'
  },
  ru: {
    nav_home: 'Главная',
    nav_products: 'Продукция',
    nav_solutions: 'Решения',
    nav_typologies: 'Типологии зданий',
    nav_projects: 'Проекты',
    nav_why_winhome: 'Почему Doorhome',
    nav_downloads: 'Загрузки',
    nav_catalogs: 'Каталоги',
    nav_contact: 'Контакты',
    nav_help_choose: 'Помощь в выборе',
    nav_find_showroom: 'Найти шоурум',
    nav_plan_project: 'Спланировать проект',
    nav_request_quote: 'Запросить расчет',
    nav_my_account: 'Личный кабинет / Вход',
    nav_search: 'Поиск',
    nav_cart: 'Корзина запросов',
    hero_title: 'Минималистичные панорамы и немецкая инженерия',
    hero_subtitle: 'Раздвижные термосистемы Lorenzo 70LS и Alumil',
    hero_explore: 'Изучить систему',
    hero_custom_quote: 'Индивидуальный расчет',
    shop_all: 'Все системы',
    shop_aluminum: 'Теплый алюминий',
    shop_upvc: 'uPVC 6-камерные профили',
    shop_accessories: 'Фурнитура и комплектующие',
    add_to_cart: 'Добавить в заявку',
    submit_request: 'Отправить запрос',
    address_line: 'Багдад, Ирак • 33.3118611° N, 44.4608056° E',
    newsletter_title: 'Подпишитесь на бюллетени Doorhome',
    newsletter_btn: 'Подписаться',
    footer_rights: 'Компания Doorhome (Nafza Al-Manzl Holding). Все права защищены.',
    language_label: 'Язык'
  },
  'zh-CN': {
    nav_home: '首页',
    nav_products: '产品系列',
    nav_solutions: '建筑方案',
    nav_typologies: '建筑类型',
    nav_projects: '工程案例',
    nav_why_winhome: '为何选择Doorhome',
    nav_downloads: '资料下载',
    nav_catalogs: '产品手册',
    nav_contact: '联系我们',
    nav_help_choose: '选型指南',
    nav_find_showroom: '查找展厅',
    nav_plan_project: '规划您的项目',
    nav_request_quote: '获取报价',
    nav_my_account: '我的账户 / 登录',
    nav_search: '搜索',
    nav_cart: '询价清单',
    hero_title: '极简全景视野与精密德国工程',
    hero_subtitle: 'Lorenzo 70LS 与 Alumil 全景推拉门窗系统',
    hero_explore: '探索系统',
    hero_custom_quote: '获取定制报价',
    shop_all: '所有系统',
    shop_aluminum: '隔热断桥铝合金系统',
    shop_upvc: 'uPVC 6腔体被动房型材',
    shop_accessories: '五金配件与锁闭系统',
    add_to_cart: '加入询价清单',
    submit_request: '提交询价申请',
    address_line: '伊拉克巴格达 • 33.3118611° N, 44.4608056° E',
    newsletter_title: '订阅Doorhome建筑技术通讯',
    newsletter_btn: '立即订阅',
    footer_rights: 'Doorhome 公司 (Nafza Al-Manzl 控股). 版权所有.',
    language_label: '语言'
  }
};

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
  isRtl: boolean;
  supportedLanguages: Language[];
  isTranslating: boolean;
  targetLanguage: Language | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCode, setCurrentCode] = useState<string>(() => {
    try {
      const urlLang = new URLSearchParams(window.location.search).get('lang');
      if (urlLang && SUPPORTED_LANGUAGES.some((l) => l.code === urlLang)) {
        return urlLang;
      }
      const saved = localStorage.getItem('winhome_language');
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    return 'ar';
  });

  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [targetLanguage, setTargetLanguage] = useState<Language | null>(null);

  const currentLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentCode) || SUPPORTED_LANGUAGES[0];

  // User explicitly asked to DISABLE RTL:
  // "also disable rtl make even arabic or any ither languages be as english tet postion no shfting to right"
  // Keep LTR orientation always!
  const isRtl = false;

  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = currentLanguage.code;
    try {
      localStorage.setItem('winhome_language', currentLanguage.code);
    } catch (e) {
      // ignore
    }
  }, [currentLanguage]);

  // Clear any existing Google Translate cookies to ensure pure, authentic React localization
  useEffect(() => {
    try {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${window.location.hostname}; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
    } catch (e) {
      // ignore
    }
  }, []);

  const setLanguage = (code: string) => {
    const found = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    if (found) {
      setTargetLanguage(found);
      setIsTranslating(true);
      setCurrentCode(found.code);

      setTimeout(() => {
        setIsTranslating(false);
      }, 200);
    }
  };

  const t = (key: string): string => {
    const common = getCommonText(currentLanguage.code, key);
    if (common) return common;
    if (key === 'working_hours_compact' || key === 'footer_working_hours_time') {
      try {
        const formatter = new Intl.DateTimeFormat(currentLanguage.code, { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' });
        return `${formatter.format(new Date('2026-01-01T09:00:00Z'))} – ${formatter.format(new Date('2026-01-01T18:00:00Z'))}`;
      } catch { return '9:00 AM – 6:00 PM'; }
    }
    const baseCode = currentLanguage.code.split('-')[0];
    const appDict =
      APP_TRANSLATIONS[currentLanguage.code] ||
      APP_TRANSLATIONS[baseCode] ||
      APP_TRANSLATIONS.en;

    if (appDict && appDict[key]) {
      return appDict[key];
    }

    const legacyDict =
      TRANSLATIONS[currentLanguage.code] ||
      TRANSLATIONS[baseCode] ||
      TRANSLATIONS.en;

    if (legacyDict && legacyDict[key]) {
      return legacyDict[key];
    }
    // Fallback to English dictionary
    if (APP_TRANSLATIONS.en && APP_TRANSLATIONS.en[key]) {
      return APP_TRANSLATIONS.en[key];
    }
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        isRtl,
        supportedLanguages: SUPPORTED_LANGUAGES,
        isTranslating,
        targetLanguage
      }}
    >
      {/* Hidden container for Google Translate Widget */}
      <div id="google_translate_element" style={{ display: 'none' }} />
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
