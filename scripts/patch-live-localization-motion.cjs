// Patch the current production bundle so newer backend/auth changes are preserved.
// Prints an apply_patch patch; never writes the bundle directly.
const fs = require('fs'), acorn = require('acorn'), diff = require('diff');
const file = process.argv[2], s = fs.readFileSync(file,'utf8');
const ast = acorn.parse(s,{ecmaVersion:'latest',sourceType:'module'});
const edits = [];
const labels = {'Close':'ui_close','Close cart':'ui_close','Open mobile menu':'ui_menu','Clear search':'ui_clear_search','Decrease quantity':'ui_quantity_less','Increase quantity':'ui_quantity_more','Remove item':'ui_remove_item','No products match this category or search.':'ui_no_products'};
let fallbackCount = 0, labelCount = 0;
function walk(n, parent, functionName) {
  if (!n || typeof n !== 'object') return;
  if (n.type === 'FunctionDeclaration') functionName = n.id?.name;
  if (functionName === 'zd' && n.type === 'IfStatement' && /\["es", "pt", "ro", "fr"\]|\["fa"\]/.test(s.slice(n.test.start,n.test.end))) {
    edits.push([n.start,n.end,'']); fallbackCount++; return;
  }
  if (n.type === 'Literal' && labels[n.value] && parent?.type === 'Property' && ['children','aria-label','title'].includes(parent.key.name || parent.key.value)) {
    edits.push([n.start,n.end,`DoorhomeMessages.getCommonText(document.documentElement.lang,${JSON.stringify(labels[n.value])})`]); labelCount++;
  }
  if (n.type === 'Literal' && parent?.type === 'CallExpression' && ['cart_title','nav_why_winhome'].includes(n.value)) edits.push([n.start,n.end,JSON.stringify(n.value === 'cart_title' ? 'cart_drawer_title' : 'nav_why_doorhome')]);
  for (const v of Object.values(n)) if (Array.isArray(v)) v.forEach(x=>walk(x,n,functionName)); else if(v && typeof v === 'object') walk(v,n,functionName);
}
walk(ast);
if (fallbackCount !== 2 || labelCount < 5) throw Error('Unexpected production structure');
let next = s;
for (const [a,b,r] of edits.sort((a,b)=>b[0]-a[0])) next = next.slice(0,a)+r+next.slice(b);
function replace(a,b) { if (!next.includes(a)) throw Error('Missing patch target: '+a); next = next.replace(a,b); }
replace('l.jsx("main", { className: "flex-1 w-full relative",','l.jsx("main", { "data-doorhome-page": t + ":" + (c?.id || ""), className: "flex-1 w-full relative",');
replace('className: "relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right"','"data-doorhome-drawer": true, className: "relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10"');
// Mark cart panels without modifying their form state or submission handlers.
next = next.replace(/className: "(w-full sm:w-\[460px\] md:w-\[500px\][^"]+)"/g,'"data-doorhome-drawer": true, className: "$1"');
next = next.replaceAll('["ckb", "kmr"].includes(o.code)', '(o.code === "ckb")');
acorn.parse(next,{ecmaVersion:'latest',sourceType:'module'});
const patch = diff.createPatch(file,s,next,'','',{context:0}).split('\n').slice(4).filter(x=>!x.startsWith('\\ No newline')).map(x=>x.startsWith('@@')?'@@':x).join('\n');
console.log('*** Begin Patch\n*** Update File: '+file+'\n'+patch+'*** End Patch');
