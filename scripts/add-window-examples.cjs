// One-time, additive VPS import. Still images are taken from the supplied demonstrations.
const fs=require('fs'),path=require('path');
const root='/var/www/doorhome';
const read=n=>JSON.parse(fs.readFileSync(path.join(root,`cms_${n}_db.json`)));
const products=read('products'),divisions=read('divisions'),gallery=read('gallery');
const examples=[
 ['glazed-window','Dark-Framed Glazed Window Example','نموذج نافذة زجاجية بإطار داكن','A still from the supplied window video showing a dark frame and a clear outdoor view. This is an installation example, not a verified branded model.'],
 ['window-operation','Operable Glazed Window Demonstration','نموذج نافذة زجاجية قابلة للفتح','A still from the showroom window-operation video. Exact opening modes, profile dimensions and manufacturer specifications require confirmation.'],
 ['blind-slider','Window Sample with Sliding Blind Control','نموذج نافذة بتحكم منزلق للستارة','A glazed sample with an integrated blind operated by a sliding control. The window profile brand and blind specifications are not identified.'],
 ['blind-magnetic','Window Sample with Magnetic Blind Control','نموذج نافذة بتحكم مغناطيسي للستارة','A glazed display sample demonstrating a magnetic control for its integrated blind. No size or performance rating is assumed.'],
 ['blind-motorized','Window Sample with Motorized Blind','نموذج نافذة بستارة تعمل بالمحرك','A glazed display sample with an internal blind demonstrated using a handheld controller. Brand and technical specifications require confirmation.']
];
for(const [key,name,ar,description]of examples){const image=`/uploads/window-examples-20260926/${key}.jpg`;const p={id:'window-example-'+key,name,arabicName:ar,category:'windows',division:'windows',image,fallbackImage:image,description,features:[],modelId:'window-design-'+key,translations:{ar:{name:ar,description:'نموذج من فيديو العرض المقدم. '+ar+'. العلامة التجارية والمقاسات والمواصفات بحاجة إلى تأكيد.'}}};const at=products.findIndex(x=>x.id===p.id);if(at<0)products.push(p);else products[at]=p;}
const arch=gallery.find(x=>x.title==='Arched Window Installation Close-Up');if(!arch)throw Error('Missing reviewed arched window photo');
const p={id:'window-example-arched',name:'Arched Window Installation Example',arabicName:'نموذج تركيب نافذة مقوسة',category:'windows',division:'windows',image:arch.src,fallbackImage:arch.src,description:'An arched upper-floor glazed opening photographed during installation. The image establishes its shape, not the manufacturer, glazing specification or performance rating.',features:[],modelId:'window-design-arched',translations:{ar:{name:'نموذج تركيب نافذة مقوسة',description:'فتحة زجاجية مقوسة في الطابق العلوي أثناء التركيب. الصورة توضح الشكل ولا تثبت العلامة التجارية أو مواصفات الزجاج.'}}};const at=products.findIndex(x=>x.id===p.id);if(at<0)products.push(p);else products[at]=p;
const samples=products.filter(x=>x.id.startsWith('window-example-'));
const models=samples.map(x=>({id:x.modelId,productId:x.id,name:x.name,kurdishName:x.name,arabicName:x.arabicName,modelCode:'EXAMPLE',description:x.description,categoryTarget:'windows',image:x.image}));
const sub={id:'window-example-series',title:'Window Examples',arabicTitle:'نماذج النوافذ',kurdishTitle:'نموونەی پەنجەرەکان',items:models};
const existing=divisions.find(x=>x.key==='windows');const division={...existing,id:existing?.id||'reviewed-category-windows',key:'windows',title:'Window Systems',arabicTitle:'أنظمة النوافذ',kurdishTitle:'سیستەمی پەنجەرەکان',divisionLabel:'Window Examples',arabicDivisionLabel:'نماذج النوافذ',kurdishDivisionLabel:'نموونەی پەنجەرەکان',iconName:'LayoutGrid',featuredImage:samples[0].image,featuredTitle:'Window Systems',featuredSubtitle:'Examples from supplied demonstrations',categoryTarget:'windows',subCategories:[...(existing?.subCategories||[]).filter(x=>x.id!==sub.id),sub]};const d=divisions.findIndex(x=>x.key==='windows');if(d<0)divisions.push(division);else divisions[d]=division;
for(const x of samples)if(!fs.existsSync(root+x.image))throw Error('Missing window image '+x.id);
const backup=fs.mkdtempSync('/var/backups/doorhome-window-examples-');fs.chmodSync(backup,0o700);
for(const [section,data]of Object.entries({products,divisions})){const filename=path.join(root,`cms_${section}_db.json`);fs.copyFileSync(filename,path.join(backup,path.basename(filename)));const temp=filename+'.window-import.tmp';fs.writeFileSync(temp,JSON.stringify(data,null,2));fs.renameSync(temp,filename);}
console.log(`Added ${samples.length} window examples; preserved gallery. Backup: ${backup}`);
