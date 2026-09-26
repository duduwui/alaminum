export type FinancialCategory =
  | 'Aluminum Systems'
  | 'uPVC Profiles'
  | 'Curtain Wall & Facades'
  | 'Accessories & Hardware'
  | 'Installation & Engineering';

export type PaymentStatus = 'paid' | 'partial' | 'pending' | 'overdue';

export type PaymentMethod =
  | 'Bank Transfer (Trade Bank of Iraq)'
  | 'FIB Mobile Banking'
  | 'FastPay Iraq'
  | 'Cash (Erbil Office)'
  | 'Cheque';

export interface FinancialRecord {
  id: string; // e.g. 'INV-2026-0092'
  date: string;
  clientName: string;
  clientPhone: string;
  projectName: string;
  category: FinancialCategory;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  milestone: string; // e.g. '50% Advance Received', '100% Fully Settled'
  notes?: string;
  itemsCount?: number;
  relatedRequestId?: string;
}

export interface FinancialSummary {
  grossPipeline: number;
  realizedCollected: number;
  pendingReceivables: number;
  netOperatingProfit: number;
  profitMarginPercent: number;
  totalInvoicesCount: number;
  paidInvoicesCount: number;
}
