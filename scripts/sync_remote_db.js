const { Pool } = require('pg');
const fs = require('fs');

async function sync() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://doorhome_user:Doorhome_Pg_2026_SecureKey@localhost:5432/doorhome_db'
  });

  const filesToSync = [
    { key: 'products', file: 'cms_products_db.json' },
    { key: 'gallery', file: 'cms_gallery_db.json' },
    { key: 'homepageSectionSlides', file: 'cms_homepage_section_slides_db.json' },
    { key: 'archShowcase', file: 'cms_arch_showcase_db.json' },
    { key: 'divisions', file: 'cms_divisions_db.json' },
    { key: 'homepageSections', file: 'cms_homepage_sections_db.json' }
  ];

  for (const item of filesToSync) {
    if (fs.existsSync(item.file)) {
      const data = JSON.parse(fs.readFileSync(item.file, 'utf8'));
      await pool.query(`
        INSERT INTO cms_content (section_key, data, updated_at)
        VALUES ($1, $2, CURRENT_TIMESTAMP)
        ON CONFLICT (section_key) DO UPDATE
        SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
      `, [item.key, JSON.stringify(data)]);
      console.log(`Synced cms_content for key "${item.key}" (${Array.isArray(data) ? data.length + ' items' : 'object'}).`);
    }
  }

  // Sync products table
  const products = JSON.parse(fs.readFileSync('cms_products_db.json', 'utf8'));
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

  console.log(`products table synced with ${products.length} products.`);
  await pool.end();
}

sync().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
