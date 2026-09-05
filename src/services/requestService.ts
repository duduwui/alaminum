import { QuotationRequest, RequestItem, CustomerInfo } from '../types/requests';

const STORAGE_KEY = 'winhome_quotation_requests';

const INITIAL_SAMPLE_REQUESTS: QuotationRequest[] = [
  {
    id: 'WH-2026-8492',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
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
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // Yesterday
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

export async function fetchAllRequests(): Promise<QuotationRequest[]> {
  try {
    const res = await fetch('/api/requests');
    if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    // Network or server endpoint fallback
    console.log('Serving from local repository', err);
  }

  // Local storage fallback
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // ignore
    }
  }

  // Seed sample requests
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_REQUESTS));
  return INITIAL_SAMPLE_REQUESTS;
}

export async function submitQuotationRequest(
  customer: CustomerInfo,
  items: RequestItem[]
): Promise<QuotationRequest> {
  const totalQuantity = items.reduce((sum, it) => sum + (it.quantity || 1), 0);
  const totalAreaSqm = items.reduce((sum, it) => {
    const area = it.estimatedAreaSqm || ((it.widthMm * it.heightMm) / 1000000) * it.quantity;
    return sum + area;
  }, 0);

  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const newRequest: QuotationRequest = {
    id: `WH-2026-${randomDigits}`,
    createdAt: new Date().toISOString(),
    status: 'new',
    customer,
    items,
    totalQuantity,
    totalAreaSqm: Number(totalAreaSqm.toFixed(2)),
    currency: 'USD'
  };

  // Try API first
  try {
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRequest)
    });
    if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
      const saved = await res.json();
      await updateLocalCache(saved);
      return saved;
    }
  } catch (err) {
    console.log('Saved to local store', err);
  }

  // Local fallback
  await updateLocalCache(newRequest);
  return newRequest;
}

async function updateLocalCache(item: QuotationRequest) {
  const current = await fetchAllRequests();
  const updated = [item, ...current.filter((r) => r.id !== item.id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export async function updateRequestStatus(
  id: string,
  status: QuotationRequest['status'],
  adminNotes?: string,
  quotedAmount?: number
): Promise<QuotationRequest | null> {
  // Try API
  try {
    const res = await fetch(`/api/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNotes, quotedAmount })
    });
    if (res.ok) {
      const updated = await res.json();
      await updateLocalCache(updated);
      return updated;
    }
  } catch (err) {
    console.log('Update local store fallback', err);
  }

  // Local fallback
  const current = await fetchAllRequests();
  const target = current.find((r) => r.id === id);
  if (!target) return null;

  const updated: QuotationRequest = {
    ...target,
    status,
    adminNotes: adminNotes !== undefined ? adminNotes : target.adminNotes,
    quotedAmount: quotedAmount !== undefined ? quotedAmount : target.quotedAmount
  };

  const list = current.map((r) => (r.id === id ? updated : r));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return updated;
}

export async function deleteRequest(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/requests/${id}`, { method: 'DELETE' });
    if (res.ok) {
      // success
    }
  } catch (err) {
    console.log('Local delete', err);
  }

  const current = await fetchAllRequests();
  const filtered = current.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

// =================== CSV & EXCEL EXPORT HELPERS ===================

export function exportRequestsToCSV(requests: QuotationRequest[]): void {
  // Headers
  const headers = [
    'Request ID',
    'Date Submitted',
    'Status',
    'Customer Name',
    'Phone / WhatsApp',
    'Email',
    'City',
    'Project Type',
    'Timeline',
    'Service Needed',
    'Total Systems Count',
    'Total Glass Area (m2)',
    'Quoted USD',
    'Itemized Products Summary',
    'Client Notes',
    'Admin Notes'
  ];

  const rows = requests.map((req) => {
    const itemSummary = req.items
      .map(
        (it, idx) =>
          `[#${idx + 1} ${it.productName} (Qty: ${it.quantity}, ${it.widthMm}x${it.heightMm}mm, ${it.color}, ${it.glazing})]`
      )
      .join('; ');

    return [
      req.id,
      new Date(req.createdAt).toLocaleString('en-US'),
      req.status.toUpperCase(),
      req.customer.fullName,
      req.customer.phone,
      req.customer.email,
      req.customer.city,
      req.customer.projectType,
      req.customer.timeline,
      req.customer.serviceNeeded,
      req.totalQuantity,
      req.totalAreaSqm,
      req.quotedAmount ? `$${req.quotedAmount}` : 'Unquoted',
      itemSummary,
      req.customer.additionalNotes || '',
      req.adminNotes || ''
    ].map((val) => {
      const str = String(val ?? '').replace(/"/g, '""');
      return `"${str}"`;
    });
  });

  const csvContent = '\uFEFF' + [headers.map((h) => `"${h}"`).join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Winhome_Quotation_Requests_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportRequestsToExcel(requests: QuotationRequest[]): void {
  // Generates an Excel-compatible XML/HTML spreadsheet format
  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Winhome Requests</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        body { font-family: Arial, sans-serif; }
        th { background-color: #0284c7; color: #ffffff; font-weight: bold; border: 1px solid #0369a1; padding: 8px; text-align: left; }
        td { border: 1px solid #cbd5e1; padding: 6px 8px; vertical-align: top; }
        tr:nth-child(even) td { background-color: #f8fafc; }
        .status-new { background-color: #e0f2fe; color: #0369a1; font-weight: bold; }
        .status-quoted { background-color: #dcfce7; color: #15803d; font-weight: bold; }
        .title-row { font-size: 18px; font-weight: bold; color: #0f172a; margin-bottom: 12px; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="15" class="title-row" style="background-color: #0f172a; color: #ffffff; font-size: 16pt; font-weight: bold; padding: 12px;">
            WINHOME COMPANY - Architectural Fenestration Requests Report (Erbil, Kurdistan)
          </td>
        </tr>
        <tr>
          <td colspan="15" style="color: #64748b; font-size: 10pt; padding: 6px;">
            Export Date: ${new Date().toLocaleString()} | Total Requests: ${requests.length}
          </td>
        </tr>
        <tr></tr>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Submission Date</th>
            <th>Status</th>
            <th>Customer Name</th>
            <th>Phone / WhatsApp</th>
            <th>Email</th>
            <th>City / Location</th>
            <th>Project Type</th>
            <th>Timeline</th>
            <th>Required Service</th>
            <th>Total Units</th>
            <th>Total Area (m²)</th>
            <th>Quoted Amount (USD)</th>
            <th>Itemized Systems & Specs</th>
            <th>Client Notes</th>
          </tr>
        </thead>
        <tbody>
  `;

  requests.forEach((req) => {
    const itemDetails = req.items
      .map(
        (it, idx) =>
          `<strong>#${idx + 1} ${escapeHtml(it.productName)}</strong><br/>` +
          `• Qty: ${it.quantity} | Dim: ${it.widthMm}mm × ${it.heightMm}mm (${((it.widthMm * it.heightMm) / 1000000).toFixed(2)} m²)<br/>` +
          `• Color: ${escapeHtml(it.color)} | Glass: ${escapeHtml(it.glazing)}<br/>` +
          `• Opening: ${escapeHtml(it.openingType)}<br/>` +
          (it.notes ? `• Note: <em>${escapeHtml(it.notes)}</em><br/>` : '')
      )
      .join('<br/>');

    html += `
      <tr>
        <td style="font-weight: bold; color: #0284c7;">${escapeHtml(req.id)}</td>
        <td>${new Date(req.createdAt).toLocaleString()}</td>
        <td class="status-${req.status}">${req.status.toUpperCase()}</td>
        <td style="font-weight: bold;">${escapeHtml(req.customer.fullName)}</td>
        <td>${escapeHtml(req.customer.phone)}</td>
        <td>${escapeHtml(req.customer.email)}</td>
        <td>${escapeHtml(req.customer.city)}</td>
        <td>${escapeHtml(req.customer.projectType)}</td>
        <td>${escapeHtml(req.customer.timeline)}</td>
        <td>${escapeHtml(req.customer.serviceNeeded)}</td>
        <td style="text-align: center; font-weight: bold;">${req.totalQuantity}</td>
        <td style="text-align: right;">${req.totalAreaSqm.toFixed(2)} m²</td>
        <td style="text-align: right; font-weight: bold; color: #059669;">
          ${req.quotedAmount ? '$' + req.quotedAmount.toLocaleString() : 'Pending'}
        </td>
        <td>${itemDetails}</td>
        <td>${escapeHtml(req.customer.additionalNotes || '-')}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Winhome_Quotation_Report_${new Date().toISOString().slice(0, 10)}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const CART_STORAGE_KEY = 'winhome_active_cart';

export function loadActiveCart(): RequestItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveActiveCart(items: RequestItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Failed to save cart to localStorage', e);
  }
}
