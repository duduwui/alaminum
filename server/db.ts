import { Pool, QueryResult } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Default JSON storage paths for graceful dual-mode fallback
const REQUESTS_FILE = path.join(process.cwd(), 'requests_db.json');
const USERS_FILE = path.join(process.cwd(), 'users_db.json');
const FINANCES_FILE = path.join(process.cwd(), 'finances_db.json');

let pool: Pool | null = null;
let isConnected = false;
let connectionChecked = false;
let lastConnectionError: string | null = null;

/**
 * Initialize PostgreSQL connection pool if configured
 */
export function getPool(): Pool | null {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  const hasPgEnv = !!(process.env.PGHOST || process.env.PGUSER || process.env.PGDATABASE);

  if (!connectionString && !hasPgEnv) {
    // Neither DATABASE_URL nor discrete PG variables are provided
    return null;
  }

  try {
    pool = new Pool({
      connectionString: connectionString || undefined,
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432', 10),
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || '',
      database: process.env.PGDATABASE || 'winhome_db',
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 10000,
      max: 10,
    });

    pool.on('error', (err) => {
      console.warn('[PostgreSQL Pool Warning]:', err.message);
      isConnected = false;
      lastConnectionError = err.message;
    });

    return pool;
  } catch (err: any) {
    console.warn('[PostgreSQL Init Warning]:', err.message);
    lastConnectionError = err.message;
    return null;
  }
}

/**
 * Test PostgreSQL connectivity
 */
export async function testDbConnection(): Promise<boolean> {
  const p = getPool();
  if (!p) {
    isConnected = false;
    connectionChecked = true;
    lastConnectionError = 'No DATABASE_URL or PostgreSQL credentials provided in environment';
    return false;
  }

  try {
    const client = await p.connect();
    try {
      await client.query('SELECT 1');
      isConnected = true;
      lastConnectionError = null;
      return true;
    } finally {
      client.release();
    }
  } catch (err: any) {
    isConnected = false;
    lastConnectionError = err.message;
    return false;
  } finally {
    connectionChecked = true;
  }
}

export function isPostgresActive(): boolean {
  return isConnected;
}

export function getPostgresStatus() {
  return {
    configured: !!(process.env.DATABASE_URL || process.env.PGHOST),
    connected: isConnected,
    connectionChecked,
    error: lastConnectionError,
    database: process.env.PGDATABASE || (process.env.DATABASE_URL ? 'configured via URL' : 'winhome_db'),
    mode: isConnected ? 'postgresql' : 'json_fallback'
  };
}

/**
 * Execute schema.sql to ensure all required tables and indexes exist
 */
export async function initializePostgresSchema(): Promise<{ success: boolean; error?: string }> {
  const p = getPool();
  if (!p || !isConnected) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      return { success: false, error: 'schema.sql not found at ' + schemaPath };
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    await p.query(schemaSql);
    console.log('✅ [PostgreSQL] Schema successfully verified & updated.');
    return { success: true };
  } catch (err: any) {
    console.error('❌ [PostgreSQL] Schema initialization error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Safe query runner with parameterized inputs
 */
export async function dbQuery<T = any>(text: string, params: any[] = []): Promise<QueryResult<T>> {
  const p = getPool();
  if (!p || !isConnected) {
    throw new Error('PostgreSQL is not connected');
  }
  return p.query<T>(text, params);
}

// ============================================================================
// JSON Fallback File Helpers
// ============================================================================

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (e) {
    return fallback;
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error(`Error writing fallback file ${filePath}:`, e);
  }
}

// ============================================================================
// Data Access Methods (Dual-Mode: PostgreSQL primary, JSON write-through/fallback)
// ============================================================================

// --- 1. Quotation Requests ---
export async function getQuotationRequests(): Promise<any[]> {
  if (isConnected) {
    try {
      const res = await dbQuery(
        'SELECT id, user_id as "userId", customer, items, status, admin_notes as "adminNotes", quoted_amount as "quotedAmount", created_at as "createdAt", updated_at as "updatedAt" FROM quotation_requests ORDER BY created_at DESC'
      );
      return res.rows.map((row: any) => ({ ...row, kind: Array.isArray(row.items) && row.items.length === 0 ? 'contact' : 'product', totalQuantity: (row.items || []).reduce((sum: number, item: any) => sum + (Number(item.quantity) || 0), 0) }));
    } catch (e: any) {
      console.warn('[PostgreSQL getRequests failed, falling back to JSON]:', e.message);
    }
  }
  return readJsonFile(REQUESTS_FILE, []);
}

export async function saveQuotationRequest(reqData: any): Promise<any> {
  // Always update JSON for local safety
  const jsonCurrent = readJsonFile<any[]>(REQUESTS_FILE, []);
  const jsonUpdated = [reqData, ...jsonCurrent.filter((r) => r.id !== reqData.id)];
  writeJsonFile(REQUESTS_FILE, jsonUpdated);

  if (isConnected) {
    try {
      await dbQuery(
        `INSERT INTO quotation_requests (id, user_id, customer, items, status, admin_notes, quoted_amount, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
         ON CONFLICT (id) DO UPDATE SET
           customer = EXCLUDED.customer,
           items = EXCLUDED.items,
           status = EXCLUDED.status,
           admin_notes = EXCLUDED.admin_notes,
           quoted_amount = EXCLUDED.quoted_amount,
           updated_at = NOW()`,
        [
          reqData.id,
          reqData.userId || null,
          JSON.stringify(reqData.customer || {}),
          JSON.stringify(reqData.items || []),
          reqData.status || 'pending',
          reqData.adminNotes || null,
          reqData.quotedAmount || null,
          reqData.createdAt || new Date().toISOString()
        ]
      );
    } catch (e: any) {
      console.warn('[PostgreSQL saveRequest error]:', e.message);
    }
  }

  return reqData;
}

export async function updateQuotationRequest(id: string, updates: any): Promise<any> {
  const jsonCurrent = readJsonFile<any[]>(REQUESTS_FILE, []);
  const targetIdx = jsonCurrent.findIndex((r) => r.id === id);
  let updatedRecord = null;

  if (targetIdx !== -1) {
    jsonCurrent[targetIdx] = { ...jsonCurrent[targetIdx], ...updates };
    updatedRecord = jsonCurrent[targetIdx];
    writeJsonFile(REQUESTS_FILE, jsonCurrent);
  }

  if (isConnected) {
    try {
      const sets: string[] = ['updated_at = NOW()'];
      const vals: any[] = [id];
      let valIdx = 2;

      if (updates.status !== undefined) {
        sets.push(`status = $${valIdx++}`);
        vals.push(updates.status);
      }
      if (updates.adminNotes !== undefined) {
        sets.push(`admin_notes = $${valIdx++}`);
        vals.push(updates.adminNotes);
      }
      if (updates.quotedAmount !== undefined) {
        sets.push(`quoted_amount = $${valIdx++}`);
        vals.push(updates.quotedAmount);
      }

      await dbQuery(`UPDATE quotation_requests SET ${sets.join(', ')} WHERE id = $1`, vals);
    } catch (e: any) {
      console.warn('[PostgreSQL updateRequest error]:', e.message);
    }
  }

  return updatedRecord;
}

export async function deleteQuotationRequest(id: string): Promise<boolean> {
  const jsonCurrent = readJsonFile<any[]>(REQUESTS_FILE, []);
  writeJsonFile(REQUESTS_FILE, jsonCurrent.filter((r) => r.id !== id));

  if (isConnected) {
    try {
      await dbQuery('DELETE FROM quotation_requests WHERE id = $1', [id]);
    } catch (e: any) {
      console.warn('[PostgreSQL deleteRequest error]:', e.message);
    }
  }

  return true;
}

// --- 2. Users & Admins ---
export async function getUsers(): Promise<any[]> {
  if (isConnected) {
    try {
      const res = await dbQuery(
        'SELECT id, name, email, password, role, phone, company, city, status, requests_count as "requestsCount", last_login as "lastLogin", created_at as "createdAt" FROM users ORDER BY created_at ASC'
      );
      return res.rows;
    } catch (e: any) {
      console.warn('[PostgreSQL getUsers failed, falling back to JSON]:', e.message);
    }
  }
  return readJsonFile(USERS_FILE, []);
}

export async function saveUser(user: any): Promise<any> {
  const jsonCurrent = readJsonFile<any[]>(USERS_FILE, []);
  const filtered = jsonCurrent.filter((u) => u.id !== user.id && u.email.toLowerCase() !== user.email.toLowerCase());
  writeJsonFile(USERS_FILE, [user, ...filtered]);

  if (isConnected) {
    try {
      await dbQuery(
        `INSERT INTO users (id, name, email, password, role, phone, company, city, status, requests_count, last_login, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
         ON CONFLICT (email) DO UPDATE SET
           name = EXCLUDED.name,
           password = EXCLUDED.password,
           role = EXCLUDED.role,
           phone = EXCLUDED.phone,
           company = EXCLUDED.company,
           city = EXCLUDED.city,
           status = EXCLUDED.status,
           requests_count = EXCLUDED.requests_count,
           last_login = EXCLUDED.last_login,
           updated_at = NOW()`,
        [
          user.id,
          user.name,
          user.email.toLowerCase(),
          user.password,
          user.role || 'user',
          user.phone || '',
          user.company || '',
          user.city || 'Erbil (Hawler)',
          user.status || 'active',
          user.requestsCount || 0,
          user.lastLogin || null,
          user.createdAt || new Date().toISOString()
        ]
      );
    } catch (e: any) {
      console.warn('[PostgreSQL saveUser error]:', e.message);
    }
  }

  return user;
}

export async function updateUser(id: string, updates: any): Promise<any> {
  const jsonCurrent = readJsonFile<any[]>(USERS_FILE, []);
  const targetIdx = jsonCurrent.findIndex((u) => u.id === id);
  let updatedRecord = null;

  if (targetIdx !== -1) {
    jsonCurrent[targetIdx] = { ...jsonCurrent[targetIdx], ...updates };
    updatedRecord = jsonCurrent[targetIdx];
    writeJsonFile(USERS_FILE, jsonCurrent);
  }

  if (isConnected) {
    try {
      const sets: string[] = ['updated_at = NOW()'];
      const vals: any[] = [id];
      let valIdx = 2;

      for (const [key, val] of Object.entries(updates)) {
        if (key === 'id') continue;
        const colMap: Record<string, string> = {
          name: 'name',
          email: 'email',
          password: 'password',
          role: 'role',
          phone: 'phone',
          company: 'company',
          city: 'city',
          status: 'status',
          requestsCount: 'requests_count',
          lastLogin: 'last_login'
        };
        const col = colMap[key];
        if (col) {
          sets.push(`${col} = $${valIdx++}`);
          vals.push(key === 'email' ? String(val).toLowerCase() : val);
        }
      }

      await dbQuery(`UPDATE users SET ${sets.join(', ')} WHERE id = $1`, vals);
    } catch (e: any) {
      console.warn('[PostgreSQL updateUser error]:', e.message);
    }
  }

  return updatedRecord;
}

export async function deleteUser(id: string): Promise<boolean> {
  const jsonCurrent = readJsonFile<any[]>(USERS_FILE, []);
  writeJsonFile(USERS_FILE, jsonCurrent.filter((u) => u.id !== id));

  if (isConnected) {
    try {
      await dbQuery('DELETE FROM users WHERE id = $1', [id]);
    } catch (e: any) {
      console.warn('[PostgreSQL deleteUser error]:', e.message);
    }
  }

  return true;
}

// --- 3. Financials ---
export async function getFinances(): Promise<any[]> {
  if (isConnected) {
    try {
      const res = await dbQuery(
        'SELECT id, request_id as "requestId", client_name as "clientName", project_title as "projectTitle", date::text as date, total_amount as "totalAmount", paid_amount as "paidAmount", pending_amount as "pendingAmount", status, notes, created_at as "createdAt" FROM finances ORDER BY date DESC'
      );
      return res.rows.map(r => ({
        ...r,
        totalAmount: Number(r.totalAmount),
        paidAmount: Number(r.paidAmount),
        pendingAmount: Number(r.pendingAmount)
      }));
    } catch (e: any) {
      console.warn('[PostgreSQL getFinances failed, falling back to JSON]:', e.message);
    }
  }
  return readJsonFile(FINANCES_FILE, []);
}

export async function saveFinance(record: any): Promise<any> {
  const jsonCurrent = readJsonFile<any[]>(FINANCES_FILE, []);
  const filtered = jsonCurrent.filter((f) => f.id !== record.id);
  writeJsonFile(FINANCES_FILE, [record, ...filtered]);

  if (isConnected) {
    try {
      await dbQuery(
        `INSERT INTO finances (id, request_id, client_name, project_title, date, total_amount, paid_amount, pending_amount, status, notes, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
         ON CONFLICT (id) DO UPDATE SET
           client_name = EXCLUDED.client_name,
           project_title = EXCLUDED.project_title,
           date = EXCLUDED.date,
           total_amount = EXCLUDED.total_amount,
           paid_amount = EXCLUDED.paid_amount,
           pending_amount = EXCLUDED.pending_amount,
           status = EXCLUDED.status,
           notes = EXCLUDED.notes,
           updated_at = NOW()`,
        [
          record.id,
          record.requestId || null,
          record.clientName,
          record.projectTitle || '',
          record.date || new Date().toISOString().split('T')[0],
          record.totalAmount || 0,
          record.paidAmount || 0,
          record.pendingAmount || 0,
          record.status || 'pending',
          record.notes || null,
          record.createdAt || new Date().toISOString()
        ]
      );
    } catch (e: any) {
      console.warn('[PostgreSQL saveFinance error]:', e.message);
    }
  }

  return record;
}

export async function updateFinance(id: string, updates: any): Promise<any> {
  const jsonCurrent = readJsonFile<any[]>(FINANCES_FILE, []);
  const targetIdx = jsonCurrent.findIndex((f) => f.id === id);
  let updatedRecord = null;

  if (targetIdx !== -1) {
    jsonCurrent[targetIdx] = { ...jsonCurrent[targetIdx], ...updates };
    updatedRecord = jsonCurrent[targetIdx];
    writeJsonFile(FINANCES_FILE, jsonCurrent);
  }

  if (isConnected) {
    try {
      const sets: string[] = ['updated_at = NOW()'];
      const vals: any[] = [id];
      let valIdx = 2;

      const colMap: Record<string, string> = {
        clientName: 'client_name',
        projectTitle: 'project_title',
        date: 'date',
        totalAmount: 'total_amount',
        paidAmount: 'paid_amount',
        pendingAmount: 'pending_amount',
        status: 'status',
        notes: 'notes'
      };

      for (const [key, val] of Object.entries(updates)) {
        if (key === 'id') continue;
        const col = colMap[key];
        if (col) {
          sets.push(`${col} = $${valIdx++}`);
          vals.push(val);
        }
      }

      await dbQuery(`UPDATE finances SET ${sets.join(', ')} WHERE id = $1`, vals);
    } catch (e: any) {
      console.warn('[PostgreSQL updateFinance error]:', e.message);
    }
  }

  return updatedRecord;
}

export async function deleteFinance(id: string): Promise<boolean> {
  const jsonCurrent = readJsonFile<any[]>(FINANCES_FILE, []);
  writeJsonFile(FINANCES_FILE, jsonCurrent.filter((f) => f.id !== id));

  if (isConnected) {
    try {
      await dbQuery('DELETE FROM finances WHERE id = $1', [id]);
    } catch (e: any) {
      console.warn('[PostgreSQL deleteFinance error]:', e.message);
    }
  }

  return true;
}

// --- 4. Catalog Seeding (Categories, Subcategories, Models, Products) ---
export async function seedPostgresCatalog(
  divisions: any[],
  products: any[]
): Promise<{ categories: number; subCategories: number; models: number; products: number }> {
  if (!isConnected) {
    throw new Error('PostgreSQL database is not connected. Check DATABASE_URL or database credentials.');
  }

  let catCount = 0;
  let subCatCount = 0;
  let modelCount = 0;
  let prodCount = 0;

  // 1. Seed Categories, SubCategories, Models
  for (let dIdx = 0; dIdx < divisions.length; dIdx++) {
    const div = divisions[dIdx];
    const catId = div.id || `div-${div.key}`;

    await dbQuery(
      `INSERT INTO categories (id, key, title, kurdish_title, arabic_title, featured_image, featured_title, featured_subtitle, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET
         key = EXCLUDED.key,
         title = EXCLUDED.title,
         kurdish_title = EXCLUDED.kurdish_title,
         arabic_title = EXCLUDED.arabic_title,
         featured_image = EXCLUDED.featured_image,
         featured_title = EXCLUDED.featured_title,
         featured_subtitle = EXCLUDED.featured_subtitle,
         sort_order = EXCLUDED.sort_order`,
      [
        catId,
        div.key,
        div.title,
        div.kurdishTitle || div.title,
        div.arabicTitle || div.title,
        div.featuredImage || '',
        div.featuredTitle || div.title,
        div.featuredSubtitle || '',
        dIdx
      ]
    );
    catCount++;

    if (Array.isArray(div.subCategories)) {
      for (let sIdx = 0; sIdx < div.subCategories.length; sIdx++) {
        const sub = div.subCategories[sIdx];
        const subId = sub.id || `${catId}-sub-${sIdx}`;

        await dbQuery(
          `INSERT INTO sub_categories (id, category_id, title, kurdish_title, arabic_title, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO UPDATE SET
             title = EXCLUDED.title,
             kurdish_title = EXCLUDED.kurdish_title,
             arabic_title = EXCLUDED.arabic_title,
             sort_order = EXCLUDED.sort_order`,
          [
            subId,
            catId,
            sub.title,
            sub.kurdishTitle || sub.title,
            sub.arabicTitle || sub.title,
            sIdx
          ]
        );
        subCatCount++;

        if (Array.isArray(sub.models)) {
          for (let mIdx = 0; mIdx < sub.models.length; mIdx++) {
            const m = sub.models[mIdx];
            const mId = m.id || `${subId}-m-${mIdx}`;

            await dbQuery(
              `INSERT INTO models (id, sub_category_id, category_key, name, kurdish_name, arabic_name, model_code, description, image, badge, specs, sort_order)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
               ON CONFLICT (id) DO UPDATE SET
                 name = EXCLUDED.name,
                 kurdish_name = EXCLUDED.kurdish_name,
                 arabic_name = EXCLUDED.arabic_name,
                 model_code = EXCLUDED.model_code,
                 description = EXCLUDED.description,
                 image = EXCLUDED.image,
                 badge = EXCLUDED.badge,
                 specs = EXCLUDED.specs,
                 sort_order = EXCLUDED.sort_order`,
              [
                mId,
                subId,
                div.key,
                m.name,
                m.kurdishName || m.name,
                m.arabicName || m.name,
                m.modelCode || m.name,
                m.description || '',
                m.image || '',
                m.badge || null,
                JSON.stringify(m.specs || {}),
                mIdx
              ]
            );
            modelCount++;
          }
        }
      }
    }
  }

  // 2. Seed Products
  for (let pIdx = 0; pIdx < products.length; pIdx++) {
    const p = products[pIdx];
    await dbQuery(
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

  return { categories: catCount, subCategories: subCatCount, models: modelCount, products: prodCount };
}
