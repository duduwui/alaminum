const fs = require('fs');
const { Client } = require('pg');

async function sync() {
  const products = JSON.parse(fs.readFileSync('/var/www/doorhome/cms_products_db.json', 'utf8'));
  const client = new Client({ connectionString: 'postgres://doorhome_user:Doorhome_Pg_2026_SecureKey@localhost:5432/doorhome_db' });
  await client.connect();

  console.log('Connected to Postgres.');

  // 1. Update cms_content 'products'
  await client.query(
    'INSERT INTO cms_content (section_key, data, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (section_key) DO UPDATE SET data = $2, updated_at = NOW()',
    ['products', JSON.stringify(products)]
  );
  console.log('Updated cms_content products key.');

  // 2. Clear old products and insert the pristine 61 products
  await client.query('DELETE FROM products');
  console.log('Cleared old products table.');

  const insertSql = `
    INSERT INTO products (
      id, name, kurdish_name, arabic_name,
      category, division, sub_category, model_name,
      image, description, kurdish_description, arabic_description,
      base_price, selling_price, currency, unit, badge, rating,
      specs, features, is_active, sort_order
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
  `;

  for (let idx = 0; idx < products.length; idx++) {
    const p = products[idx];
    const arName = p.arabicName || p.translations?.ar?.name || p.name;
    const ckbName = p.kurdishName || p.translations?.ckb?.name || p.name;
    const arDesc = p.arabicDescription || p.translations?.ar?.description || p.description;
    const ckbDesc = p.kurdishDescription || p.translations?.ckb?.description || p.description;
    const subCat = p.subCategory || p.translations?.ar?.subCategory || p.translations?.ckb?.subCategory || '';

    await client.query(insertSql, [
      p.id,
      p.name,
      ckbName,
      arName,
      p.category,
      p.division || p.category,
      subCat,
      p.modelNumber || '',
      p.image,
      p.description,
      ckbDesc,
      arDesc,
      p.basePrice || 0,
      p.sellingPrice || 0,
      p.currency || 'USD',
      p.unit || 'م²',
      p.badge || (idx < 5 ? 'Architectural Special' : null),
      4.9,
      JSON.stringify(p.specs || {}),
      JSON.stringify(p.features || []),
      true,
      idx
    ]);
  }

  const res = await client.query('SELECT category, count(*) FROM products GROUP BY category ORDER BY count DESC');
  console.log('Database sync complete! Products by category:');
  console.table(res.rows);

  await client.end();
}

sync().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
