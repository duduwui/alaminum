import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const DB_FILE = path.join(process.cwd(), 'requests_db.json');

// Initialize database file with sample requests if not exists
function getInitialDbData() {
  return [
    {
      id: 'WH-2026-8492',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      status: 'new',
      customer: {
        fullName: 'Kak Dana Farhad',
        phone: '+964 750 445 8899',
        email: 'dana.farhad@kurdoil.com',
        company: 'Farhad Villa Project',
        city: 'Erbil (Dream City)',
        projectType: 'Luxury Private Villa',
        timeline: '1 Month',
        serviceNeeded: 'Full Fabrication & Installation by Winhome Engineers',
        preferredContact: 'whatsapp',
        additionalNotes: 'Require high thermal insulation against summer heat. Master bedroom requires maximum acoustic isolation.'
      },
      items: [
        {
          id: 'item-1',
          productId: 'legend-80',
          productName: 'Deceuninck Legend 80',
          category: 'upvc',
          image: '/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg',
          quantity: 12,
          widthMm: 1600,
          heightMm: 2200,
          color: 'Anthracite Grey (RAL 7016)',
          glazing: 'Triple Glazed Argon (4+12+4+12+4 Low-E)',
          openingType: 'Tilt & Turn Double Sash',
          notes: 'Ground floor and first floor bedrooms',
          estimatedAreaSqm: 42.24
        },
        {
          id: 'item-2',
          productId: 'lorenzo-70ls',
          productName: 'Lorenzoline 70LS Monumental',
          category: 'aluminum',
          image: '/assets/winhome/photo_2023-07-03_15-41-20-1280x820.jpg',
          quantity: 3,
          widthMm: 3600,
          heightMm: 2800,
          color: 'Deep Anodized Black',
          glazing: 'Double Glazed Solar Control 6mm+16Ar+6mm',
          openingType: '2-Track Heavy Lift & Slide',
          notes: 'Direct garden and swimming pool terrace access',
          estimatedAreaSqm: 30.24
        }
      ],
      totalQuantity: 15,
      totalAreaSqm: 72.48,
      adminNotes: 'Contacted client via WhatsApp. Scheduled site measurement visit for tomorrow 11:00 AM in Dream City.',
      quotedAmount: 18600,
      currency: 'USD'
    },
    {
      id: 'WH-2026-8480',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
      status: 'quoted',
      customer: {
        fullName: 'Eng. Ahmed Al-Jabouri',
        phone: '+964 770 123 4567',
        email: 'ahmed.jabouri@almansour-const.iq',
        company: 'Al-Mansour Architectural Contracting',
        city: 'Baghdad (Al-Jadriya)',
        projectType: 'Commercial Car Showroom & Offices',
        timeline: '2-3 Months',
        serviceNeeded: 'Fabrication, Steel Structure Sub-frames & Delivery',
        preferredContact: 'phone',
        additionalNotes: 'Need 50F curtain wall facade with high wind resistance structural calculations.'
      },
      items: [
        {
          id: 'item-3',
          productId: 'facade-50f',
          productName: 'Commercial 50F Curtain Wall',
          category: 'aluminum',
          image: '/assets/winhome/photo_2023-07-03_15-42-28-1120x716.jpg',
          quantity: 1,
          widthMm: 18000,
          heightMm: 6500,
          color: 'Silver Metallic Anodized',
          glazing: 'Laminated Double Glazed Low-E (8+16Ar+8mm)',
          openingType: 'Fixed Structural Glazing with Concealed Vents',
          notes: 'Main street frontage on Al-Jadriya',
          estimatedAreaSqm: 117.0
        }
      ],
      totalQuantity: 1,
      totalAreaSqm: 117.0,
      adminNotes: 'Formal BOQ sent with structural calculations. Awaiting client signature.',
      quotedAmount: 34500,
      currency: 'USD'
    }
  ];
}

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDbData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file:', err);
    return getInitialDbData();
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API: Get all quotation requests
  app.get('/api/requests', (req, res) => {
    const data = readDb();
    res.json(data);
  });

  // API: Submit a new quotation request from Stepper
  app.post('/api/requests', (req, res) => {
    const newRequest = req.body;
    if (!newRequest || !newRequest.customer || !newRequest.items) {
      return res.status(400).json({ error: 'Invalid request payload' });
    }

    const current = readDb();
    const updated = [newRequest, ...current.filter((r: any) => r.id !== newRequest.id)];
    writeDb(updated);
    res.status(201).json(newRequest);
  });

  // API: Update request status, notes, or quoted amount
  app.patch('/api/requests/:id', (req, res) => {
    const { id } = req.params;
    const { status, adminNotes, quotedAmount } = req.body;

    const current = readDb();
    const targetIdx = current.findIndex((r: any) => r.id === id);
    if (targetIdx === -1) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const existing = current[targetIdx];
    const updated = {
      ...existing,
      status: status !== undefined ? status : existing.status,
      adminNotes: adminNotes !== undefined ? adminNotes : existing.adminNotes,
      quotedAmount: quotedAmount !== undefined ? quotedAmount : existing.quotedAmount
    };

    current[targetIdx] = updated;
    writeDb(current);
    res.json(updated);
  });

  // API: Delete request
  app.delete('/api/requests/:id', (req, res) => {
    const { id } = req.params;
    const current = readDb();
    const filtered = current.filter((r: any) => r.id !== id);
    writeDb(filtered);
    res.json({ success: true, id });
  });

  // Vite middleware for development vs static production serve
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
