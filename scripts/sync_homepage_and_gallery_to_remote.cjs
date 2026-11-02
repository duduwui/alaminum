const fs = require('fs');
const { Client } = require('pg');

async function sync() {
  const slides = JSON.parse(fs.readFileSync('/var/www/doorhome/cms_homepage_section_slides_db.json', 'utf8'));
  const gallery = JSON.parse(fs.readFileSync('/var/www/doorhome/cms_gallery_db.json', 'utf8'));

  const client = new Client({ connectionString: 'postgres://doorhome_user:Doorhome_Pg_2026_SecureKey@localhost:5432/doorhome_db' });
  await client.connect();

  console.log('Connected to Postgres.');

  // 1. Update homepageSectionSlides
  await client.query(
    'INSERT INTO cms_content (section_key, data, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (section_key) DO UPDATE SET data = $2, updated_at = NOW()',
    ['homepageSectionSlides', JSON.stringify(slides)]
  );
  console.log('✓ Successfully synced homepageSectionSlides to Postgres.');

  // 2. Update gallery
  await client.query(
    'INSERT INTO cms_content (section_key, data, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (section_key) DO UPDATE SET data = $2, updated_at = NOW()',
    ['gallery', JSON.stringify(gallery)]
  );
  console.log('✓ Successfully synced gallery to Postgres.');

  const res = await client.query('SELECT section_key, length(data::text), updated_at FROM cms_content WHERE section_key IN (\'homepageSectionSlides\', \'gallery\')');
  console.table(res.rows);

  await client.end();
}

sync().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
