import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgres://doorhome_user:Doorhome_Pg_2026_SecureKey@localhost:5432/doorhome_db';

const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 5000,
});

async function migrate() {
  console.log('🚀 Starting Data Migration to PostgreSQL...');
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // 1. Migrate CMS sections
    const cmsSections = [
      { key: 'homepage', file: 'cms_homepage_db.json' },
      { key: 'gallery', file: 'cms_gallery_db.json' },
      { key: 'products', file: 'cms_products_db.json' },
      { key: 'divisions', file: 'cms_divisions_db.json' },
      { key: 'partnerLogos', file: 'cms_partner_logos_db.json' }
    ];

    for (const section of cmsSections) {
      const filePath = path.join(process.cwd(), section.file);
      if (fs.existsSync(filePath)) {
        try {
          const raw = fs.readFileSync(filePath, 'utf-8');
          const data = JSON.parse(raw);
          await client.query(
            `INSERT INTO cms_content (section_key, data, updated_at)
             VALUES ($1, $2, NOW())
             ON CONFLICT (section_key) DO UPDATE SET
               data = EXCLUDED.data,
               updated_at = NOW()`,
            [section.key, JSON.stringify(data)]
          );
          console.log(`✅ Migrated CMS section: ${section.key}`);
        } catch (e: any) {
          console.warn(`⚠️ Warning migrating CMS section ${section.key}:`, e.message);
        }
      }
    }

    // 2. Migrate Users
    const usersFile = path.join(process.cwd(), 'users_db.json');
    if (fs.existsSync(usersFile)) {
      try {
        const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
        if (Array.isArray(users)) {
          let userCount = 0;
          for (const u of users) {
            await client.query(
              `INSERT INTO users (id, name, email, password, role, phone, company, city, status, requests_count, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
               ON CONFLICT (id) DO UPDATE SET
                 name = EXCLUDED.name,
                 password = EXCLUDED.password,
                 role = EXCLUDED.role,
                 phone = EXCLUDED.phone,
                 company = EXCLUDED.company,
                 city = EXCLUDED.city,
                 status = EXCLUDED.status,
                 requests_count = EXCLUDED.requests_count`,
              [
                u.id || `usr-${Date.now()}`,
                u.name || 'User',
                u.email || `user-${Date.now()}@doorhome.co`,
                u.password || '',
                u.role || 'user',
                u.phone || '',
                u.company || '',
                u.city || 'Erbil',
                u.status || 'active',
                u.requestsCount || 0,
                u.createdAt || new Date().toISOString()
              ]
            );
            userCount++;
          }
          console.log(`✅ Migrated ${userCount} users`);
        }
      } catch (e: any) {
        console.warn('⚠️ Warning migrating users:', e.message);
      }
    }

    // 3. Migrate Quotation Requests
    const reqsFile = path.join(process.cwd(), 'requests_db.json');
    if (fs.existsSync(reqsFile)) {
      try {
        const reqs = JSON.parse(fs.readFileSync(reqsFile, 'utf-8'));
        if (Array.isArray(reqs)) {
          let reqCount = 0;
          for (const r of reqs) {
            await client.query(
              `INSERT INTO quotation_requests (id, user_id, customer, items, status, admin_notes, quoted_amount, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
               ON CONFLICT (id) DO UPDATE SET
                 customer = EXCLUDED.customer,
                 items = EXCLUDED.items,
                 status = EXCLUDED.status,
                 admin_notes = EXCLUDED.admin_notes,
                 quoted_amount = EXCLUDED.quoted_amount`,
              [
                r.id,
                r.userId || null,
                JSON.stringify(r.customer || {}),
                JSON.stringify(r.items || []),
                r.status || 'pending',
                r.adminNotes || null,
                r.quotedAmount || null,
                r.createdAt || new Date().toISOString()
              ]
            );
            reqCount++;
          }
          console.log(`✅ Migrated ${reqCount} quotation requests`);
        }
      } catch (e: any) {
        console.warn('⚠️ Warning migrating quotation requests:', e.message);
      }
    }

    // 4. Migrate Products from cms_products_db.json
    const productsFile = path.join(process.cwd(), 'cms_products_db.json');
    if (fs.existsSync(productsFile)) {
      try {
        const prods = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
        if (Array.isArray(prods)) {
          let prodCount = 0;
          for (let pIdx = 0; pIdx < prods.length; pIdx++) {
            const p = prods[pIdx];
            await client.query(
              `INSERT INTO products (
                id, name, kurdish_name, arabic_name, category, division, sub_category,
                image, description, kurdish_description, arabic_description,
                base_price, selling_price, currency, unit, badge, rating, specs, features, sort_order
               ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
               ON CONFLICT (id) DO UPDATE SET
                 name = EXCLUDED.name,
                 kurdish_name = EXCLUDED.kurdish_name,
                 arabic_name = EXCLUDED.arabic_name,
                 category = EXCLUDED.category,
                 division = EXCLUDED.division,
                 sub_category = EXCLUDED.sub_category,
                 image = EXCLUDED.image,
                 description = EXCLUDED.description,
                 base_price = EXCLUDED.base_price,
                 selling_price = EXCLUDED.selling_price,
                 specs = EXCLUDED.specs,
                 features = EXCLUDED.features`,
              [
                p.id,
                p.name,
                p.kurdishName || p.name,
                p.arabicName || p.name,
                p.category || 'windows',
                p.division || p.category || 'windows',
                p.subCategory || '',
                p.image || '',
                p.description || '',
                p.kurdishDescription || p.description || '',
                p.arabicDescription || p.description || '',
                p.basePrice || p.pricePerSqm || 150,
                p.pricePerSqm || p.basePrice || 150,
                p.currency || 'USD',
                'm²',
                p.discountBadge || null,
                p.rating || 4.9,
                JSON.stringify(p.specs || {}),
                JSON.stringify(p.features || []),
                pIdx
              ]
            );
            prodCount++;
          }
          console.log(`✅ Migrated ${prodCount} products to table 'products'`);
        }
      } catch (e: any) {
        console.warn('⚠️ Warning migrating products table:', e.message);
      }
    }

    await client.query('COMMIT');
    console.log('🎉 Migration completed successfully!');
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((e) => {
  console.error(e);
  process.exit(1);
});
