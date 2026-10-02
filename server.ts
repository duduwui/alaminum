import express from 'express';
import cloudTranslation from './server/cloudTranslation.cjs';
import path from 'path';
import fs from 'fs';
import { randomUUID, randomBytes, scryptSync, timingSafeEqual, createHash } from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  testDbConnection,
  initializePostgresSchema,
  getPostgresStatus,
  getQuotationRequests,
  saveQuotationRequest,
  updateQuotationRequest,
  deleteQuotationRequest,
  getUsers,
  saveUser,
  updateUser,
  deleteUser,
  getFinances,
  saveFinance,
  updateFinance,
  deleteFinance
} from './server/db';
import { runDatabaseSeed } from './server/seed';
import { SEARCH_PAGES, renderSearchMetadata } from './src/utils/searchMetadata';

dotenv.config();

const DB_FILE = path.join(process.cwd(), 'requests_db.json');
const USERS_FILE = path.join(process.cwd(), 'users_db.json');
const FINANCES_FILE = path.join(process.cwd(), 'finances_db.json');
const VISITS_FILE = path.join(process.cwd(), 'visits_db.json');
const RESET_FILE = path.join(process.cwd(), 'password_resets_db.json');
const REVIEWS_FILE = path.join(process.cwd(), 'reviews_db.json');
const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString('hex');
  return `scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
};
const passwordMatches = (password: string, stored: string) => {
  if (!stored?.startsWith('scrypt:')) return password === stored;
  const [, salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
};

function getInitialUsersData() {
  if (!process.env.SUPER_ADMIN_PASSWORD || process.env.SUPER_ADMIN_PASSWORD.length < 12) return [];
  return [
    {
      id: 'usr-admin-1',
      name: 'Doorhome Administrator',
      email: 'admin@doorhome.co',
      password: hashPassword(process.env.SUPER_ADMIN_PASSWORD),
      role: 'admin',
      phone: '+964 750 738 8748',
      company: 'Doorhome Company Headquarters',
      city: 'Erbil',
      status: 'active',
      createdAt: new Date().toISOString(),
      requestsCount: 0
    }
  ];
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const mediaUploadDir = path.join(process.cwd(), 'uploads');
  const adminSessionsFile = path.join(process.cwd(), 'admin_sessions_db.json');
  const cmsContentFiles = {
    homepage: path.join(process.cwd(), 'cms_homepage_db.json'),
    gallery: path.join(process.cwd(), 'cms_gallery_db.json'),
    products: path.join(process.cwd(), 'cms_products_db.json'),
    divisions: path.join(process.cwd(), 'cms_divisions_db.json')
  };
  const adminUploadSessions = new Map<string, { expires: number; userId: string }>();
  try {
    const storedSessions = JSON.parse(await fs.promises.readFile(adminSessionsFile, 'utf8'));
    if (Array.isArray(storedSessions)) {
      for (const entry of storedSessions) {
        if (Array.isArray(entry) && typeof entry[0] === 'string' && entry[1]?.expires > Date.now() && typeof entry[1]?.userId === 'string') {
          adminUploadSessions.set(entry[0], entry[1]);
        }
      }
    }
  } catch (error: any) {
    if (error.code !== 'ENOENT') console.warn('Could not restore admin sessions:', error);
  }
  let pendingSessionSave = Promise.resolve();
  const saveAdminSessions = () => {
    pendingSessionSave = pendingSessionSave.catch(() => {}).then(async () => {
      const temporaryFile = `${adminSessionsFile}.${randomUUID()}.tmp`;
      await fs.promises.writeFile(temporaryFile, JSON.stringify([...adminUploadSessions]), { mode: 0o600 });
      await fs.promises.rename(temporaryFile, adminSessionsFile);
    });
    return pendingSessionSave;
  };
  app.use('/uploads', express.static(mediaUploadDir));
  app.use('/products&assets', express.static(path.join(process.cwd(), 'products&assets')));
  app.use('/products-assets', express.static(path.join(process.cwd(), 'products&assets')));

  const getAdminCmsSessionToken = (req: express.Request) => {
    const candidates = [req.headers.authorization?.replace(/^Bearer\s+/i, ''), req.headers['x-admin-token'] as string,
      ...(req.headers.cookie?.split(';').map((part) => part.trim()).filter((part) => part.startsWith('dh_admin_session=')).map((part) => part.slice('dh_admin_session='.length)) || [])];
    return candidates.find((token) => token && (adminUploadSessions.get(token)?.expires || 0) > Date.now());
  };

  const sessionUserId = (req: express.Request) => {
    const sessionToken = getAdminCmsSessionToken(req);
    const session = sessionToken ? adminUploadSessions.get(sessionToken) : undefined;
    return session && session.expires >= Date.now() ? session.userId : null;
  };
  const hasAdminCmsSession = (req: express.Request) => Boolean(sessionUserId(req));
  const isSuperAdmin = (req: express.Request) => sessionUserId(req) === 'usr-admin-1';

  app.get('/api/cms/session', (req, res) => {
    res.json({ authenticated: hasAdminCmsSession(req) });
  });

  app.post('/api/cms/logout', async (req, res) => {
    const sessionToken = getAdminCmsSessionToken(req);
    if (sessionToken && adminUploadSessions.delete(sessionToken)) await saveAdminSessions();
    res.clearCookie('dh_admin_session', { path: '/' });
    res.clearCookie('dh_admin_session', { path: '/api' });
    res.json({ success: true });
  });

  app.get('/api/cms/:section', async (req, res) => {
    const file = cmsContentFiles[req.params.section as keyof typeof cmsContentFiles];
    if (!file) return res.status(404).json({ error: 'Unknown CMS section.' });
    try {
      const data = JSON.parse(await fs.promises.readFile(file, 'utf8'));
      return res.json({ data });
    } catch (error: any) {
      if (error.code === 'ENOENT') return res.json({ data: null });
      console.error('CMS read failed:', error);
      return res.status(500).json({ error: 'Could not load CMS content.' });
    }
  });

  // Check the admin session before accepting a potentially large upload body.
  app.post('/api/cms/upload', (req, res, next) => {
    if (!hasAdminCmsSession(req)) return res.status(401).json({ error: 'Your admin session expired. Sign in again to upload media.' });
    next();
  }, express.raw({ type: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'], limit: '100mb' }), async (req, res) => {
    const extensionByType: Record<string, string> = {
      'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif',
      'video/mp4': 'mp4', 'video/webm': 'webm'
    };
    const extension = extensionByType[req.headers['content-type'] || ''];
    if (!extension || !Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Please upload a supported image or MP4/WebM video.' });
    }
    try {
      await fs.promises.mkdir(mediaUploadDir, { recursive: true });
      const filename = `${randomUUID()}.${extension}`;
      await fs.promises.writeFile(path.join(mediaUploadDir, filename), req.body, { flag: 'wx' });
      res.status(201).json({ url: `/uploads/${filename}` });
    } catch (error) {
      console.error('CMS media upload failed:', error);
      res.status(500).json({ error: 'Media upload failed.' });
    }
  });

  app.use((error: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (error?.type === 'entity.too.large') return res.status(413).json({ error: 'File is too large. Upload a file smaller than 100 MB.' });
    next(error);
  });

  app.use(express.json({ limit: '50mb' }));

  // Anonymous visit analytics: one random browser ID, no IP address or personal data stored.
  let pendingVisitSave = Promise.resolve();
  app.post('/api/visits/heartbeat', async (req, res) => {
    const visitorId = String(req.body?.visitorId || '');
    if (!/^[a-f0-9-]{36}$/.test(visitorId)) return res.status(400).json({ error: 'Invalid visitor ID.' });
    try {
      pendingVisitSave = pendingVisitSave.catch(() => {}).then(async () => {
        const now = new Date();
        let visits: { visitorId: string; at: string; lastSeen: string }[] = [];
        try { visits = JSON.parse(await fs.promises.readFile(VISITS_FILE, 'utf8')); } catch { /* first visit */ }
        const active = visits.find((visit) => visit.visitorId === visitorId && Date.now() - Date.parse(visit.lastSeen) < 30 * 60_000);
        if (active) active.lastSeen = now.toISOString();
        else visits.push({ visitorId, at: now.toISOString(), lastSeen: now.toISOString() });
        const temporaryFile = `${VISITS_FILE}.${randomUUID()}.tmp`;
        await fs.promises.writeFile(temporaryFile, JSON.stringify(visits));
        await fs.promises.rename(temporaryFile, VISITS_FILE);
      });
      await pendingVisitSave;
      res.json({ ok: true });
    } catch { res.status(500).json({ error: 'Visit could not be recorded.' }); }
  });

  app.post('/api/visits/leave', async (req, res) => {
    const visitorId = String(req.body?.visitorId || '');
    if (!/^[a-f0-9-]{36}$/.test(visitorId)) return res.status(400).json({ error: 'Invalid visitor ID.' });
    try {
      pendingVisitSave = pendingVisitSave.catch(() => {}).then(async () => {
        let visits: { visitorId: string; at: string; lastSeen: string }[] = [];
        try { visits = JSON.parse(await fs.promises.readFile(VISITS_FILE, 'utf8')); } catch { /* ignore */ }
        visits.forEach((visit) => {
          if (visit.visitorId === visitorId) {
            visit.lastSeen = new Date(Date.now() - 100_000).toISOString();
          }
        });
        const temporaryFile = `${VISITS_FILE}.${randomUUID()}.tmp`;
        await fs.promises.writeFile(temporaryFile, JSON.stringify(visits));
        await fs.promises.rename(temporaryFile, VISITS_FILE);
      });
      await pendingVisitSave;
      res.json({ ok: true });
    } catch { res.status(500).json({ error: 'Failed' }); }
  });

  app.get('/api/visits/summary', async (req, res) => {
    if (!hasAdminCmsSession(req)) return res.status(401).json({ error: 'Administrator access required.' });
    let visits: { visitorId: string; at: string; lastSeen: string }[] = [];
    try { visits = JSON.parse(await fs.promises.readFile(VISITS_FILE, 'utf8')); } catch { /* no visits yet */ }
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7)).getTime();

    // summarize: visits = total session rows (counts repeat visits), unique = distinct visitor IDs
    const summarize = (items: typeof visits) => ({
      visits: items.length,
      unique: new Set(items.map((item) => item.visitorId)).size
    });

    // For live: check lastSeen across ALL rows (most recent heartbeat), 45s window
    const liveWindow = 45_000;
    const latestSeenByVisitor = new Map<string, number>();
    for (const v of visits) {
      const seen = Date.parse(v.lastSeen);
      const prev = latestSeenByVisitor.get(v.visitorId) ?? 0;
      if (seen > prev) latestSeenByVisitor.set(v.visitorId, seen);
    }
    const liveCount = Array.from(latestSeenByVisitor.entries()).filter(([, seen]) => seen >= Date.now() - liveWindow).length;

    res.json({
      total: summarize(visits),
      today: summarize(visits.filter((v) => Date.parse(v.at) >= todayStart)),
      month: summarize(visits.filter((v) => Date.parse(v.at) >= monthStart)),
      week: summarize(visits.filter((v) => Date.parse(v.at) >= weekStart)),
      live: { visits: liveCount, unique: liveCount }
    });
  });

  // Traffic history: per-day breakdown for admin analytics modal
  app.get('/api/visits/history', async (req, res) => {
    if (!hasAdminCmsSession(req)) return res.status(401).json({ error: 'Administrator access required.' });
    let visits: { visitorId: string; at: string; lastSeen: string }[] = [];
    try { visits = JSON.parse(await fs.promises.readFile(VISITS_FILE, 'utf8')); } catch { /* no visits yet */ }

    // Group visits by date string YYYY-MM-DD
    const byDay = new Map<string, { visits: number; uniqueSet: Set<string> }>();
    for (const v of visits) {
      const d = new Date(v.at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!byDay.has(key)) byDay.set(key, { visits: 0, uniqueSet: new Set() });
      const entry = byDay.get(key)!;
      entry.visits++;
      entry.uniqueSet.add(v.visitorId);
    }

    // Sort days newest first
    const daily = Array.from(byDay.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, data]) => ({
        date,
        visits: data.visits,
        unique: data.uniqueSet.size
      }));

    // Max visits per day (for volume bar %)
    const maxVisits = daily.reduce((m, d) => Math.max(m, d.visits), 1);

    res.json({
      daily: daily.map(d => ({ ...d, volumePct: Math.round((d.visits / maxVisits) * 100) })),
      totalDays: daily.length
    });
  });

  app.post('/api/translate', async (req, res) => {
    if (!hasAdminCmsSession(req)) return res.status(401).json({ error: 'Administrator access required for translation.' });
    if (!cloudTranslation.configured()) return res.status(503).json({ error: 'Google Cloud Translation is not configured. Add the server-side API key.' });
    const { text, name, description, sourceLang = 'auto', targets } = req.body || {};
    const requested = targets || cloudTranslation.LANGUAGES;
    if (!Array.isArray(requested) || !requested.length || requested.some((code: string) => !cloudTranslation.LANGUAGES.includes(code))) return res.status(400).json({error:'Unsupported target language.'});
    const isProduct = name !== undefined || description !== undefined;
    const strings = isProduct ? [name || '', description || ''] : [text || ''];
    if (strings.some(value => typeof value !== 'string') || strings.reduce((n,value)=>n+[...value].length,0)>10000) return res.status(400).json({error:'Invalid translation input (maximum 10,000 characters).'});
    try {
      const result = await cloudTranslation.translateAll(strings, sourceLang, requested);
      const translations = Object.fromEntries(Object.entries(result).map(([language,values]: [string, any]) => [language,isProduct ? {name:values[0],description:values[1]} : values[0]]));
      return res.json({success:true,provider:'google-cloud-nmt',translations});
    } catch {
      return res.status(502).json({error:'Google Cloud translation failed. Check credentials, billing and quota. No fallback text was marked translated.'});
    }
  });

  app.put('/api/cms/:section', async (req, res) => {
    if (!hasAdminCmsSession(req)) return res.status(401).json({ error: 'Sign in as an administrator to save content.' });
    const file = cmsContentFiles[req.params.section as keyof typeof cmsContentFiles];
    if (!file) return res.status(404).json({ error: 'Unknown CMS section.' });
    const data = req.body?.data;
    if ((['gallery', 'products', 'divisions'].includes(req.params.section) && !Array.isArray(data)) ||
        (req.params.section === 'homepage' && (!data || typeof data !== 'object' || Array.isArray(data)))) {
      return res.status(400).json({ error: 'Invalid CMS content.' });
    }
    try {
      const temporaryFile = `${file}.${randomUUID()}.tmp`;
      await fs.promises.writeFile(temporaryFile, JSON.stringify(data));
      await fs.promises.rename(temporaryFile, file);
      return res.json({ success: true });
    } catch (error) {
      console.error('CMS save failed:', error);
      return res.status(500).json({ error: 'Could not save CMS content.' });
    }
  });

  // Check PostgreSQL connection on boot
  console.log('🔄 Checking PostgreSQL connection...');
  const isConnected = await testDbConnection();
  const dbStatus = getPostgresStatus();

  if (isConnected) {
    console.log(`✅ [PostgreSQL] Connected to ${dbStatus.database}. Initializing tables...`);
    await initializePostgresSchema();
  } else {
    console.log(`ℹ️ [Database] Running in JSON Fallback Mode.`);
    console.log(`   To connect PostgreSQL on VPS or local, configure DATABASE_URL in .env`);
  }

  // --- HEALTH & STATUS ENDPOINTS ---
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      database: getPostgresStatus(),
      timestamp: new Date().toISOString()
    });
  });

  app.get('/api/db/status', (req, res) => {
    res.json(getPostgresStatus());
  });

  // --- QUOTATION REQUESTS (RFQs) ENDPOINTS ---
  app.get('/api/requests', async (req, res) => {
    if (!hasAdminCmsSession(req)) return res.status(401).json({ error: 'Administrator access required.' });
    try {
      const data = await getQuotationRequests();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/requests', async (req, res) => {
    try {
      const newRequest = req.body;
      if (!newRequest || !newRequest.customer || !Array.isArray(newRequest.items)) {
        return res.status(400).json({ error: 'Invalid request payload' });
      }

      const saved = await saveQuotationRequest(newRequest);

      // Increment user requests count if registered user
      if (newRequest.userId) {
        const users = await getUsers();
        const user = users.find((u: any) => u.id === newRequest.userId || u.email === newRequest.customer?.email);
        if (user) {
          await updateUser(user.id, { requestsCount: (user.requestsCount || 0) + 1 });
        }
      }

      res.status(201).json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch('/api/requests/:id', async (req, res) => {
    if (!hasAdminCmsSession(req)) return res.status(401).json({ error: 'Administrator access required.' });
    try {
      const { id } = req.params;
      const { status, adminNotes, quotedAmount } = req.body;

      const updated = await updateQuotationRequest(id, { status, adminNotes, quotedAmount });
      if (!updated) {
        return res.status(404).json({ error: 'Request not found' });
      }

      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/requests/:id', async (req, res) => {
    if (!hasAdminCmsSession(req)) return res.status(401).json({ error: 'Administrator access required.' });
    try {
      const { id } = req.params;
      await deleteQuotationRequest(id);
      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- USERS & ADMINS ENDPOINTS ---
  app.get('/api/users', async (req, res) => {
    if (!hasAdminCmsSession(req)) return res.status(401).json({ error: 'Administrator access required.' });
    try {
      const users = await getUsers();
      const sanitized = users.map((u: any) => {
        const { password, ...rest } = u;
        return rest;
      });
      res.json(sanitized);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      if (!hasAdminCmsSession(req)) return res.status(401).json({ error: 'Administrator access required.' });
      const { username, password } = req.body;
      if (!/^[a-zA-Z0-9._-]{3,32}$/.test(username || '') || typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ error: 'Use a 3–32 character username and a password of at least 8 characters.' });
      }
      const email = `${username.toLowerCase()}@admins.doorhome.local`;
      const users = await getUsers();
      if (users.some((u: any) => u.email.toLowerCase() === email)) {
        return res.status(409).json({ error: 'This username already exists.' });
      }

      const newUser = {
        id: `usr-${Date.now()}`,
        name: username,
        username,
        email,
        password: hashPassword(password),
        role: 'admin',
        phone: '', company: '', city: '', status: 'active',
        createdAt: new Date().toISOString(),
        requestsCount: 0
      };

      await saveUser(newUser);

      const { password: _, ...userWithoutPass } = newUser;
      res.status(201).json(userWithoutPass);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch('/api/users/:id', async (req, res) => {
    try {
      if (!hasAdminCmsSession(req)) return res.status(401).json({ error: 'Administrator access required.' });
      const { id } = req.params;
      if (id === 'usr-admin-1') return res.status(403).json({ error: 'The super admin account is managed outside this panel.' });
      const updates: Record<string, unknown> = {};
      if (typeof req.body.status === 'string' && ['active', 'disabled'].includes(req.body.status)) updates.status = req.body.status;
      if (typeof req.body.password === 'string' && req.body.password.length >= 8) updates.password = hashPassword(req.body.password);
      if (typeof req.body.username === 'string' && /^[a-zA-Z0-9._-]{3,32}$/.test(req.body.username)) {
        updates.name = req.body.username;
        updates.email = `${req.body.username.toLowerCase()}@admins.doorhome.local`;
      }

      const updated = await updateUser(id, updates);
      if (!updated) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { password: _, ...sanitized } = updated;
      if (updates.status === 'disabled') {
        for (const [token, session] of adminUploadSessions) if (session.userId === id) adminUploadSessions.delete(token);
        await saveAdminSessions();
      }
      res.json(sanitized);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/users/:id', async (req, res) => {
    try {
      if (!hasAdminCmsSession(req)) return res.status(401).json({ error: 'Administrator access required.' });
      const { id } = req.params;
      if (id === 'usr-admin-1') return res.status(403).json({ error: 'The super admin account cannot be deleted.' });
      for (const [token, session] of adminUploadSessions) if (session.userId === id) adminUploadSessions.delete(token);
      await saveAdminSessions();
      await deleteUser(id);
      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- AUTHENTICATION (LOGIN & REGISTRATION) ENDPOINTS ---
  // ─── Google OAuth 2.0 ────────────────────────────────────────────────────────
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
  const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'https://doorhome.company/api/auth/google/callback';

  // Step 1: Redirect user to Google login
  app.get('/api/auth/google', (req, res) => {
    if (!GOOGLE_CLIENT_ID) return res.status(503).json({ error: 'Google OAuth not configured' });
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_CALLBACK_URL,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account'
    });
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  });

  // Step 2: Google redirects back here with a code
  app.get('/api/auth/google/callback', async (req, res) => {
    const code = req.query.code as string;
    if (!code) return res.redirect('/#auth?error=google_denied');
    try {
      // Exchange code for tokens
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: GOOGLE_CALLBACK_URL,
          grant_type: 'authorization_code'
        })
      });
      const tokenData: any = await tokenRes.json();
      if (!tokenData.access_token) return res.redirect('/#auth?error=google_token');

      // Get user info from Google
      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const googleUser: any = await userInfoRes.json();
      if (!googleUser.email) return res.redirect('/#auth?error=google_info');

      // Find or create user in our DB
      let users = await getUsers();
      let user = users.find((u: any) => u.email.toLowerCase() === googleUser.email.toLowerCase());

      if (!user) {
        // Auto-register via Google
        user = {
          id: `usr-google-${randomUUID().split('-')[0]}`,
          name: googleUser.name || googleUser.email.split('@')[0],
          email: googleUser.email.toLowerCase(),
          password: hashPassword(randomUUID()), // random locked password — Google auth only
          role: 'customer',
          phone: '',
          company: '',
          city: '',
          status: 'active',
          provider: 'google',
          googleId: googleUser.id,
          avatar: googleUser.picture || '',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          requestsCount: 0
        };
        await saveUser(user);
      } else {
        // Update last login & avatar
        await updateUser(user.id, {
          lastLogin: new Date().toISOString(),
          avatar: googleUser.picture || user.avatar || '',
          provider: 'google'
        });
      }

      if (user.status === 'disabled') return res.redirect('/#auth?error=account_disabled');

      // Issue session token (same as normal login)
      const sessionToken = randomUUID();
      if (user.role === 'admin' || user.role === 'super_admin') {
        adminUploadSessions.set(sessionToken, { expires: Date.now() + 12 * 60 * 60 * 1000, userId: user.id });
        await saveAdminSessions();
        res.cookie('dh_admin_session', sessionToken, { httpOnly: true, sameSite: 'lax', secure: true, path: '/', maxAge: 12 * 60 * 60 * 1000 });
      }

      const { password: _, ...userWithoutPass } = user;
      // Encode user data for frontend
      const encoded = Buffer.from(JSON.stringify({ token: sessionToken, user: userWithoutPass })).toString('base64');
      res.redirect(`/#auth?google_success=${encoded}`);
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      res.redirect('/#auth?error=google_failed');
    }
  });
  // ─────────────────────────────────────────────────────────────────────────────

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      let users = await getUsers();
      if (!users || users.length === 0) {
        users = getInitialUsersData();
        if (users.length === 0) return res.status(503).json({ error: 'Super admin setup is required. Configure SUPER_ADMIN_PASSWORD on the server.' });
        await saveUser(users[0]);
      }

      const loginId = String(email).trim().toLowerCase();
      const user = users.find((u: any) =>
        (u.email.toLowerCase() === loginId ||
          (u.role === 'admin' && u.email.toLowerCase() === `${loginId}@admins.doorhome.local`) ||
          (u.id === 'usr-admin-1' && (loginId === 'admin' || loginId.startsWith('admin@doorhome.'))) ||
          (u.role === 'admin' && loginId === 'admin')) &&
        passwordMatches(password, u.password));

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      if (user.status === 'disabled') {
        return res.status(403).json({ error: 'Account has been disabled by administrator' });
      }

      await updateUser(user.id, { lastLogin: new Date().toISOString(), ...(user.password.startsWith('scrypt:') ? {} : { password: hashPassword(password) }) });

      let sessionToken: string | undefined;
      if (user.role === 'admin' || user.role === 'super_admin' || user.id === 'usr-admin-1') {
        sessionToken = randomUUID();
        adminUploadSessions.set(sessionToken, { expires: Date.now() + 12 * 60 * 60 * 1000, userId: user.id });
        await saveAdminSessions();
        res.cookie('dh_admin_session', sessionToken, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 12 * 60 * 60 * 1000 });
      }

      const { password: _, ...userWithoutPass } = user;
      res.json({
        success: true,
        token: sessionToken,
        user: userWithoutPass
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password, phone, company, city } = req.body;
      if (!name || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.endsWith('@admins.doorhome.local') || typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ error: 'Enter your name, valid email, and a password of at least 8 characters.' });
      }

      const users = await getUsers();
      if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
      }

      const newUser = {
        id: `usr-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password: hashPassword(password),
        role: 'user',
        phone: phone || '',
        company: company || '',
        city: city || 'Erbil (Hawler)',
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        requestsCount: 0
      };

      await saveUser(newUser);

      const { password: _, ...userWithoutPass } = newUser;
      res.status(201).json({
        success: true,
        user: userWithoutPass
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/forgot-password', async (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!email.includes('@')) return res.status(400).json({ error: 'Enter your account email.' });
    if (!process.env.RESEND_API_KEY || !process.env.RESET_EMAIL_FROM || !process.env.PUBLIC_APP_URL) {
      return res.status(503).json({ error: 'Email recovery is not configured yet. Contact Doorhome to reset your password.' });
    }
    const users = await getUsers();
    const user = users.find((entry: any) => entry.email.toLowerCase() === email && entry.role === 'user');
    if (user) {
      const token = randomBytes(32).toString('hex');
      let records: { userId: string; hash: string; expires: number }[] = [];
      try { records = JSON.parse(await fs.promises.readFile(RESET_FILE, 'utf8')); } catch { /* first reset */ }
      records = records.filter((item) => item.expires > Date.now() && item.userId !== user.id);
      records.push({ userId: user.id, hash: createHash('sha256').update(token).digest('hex'), expires: Date.now() + 30 * 60_000 });
      const url = `${process.env.PUBLIC_APP_URL.replace(/\/$/, '')}/?reset=${token}#auth`;
      const mail = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.RESET_EMAIL_FROM, to: email, subject: 'Reset your Doorhome password', text: `Open this link within 30 minutes to set a new password: ${url}` }) });
      if (!mail.ok) return res.status(502).json({ error: 'Recovery email could not be sent. Please try again.' });
      await fs.promises.writeFile(RESET_FILE, JSON.stringify(records), { mode: 0o600 });
    }
    res.json({ message: 'If that email has a client account, a reset link is on its way.' });
  });

  app.post('/api/auth/reset-password', async (req, res) => {
    const token = String(req.body?.token || '');
    const password = String(req.body?.password || '');
    if (!/^[a-f0-9]{64}$/.test(token) || password.length < 8) return res.status(400).json({ error: 'Invalid link or password shorter than 8 characters.' });
    let records: { userId: string; hash: string; expires: number }[] = [];
    try { records = JSON.parse(await fs.promises.readFile(RESET_FILE, 'utf8')); } catch { /* no reset */ }
    const hash = createHash('sha256').update(token).digest('hex');
    const record = records.find((item) => item.hash === hash && item.expires > Date.now());
    if (!record) return res.status(400).json({ error: 'This reset link has expired. Request a new one.' });
    const user = (await getUsers()).find((entry: any) => entry.id === record.userId && entry.role === 'user');
    if (!user) return res.status(400).json({ error: 'This reset link is invalid.' });
    await updateUser(user.id, { password: hashPassword(password) });
    await fs.promises.writeFile(RESET_FILE, JSON.stringify(records.filter((item) => item.userId !== user.id)), { mode: 0o600 });
    res.json({ success: true });
  });

  app.post('/api/auth/change-password', async (req, res) => {
    const userId = sessionUserId(req);
    if (!userId) return res.status(401).json({ error: 'Sign in again.' });
    const user = (await getUsers()).find((entry: any) => entry.id === userId);
    if (!user || !passwordMatches(String(req.body?.currentPassword || ''), user.password)) return res.status(401).json({ error: 'Current password is incorrect.' });
    const newPassword = String(req.body?.newPassword || '');
    if (newPassword.length < 8) return res.status(400).json({ error: 'New password must have at least 8 characters.' });
    await updateUser(user.id, { password: hashPassword(newPassword) });
    const currentToken = getAdminCmsSessionToken(req);
    for (const [token, session] of adminUploadSessions) if (session.userId === user.id && token !== currentToken) adminUploadSessions.delete(token);
    await saveAdminSessions();
    res.json({ success: true });
  });

  // --- FINANCIALS & LEDGER ENDPOINTS ---
  app.get('/api/finances', async (req, res) => {
    if (!hasAdminCmsSession(req)) return res.status(401).json({ error: 'Administrator access required.' });
    try {
      const data = await getFinances();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/finances', async (req, res) => {
    if (!hasAdminCmsSession(req)) return res.status(401).json({ error: 'Administrator access required.' });
    try {
      const newRecord = req.body;
      if (!newRecord || !newRecord.clientName || !newRecord.totalAmount) {
        return res.status(400).json({ error: 'Invalid financial record payload' });
      }

      const recordWithId = {
        ...newRecord,
        id: newRecord.id || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: newRecord.date || new Date().toISOString().split('T')[0],
        pendingAmount: Math.max(0, (newRecord.totalAmount || 0) - (newRecord.paidAmount || 0)),
        status:
          newRecord.paidAmount >= newRecord.totalAmount
            ? 'paid'
            : newRecord.paidAmount > 0
            ? 'partial'
            : 'pending'
      };

      const saved = await saveFinance(recordWithId);
      res.status(201).json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch('/api/finances/:id', async (req, res) => {
    if (!hasAdminCmsSession(req)) return res.status(401).json({ error: 'Administrator access required.' });
    try {
      const { id } = req.params;
      const updates = req.body;

      const updated = await updateFinance(id, updates);
      if (!updated) {
        return res.status(404).json({ error: 'Financial record not found' });
      }

      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/finances/:id', async (req, res) => {
    if (!hasAdminCmsSession(req)) return res.status(401).json({ error: 'Administrator access required.' });
    try {
      const { id } = req.params;
      await deleteFinance(id);
      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- CLIENT REVIEWS & RATINGS ENDPOINTS ---
  app.get('/api/reviews', async (_req, res) => {
    try {
      if (!fs.existsSync(REVIEWS_FILE)) {
        return res.json([]);
      }
      const data = JSON.parse(await fs.promises.readFile(REVIEWS_FILE, 'utf8'));
      res.json(Array.isArray(data) ? data : []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/reviews', express.json(), async (req, res) => {
    try {
      let list: any[] = [];
      if (fs.existsSync(REVIEWS_FILE)) {
        try {
          list = JSON.parse(await fs.promises.readFile(REVIEWS_FILE, 'utf8'));
          if (!Array.isArray(list)) list = [];
        } catch { list = []; }
      }
      const newReview = {
        id: `rev-${Date.now()}`,
        name: String(req.body.name || 'عميل معتمد').slice(0, 100),
        city: String(req.body.city || 'العراق').slice(0, 100),
        role: String(req.body.role || '').slice(0, 100),
        rating: Math.min(5, Math.max(1, Number(req.body.rating) || 5)),
        comment: String(req.body.comment || '').slice(0, 2000),
        date: new Date().toISOString().split('T')[0],
        categories: req.body.categories || { quality: 5, speed: 5, engineering: 5, installation: 5 },
        verified: true
      };
      list.unshift(newReview);
      await fs.promises.writeFile(REVIEWS_FILE, JSON.stringify(list, null, 2), 'utf8');
      res.json({ success: true, review: newReview });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- SYSTEM & POSTGRESQL SEEDING ENDPOINTS ---
  app.post('/api/system/seed-postgres', async (req, res) => {
    if (!isSuperAdmin(req)) return res.status(403).json({ error: 'Super admin access required.' });
    try {
      const result = await runDatabaseSeed();
      if (!result.success) {
        return res.status(500).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/system/clear-data', async (req, res) => {
    if (!isSuperAdmin(req)) return res.status(403).json({ error: 'Super admin access required.' });
    try {
      // Clear RFQ requests and finances, preserve admin user
      fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
      fs.writeFileSync(FINANCES_FILE, JSON.stringify([], null, 2), 'utf-8');

      const allUsers = await getUsers();
      const preservedAdmins = allUsers.filter((u: any) => u.role === 'admin');
      const seedAdmin = preservedAdmins;
      fs.writeFileSync(USERS_FILE, JSON.stringify(seedAdmin, null, 2), 'utf-8');

      res.json({
        success: true,
        message: 'All transactions, requests, and non-admin client data cleared successfully.'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/system/reset-data', async (req, res) => {
    if (!isSuperAdmin(req)) return res.status(403).json({ error: 'Super admin access required.' });
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
      fs.writeFileSync(FINANCES_FILE, JSON.stringify([], null, 2), 'utf-8');
      res.json({ success: true, message: 'Requests and finances cleared. Administrator accounts were preserved.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite middleware for development vs static production serve
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'));

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.get(Object.keys(SEARCH_PAGES), async (req, res, next) => {
      try {
        const template = await fs.promises.readFile(path.join(process.cwd(), 'index.html'), 'utf8');
        res.type('html').send(await vite.transformIndexHtml(req.originalUrl, renderSearchMetadata(template, req.path)));
      } catch (error) { next(error); }
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
    app.get('*', async (req, res, next) => {
      try {
        if (req.path.startsWith('/api/') || /\.[a-z0-9]+$/i.test(req.path)) return res.status(404).send('Not found');
        const template = await fs.promises.readFile(path.join(distPath, 'index.html'), 'utf8');
        res.type('html').send(renderSearchMetadata(template, req.path));
      } catch (error) { next(error); }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Winhome Server running on http://localhost:${PORT}`);
  });
}

startServer();
