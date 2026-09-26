// Reviewed manually from numbered contact sheets and full-size detail images.
// Outputs a patch-ready import plan; never infers brands, dimensions or ratings.
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const root = path.resolve(__dirname, '..');
const folder = path.join(root, 'products&assets');
const live = '/tmp/doorhome-asset-review/live';
const remote = JSON.parse(fs.readFileSync('/tmp/doorhome-asset-review/remote-hashes.json'));
const groups = {
  doors: ['Doors & Entrance Gates', 'الأبواب وبوابات المداخل', 'دەرگا و دەروازەکان', 'DoorOpen'],
  railings: ['Glass & Stair Railings', 'درابزين الزجاج والسلالم', 'محجەری شووشە و پلەکان', 'Fence'],
  shading: ['Outdoor Shading', 'أنظمة التظليل الخارجية', 'سێبەری دەرەوە', 'LayoutGrid'],
  glass: ['Architectural Glazing', 'الواجهات الزجاجية', 'ڕووکارە شووشەییەکان', 'Layers'],
  accessories: ['Handles & Lock Hardware', 'المقابض وتجهيزات الأقفال', 'دەستگیر و قوفڵەکان', 'Settings'],
  aluminum: ['Profile Sections', 'مقاطع القطاعات', 'بڕگەی پرۆفایلەکان', 'Layers']
};
// [photo, category (null = project-only), English title, Arabic title, visible detail]
const rows = [
[1,null,'Residential Facade Installation','تركيب واجهة منزل','A multi-storey home with an arched upper opening and installation work in progress.'],
[2,'doors','Light Grey Horizontal-Panel Entrance Gate','بوابة رمادية فاتحة بألواح أفقية','A wide panelled gate paired with narrow pedestrian entrances and contrasting dark frames.'],
[3,null,'Glazed Restaurant Terrace','تراس مطعم بواجهات زجاجية','An indoor dining space beside full-height glazing and a slatted overhead canopy.'],
[4,'accessories','Cylinder Lock Mechanism','آلية قفل بأسطوانة','A narrow lock case with a cylinder opening and an extended faceplate; compatibility must be checked against the door.'],
[5,null,'Restaurant Canopy and Glazing Detail','تفاصيل مظلة وزجاج المطعم','Dark overhead slats, open roof areas and glazed walls above a dining area.'],
[6,'doors','Charcoal Gate with Vertical Wood-Effect Accent','بوابة فحمية بتفصيل عمودي بلون الخشب','Horizontal dark panels meet a slim wood-effect insert and separate pedestrian leaf.'],
[7,null,'Open-Roof Dining Terrace','تراس طعام بسقف مفتوح','The terrace canopy is pictured with an open roof bay above tables and perimeter glazing.'],
[8,'railings','Glass Stair Balustrade with Wood-Tone Handrail','درابزين درج زجاجي بمسكة بلون الخشب','Clear glass panels follow a stone staircase, with dark mounting fittings and a wood-tone top rail.'],
[9,null,'Dining Terrace Roof Opening','فتحة سقف تراس الطعام','An alternate view of the open canopy bay over the glazed restaurant terrace.'],
[10,'doors','Vertical-Slat Driveway Gate','بوابة مدخل بشرائح عمودية','Closely spaced dark vertical slats create a consistent frontage across the wide gate.'],
[11,'railings','Blue-Tinted Glass Balcony Railing','درابزين شرفة بزجاج مائل للأزرق','Glass panels and dark posts run along a balcony beside the street.'],
[12,null,'Large Villa Exterior','واجهة فيلا كبيرة','A wide residence with arched openings, columns and an unfinished landscaped foreground.'],
[13,null,'Gate and Pedestrian Entrance Installation','تركيب بوابة ومدخل مشاة','A horizontal-panel gate, wood-effect inset and dark-framed pedestrian entrance installed between masonry piers.'],
[14,'doors','Horizontal-Slat Gate with Wood-Effect Side Panel','بوابة بشرائح أفقية ولوح جانبي بلون الخشب','A dark horizontal-slat gate paired with a narrow wood-effect pedestrian panel.'],
[15,'doors','Inset-Window Horizontal Gate','بوابة أفقية بشريط نافذة','Light horizontal panels are broken by a small rectangular glazed strip near the top.'],
[16,'railings','Glass Railing for Open-Riser Stairs','درابزين زجاجي لدرج مفتوح','Clear glass follows open wood-tone stair treads supported by a dark central structure.'],
[17,'doors','Vertical Wood-Effect Entrance Gate','بوابة مدخل عمودية بلون الخشب','A warm wood-effect slatted frontage contrasts with dark framing and adjacent pedestrian entrances.'],
[18,'doors','Geometric Double Entrance Gate','بوابة مزدوجة بزخارف هندسية','Two broad dark leaves use rectangular light outlines with matching decorative end panels.'],
[19,null,'Dark Entrance Door Display','عرض باب مدخل داكن','A showroom-style entrance assembly with a broad dark panel, vertical glazing and a separate narrow side section.'],
[20,'railings','Indoor Glass Guardrail with Wood-Tone Posts','حاجز زجاجي داخلي بقوائم بلون الخشب','Tinted glass panels border an upper-level opening with wood-tone posts and a dark top rail.'],
[21,'doors','Three-Rectangle Entrance Gate','بوابة مدخل بثلاثة مستطيلات','A dark gate with three elongated light rectangular outlines and a matching pedestrian panel.'],
[22,'doors','Slatted Gate with Central Wood-Effect Band','بوابة بشرائح وشريط وسطي بلون الخشب','Horizontal dark slats are interrupted by a warm wood-effect band and matching side panel.'],
[23,'doors','Three Glazed-Strip Entrance Gate','بوابة مدخل بثلاثة شرائط زجاجية','A dark gate framed by a light border features three narrow rectangular inset windows.'],
[24,'doors','Glazed Office Door with Frosted Bands','باب مكتب زجاجي بشرائط مصنفرة','A hinged glazed door and fixed side panel use horizontal frosted bands and dark framing.'],
[25,'doors','Mixed Slat and Panel Entrance Gate','بوابة مدخل تجمع الشرائح والألواح','A pale slatted pedestrian section sits beside a wide dark gate with horizontal light accents.'],
[26,'doors','Push-Bar Door with Vision Panel','باب بقضيب دفع ونافذة رؤية','A plain light-coloured door has a small rectangular vision panel and horizontal push bar. No fire rating is asserted.'],
[27,'doors','Double Gate with Horizontal Light Strips','بوابة مزدوجة بشرائط أفقية فاتحة','Two hinged dark leaves feature repeated horizontal light strips and central handles.'],
[28,null,'Glass Balcony Installation at Dusk','تركيب درابزين شرفة زجاجي عند الغروب','Tinted glass panels and dark posts sit in front of a lit stone-clad balcony.'],
[29,'doors','Solid Entrance Gate with Vertical Wood-Effect Inserts','بوابة مصمتة بإدخالات عمودية بلون الخشب','Wide plain panels contrast with narrow vertical wood-effect inserts at the sides.'],
[30,null,'Office Glazed Entrance Detail','تفاصيل مدخل مكتب زجاجي','An alternate angle of a glazed door, fixed side panel and horizontal privacy bands.'],
[31,null,'Stone-Clad Balcony Elevation','واجهة شرفة مكسوة بالحجر','A recessed balcony with tinted glass railing, dark windows and warm ceiling lights.'],
[32,'doors','Pale Horizontal-Panel Gate','بوابة فاتحة بألواح أفقية','Broad pale horizontal panels framed in dark trim beside a matching pedestrian door.'],
[33,'doors','Dark Gate with Narrow Horizontal Accents','بوابة داكنة بتفاصيل أفقية رفيعة','A dark vehicle gate with light horizontal stripes and a narrow glazed pedestrian entrance.'],
[34,'doors','Twin Light-Panel Entrance Gate','بوابة مدخل مزدوجة بألواح فاتحة','Two equal light-coloured hinged leaves feature dark framing and horizontal divisions.'],
[35,null,'Interior Gallery Glass Railing','درابزين زجاجي لممر داخلي','Clear glass panels with dark posts line the edge of a bright interior gallery.'],
[36,null,'Paired Balcony Glass Railings','درابزين زجاجي لشرفتين','Two adjacent balcony bays use blue-tinted glass panels and dark fittings.'],
[37,'doors','Fine Horizontal-Slat Entrance Gate','بوابة مدخل بشرائح أفقية رفيعة','A wide dark gate uses fine repeated horizontal slats beside a smaller matching entrance.'],
[38,'doors','Minimal Horizontal-Panel Gate','بوابة بسيطة بألواح أفقية','A dark broad-leaf gate has widely spaced horizontal joints and a matching pedestrian door.'],
[39,null,'Lit Residential Balcony Facade','واجهة منزل بشرفات مضاءة','Two-storey stone-clad elevation with recessed balcony bays, glass railings and warm lighting.'],
[40,'doors','Dark Panel Gate with Wood-Effect Pedestrian Door','بوابة داكنة وباب مشاة بلون الخشب','A broad dark gate with thin horizontal accents pairs with a vertical wood-effect entrance leaf.'],
[41,null,'Interior Atrium Glass Balustrade','درابزين زجاجي لبهو داخلي','Tinted glass panels border an upper-floor atrium with a sweeping stair opening.'],
[42,'doors','Plain Gate with Slatted Pedestrian Panel','بوابة مصمتة ولوح مشاة بشرائح','A plain dark vehicle gate is complemented by a narrow horizontally slatted entrance.'],
[43,null,'Residential Glass Balcony Overview','منظر عام لشرفات منزل زجاجية','An exterior view of stone-clad balcony recesses and blue-tinted glass guardrails.'],
[44,'doors','Double Wood-Effect Slat Gate','بوابة مزدوجة بشرائح بلون الخشب','Two dark-framed leaves contain repeated vertical wood-effect inserts.'],
[45,'doors','Wood-Tone Entrance Door with Glazed Sidelight','باب مدخل بلون الخشب ولوح زجاجي جانبي','Horizontal wood-tone panels, a long dark pull handle and a tall narrow glazed sidelight.'],
[46,null,'Pedestrian Gate Opening Detail','تفاصيل فتح بوابة المشاة','The hinged pedestrian leaf is shown open beside a broad horizontal-panel gate.'],
[47,'doors','Wood-Tone Door with Dark Cross Band','باب بلون الخشب وشريط داكن عرضي','A wood-tone entrance leaf uses a broad dark horizontal accent and long vertical pull handle.'],
[48,'doors','Grey Horizontal-Slat Gate and Side Door','بوابة رمادية بشرائح أفقية وباب جانبي','A wide grey slatted frontage with a narrow matching pedestrian door.'],
[49,null,'Outdoor Balcony Glass Guardrail','حاجز زجاجي لشرفة خارجية','Blue-tinted glass panels line a covered exterior balcony with dark posts and framing.'],
[50,'doors','Light Panel Gate with Glazed Side Entrance','بوابة فاتحة ومدخل جانبي زجاجي','Broad pale panels pair with a tall narrow dark-framed glazed entrance.'],
[51,null,'Wood-Tone Door Display Pair','عرض بابين بلون الخشب','Two entrance door samples show wood-tone surfaces, dark surrounds and long pull handles.'],
[52,'doors','Dark Gate with Square Glazing Row','بوابة داكنة بصف فتحات زجاجية مربعة','A dark gate contains a horizontal row of small square glazed openings.'],
[53,'doors','Pale Gate with Central Glazing Strip','بوابة فاتحة بشريط زجاجي وسطي','Wide pale horizontal panels enclose a short central row of small windows.'],
[54,'doors','Black Gate with Bright Horizontal Trim','بوابة سوداء بتفاصيل أفقية فاتحة','A dark entrance gate and pedestrian leaf share slim horizontal light accents.'],
[55,null,'Glass Railing beside Garden Terrace','درابزين زجاجي بجانب تراس الحديقة','Clear glass panels separate a tiled terrace from a planted outdoor area.'],
[56,'doors','Horizontal Gate with Curved Slat Accent','بوابة أفقية بتفصيل شرائح منحني','A horizontal-panel gate is paired with a pedestrian leaf carrying a curved slatted detail.'],
[57,'aluminum','Dark-Finish Frame Profile Cross Section','مقطع إطار بتشطيب داكن','A cut section exposes hollow internal channels and glazing grooves. Exact alloy, system, depth and thermal performance are unverified.'],
[58,'doors','Dark Entrance Door with Vertical Glazing','باب مدخل داكن بزجاج عمودي','A vertically grooved dark door has a tall narrow glazed inset, handle and overhead lights.'],
[59,null,'Arched Facade Glazing Installation','تركيب زجاج واجهة مقوسة','An arched upper opening is being fitted in a residence with scaffolding still present.'],
[60,null,'Stair Landing Glass Railing Detail','تفاصيل درابزين زجاجي لبسطة درج','Glass panels, dark fittings and a wood-tone rail surround an interior stair landing.'],
[61,'doors','Dark Gate with Wood-Effect Horizontal Band','بوابة داكنة بشريط أفقي بلون الخشب','A wide gate combines dark horizontal panels with a warm wood-effect inset and matching side door.'],
[62,'doors','Open-Slat Double Entrance Gate','بوابة مدخل مزدوجة بشرائح مفتوحة','Two hinged leaves use spaced horizontal slats with wood-effect accents.'],
[63,'accessories','Black Lever Handle Assembly','طقم مقبض أسود','A black lever handle on a rectangular backplate; fixing dimensions and system compatibility require confirmation.'],
[64,null,'Garden-Facing Terrace Glass Detail','تفاصيل زجاج تراس مطل على الحديقة','An alternate view of a glass guardrail beside a tiled terrace and garden.'],
[65,null,'Vertical-Slat Gate Exterior View','منظر خارجي لبوابة بشرائح عمودية','A full-width view of the closely spaced dark vertical-slat entrance gate.'],
[66,'doors','Panel Gate with Narrow Glazed Pedestrian Door','بوابة ألواح وباب مشاة بزجاج ضيق','A dark horizontal-panel gate with small round accents beside a tall narrow glazed side leaf.'],
[67,null,'Residential Interior Glass Railings','درابزين زجاجي داخل منزل','A two-level living area with glass balustrades around the gallery and stair opening.'],
[68,'glass','Recessed Balcony Glass Front','واجهة زجاجية لشرفة غائرة','A recessed balcony has a broad dark reflective glazed front above a framed ground-floor opening.'],
[69,'railings','Geometric Stair and Landing Railing','درابزين هندسي للدرج والبسطة','Dark rectangular bars and posts form a geometric guardrail beside an interior staircase.'],
[70,'shading','Full-Height Outdoor Privacy Screens','ستائر خصوصية خارجية كاملة الارتفاع','Dark fabric-like screens span the exterior bays of a garden-side structure. Operation and fabric specifications are unverified.'],
[71,'doors','Grey Gate with Twin Wood-Effect Accent Panels','بوابة رمادية بلوحين بلون الخشب','A broad grey gate is paired with twin narrow wood-effect panels in dark framing.'],
[72,'doors','Wood-Effect Entrance Door Design','تصميم باب مدخل بلون الخشب','A door design image shows a long vertical pull handle, narrow dark inset and wood-effect surface; it is not evidence of a completed installation.'],
[73,'doors','Plain Dark Driveway Gate','بوابة مدخل سيارات داكنة مصمتة','A minimalist dark gate and matching pedestrian entrance sit between stone-faced piers.'],
[74,'doors','Decorative Gate with Wood-Effect Insets','بوابة مزخرفة بإدخالات بلون الخشب','Two dark entrance leaves have circular decorative bands and warm wood-effect rectangular inserts.'],
[75,null,'Tall Glazed Residential Entrance','مدخل منزل بواجهة زجاجية مرتفعة','Dark framed full-height glazing sits between stone-clad piers beside a landscaped approach.'],
[76,null,'Roof Glazing Installation Team','فريق تركيب زجاج السقف','Installers work around a pitched glazed roof structure.'],
[77,'doors','Illuminated Vertical-Slat Entrance Gate','بوابة مدخل مضاءة بشرائح عمودية','Dark vertical slats, warm accent strips and lighting around the gate frame.'],
[78,'shading','Garden Canopy Screen Detail','تفاصيل ستارة مظلة الحديقة','A dark screen panel is shown from above beside a framed garden canopy.'],
[79,null,'Residential Facade Work Overview','منظر عام لأعمال واجهة منزل','A street-side view of a multi-storey residence with an arched upper opening under installation.'],
[80,null,'Glazing Frame Delivery Team','فريق توصيل إطارات الزجاج','Workers unload and handle large framed units beside a delivery vehicle.'],
[81,null,'Arched Window Installation Close-Up','لقطة قريبة لتركيب نافذة مقوسة','A close-up of an arched upper-floor opening with a Doorhome banner below.'],
[82,null,'Arched Opening and Scaffolding','فتحة مقوسة وسقالات','An alternate view of the arched facade opening while installation work is in progress.']
];
const videoNames = {
  '10': ['Integrated Blind Slider Demonstration','عرض التحكم المنزلق للستارة داخل الزجاج','A hand moves the sliding control to adjust a blind inside a glazed sample.'],
  '11': ['Garden Canopy and Screens','مظلة الحديقة والستائر','An exterior overview of a framed canopy and dark screen panels beside a lawn.'],
  '2': ['Tall Residential Glazing','زجاج مرتفع لمدخل منزل','Exterior footage of tall dark-framed glazing beside a landscaped entrance.'],
  '3': ['Magnetic Blind Control Demonstration','عرض التحكم المغناطيسي للستارة','A control at the edge of a glazed sample adjusts the internal blind. No brand, dimensions or performance rating is asserted.'],
  '4': ['Restaurant Terrace Interior','داخل تراس المطعم','Video of dining tables, full-height glazing and overhead canopy panels.'],
  '5': ['Dining Terrace Canopy','مظلة تراس الطعام','Another view of the terrace glazing and roof structure above the dining area.'],
  '6': ['Black-Framed Window View','منظر نافذة بإطار أسود','A dark-framed glazed window shown from indoors with a view outside.'],
  '7': ['Showroom Window Operation','تشغيل نافذة في المعرض','An indoor window demonstration showing the framed sash and handle.'],
  '8': ['Outdoor Screen Installation','تركيب ستارة خارجية','Video of a broad dark outdoor screen beside the garden and framed canopy.'],
  '9': ['Motorized Blind Demonstration','عرض ستارة تعمل بالمحرك','A handheld controller operates a blind in a glazed display sample.'],
  'base': ['Window and Outdoor View','نافذة وإطلالة خارجية','Video of tall dark-framed glazing and the outdoor view.']
};
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const oldGallery = JSON.parse(fs.readFileSync(path.join(live,'cms_gallery_db.json')));
const gallery = [...oldGallery];
const products = JSON.parse(fs.readFileSync(path.join(live,'cms_products_db.json')));
const divisions = JSON.parse(fs.readFileSync(path.join(live,'cms_divisions_db.json')));
const homepage = JSON.parse(fs.readFileSync(path.join(live,'cms_homepage_db.json')));
const audit = [];
function media(file,title,arabic,description,category) {
  const h = hash(path.join(folder,file));
  const match = remote.find(x=>x.hash===h);
  if(!match) throw Error('Media not uploaded / hash mismatch: '+file);
  const existing = gallery.find(x=>x.src===match.src);
  const item = { ...(existing||{}), id:existing?.id||'asset-'+h.slice(0,16), title, description, src:match.src, mediaType:file.endsWith('.mp4')?'video':'image', category:category==='doors'?'doors':category==='glass'?'facade':'villa', location:'', system:'', arabicTitle:arabic };
  const idx=gallery.findIndex(x=>x.id===item.id);
  if(idx>=0) gallery[idx]=item; else gallery.push(item);
  audit.push({file,hash:h,src:match.src,title,category:category||'projects-only'});
  return match.src;
}
for(const [n,category,title,arabic,description] of rows) {
  const image=media(`photo_${n}_2026-09-26_07-36-01.jpg`,title,arabic,description,category);
  if(!category)continue;
  const id=`reviewed-photo-${n}`,modelId=`reviewed-design-${n}`;
  const product={id,name:title,arabicName:arabic,category,division:category,image,fallbackImage:image,description,features:[],modelId,currency:'USD',translations:{ar:{name:arabic,description:arabic+' — '+groups[category][1]}}};
  const at=products.findIndex(x=>x.id===id);if(at>=0)products[at]=product;else products.push(product);
}
for(const file of fs.readdirSync(folder).filter(x=>x.endsWith('.mp4'))) {
  const key=file.match(/\((\d+)\)/)?.[1]||'base'; const [title,ar,desc]=videoNames[key];media(file,title,ar,desc,null);
}
for(const [key,[title,ar,ku,iconName]] of Object.entries(groups)) {
  const items=products.filter(x=>x.id.startsWith('reviewed-photo-')&&x.category===key);
  const existing=divisions.find(x=>x.key===key);
  const models=items.map(x=>({id:x.modelId,productId:x.id,name:x.name,kurdishName:x.name,arabicName:x.arabicName,modelCode:'DESIGN-'+x.id.replace('reviewed-photo-',''),description:x.description,categoryTarget:key,image:x.image}));
  const sub={id:'reviewed-'+key,title:'Designs & Samples',arabicTitle:'تصاميم ونماذج',kurdishTitle:'دیزاین و نموونەکان',items:models};
  const division={...(existing||{}),id:existing?.id||'reviewed-category-'+key,key,title,arabicTitle:ar,kurdishTitle:ku,divisionLabel:title,arabicDivisionLabel:ar,kurdishDivisionLabel:ku,iconName,featuredImage:items[0].image,featuredTitle:title,featuredSubtitle:'Designs and installation examples',categoryTarget:key,subCategories:[...(existing?.subCategories||[]).filter(x=>x.id!==sub.id),sub]};
  const idx=divisions.findIndex(x=>x.key===key);if(idx>=0)divisions[idx]=division;else divisions.push(division);
}
const featured=[['legend-80',77],['lorenzo-70ls',45],['curtain-50f',16],['hs76-sliding',70],['winsa-dorado-76',68]];
homepage.showcaseProductIds={...homepage.showcaseProductIds};
homepage.showcaseImages={...homepage.showcaseImages};homepage.showcaseContent={...homepage.showcaseContent};
homepage.showcaseContentByLanguage={...homepage.showcaseContentByLanguage};
for(const [slot,n] of featured){const row=rows.find(x=>x[0]===n),a=audit.find(x=>x.file===`photo_${n}_2026-09-26_07-36-01.jpg`);homepage.showcaseImages[slot]=a.src;const text={title:row[2],subtitle:'Doorhome designs & installation examples',description:row[4]};homepage.showcaseContent[slot]=text;for(const lang of ['en','ar','ckb','kmr']){homepage.showcaseContentByLanguage[lang]={...homepage.showcaseContentByLanguage[lang],[slot]:lang==='ar'?{...text,title:row[3],subtitle:'تصاميم ونماذج تركيب دور هوم'}:text};}}
homepage.showcaseSectionText={...homepage.showcaseSectionText,en:{title:'Doors, Gates & Architectural Details',subtitle:'Explore entrance designs, glass railings, outdoor screens and glazing from our supplied portfolio.'},ar:{title:'أبواب وبوابات وتفاصيل معمارية',subtitle:'استكشف تصاميم المداخل والدرابزين الزجاجي والستائر الخارجية والواجهات الزجاجية.'}};
homepage.aboutFactoryImage=audit.find(x=>x.file.startsWith('photo_80_')).src;
homepage.showcaseSectionText.ckb={title:'دەرگا، دەروازە و وردەکارییە ئەندازیارییەکان',subtitle:'دیزاینی دەرگا، محجەری شووشە، سێبەری دەرەوە و ڕووکارە شووشەییەکان ببینە.'};
homepage.showcaseSectionText.kmr={title:'Derî, Dergeh û Hûrguliyên Mîmarî',subtitle:'Dîzaynên deriyan, parmakên camî, sîberên derve û rûyên camî bibîne.'};
for(const [slot,n] of featured)homepage.showcaseProductIds[slot]=`reviewed-photo-${n}`;
if(audit.length!==93||new Set(audit.map(x=>x.file)).size!==93)throw Error('Incomplete asset review');
for(const p of products.filter(x=>x.id.startsWith('reviewed-')))if(!divisions.some(d=>d.key===p.category&&d.subCategories.some(s=>s.items.some(m=>m.productId===p.id))))throw Error('Broken product link');
console.log(JSON.stringify({products,divisions,gallery,homepage,audit}));
