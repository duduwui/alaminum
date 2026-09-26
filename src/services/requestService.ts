import { QuotationRequest, RequestItem, CustomerInfo } from '../types/requests';
import {
  db,
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from '../config/firebase';

const STORAGE_KEY = 'winhome_quotation_requests';
const COLLECTION_NAME = 'quotation_requests';

export async function fetchAllRequests(): Promise<QuotationRequest[]> {
  // The server is the shared source for both cart and contact submissions.
  try {
    const token = localStorage.getItem('dh_admin_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/requests', { headers, credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return data; }
    }
  } catch { /* offline fallback below */ }
  // Legacy Firestore data remains readable when the server is unavailable.
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const items: QuotationRequest[] = [];
      snapshot.forEach((d) => {
        items.push({ ...(d.data() as QuotationRequest), id: d.id });
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      return items;
    }
  } catch (firestoreErr) {
    console.warn('Firestore fetch info (fallback to local):', firestoreErr);
  }

  // 2. Try Local API Server if running
  try {
    const res = await fetch('/api/requests');
    if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
      const data = await res.json();
      if (Array.isArray(data)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    // console.log('Serving from local repository', err);
  }

  // 3. Local storage fallback
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // ignore
    }
  }

  return [];
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
    kind: 'product',
    createdAt: new Date().toISOString(),
    status: 'new',
    customer,
    items,
    totalQuantity,
    totalAreaSqm: Number(totalAreaSqm.toFixed(2)),
    currency: 'USD'
  };

  // The shared API must confirm the request before telling the customer it was sent.
  const response = await fetch('/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newRequest) });
  if (!response.ok) throw new Error('Request could not be sent. Please try again.');

  // Retain the legacy Firestore copy when configured.
  try {
    await setDoc(doc(db, COLLECTION_NAME, newRequest.id), newRequest);
  } catch (firestoreErr) {
    console.warn('Firestore save warning:', firestoreErr);
  }

  // Update local browser cache after the server confirms receipt.
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
  const updatePayload: any = {
    status,
    updatedAt: new Date().toISOString()
  };
  if (adminNotes !== undefined) updatePayload.adminNotes = adminNotes;
  if (quotedAmount !== undefined) updatePayload.quotedAmount = quotedAmount;

  // 1. Update Firebase Firestore
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), updatePayload);
  } catch (firestoreErr) {
    console.warn('Firestore update warning:', firestoreErr);
  }

  // 2. Try Node API
  try {
    const token = localStorage.getItem('dh_admin_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    await fetch(`/api/requests/${id}`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: JSON.stringify({ status, adminNotes, quotedAmount })
    });
  } catch (err) {
    // ignore
  }

  // 3. Local fallback cache
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
  // 1. Delete from Firestore
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (firestoreErr) {
    console.warn('Firestore delete warning:', firestoreErr);
  }

  // 2. Try Node API
  try {
    const token = localStorage.getItem('dh_admin_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    await fetch(`/api/requests/${id}`, { method: 'DELETE', headers, credentials: 'include' });
  } catch (err) {
    // ignore
  }

  // 3. Local cache
  const current = await fetchAllRequests();
  const filtered = current.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

// Poll the shared API so contact messages and cart requests appear together.
export function subscribeToRequests(onUpdate: (requests: QuotationRequest[]) => void): () => void {
  let active = true;
  const refresh = () => { void fetchAllRequests().then((items) => { if (active) onUpdate(items); }).catch(() => {}); };
  refresh();
  const timer = window.setInterval(refresh, 15_000);
  return () => { active = false; window.clearInterval(timer); };
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
  link.setAttribute('download', `Doorhome_Quotation_Requests_${new Date().toISOString().slice(0, 10)}.csv`);
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
              <x:Name>Doorhome Requests</x:Name>
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
            DOORHOME COMPANY - Architectural Fenestration Requests Report (Erbil, Kurdistan)
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
  link.setAttribute('download', `Doorhome_Quotation_Report_${new Date().toISOString().slice(0, 10)}.xls`);
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
