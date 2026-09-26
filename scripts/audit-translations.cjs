const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
function source(file) { return ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX); }
function declaration(file, name) {
  let value;
  const tree = source(file);
  function visit(n) {
    if (ts.isVariableDeclaration(n) && n.name.getText(tree) === name && n.initializer) {
      const code = ts.transpileModule('const result = ' + n.initializer.getText(tree), {compilerOptions: {target: ts.ScriptTarget.ES2020}}).outputText;
      value = vm.runInNewContext(code + '; result');
    }
    ts.forEachChild(n, visit);
  }
  visit(tree);
  if (!value) throw Error('Missing declaration ' + name);
  return value;
}
const languageFile = path.join(root, 'src/context/LanguageContext.tsx');
const languages = declaration(languageFile, 'SUPPORTED_LANGUAGES').map(x => x.code);
const app = declaration(path.join(root, 'src/data/translationsData.ts'), 'APP_TRANSLATIONS');
const legacy = declaration(languageFile, 'TRANSLATIONS');
const commonFile = path.join(root,'src/data/commonTranslations.ts');
const commonKeys = declaration(commonFile,'keys');
const common = declaration(commonFile,'COMMON_LABELS');
const keys = new Set();
const literals = [];
function scan(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) scan(file);
    else if (/\.tsx$/.test(file)) {
      const tree = source(file);
      function visit(n) {
        if (ts.isCallExpression(n) && n.expression.getText(tree) === 't' && n.arguments[0] && ts.isStringLiteral(n.arguments[0])) keys.add(n.arguments[0].text);
        let text;
        if (ts.isJsxText(n)) text = n.text.trim();
        if (ts.isJsxAttribute(n) && ['placeholder', 'title', 'aria-label', 'alt'].includes(n.name.getText(tree)) && n.initializer && ts.isStringLiteral(n.initializer)) text = n.initializer.text;
        if (text && /[A-Za-z\u0600-\u06ff]{2}/.test(text)) literals.push({file:path.relative(root,file),line:tree.getLineAndCharacterOfPosition(n.getStart(tree)).line+1,text});
        ts.forEachChild(n, visit);
      }
      visit(tree);
    }
  }
}
scan(path.join(root, 'src'));
const cmsRoot = process.argv[2];
const cms = {};
for (const section of ['products','gallery','divisions']) {
  const file = path.join(cmsRoot, `cms_${section}_db.json`);
  cms[section] = JSON.parse(fs.readFileSync(file,'utf8'));
}
const coverage = languages.map(language => {
  const base = language.split('-')[0];
  const dict = {...(legacy[base]||{}),...(legacy[language]||{}),...(app[base]||{}),...(app[language]||{})};
  commonKeys.forEach((key,index) => { dict[key] = (common[language] || common[base] || [])[index]; });
  const missingKeys = [...keys].filter(key => !dict[key] && !['working_hours_compact','footer_working_hours_time'].includes(key));
  const copiedEnglishKeys = base === 'en' ? [] : [...keys].filter(key => dict[key] && dict[key] === (app.en[key]||legacy.en[key]));
  const content = {};
  for (const [section, records] of Object.entries(cms)) {
    const missing = [];
    for (const record of records) {
      const text = record.translations?.[language] || record.translations?.[base];
      const name = text?.name || text?.title || (base === 'ar' ? record.arabicName || record.arabicTitle : base === 'ckb' ? record.kurdishName || record.kurdishTitle : null);
      const description = text?.description || (base === 'ar' ? record.arabicDescription : base === 'ckb' ? record.kurdishDescription : null);
      const sourceName = record.name || record.title;
      if (base !== 'en' && (!name || name === sourceName || (record.description && (!description || description === record.description)))) missing.push({id:record.id,title:sourceName,name:!name||name===sourceName,description:!!record.description&&(!description||description===record.description)});
    }
    content[section] = {total:records.length,translated:records.length-missing.length,missing};
  }
  const models = cms.divisions.flatMap(division => (division.subCategories || []).flatMap(sub => sub.items || []));
  content.models = {total:models.length, translated: models.filter(record => {
    if (base === 'en') return true;
    const linked = cms.products.find(product => product.id === record.productId || product.modelId === record.id) || record;
    const text = linked.translations?.[language] || linked.translations?.[base];
    return text?.name && text.name !== linked.name && (!linked.description || (text.description && text.description !== linked.description));
  }).length};
  return {language,missingKeys,copiedEnglishKeys,content};
});
const report = {createdAt:new Date().toISOString(),limits:'Static source audit plus saved CMS data; literal candidates require review. Matching English may be a legitimate brand or abbreviation. This does not certify every runtime state or linguistic quality.',enabledLanguages:languages.length,referencedKeys:keys.size,hardcodedCandidates:literals,coverage};
const output = path.join(root,'docs/translation-audit.json');
fs.writeFileSync(output,JSON.stringify(report,null,2));
const lines = [
  '# Translation audit', '',
  'Status: incomplete. Do not certify the app as fully translated.', '',
  `The source scan found ${keys.size} distinct literal translation keys and ${literals.length} hard-coded text candidates. Candidates include brand names, technical examples and inactive components, so this is not a confirmed defect count.`, '',
  'The table checks saved titles and descriptions together. English is the original content. Presence checks do not certify translation quality; existing Sorani samples also need editorial review. Dynamic keys, error messages and dictionaries inside components require additional review.', '',
  '| Language | Missing referenced UI keys | Product title + description | Project title + description | Category title | Model title + description |',
  '| --- | ---: | ---: | ---: | ---: | ---: |',
  ...coverage.map(x=>`| ${x.language} | ${x.missingKeys.length} | ${x.content.products.translated}/${x.content.products.total} | ${x.content.gallery.translated}/${x.content.gallery.total} | ${x.content.divisions.translated}/${x.content.divisions.total} | ${x.content.models.translated}/${x.content.models.total} |`), '',
  '## Remaining work', '',
  '- Manually translate the missing product/project content and category/model labels into the other enabled languages.',
  '- Review contact confirmations, request forms, admin screens, validation errors and accessibility labels identified in the JSON report.',
  '- Audit homepage overrides and component-specific dictionaries for copied English text.',
  '- Check every language in the browser, including authenticated screens. A source scan cannot prove every runtime state.', '',
  '## Changes in this pass', '',
  '- Resolved missing cart/navigation keys and added seven manually translated catalog/control labels across all enabled language variants.',
  '- Removed unrelated-language fallback rules (Italian for French/Spanish/Portuguese/Romanian and Arabic for Persian).',
  '- Corrected Arabic descriptions for the five homepage showcase cards.',
  '- Added short page/content reveals, drawer/menu/dialog entrances, hover/focus transitions and reduced-motion handling.', '',
  'The production bundle is newer than the local source. Only targeted frontend changes were deployed; the production backend was not replaced.', ''
];
fs.writeFileSync(path.join(root,'docs/TRANSLATION-AUDIT.md'),lines.join('\n'));
console.log(JSON.stringify({report:output,languages:languages.length,keys:keys.size,literalCandidates:literals.length,coverage:coverage.map(x=>({language:x.language,missingKeys:x.missingKeys.length,copiedEnglish:x.copiedEnglishKeys.length,products:x.content.products.translated,projects:x.content.gallery.translated,categories:x.content.divisions.translated}))},null,2));
