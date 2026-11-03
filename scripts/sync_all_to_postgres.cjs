const fs = require('fs');
const { Pool } = require('pg');

async function syncAll() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://doorhome_user:Doorhome_Pg_2026_SecureKey@localhost:5432/doorhome_db'
  });

  console.log('Connecting to PostgreSQL...');
  
  const prods = JSON.parse(fs.readFileSync('/var/www/doorhome/cms_products_db.json', 'utf8'));
  const gallery = JSON.parse(fs.readFileSync('/var/www/doorhome/cms_gallery_db.json', 'utf8'));
  const slides = JSON.parse(fs.readFileSync('/var/www/doorhome/cms_homepage_section_slides_db.json', 'utf8'));
  const arch = JSON.parse(fs.readFileSync('/var/www/doorhome/cms_arch_showcase_db.json', 'utf8'));
  const divisions = JSON.parse(fs.readFileSync('/var/www/doorhome/cms_divisions_db.json', 'utf8'));

  // 1. Sync cms_content: products
  await pool.query(`
    INSERT INTO cms_content (section_key, data, updated_at)
    VALUES ('products', $1, CURRENT_TIMESTAMP)
    ON CONFLICT (section_key) DO UPDATE
    SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
  `, [JSON.stringify(prods)]);
  console.log(`✓ Synced ${prods.length} products to cms_content.`);

  // 2. Sync cms_content: gallery
  await pool.query(`
    INSERT INTO cms_content (section_key, data, updated_at)
    VALUES ('gallery', $1, CURRENT_TIMESTAMP)
    ON CONFLICT (section_key) DO UPDATE
    SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
  `, [JSON.stringify(gallery)]);
  console.log(`✓ Synced ${gallery.length} gallery items to cms_content.`);

  // 3. Sync cms_content: homepageSectionSlides
  await pool.query(`
    INSERT INTO cms_content (section_key, data, updated_at)
    VALUES ('homepageSectionSlides', $1, CURRENT_TIMESTAMP)
    ON CONFLICT (section_key) DO UPDATE
    SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
  `, [JSON.stringify(slides)]);
  console.log(`✓ Synced ${slides.length} homepageSectionSlides to cms_content.`);

  // 4. Sync cms_content: archShowcase
  await pool.query(`
    INSERT INTO cms_content (section_key, data, updated_at)
    VALUES ('archShowcase', $1, CURRENT_TIMESTAMP)
    ON CONFLICT (section_key) DO UPDATE
    SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
  `, [JSON.stringify(arch)]);
  console.log(`✓ Synced ${arch.length} archShowcase items to cms_content.`);

  // 5. Sync cms_content: divisions
  await pool.query(`
    INSERT INTO cms_content (section_key, data, updated_at)
    VALUES ('divisions', $1, CURRENT_TIMESTAMP)
    ON CONFLICT (section_key) DO UPDATE
    SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
  `, [JSON.stringify(divisions)]);
  console.log(`✓ Synced ${divisions.length} divisions to cms_content.`);

  // 6. Sync products table
  await pool.query('DELETE FROM products;');
  for (let i = 0; i < prods.length; i++) {
    const p = prods[i];
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
      p.kurdishName || p.ckbName || p.translations?.ckb?.name || '',
      p.arabicName || p.translations?.ar?.name || '',
      p.category || '',
      p.division || '',
      p.subCategory || '',
      p.modelNumber || p.id,
      p.image || '',
      p.description || '',
      p.kurdishDescription || p.ckbDescription || p.translations?.ckb?.description || '',
      p.arabicDescription || p.translations?.ar?.description || '',
      p.basePrice || p.price || 0,
      p.price || 0,
      'USD',
      'm²',
      JSON.stringify(p.technicalSpecs || p.specs || {}),
      JSON.stringify(p.features || {}),
      true,
      i
    ]);
  }
  console.log(`✓ Synced products table with ${prods.length} rows.`);

  await pool.end();
  console.log('★ All PostgreSQL tables successfully synced and updated.');
}

syncAll().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
