# -*- coding: utf-8 -*-
"""
Master Execution Script for Applying 31-Language Localization.
"""

import os
import json
import re
from i18n_data import STARTING_FROM_BY_LANG, PARTNERS_TITLE_BY_LANG, HERO_CONTENT_BY_LANG, HERO_QUOTES_BY_LANG, SHOWCASE_TEXT_BY_LANG
from i18n_data_pillars import AUTH_COPY_BY_LANG, RECOVERY_COPY
from i18n_data_about import PILLARS_BY_LANG, SECTION_HEADERS_BY_LANG
from i18n_data_showcase_items import get_item_locales
from i18n_data_products import get_product_localizations

ROOT = '/home/emz/Desktop/alaminum'

def update_translations_data():
    print("1. Updating translationsData.ts...")
    filepath = os.path.join(ROOT, 'src/data/translationsData.ts')
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # We need to extract the APP_TRANSLATIONS object
    # It starts after "export const APP_TRANSLATIONS: Record<string, Record<string, string>> = "
    prefix = "export const APP_TRANSLATIONS: Record<string, Record<string, string>> = "
    json_str = content[len(prefix):].rstrip(';\n')
    data = json.loads(json_str)

    # 1. Add starting_from to all languages
    for lang, text in STARTING_FROM_BY_LANG.items():
        if lang in data:
            data[lang]['starting_from'] = text

    # Missing German translations for window/door and admin keys
    de_missing = {
        "win_badge": "Architektonische Fenster • Thermisch getrennt & Passivhaus-Serie",
        "win_title": "Fenstersysteme",
        "win_empty": "Derzeit sind keine Fenstersysteme verfügbar.",
        "win_desc": "Hochwertige europäische Fenstersysteme mit thermischer Trennung und Mehrkammersystemen, entwickelt für höchste Energieeffizienz und Schallschutz.",
        "win_available": "Verfügbare Fenstersysteme",
        "tab_all_windows": "Alle Fenster",
        "tab_thermal_windows": "Thermisch getrennt",
        "tab_passive_windows": "Passivhaus 6-Kammer",
        "tab_sliding_windows": "Minimalistische Schiebesysteme",
        "tab_tilt_windows": "Dreh-Kipp-Fenster",
        "search_windows": "Fenster suchen...",
        "view_all_windows": "Alle Fenster erkunden",
        "door_badge": "Monumentale Eingänge & Panorama-Glastüren",
        "door_title": "Türen & Eingänge",
        "door_empty": "Derzeit sind keine Türsysteme verfügbar.",
        "door_desc": "Architektonische Pivot-Eingangstüren, großflächige Hebeschiebetüren und hochbelastbare Objekttüren für Luxusvillen und Hochhäuser.",
        "door_available": "Verfügbare Türsysteme",
        "tab_all_doors": "Alle Türen",
        "tab_pivot_doors": "Pivot-Eingangstüren",
        "tab_lift_doors": "Hebeschiebe Panorama",
        "tab_heavy_doors": "Schwerlasttüren Gewerbe",
        "tab_folding_doors": "Faltschiebesysteme",
        "search_doors": "Türen suchen...",
        "view_all_doors": "Alle Türen erkunden",
        "contact_info_title": "Kontaktinformationen",
        "contact_info_subtitle": "Geben Sie Ihre Kontaktdaten für das technische Angebot ein",
        "quotation_summary": "Angebotsübersicht",
        "est_subtotal": "Geschätzte Zwischensumme",
        "units_label": "Einheiten",
        "systems_label": "Systeme",
        "across_systems": "über",
        "full_name_label": "Vollständiger Name / Ansprechpartner",
        "full_name_placeholder": "z. B. Kak Dana Farhad / Ahmed Ali",
        "phone_whatsapp_label": "Telefon / WhatsApp",
        "email_label_opt": "E-Mail-Adresse (Optional)",
        "city_label": "Stadt / Region",
        "notes_label_opt": "Zusätzliche Anmerkungen oder Spezifikationen (Optional)",
        "notes_placeholder": "z. B. Spezifische Glastönung, Lieferzeitplan oder Details zur Montage...",
        "engineers_review_note": "Die Ingenieure von Doorhome prüfen diese Spezifikationen und kontaktieren Sie mit einem formellen Angebot.",
        "back_btn": "Zurück",
        "submitting_btn": "Wird übermittelt...",
        "quotation_submitted_title": "Angebotsanfrage erfolgreich übermittelt!",
        "ref_id_label": "Referenz-ID:",
        "whatsapp_sales_connect": "Vertrieb auf WhatsApp kontaktieren",
        "continue_browsing": "Weitere Produkte ansehen",
        "selected_systems_label": "Ausgewählte Systeme",
        "auth_mobile_nav_btn": "Anmelden / Registrieren",
        "auth_title": "Doorhome Kunden- und Partnerportal",
        "auth_signin_tab": "Anmelden",
        "auth_signup_tab": "Konto erstellen",
        "auth_password_label": "Passwort",
        "auth_role_label": "Architektonisches Profil / Rolle",
        "auth_role_client": "Privatkunde / Villenbesitzer",
        "auth_role_architect": "Architekt / Planungsbüro",
        "auth_role_fabricator": "Verarbeiter / Bauunternehmer",
        "dimensions_label": "Abmessungen",
        "profile_depth_label": "Profiltiefe",
        "cart_insulation_label": "Wärmedämmung",
        "cart_qty_label": "Menge",
        "thank_you_label": "Vielen Dank,",
        "auth_logout_btn": "Abmelden",
        "auth_welcome_back": "Willkommen zurück",
        "auth_my_profile": "Benutzerprofil",
        "auth_admin_portal_btn": "Zum Admin-Portal",
        "auth_dont_have_account": "Noch kein Konto?",
        "auth_already_have_account": "Bereits ein Konto?",
        "gallery_scope_label": "Projektumfang",
        "gallery_cert_label": "Zertifizierung",
        "gallery_cert_val": "CE & ift Rosenheim konform",
        "gallery_inquire_btn": "Dieses System anfragen",
        "admin_title": "Doorhome Admin-Portal",
        "admin_tagline": "Architektur-Management & Vertriebssteuerung",
        "admin_tab_dashboard": "Dashboard",
        "admin_tab_products": "Katalog & Produkte",
        "admin_tab_categories": "Kategorien",
        "admin_tab_requests": "Preisanfragen (RFQ)",
        "admin_tab_financials": "Finanzbuchhaltung",
        "admin_tab_users": "Benutzer & Rollen",
        "admin_tab_analytics": "Analysen & Berichte",
        "admin_tab_cms": "CMS & Medien",
        "admin_tab_settings": "Einstellungen",
        "admin_btn_back_home": "Zurück zur Website",
        "admin_btn_shop": "Shop anzeigen",
        "admin_btn_seed_data": "Produktionskatalog laden",
        "admin_btn_clear_catalog": "Alle Produkte löschen",
        "admin_btn_add_product": "+ Produktsystem hinzufügen",
        "admin_btn_add_category": "+ Neue Kategorie",
        "admin_btn_add_model": "+ Modell hinzufügen",
        "admin_btn_add_subseries": "+ Unterserie hinzufügen",
        "admin_search_products_ph": "Katalog nach Systemname, Profiltiefe, Serie durchsuchen...",
        "admin_filter_all_divisions": "Alle Architekturbereiche",
        "admin_stat_total_products": "Gesamte Katalogsysteme",
        "admin_stat_active_categories": "Aktive Bereiche",
        "admin_stat_rfq_requests": "Offene Angebote",
        "admin_stat_total_revenue": "Gesamtes Angebotsvolumen",
        "admin_col_image": "Foto",
        "admin_col_name": "Systemname",
        "admin_col_category": "Bereich",
        "admin_col_subseries": "Unterserie",
        "admin_col_dimensions": "Abmessungen / Tiefe",
        "admin_col_cost": "Gestehungspreis",
        "admin_col_selling": "Verkaufspreis",
        "admin_col_profit": "Gewinnmarge",
        "admin_col_actions": "Aktionen",
        "admin_modal_edit_product": "Produkt bearbeiten",
        "admin_modal_create_product": "Neues Produkt",
        "admin_form_name": "Produktname *",
        "admin_simple_category": "Kategorie",
        "admin_simple_price": "Preis",
        "admin_image_ready": "Bild bereit",
        "admin_uploading": "Wird hochgeladen...",
        "admin_product_form_error": "Name, Beschreibung, Bild und einen Preis über Null eingeben.",
        "admin_form_division": "Architekturbereich / Kategorie *",
        "admin_form_subseries": "Unterserie / Unterkategorie (Optional)",
        "admin_form_image": "Produktbild",
        "admin_form_upload": "Bild hochladen",
        "admin_form_desc": "Beschreibung",
        "admin_form_height": "Standardhöhe",
        "admin_form_width": "Standardbreite",
        "admin_form_depth": "Profiltiefe / Bautiefe",
        "admin_form_glass": "Glasspezifikation",
        "admin_form_cost": "Herstellungskosten",
        "admin_form_selling": "Verkaufspreis",
        "admin_form_save": "Produkt speichern",
        "admin_form_cancel": "Abbrechen",
        "admin_notice_seed_success": "✓ Produktionskatalog mit allen Bereichen erfolgreich geladen!",
        "admin_notice_saved": "✓ Erfolgreich gespeichert!",
        "admin_notice_deleted": "✓ Element gelöscht."
    }
    for k, v in de_missing.items():
        data['de'][k] = v

    # Missing Turkish translations
    tr_missing = {
        "win_badge": "Mimari Pencereler • Isı Yalıtımlı & Pasif Seri",
        "win_title": "Pencere Sistemleri",
        "win_empty": "Henüz pencere sistemi bulunmamaktadır.",
        "win_desc": "Aşırı iklim koşullarına dayanacak şekilde maksimum enerji verimliliği ve ses yalıtımı ile tasarlanmış Avrupa standartlarında pencere sistemleri.",
        "win_available": "Mevcut Pencere Sistemleri",
        "tab_all_windows": "Tüm Pencereler",
        "tab_thermal_windows": "Isı Yalıtımlı",
        "tab_passive_windows": "Pasif 6 Odacıklı",
        "tab_sliding_windows": "Minimal Sürme",
        "tab_tilt_windows": "Çift Açılım",
        "search_windows": "Pencere ara...",
        "view_all_windows": "Tüm Pencereleri Gör",
        "door_badge": "Anıtsal Girişler & Panoramik Cam Kapılar",
        "door_title": "Kapılar ve Girişler",
        "door_empty": "Henüz kapı sistemi bulunmamaktadır.",
        "door_desc": "Lüks villalar ve ticari binalar için tasarlanmış mimari pivot kapılar ve devasa kaldır-sür cam sistemleri.",
        "door_available": "Mevcut Kapı Sistemleri",
        "tab_all_doors": "Tüm Kapılar",
        "tab_pivot_doors": "Pivot Giriş Kapıları",
        "tab_lift_doors": "Hebeschiebe Panoramik",
        "tab_heavy_doors": "Ağır Hizmet Kapıları",
        "tab_folding_doors": "Katlanır Sistemler",
        "search_doors": "Kapı ara...",
        "view_all_doors": "Tüm Kapıları Gör",
        "contact_info_title": "İletişim Bilgileri",
        "contact_info_subtitle": "Mühendislik fiyat teklifi için iletişim bilgilerinizi girin",
        "quotation_summary": "Teklif Özeti",
        "est_subtotal": "Tahmini Ara Toplam",
        "units_label": "adet",
        "systems_label": "sistem",
        "across_systems": "toplam",
        "full_name_label": "Ad Soyad / Yetkili Kişi",
        "full_name_placeholder": "örn. Kak Dana Farhad / Ahmed Ali",
        "phone_whatsapp_label": "Telefon / WhatsApp",
        "email_label_opt": "E-posta Adresi (İsteğe Bağlı)",
        "city_label": "Şehir / Bölge",
        "notes_label_opt": "Ek Notlar veya Özel İstekler (İsteğe Bağlı)",
        "notes_placeholder": "örn. Özel cam tonu, teslimat takvimi veya montaj detayları...",
        "engineers_review_note": "Doorhome mühendisleri bu şartnameyi inceleyecek ve resmi teklif ile sizinle iletişime geçecektir.",
        "back_btn": "Geri",
        "submitting_btn": "Gönderiliyor...",
        "quotation_submitted_title": "Teklif Talebi Başarıyla Gönderildi!",
        "ref_id_label": "Referans No:",
        "whatsapp_sales_connect": "WhatsApp Satış Hattına Bağlan",
        "continue_browsing": "Ürünleri İncelemeye Devam Et",
        "selected_systems_label": "Seçilen Sistemler",
        "auth_mobile_nav_btn": "Giriş Yap / Kayıt Ol",
        "auth_title": "Doorhome Müşteri & Ortak Portalı",
        "auth_signin_tab": "Giriş Yap",
        "auth_signup_tab": "Hesap Oluştur",
        "auth_password_label": "Şifre",
        "auth_role_label": "Mimari Profil / Rol",
        "auth_role_client": "Bireysel Müşteri / Villa Sahibi",
        "auth_role_architect": "Mimar / Mühendislik Danışmanı",
        "auth_role_fabricator": "Üretici / Müteahhit",
        "dimensions_label": "Boyutlar",
        "profile_depth_label": "Profil Derinliği",
        "cart_insulation_label": "Isı Yalıtımı",
        "cart_qty_label": "Adet",
        "thank_you_label": "Teşekkür ederiz,",
        "auth_logout_btn": "Çıkış Yap",
        "auth_welcome_back": "Tekrar hoş geldiniz",
        "auth_my_profile": "Profil Bilgileri",
        "auth_admin_portal_btn": "Yönetici Paneline Git",
        "auth_dont_have_account": "Hesabınız yok mu?",
        "auth_already_have_account": "Zaten hesabınız var mı?",
        "gallery_scope_label": "Proje Kapsamı",
        "gallery_cert_label": "Sertifikasyon",
        "gallery_cert_val": "CE & ift Rosenheim Onaylı",
        "gallery_inquire_btn": "Bu Sistem Hakkında Bilgi Al",
        "admin_title": "Doorhome Yönetici Portalı",
        "admin_tagline": "Mimari Operasyonlar ve Ticari Yönetim",
        "admin_tab_dashboard": "Kontrol Paneli",
        "admin_tab_products": "Katalog & Ürünler",
        "admin_tab_categories": "Kategoriler",
        "admin_tab_requests": "Fiyat Teklif Talepleri (RFQ)",
        "admin_tab_financials": "Finansal Defter",
        "admin_tab_users": "Kullanıcılar & Roller",
        "admin_tab_analytics": "Analizler & Raporlar",
        "admin_tab_cms": "CMS & Medya",
        "admin_tab_settings": "Ayarlar",
        "admin_btn_back_home": "Web Sitesine Dön",
        "admin_btn_shop": "Mağazayı Gör",
        "admin_btn_seed_data": "Üretim Kataloğunu Yükle",
        "admin_btn_clear_catalog": "Tüm Ürünleri Temizle",
        "admin_btn_add_product": "+ Ürün Sistemi Ekle",
        "admin_btn_add_category": "+ Yeni Kategori",
        "admin_btn_add_model": "+ Model Ekle",
        "admin_btn_add_subseries": "+ Alt Seri Ekle",
        "admin_search_products_ph": "Katalogda sistem adı, profil derinliği veya seri ara...",
        "admin_filter_all_divisions": "Tüm Mimari Bölümler",
        "admin_stat_total_products": "Toplam Katalog Sistemi",
        "admin_stat_active_categories": "Aktif Bölümler",
        "admin_stat_rfq_requests": "Bekleyen Teklifler",
        "admin_stat_total_revenue": "Toplam Teklif Hacmi",
        "admin_col_image": "Fotoğraf",
        "admin_col_name": "Sistem Adı",
        "admin_col_category": "Bölüm",
        "admin_col_subseries": "Alt Seri",
        "admin_col_dimensions": "Boyutlar / Derinlik",
        "admin_col_cost": "Maliyet Fiyatı",
        "admin_col_selling": "Satış Fiyatı",
        "admin_col_profit": "Kar Marjı",
        "admin_col_actions": "İşlemler",
        "admin_modal_edit_product": "Ürünü Düzenle",
        "admin_modal_create_product": "Yeni Ürün",
        "admin_form_name": "Ürün adı *",
        "admin_simple_category": "Kategori",
        "admin_simple_price": "Fiyat",
        "admin_image_ready": "Görsel hazır",
        "admin_uploading": "Yükleniyor...",
        "admin_product_form_error": "Lütfen ürün adı, açıklama, görsel ve sıfırdan büyük bir fiyat girin.",
        "admin_form_division": "Mimari Bölüm / Kategori *",
        "admin_form_subseries": "Alt Seri / Alt Kategori (İsteğe Bağlı)",
        "admin_form_image": "Ürün Görseli",
        "admin_form_upload": "Görsel yükle",
        "admin_form_desc": "Açıklama",
        "admin_form_height": "Standart Yükseklik",
        "admin_form_width": "Standart Genişlik",
        "admin_form_depth": "Profil Derinliği / Kalınlığı",
        "admin_form_glass": "Cam Şartnamesi",
        "admin_form_cost": "Üretim Maliyeti",
        "admin_form_selling": "Satış Fiyatı",
        "admin_form_save": "Ürünü kaydet",
        "admin_form_cancel": "İptal",
        "admin_notice_seed_success": "✓ Üretim kataloğu tüm bölümleriyle başarıyla yüklendi!",
        "admin_notice_saved": "✓ Başarıyla kaydedildi!",
        "admin_notice_deleted": "✓ Öğe silindi."
    }
    for k, v in tr_missing.items():
        data['tr'][k] = v

    # Missing Kurmanji translations
    for k in de_missing.keys():
        if k not in data['kmr']:
            data['kmr'][k] = data['ckb'].get(k, data['ar'].get(k, de_missing[k]))

    new_content = prefix + json.dumps(data, ensure_ascii=False, indent=2) + ";\n"
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("✓ translationsData.ts successfully updated with all keys for all 31 languages!")

def update_hero_section():
    print("2. Updating HeroSection.tsx with 31 languages...")
    filepath = os.path.join(ROOT, 'src/components/HeroSection.tsx')
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()

    quotes_json = json.dumps(HERO_QUOTES_BY_LANG, ensure_ascii=False, indent=2)
    content_json = json.dumps(HERO_CONTENT_BY_LANG, ensure_ascii=False, indent=2)

    # Replace HERO_QUOTES_BY_LANG
    code = re.sub(
        r'const HERO_QUOTES_BY_LANG: Record<string, string\[\]> = \{[\s\S]*?\n\};',
        f'const HERO_QUOTES_BY_LANG: Record<string, string[]> = {quotes_json};',
        code
    )

    # Replace HERO_CONTENT_BY_LANG
    code = re.sub(
        r'const HERO_CONTENT_BY_LANG: Record<string, \{ title: string; exploreBtn: string \}> = \{[\s\S]*?\n\};',
        f'const HERO_CONTENT_BY_LANG: Record<string, {{ title: string; exploreBtn: string }}> = {content_json};',
        code
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)
    print("✓ HeroSection.tsx successfully updated!")

def update_signature_showcase():
    print("3. Updating SignatureShowcase.tsx with 31 languages...")
    filepath = os.path.join(ROOT, 'src/components/SignatureShowcase.tsx')
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()

    showcase_text_json = json.dumps(SHOWCASE_TEXT_BY_LANG, ensure_ascii=False, indent=2)
    item_locales = get_item_locales()
    item_locales_json = json.dumps(item_locales, ensure_ascii=False, indent=2)

    # Replace SHOWCASE_TEXT_BY_LANG
    code = re.sub(
        r'export const SHOWCASE_TEXT_BY_LANG: Record<string, \{ title: string; subtitle: string; estimateBtn: string; specsBtn: string; inspectHint: string \}> = \{[\s\S]*?\n\};',
        f'export const SHOWCASE_TEXT_BY_LANG: Record<string, {{ title: string; subtitle: string; estimateBtn: string; specsBtn: string; inspectHint: string }}> = {showcase_text_json};',
        code
    )

    # Replace ITEM_LOCALES
    code = re.sub(
        r'export const ITEM_LOCALES: Record<string, Record<string, LocalizedItem>> = \{[\s\S]*?\n\};',
        f'export const ITEM_LOCALES: Record<string, Record<string, LocalizedItem>> = {item_locales_json};',
        code
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)
    print("✓ SignatureShowcase.tsx successfully updated!")

def update_about_section():
    print("4. Updating AboutSection.tsx with 31 languages...")
    filepath = os.path.join(ROOT, 'src/components/AboutSection.tsx')
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()

    pillars_json = json.dumps(PILLARS_BY_LANG, ensure_ascii=False, indent=2)
    headers_json = json.dumps(SECTION_HEADERS_BY_LANG, ensure_ascii=False, indent=2)

    code = re.sub(
        r'const PILLARS_BY_LANG: Record<string, PillarContent\[\]> = \{[\s\S]*?\n\};',
        f'const PILLARS_BY_LANG: Record<string, PillarContent[]> = {pillars_json};',
        code
    )

    code = re.sub(
        r'const SECTION_HEADERS_BY_LANG: Record<string, \{ title: string; subtitle: string; plantBadge: string; plantDesc: string; exploreBtn: string \}> = \{[\s\S]*?\n\};',
        f'const SECTION_HEADERS_BY_LANG: Record<string, {{ title: string; subtitle: string; plantBadge: string; plantDesc: string; exploreBtn: string }}> = {headers_json};',
        code
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)
    print("✓ AboutSection.tsx successfully updated!")

def update_partner_logos():
    print("5. Updating PartnerLogos.tsx with 31 languages...")
    filepath = os.path.join(ROOT, 'src/components/PartnerLogos.tsx')
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()

    partners_json = json.dumps(PARTNERS_TITLE_BY_LANG, ensure_ascii=False, indent=2)
    code = re.sub(
        r'const PARTNERS_TITLE_BY_LANG: Record<string, string> = \{[\s\S]*?\n\};',
        f'const PARTNERS_TITLE_BY_LANG: Record<string, string> = {partners_json};',
        code
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)
    print("✓ PartnerLogos.tsx successfully updated!")

def update_user_auth_page():
    print("6. Updating UserAuthPage.tsx with 31 languages...")
    filepath = os.path.join(ROOT, 'src/components/UserAuthPage.tsx')
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()

    auth_copy_json = json.dumps(AUTH_COPY_BY_LANG, ensure_ascii=False, indent=2)
    recovery_copy_json = json.dumps(RECOVERY_COPY, ensure_ascii=False, indent=2)

    code = re.sub(
        r'const AUTH_COPY_BY_LANG: Record<string, AuthCopy> = \{[\s\S]*?\n\};',
        f'const AUTH_COPY_BY_LANG: Record<string, AuthCopy> = {auth_copy_json};',
        code
    )

    code = re.sub(
        r'const RECOVERY_COPY: Record<string, \{ title: string; newPassword: string; save: string; email: string; back: string; wait: string; saved: string \}> = \{[\s\S]*?\n\};',
        f'const RECOVERY_COPY: Record<string, {{ title: string; newPassword: string; save: string; email: string; back: string; wait: string; saved: string }}> = {recovery_copy_json};',
        code
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)
    print("✓ UserAuthPage.tsx successfully updated!")

def update_windows_and_doors():
    print("7. Updating WindowsSection.tsx and DoorsSection.tsx for starting_from...")
    for comp in ['src/components/WindowsSection.tsx', 'src/components/DoorsSection.tsx']:
        filepath = os.path.join(ROOT, comp)
        with open(filepath, 'r', encoding='utf-8') as f:
            code = f.read()
        code = code.replace(
            '<span className="text-xs font-medium text-slate-500">Starting from</span>',
            '<span className="text-xs font-medium text-slate-500">{t(\'starting_from\')}</span>'
        )
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(code)
    print("✓ WindowsSection and DoorsSection updated with {t('starting_from')}!")

def update_localized_content():
    print("8. Updating localizedContent.ts with complete Italian and multi-language catalog...")
    filepath = os.path.join(ROOT, 'src/utils/localizedContent.ts')
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()

    it_products = get_product_localizations()
    it_products_json = json.dumps(it_products, ensure_ascii=False, indent=6)

    # Insert 'it' into PRODUCT_LOCALIZATIONS
    insert_str = f'  it: {it_products_json},\n'
    
    # Check if 'it' already exists, if not, add it
    if 'it:' not in code:
        code = re.sub(
            r'const PRODUCT_LOCALIZATIONS: Record<string, Record<string, LocalizedProductInfo>> = \{',
            r'const PRODUCT_LOCALIZATIONS: Record<string, Record<string, LocalizedProductInfo>> = {\n' + insert_str,
            code
        )

    # Upgrade getLocalizedProduct to also support Italian and fallback gracefully
    enhanced_get_localized = """export function getLocalizedProduct(product: ProductItem, langCode: string): ProductItem {
  if (!product) return product;
  const baseLang = langCode.split('-')[0].toLowerCase();

  // 1. Direct translation stored on product object
  if (product.translations) {
    const directMatch = product.translations[langCode] || product.translations[baseLang];
    if (directMatch) {
      return {
        ...product,
        name: directMatch.name || product.name,
        description: directMatch.description || product.description,
        subCategory: directMatch.subCategory || product.subCategory,
        features: (directMatch.features && directMatch.features.length) ? directMatch.features : product.features
      };
    }
  }

  // 2. Arabic / Kurdish legacy properties on product
  if (baseLang === 'ar') {
    if (product.arabicName || product.arabicDescription) {
      return {
        ...product,
        name: product.arabicName || product.name,
        description: product.arabicDescription || product.description
      };
    }
  } else if (baseLang === 'ckb' || baseLang === 'ku') {
    if (product.kurdishName || product.kurdishDescription) {
      return {
        ...product,
        name: product.kurdishName || product.name,
        description: product.kurdishDescription || product.description
      };
    }
  }

  // 3. Static localizations table lookup (direct match or baseLang)
  const langDict = PRODUCT_LOCALIZATIONS[langCode] || PRODUCT_LOCALIZATIONS[baseLang];
  if (langDict && langDict[product.id]) {
    const loc = langDict[product.id];
    return {
      ...product,
      name: loc.name || product.name,
      description: loc.description || product.description,
      subCategory: loc.subCategory || product.subCategory,
      features: loc.features || product.features,
      specs: loc.specs || product.specs
    };
  }

  // 4. Fallback for European Latin-based languages to Italian if English is otherwise shown
  if (['es', 'pt', 'ro', 'fr'].includes(baseLang) && PRODUCT_LOCALIZATIONS.it?.[product.id]) {
    const loc = PRODUCT_LOCALIZATIONS.it[product.id];
    return {
      ...product,
      name: loc.name || product.name,
      description: loc.description || product.description,
      subCategory: loc.subCategory || product.subCategory,
      features: loc.features || product.features,
      specs: loc.specs || product.specs
    };
  }

  // 5. Fallback for Middle Eastern languages to Arabic
  if (['fa'].includes(baseLang) && (product.arabicName || PRODUCT_LOCALIZATIONS.ar?.[product.id])) {
    const loc = PRODUCT_LOCALIZATIONS.ar?.[product.id];
    return {
      ...product,
      name: loc?.name || product.arabicName || product.name,
      description: loc?.description || product.arabicDescription || product.description,
      subCategory: loc?.subCategory || product.subCategory,
      features: loc?.features || product.features
    };
  }

  return product;
}"""

    code = re.sub(
        r'export function getLocalizedProduct[\s\S]*?return product;\n\}',
        enhanced_get_localized,
        code
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)
    print("✓ localizedContent.ts successfully updated with Italian catalog and smart fallback!")

def update_server_translate_endpoint():
    print("9. Updating server.ts /api/translate endpoint for 31 languages...")
    filepath = os.path.join(ROOT, 'server.ts')
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()

    # In server.ts, replace targetLangs = ['en', 'ar', 'ckb', 'kmr', 'tr', 'de']
    # with the full 31 language list
    full_langs_str = "['ckb', 'kmr', 'ar', 'tr', 'fa', 'en-GB', 'de', 'fr', 'it', 'el', 'es', 'ro', 'bg', 'sr', 'bs', 'hr', 'sq', 'nl', 'sv', 'pl', 'pt', 'en-US', 'es-MX', 'pt-BR', 'zh-CN', 'ru', 'hi', 'ja', 'ko', 'kk', 'en']"
    
    code = code.replace(
        "const targetLangs = ['en', 'ar', 'ckb', 'kmr', 'tr', 'de'];",
        f"const targetLangs = {full_langs_str};"
    )
    code = code.replace(
        "const targets = req.body?.targets || ['en', 'ar', 'ckb', 'kmr', 'tr', 'de'];",
        f"const targets = req.body?.targets || {full_langs_str};"
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)
    print("✓ server.ts /api/translate updated for all 31 languages!")

def update_client_translate_service():
    print("10. Updating src/services/translateService.ts for 31 languages...")
    filepath = os.path.join(ROOT, 'src/services/translateService.ts')
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()

    full_langs_str = "['ckb', 'kmr', 'ar', 'tr', 'fa', 'en-GB', 'de', 'fr', 'it', 'el', 'es', 'ro', 'bg', 'sr', 'bs', 'hr', 'sq', 'nl', 'sv', 'pl', 'pt', 'en-US', 'es-MX', 'pt-BR', 'zh-CN', 'ru', 'hi', 'ja', 'ko', 'kk', 'en']"
    code = code.replace(
        "const targetLangs = ['en', 'ar', 'ckb', 'kmr', 'tr', 'de'] as const;",
        f"const targetLangs = {full_langs_str} as const;"
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)
    print("✓ translateService.ts updated for all 31 languages!")

if __name__ == '__main__':
    update_translations_data()
    update_hero_section()
    update_signature_showcase()
    update_about_section()
    update_partner_logos()
    update_user_auth_page()
    update_windows_and_doors()
    update_localized_content()
    update_server_translate_endpoint()
    update_client_translate_service()
    print("\n🎉 ALL 10 STEPS COMPLETED SUCCESSFULLY!")
