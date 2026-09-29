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
  const override = MANUAL_OVERRIDES[language]?.[key] || MANUAL_OVERRIDES[language.split('-')[0]]?.[key];
  if (override) return override;
  const contactIndex = CONTACT_KEYS.indexOf(key);
  if (contactIndex >= 0) return (CONTACT_LABELS[language] || CONTACT_LABELS[language.split('-')[0]] || CONTACT_LABELS.en)[contactIndex];
  const extraIndex = EXTRA_KEYS.indexOf(key);
  if (extraIndex >= 0) return (EXTRA_LABELS[language] || EXTRA_LABELS[language.split('-')[0]] || EXTRA_LABELS.en)[extraIndex];
  const index = keys.indexOf(key);
  return index < 0 ? undefined : (COMMON_LABELS[language] || COMMON_LABELS[language.split('-')[0]] || COMMON_LABELS.en)[index];
}

// Corrections to untranslated interface entries found during the source audit.
export const MANUAL_OVERRIDES: Record<string, Record<string, string>> = {
  fa: {tab_sky_light:'نورگیر سقفی'},
  el: {acc_badge:'Εξαρτήματα',admin_title:'Πύλη διαχείρισης Doorhome',admin_tab_cms:'Περιεχόμενο και πολυμέσα',tab_sky_light:'Φεγγίτες',stepper_title:'Βήματα αίτησης προσφοράς Doorhome',upvc_badge:'Συστήματα uPVC',auth_super_admin:'Κύριος διαχειριστής'},
  es: {est_subtotal:'Subtotal estimado'},
  ro: {est_subtotal:'Subtotal estimat'},
  bg: {tab_sky_light:'Покривни прозорци'},
  bs: {admin_title:'Doorhome administrativni portal',admin_tab_dashboard:'Pregled',admin_col_category:'Kategorija',admin_form_upload:'Učitaj fotografiju',footer_outdoor:'Vanjska rješenja',footer_consultation:'Tehničko savjetovanje',nav_cart:'Korpa za ponude',cart_drawer_title:'Korpa za ponude',tab_casement_openings:'Prozori s otvaranjem na šarke',tab_sky_light:'Krovni prozori',showroom_title:'Posjetite naš izložbeni prostor',stepper_title:'Koraci zahtjeva za ponudu Doorhome',ref_id_label:'Referentni broj:',upvc_series_count:'Serije uPVC sistema',chambers_label:'Komore',auth_super_admin:'Glavni administrator',auth_verified_badge:'Potvrđen račun'},
  hr: {ref_id_label:'Referentni broj:'},
  sq: {admin_tab_cms:'Përmbajtja dhe media',showroom_title:'Vizitoni sallën tonë të ekspozitës',ref_id_label:'Numri i referencës:',auth_super_admin:'Administratori kryesor'},
  sv: {acc_badge:'Beslag',admin_title:'Doorhomes administratörsportal',admin_tagline:'Hantera produkter, innehåll och förfrågningar',admin_col_category:'Kategori',footer_col_support:'Support',tab_sky_light:'Takfönster',ref_id_label:'Referensnummer:',tab_casement:'Sidohängda fönster',upvc_badge:'uPVC-system',auth_super_admin:'Huvudadministratör'},
  pt: {est_subtotal:'Subtotal estimado'},
  ja: {cart_drawer_title:'見積依頼カート',last_name_label:'姓 *',phone_label:'電話番号 *',location_card_title:'ショールームへお越しください',working_hours_label:'営業時間：',cart_empty_title:'カートは空です'},
  kk: {stepper_title:'Doorhome баға ұсынысына өтінім беру қадамдары'}
};

const CONTACT_KEYS = ['contact_form_heading', 'contact_another_message', 'contact_message_placeholder'];
export const CONTACT_LABELS: Record<string, string[]> = {
  en: ['Inquiry and request form','Send another message','Describe your window, door, facade or hardware requirements…'],
  ar: ['نموذج الاستفسار والطلب','إرسال رسالة أخرى','صف احتياجاتك من النوافذ أو الأبواب أو الواجهات أو التجهيزات…'],
  ckb: ['فۆڕمی پرسیار و داواکاری','ناردنی پەیامێکی تر','پێداویستییەکانت بۆ پەنجەرە، دەرگا، ڕووکار یان کەرەستە باس بکە…'],
  kmr: ['Forma pirs û daxwazê','Peyameke din bişîne','Pêdiviyên xwe yên pencere, derî, rûyê avahiyê an amûran rave bike…'],
  tr: ['İletişim ve talep formu','Başka bir mesaj gönder','Pencere, kapı, cephe veya donanım ihtiyaçlarınızı açıklayın…'],
  fa: ['فرم پرسش و درخواست','ارسال پیام دیگر','نیازهای خود برای پنجره، در، نما یا یراق‌آلات را توضیح دهید…'],
  de: ['Anfrageformular','Weitere Nachricht senden','Beschreiben Sie Ihren Bedarf an Fenstern, Türen, Fassaden oder Beschlägen…'],
  fr: ['Formulaire de demande','Envoyer un autre message','Décrivez vos besoins en fenêtres, portes, façades ou quincaillerie…'],
  it: ['Modulo di richiesta','Invia un altro messaggio','Descrivi le tue esigenze di finestre, porte, facciate o ferramenta…'],
  el: ['Φόρμα ερωτήματος και αιτήματος','Αποστολή άλλου μηνύματος','Περιγράψτε τις ανάγκες σας για παράθυρα, πόρτες, προσόψεις ή εξαρτήματα…'],
  es: ['Formulario de consulta y solicitud','Enviar otro mensaje','Describa sus necesidades de ventanas, puertas, fachadas o herrajes…'],
  ro: ['Formular de solicitare','Trimite alt mesaj','Descrieți cerințele pentru ferestre, uși, fațade sau feronerie…'],
  bg: ['Формуляр за запитване и заявка','Изпратете друго съобщение','Опишете нуждите си от прозорци, врати, фасади или обков…'],
  sr: ['Obrazac za upit i zahtev','Pošalji drugu poruku','Opišite potrebe za prozorima, vratima, fasadama ili okovima…'],
  bs: ['Obrazac za upit i zahtjev','Pošalji drugu poruku','Opišite potrebe za prozorima, vratima, fasadama ili okovima…'],
  hr: ['Obrazac za upit i zahtjev','Pošalji drugu poruku','Opišite potrebe za prozorima, vratima, fasadama ili okovima…'],
  sq: ['Formular pyetjesh dhe kërkesash','Dërgo një mesazh tjetër','Përshkruani nevojat për dritare, dyer, fasada ose pajisje…'],
  nl: ['Aanvraagformulier','Nog een bericht sturen','Beschrijf uw wensen voor ramen, deuren, gevels of beslag…'],
  sv: ['Förfrågningsformulär','Skicka ett nytt meddelande','Beskriv dina behov av fönster, dörrar, fasader eller beslag…'],
  pl: ['Formularz zapytania','Wyślij kolejną wiadomość','Opisz wymagania dotyczące okien, drzwi, fasad lub okuć…'],
  pt: ['Formulário de consulta e pedido','Enviar outra mensagem','Descreva os requisitos de janelas, portas, fachadas ou ferragens…'],
  zh: ['咨询与申请表','发送另一条消息','请描述您的窗户、门、建筑外墙或五金需求…'],
  ru: ['Форма запроса','Отправить другое сообщение','Опишите требования к окнам, дверям, фасадам или фурнитуре…'],
  hi: ['पूछताछ और अनुरोध फ़ॉर्म','एक और संदेश भेजें','खिड़की, दरवाज़े, फ़साड या हार्डवेयर की आवश्यकताएँ बताएँ…'],
  ja: ['お問い合わせ・ご依頼フォーム','別のメッセージを送信','窓、ドア、ファサード、金具に関するご要望をご記入ください…'],
  ko: ['문의 및 요청 양식','다른 메시지 보내기','창문, 문, 건축 외벽 또는 철물 관련 요구 사항을 설명해 주세요…'],
  kk: ['Сұрау және өтінім нысаны','Тағы бір хабар жіберу','Терезе, есік, қасбет немесе фурнитураға қойылатын талаптарды сипаттаңыз…']
};

const EXTRA_KEYS = ['footer_intro', 'ui_contact_social', 'footer_col_company'];
export const EXTRA_LABELS: Record<string, string[]> = {
  en: ['Aluminium and uPVC window and door systems, sliding doors and architectural facades in Iraq and Kurdistan. Explore our products and projects, or contact our team.', 'Contact and social links', 'Doorhome'],
  ar: ['أنظمة نوافذ وأبواب الألمنيوم وuPVC، وأبواب منزلقة وواجهات معمارية في العراق وكردستان. استكشف منتجاتنا ومشاريعنا أو تواصل مع فريقنا.', 'روابط التواصل والشبكات الاجتماعية', 'دور هوم'],
  ckb: ['سیستەمی پەنجەرە و دەرگای ئەلۆمنیۆم و uPVC، دەرگای خلیسکاو و ڕووکاری تەلارسازی لە عێراق و کوردستان. بەرهەم و پڕۆژەکانمان ببینە یان پەیوەندی بە تیمەکەمانەوە بکە.', 'بەستەرەکانی پەیوەندی و تۆڕە کۆمەڵایەتییەکان', 'دور هۆم'],
  kmr: ['Pergalên pencere û deriyên alumînyûm û uPVC, deriyên şemitok û rûyên avahiyan li Iraq û Kurdistanê. Hilber û projeyên me bibînin an bi tîma me re têkilî daynin.', 'Girêdanên têkilî û torên civakî', 'Doorhome'],
  tr: ['Irak ve Kürdistan’da alüminyum ve uPVC pencere ve kapı sistemleri, sürgülü kapılar ve mimari cepheler. Ürünlerimizi ve projelerimizi inceleyin veya ekibimizle iletişime geçin.', 'İletişim ve sosyal medya bağlantıları', 'Doorhome'],
  fa: ['سیستم‌های پنجره و در آلومینیومی و uPVC، درهای کشویی و نماهای معماری در عراق و کردستان. محصولات و پروژه‌های ما را ببینید یا با تیم ما تماس بگیرید.', 'پیوندهای تماس و شبکه‌های اجتماعی', 'دور هوم'],
  de: ['Fenster- und Türsysteme aus Aluminium und uPVC, Schiebetüren und Architekturfassaden im Irak und in Kurdistan. Entdecken Sie unsere Produkte und Projekte oder kontaktieren Sie unser Team.', 'Kontakt und soziale Netzwerke', 'Doorhome'],
  fr: ['Systèmes de fenêtres et de portes en aluminium et uPVC, portes coulissantes et façades architecturales en Irak et au Kurdistan. Découvrez nos produits et projets ou contactez notre équipe.', 'Contact et réseaux sociaux', 'Doorhome'],
  it: ['Sistemi di finestre e porte in alluminio e uPVC, porte scorrevoli e facciate architettoniche in Iraq e Kurdistan. Scopri i nostri prodotti e progetti oppure contatta il nostro team.', 'Contatti e social network', 'Doorhome'],
  el: ['Συστήματα παραθύρων και θυρών αλουμινίου και uPVC, συρόμενες πόρτες και αρχιτεκτονικές προσόψεις στο Ιράκ και το Κουρδιστάν. Δείτε τα προϊόντα και τα έργα μας ή επικοινωνήστε με την ομάδα μας.', 'Επικοινωνία και κοινωνικά δίκτυα', 'Doorhome'],
  es: ['Sistemas de ventanas y puertas de aluminio y uPVC, puertas correderas y fachadas arquitectónicas en Irak y Kurdistán. Explore nuestros productos y proyectos o contacte con nuestro equipo.', 'Contacto y redes sociales', 'Doorhome'],
  ro: ['Sisteme de ferestre și uși din aluminiu și uPVC, uși glisante și fațade arhitecturale în Irak și Kurdistan. Descoperiți produsele și proiectele noastre sau contactați echipa noastră.', 'Contact și rețele sociale', 'Doorhome'],
  bg: ['Алуминиеви и uPVC системи за прозорци и врати, плъзгащи врати и архитектурни фасади в Ирак и Кюрдистан. Разгледайте продуктите и проектите ни или се свържете с нашия екип.', 'Контакти и социални мрежи', 'Doorhome'],
  sr: ['Aluminijumski i uPVC sistemi prozora i vrata, klizna vrata i arhitektonske fasade u Iraku i Kurdistanu. Pogledajte naše proizvode i projekte ili kontaktirajte naš tim.', 'Kontakt i društvene mreže', 'Doorhome'],
  bs: ['Aluminijski i uPVC sistemi prozora i vrata, klizna vrata i arhitektonske fasade u Iraku i Kurdistanu. Pogledajte naše proizvode i projekte ili kontaktirajte naš tim.', 'Kontakt i društvene mreže', 'Doorhome'],
  hr: ['Aluminijski i uPVC sustavi prozora i vrata, klizna vrata i arhitektonske fasade u Iraku i Kurdistanu. Pogledajte naše proizvode i projekte ili kontaktirajte naš tim.', 'Kontakt i društvene mreže', 'Doorhome'],
  sq: ['Sisteme dritaresh dhe dyersh prej alumini dhe uPVC, dyer rrëshqitëse dhe fasada arkitekturore në Irak dhe Kurdistan. Shikoni produktet dhe projektet tona ose kontaktoni ekipin tonë.', 'Kontakt dhe rrjete sociale', 'Doorhome'],
  nl: ['Aluminium- en uPVC-raam- en deursystemen, schuifdeuren en architectonische gevels in Irak en Koerdistan. Bekijk onze producten en projecten of neem contact op met ons team.', 'Contact en sociale media', 'Doorhome'],
  sv: ['Fönster- och dörrsystem i aluminium och uPVC, skjutdörrar och arkitektoniska fasader i Irak och Kurdistan. Utforska våra produkter och projekt eller kontakta vårt team.', 'Kontakt och sociala medier', 'Doorhome'],
  pl: ['Systemy okienne i drzwiowe z aluminium i uPVC, drzwi przesuwne i fasady architektoniczne w Iraku i Kurdystanie. Poznaj nasze produkty i realizacje lub skontaktuj się z naszym zespołem.', 'Kontakt i media społecznościowe', 'Doorhome'],
  pt: ['Sistemas de janelas e portas de alumínio e uPVC, portas de correr e fachadas arquitetónicas no Iraque e no Curdistão. Conheça os nossos produtos e projetos ou contacte a nossa equipa.', 'Contacto e redes sociais', 'Doorhome'],
  'pt-BR': ['Sistemas de janelas e portas de alumínio e uPVC, portas de correr e fachadas arquitetônicas no Iraque e no Curdistão. Conheça nossos produtos e projetos ou entre em contato com nossa equipe.', 'Contato e redes sociais', 'Doorhome'],
  zh: ['伊拉克和库尔德斯坦的铝合金及uPVC门窗系统、推拉门和建筑幕墙。了解我们的产品和项目，或联系我们的团队。', '联系与社交媒体链接', 'Doorhome'],
  ru: ['Алюминиевые и uPVC-системы окон и дверей, раздвижные двери и архитектурные фасады в Ираке и Курдистане. Ознакомьтесь с нашими продуктами и проектами или свяжитесь с нашей командой.', 'Контакты и социальные сети', 'Doorhome'],
  hi: ['इराक और कुर्दिस्तान में एल्युमिनियम और uPVC खिड़की व दरवाज़ा प्रणालियाँ, स्लाइडिंग दरवाज़े और वास्तुशिल्प फ़साड। हमारे उत्पाद और प्रोजेक्ट देखें या हमारी टीम से संपर्क करें।', 'संपर्क और सोशल मीडिया लिंक', 'Doorhome'],
  ja: ['イラクとクルディスタンのアルミニウム・uPVC窓およびドアシステム、引き戸、建築ファサード。製品や施工事例をご覧いただくか、当社チームにお問い合わせください。', 'お問い合わせとソーシャルメディア', 'Doorhome'],
  ko: ['이라크와 쿠르디스탄의 알루미늄 및 uPVC 창호 시스템, 슬라이딩 도어와 건축 외벽. 제품과 시공 사례를 살펴보거나 담당 팀에 문의하세요.', '연락처 및 소셜 미디어 링크', 'Doorhome'],
  kk: ['Ирак пен Күрдістандағы алюминий және uPVC терезе мен есік жүйелері, жылжымалы есіктер және сәулеттік қасбеттер. Өнімдеріміз бен жобаларымызды қараңыз немесе тобымызбен байланысыңыз.', 'Байланыс және әлеуметтік желі сілтемелері', 'Doorhome']
};

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
