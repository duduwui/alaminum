export interface RequestItem {
  id: string;
  productId: string;
  productName: string;
  category: 'upvc' | 'aluminum' | 'accessories' | string;
  image: string;
  quantity: number;
  widthMm: number;
  heightMm: number;
  color: string;
  glazing: string;
  openingType: string;
  notes?: string;
  estimatedAreaSqm?: number;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  company?: string;
  city: string;
  projectType: string;
  timeline: string;
  serviceNeeded: string;
  preferredContact: 'whatsapp' | 'phone' | 'email';
  additionalNotes?: string;
}

export interface QuotationRequest {
  id: string; // e.g. "WH-2026-8491"
  createdAt: string; // ISO string
  status: 'new' | 'reviewing' | 'quoted' | 'approved' | 'rejected';
  customer: CustomerInfo;
  items: RequestItem[];
  totalQuantity: number;
  totalAreaSqm: number;
  adminNotes?: string;
  quotedAmount?: number;
  currency?: string;
}
