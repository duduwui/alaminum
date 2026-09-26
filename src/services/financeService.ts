import { FinancialRecord, FinancialSummary } from '../types/finance';

const STORAGE_KEY_FINANCES_FALLBACK = 'winhome_fallback_finances';

export async function fetchFinancials(): Promise<FinancialRecord[]> {
  try {
    const res = await fetch('/api/finances');
    if (res.ok) {
      const data = await res.json();
      saveFallbackFinances(data);
      return data;
    }
  } catch (e) {
    console.warn('Using local fallback finances:', e);
  }
  return getFallbackFinances();
}

export async function createFinancialRecord(record: Partial<FinancialRecord>): Promise<FinancialRecord> {
  try {
    const res = await fetch('/api/finances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Falling back to local finance create:', e);
  }

  const fallback = getFallbackFinances();
  const total = Number(record.totalAmount || 0);
  const paid = Number(record.paidAmount || 0);
  const newRec: FinancialRecord = {
    id: record.id || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    date: record.date || new Date().toISOString().split('T')[0],
    clientName: record.clientName || 'Private Client',
    clientPhone: record.clientPhone || '+964 750 000 0000',
    projectName: record.projectName || 'Architectural Project',
    category: record.category || 'Aluminum Systems',
    totalAmount: total,
    paidAmount: paid,
    pendingAmount: Math.max(0, total - paid),
    status: record.status || (paid >= total ? 'paid' : paid > 0 ? 'partial' : 'pending'),
    paymentMethod: record.paymentMethod || 'Bank Transfer (Trade Bank of Iraq)',
    milestone: record.milestone || 'Standard Payment Term',
    notes: record.notes || '',
    itemsCount: record.itemsCount || 1
  };

  const updated = [newRec, ...fallback];
  saveFallbackFinances(updated);
  return newRec;
}

export async function updateFinancialRecord(id: string, updates: Partial<FinancialRecord>): Promise<FinancialRecord> {
  try {
    const res = await fetch(`/api/finances/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Falling back to local finance update:', e);
  }

  const fallback = getFallbackFinances();
  const index = fallback.findIndex((f) => f.id === id);
  if (index === -1) throw new Error('Financial record not found');
  const existing = fallback[index];
  const total = updates.totalAmount !== undefined ? Number(updates.totalAmount) : existing.totalAmount;
  const paid = updates.paidAmount !== undefined ? Number(updates.paidAmount) : existing.paidAmount;
  const updated: FinancialRecord = {
    ...existing,
    ...updates,
    totalAmount: total,
    paidAmount: paid,
    pendingAmount: Math.max(0, total - paid),
    status: updates.status || (paid >= total ? 'paid' : paid > 0 ? 'partial' : 'pending')
  };
  fallback[index] = updated;
  saveFallbackFinances(fallback);
  return updated;
}

export async function deleteFinancialRecord(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/finances/${id}`, { method: 'DELETE' });
    if (res.ok) return true;
  } catch (e) {
    console.warn('Falling back to local finance delete:', e);
  }

  const fallback = getFallbackFinances();
  const filtered = fallback.filter((f) => f.id !== id);
  saveFallbackFinances(filtered);
  return true;
}

export function calculateFinancialSummary(records: FinancialRecord[]): FinancialSummary {
  const grossPipeline = records.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  const realizedCollected = records.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
  const pendingReceivables = records.reduce((sum, r) => sum + (r.pendingAmount || 0), 0);
  const profitMarginPercent = 28; // standard industrial fabrication profit margin
  const netOperatingProfit = Math.round(realizedCollected * (profitMarginPercent / 100));

  return {
    grossPipeline,
    realizedCollected,
    pendingReceivables,
    netOperatingProfit,
    profitMarginPercent,
    totalInvoicesCount: records.length,
    paidInvoicesCount: records.filter((r) => r.status === 'paid').length
  };
}

export function exportFinancesToCSV(records: FinancialRecord[]) {
  const headers = [
    'Invoice ID',
    'Date',
    'Client Name',
    'Phone',
    'Project Description',
    'System Category',
    'Total Amount ($)',
    'Paid Amount ($)',
    'Pending Balance ($)',
    'Payment Status',
    'Payment Method',
    'Milestone'
  ];

  const rows = records.map((r) => [
    r.id,
    r.date,
    `"${r.clientName.replace(/"/g, '""')}"`,
    `"${r.clientPhone.replace(/"/g, '""')}"`,
    `"${r.projectName.replace(/"/g, '""')}"`,
    `"${r.category.replace(/"/g, '""')}"`,
    r.totalAmount,
    r.paidAmount,
    r.pendingAmount,
    r.status.toUpperCase(),
    `"${r.paymentMethod.replace(/"/g, '""')}"`,
    `"${r.milestone.replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `winhome_financial_ledger_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function getFallbackFinances(): FinancialRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_FINANCES_FALLBACK);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return [];
}

function saveFallbackFinances(finances: FinancialRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY_FINANCES_FALLBACK, JSON.stringify(finances));
  } catch (e) {}
}
