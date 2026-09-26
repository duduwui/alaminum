import dotenv from 'dotenv';
dotenv.config();

import { testDbConnection, initializePostgresSchema, seedPostgresCatalog, getPostgresStatus } from './db';
import { PRODUCT_DIVISIONS } from '../src/data/productNavigationData';
import { ALL_PRODUCTS } from '../src/data/winhomeData';

export async function runDatabaseSeed() {
  console.log('--- Winhome PostgreSQL Migration & Seeding ---');
  console.log('Database Status:', getPostgresStatus());

  const connected = await testDbConnection();
  if (!connected) {
    console.error('❌ Cannot connect to PostgreSQL database.');
    console.error('Please configure DATABASE_URL in .env (e.g. DATABASE_URL=postgresql://user:password@localhost:5432/winhome_db)');
    return { success: false, error: 'Database connection failed. Check .env configuration.' };
  }

  console.log('✅ PostgreSQL connected successfully!');
  console.log('⚙️ Initializing schema...');
  const schemaRes = await initializePostgresSchema();
  if (!schemaRes.success) {
    console.error('❌ Schema initialization failed:', schemaRes.error);
    return { success: false, error: schemaRes.error };
  }

  console.log('🌱 Seeding production categories, subcategories, models, and products...');
  const seedRes = await seedPostgresCatalog(PRODUCT_DIVISIONS, ALL_PRODUCTS);
  console.log(`✅ Seeded: ${seedRes.categories} categories, ${seedRes.subCategories} sub-categories, ${seedRes.models} models, ${seedRes.products} products.`);

  return {
    success: true,
    stats: seedRes,
    message: 'PostgreSQL database successfully initialized and seeded with full production catalog!'
  };
}

// Allow direct CLI execution
const isCli = process.argv[1]?.includes('seed.ts') || process.argv[1]?.includes('seed.cjs');
if (isCli) {
  runDatabaseSeed()
    .then((res) => {
      console.log('Done:', res);
      process.exit(res.success ? 0 : 1);
    })
    .catch((err) => {
      console.error('Fatal error during seed:', err);
      process.exit(1);
    });
}
