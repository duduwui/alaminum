const { Pool } = require('pg');
const fs = require('fs');

async function sync() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://doorhome_user:Doorhome_Pg_2026_SecureKey@localhost:5432/doorhome_db'
  });

  const products = JSON.parse(fs.readFileSync('cms_products_db.json', 'utf8'));
  const gallery = JSON.parse(fs.readFileSync('cms_gallery_db.json', 'utf8'));

  console.log('Read ' + products.length + ' products, ' + gallery.length + ' gallery items.');

  // 1. Update cms_content
  await pool.query(`
    INSERT INTO cms_content (section_key, data, updated_at)
    VALUES ('products', $1, CURRENT_TIMESTAMP)
    ON CONFLICT (section_key) DO UPDATE
    SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
  `, [JSON.stringify(products)]);

  await pool.query(`
    INSERT INTO cms_content (section_key, data, updated_at)
    VALUES ('gallery', $1, CURRENT_TIMESTAMP)
    ON CONFLICT (section_key) DO UPDATE
    SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
  `, [JSON.stringify(gallery)]);

  console.log('cms_content table updated successfully.');

  // 2. Sync products table
  await pool.query('DELETE FROM products;');
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    await pool.query(`
      INSERT INTO products (
        id, name, kurdish_name, arabic_name,
        category, division, sub_category, model_name,
        image, description, kurdish_description, arabic_description,
        base_price, selling_price, currency, unit,
        specs, features, is_active, sort_order,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [
      p.id,
      p.name || '',
      p.translations?.ckb?.name || '',
      p.arabicName || p.translations?.ar?.name || '',
      p.category || '',
      p.division || '',
      p.subCategory || '',
      p.modelNumber || p.id,
      p.image || '',
      p.description || '',
      p.translations?.ckb?.description || '',
      p.arabicDescription || p.translations?.ar?.description || '',
      p.basePrice || p.price || 0,
      p.price || 0,
      'USD',
      'm²',
      JSON.stringify(p.technicalSpecs || {}),
      JSON.stringify(p.features || {}),
      true,
      i
    ]);
  }

  console.log('products table synced with ' + products.length + ' products.');
  await pool.end();
}

sync().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
