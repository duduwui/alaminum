const keys = ['ui_close', 'ui_menu', 'ui_clear_search', 'ui_quantity_less', 'ui_quantity_more', 'ui_no_products', 'ui_remove_item'];
// Manual translations, also bundled separately for the deployed frontend.
export const COMMON_LABELS: Record<string, string[]> = {
  en: ['Close','Open menu','Clear search','Decrease quantity','Increase quantity','No matching products.','Remove item'],
  ar: ['إغلاق','فتح القائمة','مسح البحث','تقليل الكمية','زيادة الكمية','لا توجد منتجات مطابقة.','إزالة المنتج'],
  ckb: ['داخستن','کردنەوەی لیست','سڕینەوەی گەڕان','کەمکردنەوەی ژمارە','زیادکردنی ژمارە','هیچ بەرهەمێکی گونجاو نەدۆزرایەوە.','سڕینەوەی بەرهەم'],
  kmr: ['Bigire','Menûyê veke','Lêgerînê paqij bike','Hejmara kêm bike','Hejmara zêde bike','Tu hilbera lihevhatî nehat dîtin.','Hilberê rake'],
  tr: ['Kapat','Menüyü aç','Aramayı temizle','Miktarı azalt','Miktarı artır','Eşleşen ürün yok.','Ürünü kaldır'],
  fa: ['بستن','باز کردن منو','پاک کردن جستجو','کاهش تعداد','افزایش تعداد','محصولی مطابق جستجو یافت نشد.','حذف محصول'],
  de: ['Schließen','Menü öffnen','Suche löschen','Menge verringern','Menge erhöhen','Keine passenden Produkte.','Artikel entfernen'],
  fr: ['Fermer','Ouvrir le menu','Effacer la recherche','Diminuer la quantité','Augmenter la quantité','Aucun produit correspondant.','Retirer l’article'],
  it: ['Chiudi','Apri il menu','Cancella la ricerca','Diminuisci la quantità','Aumenta la quantità','Nessun prodotto corrispondente.','Rimuovi articolo'],
  el: ['Κλείσιμο','Άνοιγμα μενού','Εκκαθάριση αναζήτησης','Μείωση ποσότητας','Αύξηση ποσότητας','Δεν βρέθηκαν αντίστοιχα προϊόντα.','Αφαίρεση προϊόντος'],
  es: ['Cerrar','Abrir menú','Borrar búsqueda','Disminuir cantidad','Aumentar cantidad','No hay productos coincidentes.','Eliminar producto'],
  ro: ['Închide','Deschide meniul','Șterge căutarea','Scade cantitatea','Mărește cantitatea','Nu există produse corespunzătoare.','Elimină produsul'],
  bg: ['Затваряне','Отваряне на менюто','Изчистване на търсенето','Намаляване на количеството','Увеличаване на количеството','Няма съответстващи продукти.','Премахване на продукта'],
  sr: ['Zatvori','Otvori meni','Obriši pretragu','Smanji količinu','Povećaj količinu','Nema odgovarajućih proizvoda.','Ukloni proizvod'],
  bs: ['Zatvori','Otvori meni','Obriši pretragu','Smanji količinu','Povećaj količinu','Nema odgovarajućih proizvoda.','Ukloni proizvod'],
  hr: ['Zatvori','Otvori izbornik','Obriši pretragu','Smanji količinu','Povećaj količinu','Nema odgovarajućih proizvoda.','Ukloni proizvod'],
  sq: ['Mbyll','Hap menynë','Pastro kërkimin','Zvogëlo sasinë','Rrit sasinë','Nuk ka produkte që përputhen.','Hiq produktin'],
  nl: ['Sluiten','Menu openen','Zoekopdracht wissen','Aantal verlagen','Aantal verhogen','Geen overeenkomende producten.','Artikel verwijderen'],
  sv: ['Stäng','Öppna menyn','Rensa sökningen','Minska antal','Öka antal','Inga matchande produkter.','Ta bort produkt'],
  pl: ['Zamknij','Otwórz menu','Wyczyść wyszukiwanie','Zmniejsz ilość','Zwiększ ilość','Brak pasujących produktów.','Usuń produkt'],
  pt: ['Fechar','Abrir menu','Limpar pesquisa','Diminuir quantidade','Aumentar quantidade','Nenhum produto correspondente.','Remover produto'],
  zh: ['关闭','打开菜单','清除搜索','减少数量','增加数量','没有匹配的产品。','移除商品'],
  ru: ['Закрыть','Открыть меню','Очистить поиск','Уменьшить количество','Увеличить количество','Нет подходящих товаров.','Удалить товар'],
  hi: ['बंद करें','मेन्यू खोलें','खोज साफ़ करें','मात्रा घटाएँ','मात्रा बढ़ाएँ','कोई मेल खाने वाला उत्पाद नहीं है।','उत्पाद हटाएँ'],
  ja: ['閉じる','メニューを開く','検索をクリア','数量を減らす','数量を増やす','一致する商品がありません。','商品を削除'],
  ko: ['닫기','메뉴 열기','검색 지우기','수량 줄이기','수량 늘리기','일치하는 제품이 없습니다.','상품 삭제'],
  kk: ['Жабу','Мәзірді ашу','Іздеуді тазалау','Санын азайту','Санын көбейту','Сәйкес өнімдер жоқ.','Өнімді жою']
};
export function getCommonText(language: string, key: string): string | undefined {
  const index = keys.indexOf(key);
  return index < 0 ? undefined : (COMMON_LABELS[language] || COMMON_LABELS[language.split('-')[0]] || COMMON_LABELS.en)[index];
}

export const REGION_LABELS: Record<string, string[]> = {
  en:['All regions','Middle East','Europe','Americas','Asia & Global'],
  ar:['جميع المناطق','الشرق الأوسط','أوروبا','الأمريكتان','آسيا والعالم'],
  ckb:['هەموو ناوچەکان','ڕۆژهەڵاتی ناوەڕاست','ئەوروپا','ئەمریکاکان','ئاسیا و جیهان'],
  kmr:['Hemû herêm','Rojhilata Navîn','Ewropa','Amerîka','Asya û cîhan'],
  tr:['Tüm bölgeler','Orta Doğu','Avrupa','Amerika','Asya ve dünya'],
  fa:['همه مناطق','خاورمیانه','اروپا','قاره آمریکا','آسیا و جهان'],
  de:['Alle Regionen','Naher Osten','Europa','Amerika','Asien & weltweit'],
  fr:['Toutes les régions','Moyen-Orient','Europe','Amériques','Asie et monde'],
  it:['Tutte le regioni','Medio Oriente','Europa','Americhe','Asia e mondo'],
  el:['Όλες οι περιοχές','Μέση Ανατολή','Ευρώπη','Αμερική','Ασία και κόσμος'],
  es:['Todas las regiones','Oriente Medio','Europa','Américas','Asia y mundo'],
  ro:['Toate regiunile','Orientul Mijlociu','Europa','Americi','Asia și global'],
  bg:['Всички региони','Близък изток','Европа','Америка','Азия и свят'],
  sr:['Svi regioni','Bliski istok','Evropa','Amerika','Azija i svet'],
  bs:['Sve regije','Bliski istok','Evropa','Amerika','Azija i svijet'],
  hr:['Sve regije','Bliski istok','Europa','Amerika','Azija i svijet'],
  sq:['Të gjitha rajonet','Lindja e Mesme','Evropa','Amerika','Azia dhe bota'],
  nl:['Alle regio’s','Midden-Oosten','Europa','Amerika','Azië en wereldwijd'],
  sv:['Alla regioner','Mellanöstern','Europa','Amerika','Asien och världen'],
  pl:['Wszystkie regiony','Bliski Wschód','Europa','Ameryki','Azja i świat'],
  pt:['Todas as regiões','Oriente Médio','Europa','Américas','Ásia e mundo'],
  zh:['所有地区','中东','欧洲','美洲','亚洲及全球'],
  ru:['Все регионы','Ближний Восток','Европа','Америка','Азия и весь мир'],
  hi:['सभी क्षेत्र','मध्य पूर्व','यूरोप','अमेरिका','एशिया और विश्व'],
  ja:['すべての地域','中東','ヨーロッパ','南北アメリカ','アジア・世界'],
  ko:['모든 지역','중동','유럽','아메리카','아시아 및 전 세계'],
  kk:['Барлық аймақтар','Таяу Шығыс','Еуропа','Америка','Азия және әлем']
};
export function getRegionLabel(language: string, region: string): string {
  const index = ['all','middle_east','europe','americas','asia_global'].indexOf(region);
  return (REGION_LABELS[language] || REGION_LABELS[language.split('-')[0]] || REGION_LABELS.en)[index] || region;
}
export function getLanguageDisplayName(language: string, target: string, fallback: string): string {
  try { return new Intl.DisplayNames([language], {type:'language'}).of(target) || fallback; }
  catch { return fallback; }
}
