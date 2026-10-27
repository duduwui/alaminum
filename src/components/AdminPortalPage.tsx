import { getLocalizedProduct } from '../utils/localizedContent';
import { VisitsHistoryModal } from './VisitsHistoryModal';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  QuotationRequest,
  RequestItem,
  CustomerInfo
} from '../types/requests';
import {
  fetchAllRequests,
  subscribeToRequests,
  updateRequestStatus,
  deleteRequest,
  exportRequestsToCSV,
  exportRequestsToExcel
} from '../services/requestService';
import {
  ProductItem,
  ALL_PRODUCTS,
  UPVC_PRODUCTS,
  ALUMINUM_PRODUCTS,
  ACCESSORIES_LINES,
  DOORHOME_CONTACT
} from '../data/winhomeData';
import { GlowButton } from './GlowButton';
import {
  LayoutDashboard,
  LayoutGrid,
  Package,
  FileSpreadsheet,
  FileText,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  Ruler,
  MessageSquare,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  X,
  Trash2,
  Save,
  DollarSign,
  ShieldCheck,
  Check,
  Plus,
  Edit,
  TrendingUp,
  BarChart3,
  PieChart,
  Image as ImageIcon,
  HelpCircle,
  LogOut,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Sliders,
  Bell,
  User,
  Users,
  Upload,
  ClipboardList,
  ChevronLeft,
  Database,
  Globe,
  Languages,
  Copy,
  MessageCircle
} from 'lucide-react';
import { AdminUsersTab } from './AdminUsersTab';
import { AdminCategoriesTab } from './AdminCategoriesTab';
import { CurrencyType, formatCurrency } from '../utils/currency';
import { saveProductToCloud, deleteProductFromCloud, loadLocalProducts, saveLocalProducts, resetProductsToDefault } from '../services/productService';
import { autoTranslateFullProduct } from '../services/translateService';
import { loadProductDivisions, saveProductDivisions, subscribeToDivisions, resetProductDivisionsToDefault, updateModelInDivision, deleteModelFromDivision } from '../services/productNavigationService';
import { loadSharedCmsSection, saveSharedCmsSection } from '../services/cmsService';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import { GalleryMediaItem, loadGalleryItems, normalizeGalleryItems, saveGalleryItems } from '../services/galleryContentService';
import { ProductCategoryDivision } from '../data/productNavigationData';
import { ITEM_LOCALES, SHOWCASE_TEXT_BY_LANG } from './SignatureShowcase';
import { getPartnerLogos, PartnerBrand, isImageFlag } from './PartnerLogos';
import {
  loadArchitectureCards,
  saveArchitectureCards,
  ArchitectureCatalogueCard,
  DEFAULT_CATALOGUE_CARDS
} from '../services/architectureCardsService';
import { Admin3DCarouselTab } from './Admin3DCarouselTab';
import { AdminAllProjectsTab } from './AdminAllProjectsTab';
import { AdminArchCardsTab } from './AdminArchCardsTab';
import { AdminWindowsSectionTab } from './AdminWindowsSectionTab';
import { AdminDoorsSectionTab } from './AdminDoorsSectionTab';

interface AdminPortalPageProps {
  onBackToHome: () => void;
  onGoToProducts: () => void;
}

const compressImageFile = (file: File, maxWidth = 1000, quality = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(e.target?.result as string || '');
        }
      };
      img.onerror = () => resolve(e.target?.result as string || '');
      img.src = e.target?.result as string || '';
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

const MAX_IMAGE_UPLOAD_BYTES = 15 * 1024 * 1024;
const MAX_MEDIA_UPLOAD_BYTES = 100 * 1024 * 1024;

interface AdvancedTextareaProps {
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  minHeight?: string;
}

const AdvancedTextarea: React.FC<AdvancedTextareaProps> = ({
  value,
  onChange,
  onBlur,
  placeholder = 'Type detailed architectural description...',
  rows = 5,
  label,
  minHeight = '150px'
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow height so all lines are visible without needing an internal scrollbar
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const minH = parseInt(minHeight, 10) || 150;
    const scrollH = el.scrollHeight;
    el.style.height = `${Math.max(minH, scrollH)}px`;
  }, [value, minHeight]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const tabSpaces = '    '; // 4 spaces for clean indentation
      const currentVal = value || '';
      const nextVal = currentVal.substring(0, start) + tabSpaces + currentVal.substring(end);
      onChange(nextVal);
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + tabSpaces.length;
        }
      });
    }
  };

  const lineCount = (value || '').split('\n').length;
  const charCount = (value || '').length;

  return (
    <div className="space-y-1 w-full text-start">
      {label && (
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span>{label}</span>
          <span className="text-[10px] text-slate-400 font-normal">
            {charCount} chars • {lineCount} line{lineCount > 1 ? 's' : ''}
          </span>
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        rows={rows}
        placeholder={placeholder}
        style={{ minHeight }}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs sm:text-sm text-slate-900 leading-relaxed font-normal focus:border-red-500 focus:ring-1 focus:ring-red-500/20 focus:outline-none transition-all resize-y"
      />
    </div>
  );
};

const uploadCmsMediaFile = async (file: File): Promise<string> => {
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'application/pdf'].includes(file.type)) {
    throw new Error('Use a JPG, PNG, WebP, GIF, MP4, WebM, or PDF file.');
  }
  if (file.size > MAX_MEDIA_UPLOAD_BYTES) {
    throw new Error('File is too large. Upload a file smaller than 100 MB.');
  }
  if (file.type.startsWith('image/') && file.size > MAX_IMAGE_UPLOAD_BYTES) {
    throw new Error('Image is too large. Upload an image smaller than 15 MB.');
  }
  const token = localStorage.getItem('dh_admin_token');
  const headers: Record<string, string> = { 'Content-Type': file.type };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch('/api/cms/upload', {
    method: 'POST',
    headers,
    credentials: 'include',
    body: file
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.url) {
    if (response.status === 404) throw new Error('Upload service is unavailable. Restart the app server and try again.');
    if (response.status === 401) throw new Error('Your sign-in session is no longer valid. Sign out and sign in again to upload. Your edits have not been removed.');
    if (response.status === 413) throw new Error('This file exceeds the server upload limit. Choose a smaller file.');
    throw new Error(result.error || 'Media upload failed. Please try again.');
  }
  return result.url;
};

const uploadCmsImageFile = async (file: File): Promise<string> => {
  if (!file.type.startsWith('image/')) throw new Error('Please select an image file.');
  return uploadCmsMediaFile(file);
};

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({
  onBackToHome,
  onGoToProducts
}) => {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const isRtl = ['ckb', 'kmr', 'ar'].includes(currentLanguage.code);

  // Navigation tab state
  const [activeSection, setActiveSection] = useState<
    'products' | 'categories' | 'users' | 'cms' | 'logos'
  >(() => {
    if (typeof window !== 'undefined') {
      const h = (window.location.hash || '').toLowerCase();
      if (h.includes('cms') || h.includes('gallery')) return 'cms';
      if (h.includes('users') || h.includes('team')) return 'users';
      if (h.includes('logos') || h.includes('brands')) return 'logos';
    }
    return 'products';
  });

  // Keep active section in sync if hash changes while on Admin portal
  useEffect(() => {
    const syncSectionWithHash = () => {
      const h = (window.location.hash || '').toLowerCase();
      if (h.includes('cms') || h.includes('gallery')) {
        setActiveSection('cms');
      } else if (h.includes('users') || h.includes('team')) {
        setActiveSection('users');
      } else if (h.includes('logos') || h.includes('brands')) {
        setActiveSection('logos');
      }
    };
    window.addEventListener('hashchange', syncSectionWithHash);
    return () => window.removeEventListener('hashchange', syncSectionWithHash);
  }, []);
  const [productSubTab, setProductSubTab] = useState<'products' | 'categories'>('products');
  const [cmsSubTab, setCmsSubTab] = useState<
    '3d-carousel' | 'all-projects' | 'arch-cards' | 'windows-section' | 'doors-section'
  >('3d-carousel');

  // Architecture Catalogue Cards State
  const [archCards, setArchCards] = useState<ArchitectureCatalogueCard[]>(() => loadArchitectureCards());
  const [archCardsSaving, setArchCardsSaving] = useState(false);
  const [archCardsSaveFeedback, setArchCardsSaveFeedback] = useState('');
  const archLogoInput1Ref = React.useRef<HTMLInputElement>(null);
  const archLogoInput2Ref = React.useRef<HTMLInputElement>(null);
  const archPdfInput1Ref = React.useRef<HTMLInputElement>(null);
  const archPdfInput2Ref = React.useRef<HTMLInputElement>(null);
  const [isUploadingArchFile, setIsUploadingArchFile] = useState(false);

  // Seed Production Data Handler
  const handleSeedProductionData = () => {
    if (confirm('Load realistic production-grade catalog and categories for Windows, Doors, Facades, Railings, and Hardware?')) {
      const resetProds = resetProductsToDefault();
      setProductList(resetProds);
      const resetDivs = resetProductDivisionsToDefault();
      setDivisions(resetDivs);
      setRequestNotification(t('admin_notice_seed_success') || '✓ Production catalog loaded successfully!');
      setTimeout(() => setRequestNotification(''), 4500);
    }
  };

  // File Upload Input Refs for reliable file picker triggering
  const galleryFileInputRef = React.useRef<HTMLInputElement>(null);
  const aboutFileInputRef = React.useRef<HTMLInputElement>(null);
  const heroFileInputRef = React.useRef<HTMLInputElement>(null);
  const productFileInputRef = React.useRef<HTMLInputElement>(null);

  // Partner Logos State
  const [partnerLogos, setPartnerLogos] = useState<PartnerBrand[]>(getPartnerLogos);
  const [logosSaving, setLogosSaving] = useState(false);
  const [logosSaveFeedback, setLogosSaveFeedback] = useState('');
  const [newLogo, setNewLogo] = useState({ name: '', src: '', alt: '', country: '', flag: '' });
  const logoFileInputRef = React.useRef<HTMLInputElement>(null);
  const newFlagFileInputRef = React.useRef<HTMLInputElement>(null);
  const cardFlagFileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFlag, setIsUploadingFlag] = useState(false);
  const [uploadingFlagCardIdx, setUploadingFlagCardIdx] = useState<number | null>(null);

  const autoTrimLogoImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) { resolve(file); return; }
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          const w = canvas.width;
          const h = canvas.height;
          let minX = w, minY = h, maxX = 0, maxY = 0;
          let hasContent = false;
          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const idx = (y * w + x) * 4;
              const r = data[idx];
              const g = data[idx + 1];
              const b = data[idx + 2];
              const a = data[idx + 3];
              const isWhiteOrTransparent = a < 20 || (r > 245 && g > 245 && b > 245);
              if (!isWhiteOrTransparent) {
                hasContent = true;
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
              }
            }
          }
          if (!hasContent || maxX <= minX || maxY <= minY) { resolve(file); return; }
          const padX = Math.round((maxX - minX) * 0.04);
          const padY = Math.round((maxY - minY) * 0.05);
          const cropX = Math.max(0, minX - padX);
          const cropY = Math.max(0, minY - padY);
          const cropW = Math.min(w - cropX, (maxX - minX) + padX * 2);
          const cropH = Math.min(h - cropY, (maxY - minY) + padY * 2);
          const croppedCanvas = document.createElement('canvas');
          croppedCanvas.width = cropW;
          croppedCanvas.height = cropH;
          const croppedCtx = croppedCanvas.getContext('2d');
          if (!croppedCtx) { resolve(file); return; }
          croppedCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
          croppedCanvas.toBlob((blob) => {
            if (!blob) { resolve(file); return; }
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.png'), { type: 'image/png' }));
          }, 'image/png');
        } catch {
          resolve(file);
        }
      };
      img.onerror = () => resolve(file);
      img.src = url;
    });
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingLogo(true);
      const trimmedFile = await autoTrimLogoImage(file);
      const url = await uploadCmsImageFile(trimmedFile);
      setNewLogo((prev) => ({ ...prev, src: url }));
    } catch (err: any) {
      alert(err.message || 'Logo upload failed');
    } finally {
      setIsUploadingLogo(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleNewFlagFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingFlag(true);
      const url = await uploadCmsMediaFile(file);
      setNewLogo((prev) => ({ ...prev, flag: url }));
    } catch (err: any) {
      alert(err.message || 'Flag upload failed');
    } finally {
      setIsUploadingFlag(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleCardFlagFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || uploadingFlagCardIdx === null) return;
    try {
      setIsUploadingFlag(true);
      const url = await uploadCmsMediaFile(file);
      const updated = [...partnerLogos];
      updated[uploadingFlagCardIdx] = { ...updated[uploadingFlagCardIdx], flag: url };
      setPartnerLogos(updated);
      try {
        localStorage.setItem('winhome_cms_partner_logos', JSON.stringify(updated));
        window.dispatchEvent(new Event('cms_partner_logos_updated'));
      } catch {}
      void saveSharedCmsSection('partnerLogos', updated).catch(() => {});
      setLogosSaveFeedback(`✓ Flag image updated for ${updated[uploadingFlagCardIdx].name}!`);
      setTimeout(() => setLogosSaveFeedback(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Flag upload failed');
    } finally {
      setIsUploadingFlag(false);
      setUploadingFlagCardIdx(null);
      if (e.target) e.target.value = '';
    }
  };

  // Requests State
  const [requests, setRequests] = useState<QuotationRequest[]>([]);
  const [visits, setVisits] = useState<Record<'total' | 'today' | 'month' | 'week' | 'live', { visits: number; unique: number }> | null>(null);
  const [showVisitsModal, setShowVisitsModal] = useState(false);
  const [requestTypeFilter, setRequestTypeFilter] = useState<'all' | 'contact' | 'product'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [requestSearchQuery, setRequestSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<QuotationRequest | null>(null);

  // Request inspection edit fields
  const [editStatus, setEditStatus] = useState<QuotationRequest['status']>('new');
  const [editAdminNotes, setEditAdminNotes] = useState<string>('');
  const [editQuotedAmount, setEditQuotedAmount] = useState<string>('');
  const [isSavingRequest, setIsSavingRequest] = useState<boolean>(false);
  const [requestNotification, setRequestNotification] = useState<string>('');

  // Products CRUD State
  const [productList, setProductList] = useState<ProductItem[]>(() => loadLocalProducts());
  const [divisions, setDivisions] = useState(() => loadProductDivisions());

  const doorProducts = productList.filter((p) => p.division === 'doors' || p.category === 'doors');
  const windowProducts = productList.filter((p) => p.division === 'windows' || p.category === 'windows');

  useEffect(() => {
    return subscribeToDivisions((updated) => {
      setDivisions(updated);
    });
  }, []);

  const [productSearchQuery, setProductSearchQuery] = useState<string>('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  useEffect(() => {
    if (productCategoryFilter !== 'all' && !divisions.some((division) => division.key === productCategoryFilter)) {
      setProductCategoryFilter('all');
    }
  }, [divisions, productCategoryFilter]);
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Product Form State - Simple & Clear
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<string>(() => divisions[0]?.key || '');
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSellingPrice, setFormSellingPrice] = useState<number>(140);
  const [productFormError, setProductFormError] = useState('');
  const [isUploadingProductImage, setIsUploadingProductImage] = useState(false);
  const [formTranslations, setFormTranslations] = useState<Record<string, { name: string; description: string }> | null>(null);
  const [isTranslatingProduct, setIsTranslatingProduct] = useState(false);
  const [translationSuccessMsg, setTranslationSuccessMsg] = useState<string | null>(null);
  const [copiedMsg, setCopiedMsg] = useState(false);

  // CMS Gallery Images State with LocalStorage Persistence
  const [galleryImages, setGalleryImages] = useState<GalleryMediaItem[]>(() => loadGalleryItems());
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryDescription, setNewGalleryDescription] = useState('');
  const [galleryUploadError, setGalleryUploadError] = useState('');
  const [isUploadingGalleryMedia, setIsUploadingGalleryMedia] = useState(false);

  // Sync products with localStorage and broadcast live update
  useEffect(() => {
    saveLocalProducts(productList);
  }, [productList]);

  // Sync gallery images with localStorage and broadcast live update
  useEffect(() => {
    try { saveGalleryItems(galleryImages); } catch (error) { console.error('Gallery save failed:', error); }
  }, [galleryImages]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await fetchAllRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
    const unsubscribe = subscribeToRequests((updated) => {
      setRequests(Array.isArray(updated) ? updated : []);
      setLoading(false);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  useEffect(() => {
    const loadVisits = async () => {
      try {
        const token = localStorage.getItem('dh_admin_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const response = await fetch('/api/visits/summary', { headers, credentials: 'include' });
        if (response.ok) setVisits(await response.json());
      } catch { /* show unavailable state */ }
    };
    void loadVisits();
    const timer = window.setInterval(loadVisits, 2500);
    return () => window.clearInterval(timer);
  }, []);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    if (!Array.isArray(requests)) return [];
    return requests.filter((req) => {
      if (!req) return false;
      if (requestTypeFilter !== 'all' && (req.kind || (req.items?.length ? 'product' : 'contact')) !== requestTypeFilter) return false;
      if (statusFilter !== 'all' && req.status !== statusFilter) return false;
      if (requestSearchQuery.trim()) {
        const query = requestSearchQuery.toLowerCase();
        const matchesId = (req.id || '').toLowerCase().includes(query);
        const matchesName = (req.customer?.fullName || '').toLowerCase().includes(query);
        const matchesPhone = (req.customer?.phone || '').toLowerCase().includes(query);
        const matchesItems = (req.items || []).some((it) => (it?.productName || '').toLowerCase().includes(query));
        if (!matchesId && !matchesName && !matchesPhone && !matchesItems) return false;
      }
      return true;
    });
  }, [requests, statusFilter, requestSearchQuery, requestTypeFilter]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(productList)) return [];
    return productList.filter((prod) => {
      if (!prod) return false;
      if (
        productCategoryFilter !== 'all' &&
        prod.category !== productCategoryFilter &&
        prod.division !== productCategoryFilter
      )
        return false;
      if (productSearchQuery.trim()) {
        const q = productSearchQuery.toLowerCase();
        return (
          (prod.name || '').toLowerCase().includes(q) ||
          (prod.description || '').toLowerCase().includes(q) ||
          (prod.subCategory && prod.subCategory.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [productList, productCategoryFilter, productSearchQuery]);

  // Currency State (USD or IQD)
  const [currency, setCurrency] = useState<CurrencyType>('USD');

  // Product Catalog Pagination State
  const [catalogPage, setCatalogPage] = useState<number>(1);
  const [catalogPageSize, setPageSizeProducts] = useState<number>(6);

  // Quotation Requests Pagination State
  const [requestsPage, setRequestsPage] = useState<number>(1);
  const [requestsPageSize, setRequestsPageSize] = useState<number>(30);

  // Reset page numbers on filter changes
  useEffect(() => {
    setCatalogPage(1);
  }, [productCategoryFilter, productSearchQuery, catalogPageSize]);

  useEffect(() => {
    setRequestsPage(1);
  }, [statusFilter, requestSearchQuery, requestTypeFilter, requestsPageSize]);

  const catalogTotalPages = Math.max(1, Math.ceil(filteredProducts.length / catalogPageSize));
  const paginatedProducts = useMemo(() => {
    const start = (catalogPage - 1) * catalogPageSize;
    return filteredProducts.slice(start, start + catalogPageSize);
  }, [filteredProducts, catalogPage, catalogPageSize]);

  const requestsTotalPages = Math.max(1, Math.ceil(filteredRequests.length / requestsPageSize));
  const paginatedRequests = useMemo(() => {
    const start = (requestsPage - 1) * requestsPageSize;
    return filteredRequests.slice(start, start + requestsPageSize);
  }, [filteredRequests, requestsPage, requestsPageSize]);

  // Overall Financial & Analytical Stats
  const totalInquiries = requests?.length || 0;
  const newRequestsCount = (requests || []).filter((r) => r?.status === 'new' || r?.status === 'reviewing' || (r?.status as string) === 'pending').length;
  const quotedCount = (requests || []).filter((r) => r?.status === 'quoted').length;
  const totalFabricatedUnits = (requests || []).reduce((sum, r) => sum + (r?.totalQuantity || 0), 0);
  const totalGlassArea = (requests || []).reduce((sum, r) => sum + (r?.totalAreaSqm || 0), 0);
  const totalRevenuePipeline = (requests || []).reduce((sum, r) => sum + (r?.quotedAmount || 0), 0);
  const estimatedProfit = Math.round(totalRevenuePipeline * 0.28);

  // Product Modal Open Handlers
  const handleOpenAddProduct = () => {
    setProductFormError('');
    setEditingProduct(null);
    setFormName('');
    setFormCategory(divisions[0]?.key || '');
    setFormImage('');
    setFormDescription('');
    setFormSellingPrice(0);
    setFormTranslations(null);
    setTranslationSuccessMsg(null);
    setIsTranslatingProduct(false);
    setIsProductModalOpen(true);
  };

  const handleOpenAddProductForCategory = (categoryOrDivision: string) => {
    setProductFormError('');
    setEditingProduct(null);
    setFormName('');
    setFormCategory(divisions.some((division) => division.key === categoryOrDivision) ? categoryOrDivision : divisions[0]?.key || '');
    setFormImage('');
    setFormDescription('');
    setFormSellingPrice(0);
    setFormTranslations(null);
    setTranslationSuccessMsg(null);
    setIsTranslatingProduct(false);
    setIsProductModalOpen(true);
  };

  const handleDirectReplaceProductImage = async (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploaded = await uploadCmsMediaFile(file);
        if (uploaded) {
          const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov)(\?|#|$)/i.test(uploaded);
          const updated = productList.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  image: uploaded,
                  videoUrl: isVideo ? uploaded : p.videoUrl
                }
              : p
          );
          setProductList(updated);
          saveLocalProducts(updated);
          setCmsSaveFeedback('✓ Media (Image/Video) Replaced & Live on Homepage!');
          setTimeout(() => setCmsSaveFeedback(''), 4000);
        }
      } catch (err) {
        console.error('Direct replace error:', err);
        setCmsSaveFeedback(err instanceof Error ? err.message : 'Media upload failed.');
      } finally {
        e.target.value = '';
      }
    }
  };

  const handleDirectDeleteProduct = (productId: string, productName: string) => {
    if (confirm(`Are you sure you want to delete "${productName}" from the website?`)) {
      divisions.forEach((division) => division.subCategories.forEach((sub) => sub.items.forEach((model) => {
        if (model.productId === productId) deleteModelFromDivision(division.id, model.id);
      })));
      const updated = productList.filter((p) => p.id !== productId);
      setProductList(updated);
      saveLocalProducts(updated);
      void deleteProductFromCloud(productId);
      setCmsSaveFeedback(`✓ "${productName}" Deleted from Website!`);
      setTimeout(() => setCmsSaveFeedback(''), 4000);
    }
  };

  const handleOpenEditProduct = (prod: ProductItem) => {
    setProductFormError('');
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(divisions.some((division) => division.key === prod.category) ? prod.category : divisions[0]?.key || '');
    setFormImage(prod.image);
    setFormDescription(prod.description);
    setFormSellingPrice(prod.pricePerSqm || prod.basePrice || prod.unitPrice || 140);
    setFormTranslations((prod.translations as Record<string, { name: string; description: string }>) || null);
    setTranslationSuccessMsg(null);
    setIsTranslatingProduct(false);
    setIsProductModalOpen(true);
  };

  const handleAutoTranslateProduct = async () => {
    if (!formName.trim() && !formDescription.trim()) return;
    setIsTranslatingProduct(true);
    setTranslationSuccessMsg(null);
    try {
      const res = await autoTranslateFullProduct({ name: formName, description: formDescription });
      setFormTranslations(res);
      setTranslationSuccessMsg('✓ Translated into Arabic, English, Kurdish Sorani, Kurdish Kurmanji, Turkish & German!');
    } catch (e) {
      console.error('Auto translation error:', e);
      setTranslationSuccessMsg('Notice: Basic translation applied.');
    } finally {
      setIsTranslatingProduct(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDescription.trim() || !formImage.trim() || !divisions.some((division) => division.key === formCategory)) {
      setProductFormError(t('admin_product_form_error'));
      return;
    }
    setProductFormError('');
    const productId = editingProduct?.id || `prod-${Date.now()}`;
    const categoryChanged = Boolean(editingProduct && editingProduct.category !== formCategory);
    if (editingProduct?.modelId) {
      const ownedDivision = divisions.find((division) => division.subCategories.some((sub) => sub.items.some((model) => model.id === editingProduct.modelId && model.productId === productId)));
      if (ownedDivision) {
        if (categoryChanged) deleteModelFromDivision(ownedDivision.id, editingProduct.modelId);
        else updateModelInDivision(ownedDivision.id, editingProduct.modelId, { name: formName.trim(), description: formDescription.trim(), image: formImage.trim() });
      }
    }

    // Auto-translate if not already done manually
    let fullTranslations = formTranslations;
    if (!fullTranslations) {
      try {
        fullTranslations = await autoTranslateFullProduct({ name: formName, description: formDescription });
      } catch (err) {
        console.error('Auto translate on save error:', err);
      }
    }

    const arName = fullTranslations?.['ar']?.name || (formName.match(/[\u0600-\u06FF]/) ? formName : undefined);
    const arDesc = fullTranslations?.['ar']?.description || (formDescription.match(/[\u0600-\u06FF]/) ? formDescription : undefined);
    const kuName = fullTranslations?.['ckb']?.name || fullTranslations?.['ku']?.name || fullTranslations?.['kmr']?.name;
    const kuDesc = fullTranslations?.['ckb']?.description || fullTranslations?.['ku']?.description || fullTranslations?.['kmr']?.description;

    if (editingProduct) {
      // Update existing
      const updatedProduct: ProductItem = {
        ...editingProduct,
        name: formName.trim(),
        category: formCategory,
        division: formCategory,
        subCategory: categoryChanged ? undefined : editingProduct.subCategory,
        modelId: categoryChanged ? undefined : editingProduct.modelId,
        modelNumber: categoryChanged ? undefined : editingProduct.modelNumber,
        image: formImage.trim(),
        description: formDescription.trim(),
        pricePerSqm: formSellingPrice,
        unitPrice: formSellingPrice,
        pricing: editingProduct.pricing ? { ...editingProduct.pricing, unitPrice: formSellingPrice, pricePerSqm: formSellingPrice } : undefined,
        translations: fullTranslations || editingProduct.translations,
        arabicName: arName || editingProduct.arabicName,
        arabicDescription: arDesc || editingProduct.arabicDescription,
        kurdishName: kuName || editingProduct.kurdishName,
        kurdishDescription: kuDesc || editingProduct.kurdishDescription
      };
      setProductList((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
      );
      saveProductToCloud(updatedProduct);
    } else {
      // Create new
      const newProd: ProductItem = {
        id: productId,
        name: formName.trim(),
        category: formCategory,
        division: formCategory,
        image: formImage.trim(),
        fallbackImage: './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg',
        description: formDescription.trim(),
        basePrice: formSellingPrice,
        currency: 'USD',
        pricePerSqm: formSellingPrice,
        unitPrice: formSellingPrice,
        features: [],
        translations: fullTranslations || undefined,
        arabicName: arName,
        arabicDescription: arDesc,
        kurdishName: kuName,
        kurdishDescription: kuDesc
      };
      setProductList((prev) => [newProd, ...prev]);
      saveProductToCloud(newProd);
    }

    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product system from the catalog?')) {
      divisions.forEach((division) => division.subCategories.forEach((sub) => sub.items.forEach((model) => {
        if (model.productId === id) deleteModelFromDivision(division.id, model.id);
      })));
      setProductList((prev) => prev.filter((p) => p.id !== id));
      deleteProductFromCloud(id);
    }
  };

  // Homepage Section Media State (About, Hero, Signature Showcase, etc.)
  const [homepageMedia, setHomepageMedia] = useState<{
    aboutFactoryImage: string;
    aboutTitle?: string;
    aboutSubtitle?: string;
    heroPosterImage: string;
    heroTagline?: string;
    heroSubtitle?: string;
    showcaseImages?: Record<string, string>;
    showcaseContent?: Record<string, { title?: string; subtitle?: string; description?: string }>;
    showcaseContentByLanguage?: Record<string, Record<string, { title?: string; subtitle?: string; description?: string }>>;
    showcaseSectionText?: Record<string, { title?: string; subtitle?: string }>;
    bentoImages?: Record<string, string>;
  }>(() => {
    const saved = localStorage.getItem('winhome_cms_homepage_media');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return {
      aboutFactoryImage: './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg',
      aboutTitle: 'Building Iraq’s Most Resilient Window & Door Systems',
      aboutSubtitle: 'Doorhome Company, operating under Nafza Almanzl Holding...',
      heroPosterImage: './assets/doorhome/photo_2023-07-03_15-41-20-1280x820.jpg',
      showcaseImages: {
        'legend-80': './assets/doorhome/10.png',
        'lorenzo-70ls': './assets/doorhome/LIFT-SLIDE-70LS-Medium-300x300.jpeg',
        'curtain-50f': './assets/doorhome/24-1.jpg',
        'hs76-sliding': './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg',
        'winsa-dorado-76': './assets/doorhome/2-1.png'
      },
      bentoImages: {
        'legend-80': './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg',
        'lorenzo-70ls': './assets/doorhome/photo_2023-07-03_15-41-20-1280x820.jpg',
        'facade-50f': './assets/doorhome/photo_2023-07-03_15-42-28-1120x716.jpg',
        'winsa-dorado': './assets/doorhome/photo_2023-07-03_15-50-46-1104x700.jpg',
        'hardware-master': './assets/doorhome/2026-04-14-21.53.50-1000x650.jpg',
        'villa-panoramic': './assets/doorhome/photo_2023-07-03_15-49-24-760x485.jpg'
      }
    };
  });

  const [showcaseTextLanguage, setShowcaseTextLanguage] = useState(() => {
    const code = currentLanguage.code.split('-')[0];
    return SHOWCASE_TEXT_BY_LANG[code] ? code : 'en';
  });

  const showcaseCardValue = (key: string, field: 'title' | 'subtitle' | 'description', fallback: string) =>
    homepageMedia.showcaseContentByLanguage?.[showcaseTextLanguage]?.[key]?.[field]
      ?? homepageMedia.showcaseContent?.[key]?.[field]
      ?? fallback;

  const updateShowcaseCardValue = (key: string, field: 'title' | 'subtitle' | 'description', value: string) => {
    setHomepageMedia((previous) => ({
      ...previous,
      showcaseContentByLanguage: {
        ...(previous.showcaseContentByLanguage || {}),
        [showcaseTextLanguage]: {
          ...(previous.showcaseContentByLanguage?.[showcaseTextLanguage] || {}),
          [key]: { ...(previous.showcaseContentByLanguage?.[showcaseTextLanguage]?.[key] || {}), [field]: value }
        }
      }
    }));
  };

  const [cmsSaveFeedback, setCmsSaveFeedback] = useState<string>('');
  const [cmsHydrated, setCmsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      loadSharedCmsSection<typeof homepageMedia>('homepage'),
      loadSharedCmsSection<unknown>('gallery'),
      loadSharedCmsSection<unknown>('products'),
      loadSharedCmsSection<unknown>('divisions'),
      loadSharedCmsSection<unknown>('partnerLogos'),
      loadSharedCmsSection<ArchitectureCatalogueCard[]>('archCards').catch(() => null)
    ]).then(([sharedHomepage, sharedGallery, sharedProducts, sharedDivisions, sharedLogos, sharedArchCards]) => {
      if (cancelled) return;
      if (sharedHomepage && typeof sharedHomepage === 'object' && !Array.isArray(sharedHomepage)) {
        setHomepageMedia((previous) => ({ ...previous, ...sharedHomepage }));
      }
      if (Array.isArray(sharedGallery)) setGalleryImages(normalizeGalleryItems(sharedGallery));
      if (Array.isArray(sharedProducts)) setProductList(sharedProducts as ProductItem[]);
      if (Array.isArray(sharedDivisions)) {
        saveProductDivisions(sharedDivisions as ProductCategoryDivision[]);
      }
      if (Array.isArray(sharedLogos)) setPartnerLogos(sharedLogos as any[]);
      if (Array.isArray(sharedArchCards) && sharedArchCards.length >= 2) {
        setArchCards(sharedArchCards);
        saveArchitectureCards(sharedArchCards);
      }
      setCmsHydrated(true);
    }).catch(() => {
      if (!cancelled) setCmsSaveFeedback('Shared content is unavailable. Existing local data was preserved.');
    });
    return () => { cancelled = true; };
  }, []);

  // Sync homepage section media with localStorage safely
  useEffect(() => {
    try {
      localStorage.setItem('winhome_cms_homepage_media', JSON.stringify(homepageMedia));
      window.dispatchEvent(new Event('cms_homepage_updated'));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [homepageMedia]);

  useEffect(() => {
    if (!cmsHydrated) return;
    const timer = window.setTimeout(() => {
      void saveSharedCmsSection('homepage', homepageMedia).catch((error) => {
        console.warn('Homepage shared save failed:', error);
        setCmsSaveFeedback('Saved in this browser only. Sign in again to publish across devices.');
      });
    }, 500);
    return () => window.clearTimeout(timer);
  }, [cmsHydrated, homepageMedia]);

  useEffect(() => {
    if (!cmsHydrated) return;
    const timer = window.setTimeout(() => {
      void saveSharedCmsSection('gallery', galleryImages).catch((error) => {
        console.warn('Gallery shared save failed:', error);
        setCmsSaveFeedback('Saved in this browser only. Sign in again to publish across devices.');
      });
    }, 500);
    return () => window.clearTimeout(timer);
  }, [cmsHydrated, galleryImages]);

  useEffect(() => {
    if (!cmsHydrated) return;
    const timer = window.setTimeout(() => {
      void saveSharedCmsSection('products', productList).catch((error) => {
        console.warn('Product shared save failed:', error);
        setCmsSaveFeedback('Products saved in this browser only. Sign in again to publish across devices.');
      });
    }, 500);
    return () => window.clearTimeout(timer);
  }, [cmsHydrated, productList]);

  useEffect(() => {
    if (!cmsHydrated) return;
    const timer = window.setTimeout(() => {
      void saveSharedCmsSection('divisions', divisions).catch((error) => {
        console.warn('Category shared save failed:', error);
        setCmsSaveFeedback('Categories saved in this browser only. Sign in again to publish across devices.');
      });
    }, 500);
    return () => window.clearTimeout(timer);
  }, [cmsHydrated, divisions]);

  useEffect(() => {
    if (!cmsHydrated) return;
    try {
      localStorage.setItem('winhome_cms_partner_logos', JSON.stringify(partnerLogos));
      window.dispatchEvent(new Event('cms_partner_logos_updated'));
    } catch (e) {
      console.warn('LocalStorage save error for partner logos:', e);
    }
    const timer = window.setTimeout(() => {
      void saveSharedCmsSection('partnerLogos', partnerLogos).then(() => {
        window.dispatchEvent(new Event('cms_partner_logos_updated'));
      }).catch((error) => {
        console.warn('Partner logos shared save failed:', error);
      });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [cmsHydrated, partnerLogos]);

  useEffect(() => {
    if (!cmsHydrated) return;
    try {
      saveArchitectureCards(archCards);
    } catch (e) {
      console.warn('LocalStorage save error for arch cards:', e);
    }
    const timer = window.setTimeout(() => {
      void saveSharedCmsSection('archCards', archCards).catch((error) => {
        console.warn('Architecture cards shared save failed:', error);
      });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [cmsHydrated, archCards]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, destination: 'gallery' | 'about' | 'hero' = 'gallery') => {
    const files = Array.from(e.target.files || []);
    const file = files[0];
    if (file) {
      try {
        if (destination === 'gallery') {
          if (!newGalleryTitle.trim()) {
            setGalleryUploadError('Enter a project title before choosing a file.');
            e.target.value = '';
            return;
          }
          setGalleryUploadError('');
          setIsUploadingGalleryMedia(true);
          let uploadedCount = 0;
          const failures: string[] = [];
          const newEntries: GalleryMediaItem[] = [];
          for (const selectedFile of files) {
            try {
              const uploadedUrl = await uploadCmsMediaFile(selectedFile);
              newEntries.push({
                id: `proj-${crypto.randomUUID()}`,
                title: newGalleryTitle.trim(),
                description: newGalleryDescription.trim(),
                src: uploadedUrl,
                mediaType: selectedFile.type.startsWith('video/') ? 'video' : 'image',
                category: 'villa',
                location: '',
                system: ''
              });
              uploadedCount++;
            } catch (error) {
              failures.push(`${selectedFile.name}: ${error instanceof Error ? error.message : 'Upload failed'}`);
            }
          }
          if (newEntries.length > 0) {
            const updated = [...newEntries, ...galleryImages];
            await persistGalleryUpdates(updated);
          }
          if (!failures.length) {
            setNewGalleryTitle('');
            setNewGalleryDescription('');
          }
          setGalleryUploadError(failures.join('\n'));
          setCmsSaveFeedback(`${uploadedCount} of ${files.length} project files added & saved.`);
          e.target.value = '';
          return;
        }
        const compressed = await compressImageFile(file);
        if (compressed) {
          if (destination === 'about') {
            setHomepageMedia((prev) => ({ ...prev, aboutFactoryImage: compressed }));
          } else if (destination === 'hero') {
            setHomepageMedia((prev) => ({ ...prev, heroPosterImage: compressed }));
          }
          setCmsSaveFeedback('✓ New Image Uploaded & Live on Website!');
          setTimeout(() => setCmsSaveFeedback(''), 4000);
        }
      } catch (err) {
        console.error('Media upload error:', err);
        if (destination === 'gallery') setGalleryUploadError(err instanceof Error ? err.message : 'Media upload failed.');
        else setCmsSaveFeedback(err instanceof Error ? err.message : 'Media upload failed.');
      } finally {
        if (destination === 'gallery') setIsUploadingGalleryMedia(false);
        e.target.value = '';
      }
    }
  };

  const persistGalleryUpdates = async (updated: GalleryMediaItem[]) => {
    setGalleryImages(updated);
    saveGalleryItems(updated);
    try {
      await saveSharedCmsSection('gallery', updated);
    } catch (sharedErr) {
      console.warn('Failed to save gallery to server:', sharedErr);
    }
  };

  const handleReplaceGalleryImage = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setGalleryUploadError('');
        const uploadedUrl = await uploadCmsMediaFile(file);
        if (uploadedUrl) {
          const updated = [...galleryImages];
          updated[idx] = { ...updated[idx], src: uploadedUrl, mediaType: file.type.startsWith('video/') ? 'video' : 'image' };
          await persistGalleryUpdates(updated);
          setCmsSaveFeedback(`✓ 3D Carousel Card #${idx + 1} Replaced & Saved!`);
          setTimeout(() => setCmsSaveFeedback(''), 4000);
        }
      } catch (err) {
        console.error('Replace error:', err);
        setGalleryUploadError(err instanceof Error ? err.message : 'Media upload failed.');
      } finally {
        e.target.value = '';
      }
    }
  };

  const handleMoveGalleryImage = async (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= galleryImages.length) return;
    const updated = [...galleryImages];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    await persistGalleryUpdates(updated);
    setCmsSaveFeedback(`✓ Moved Card #${idx + 1} to #${targetIdx + 1}`);
    setTimeout(() => setCmsSaveFeedback(''), 3000);
  };

  const handleDeleteGalleryImage = async (idx: number) => {
    const updated = galleryImages.filter((_, i) => i !== idx);
    await persistGalleryUpdates(updated);
    setCmsSaveFeedback('✓ Image removed and changes saved.');
    setTimeout(() => setCmsSaveFeedback(''), 3000);
  };

  const handleReplaceShowcaseImage = async (systemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file);
        if (compressed) {
          setHomepageMedia((prev) => ({
            ...prev,
            showcaseImages: {
              ...(prev.showcaseImages || {}),
              [systemId]: compressed
            }
          }));
          setCmsSaveFeedback(`✓ ${systemId} Image Replaced Successfully!`);
          setTimeout(() => setCmsSaveFeedback(''), 4000);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleProductImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingProductImage(true);
      setProductFormError('');
      try {
        setFormImage(await uploadCmsMediaFile(file));
      } catch (err) {
        console.error('Product media error:', err);
        setProductFormError(err instanceof Error ? err.message : 'Media upload failed.');
      } finally {
        setIsUploadingProductImage(false);
        e.target.value = '';
      }
    }
  };

  const handleManualSaveCMS = async () => {
    try {
      localStorage.setItem('winhome_cms_homepage_media', JSON.stringify(homepageMedia));
      saveGalleryItems(galleryImages);
      await Promise.all([
        saveSharedCmsSection('homepage', homepageMedia),
        saveSharedCmsSection('gallery', galleryImages),
        saveSharedCmsSection('archCards', archCards).catch(() => {})
      ]);
      setCmsSaveFeedback('✓ All Section Media & Text Confirmed & Saved to Website!');
      setTimeout(() => setCmsSaveFeedback(''), 4000);
    } catch (err) {
      console.error(err);
      setCmsSaveFeedback('Saved in this browser only. Sign in again to publish across devices.');
    }
  };

  const handleOpenRequestDetail = (req: QuotationRequest) => {
    setSelectedRequest(req);
    setEditStatus(req.status);
    setEditAdminNotes(req.adminNotes || '');
    setEditQuotedAmount(req.quotedAmount ? String(req.quotedAmount) : '');
    setRequestNotification('');
  };

  const handleSaveRequestDetails = async () => {
    if (!selectedRequest) return;
    setIsSavingRequest(true);
    try {
      const numericAmount = editQuotedAmount.trim() ? parseFloat(editQuotedAmount) : undefined;
      const updated = await updateRequestStatus(
        selectedRequest.id,
        editStatus,
        editAdminNotes,
        numericAmount
      );
      if (updated) {
        setSelectedRequest(updated);
        setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        setRequestNotification('Request updated successfully.');
        setTimeout(() => setRequestNotification(''), 3000);
      }
    } catch (err) {
      console.error(err);
      alert('Error updating request');
    } finally {
      setIsSavingRequest(false);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (confirm(`Delete request ${id}?`)) {
      await deleteRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      if (selectedRequest?.id === id) setSelectedRequest(null);
    }
  };

  const getStatusBadge = (status: QuotationRequest['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-red-100 text-red-800 border border-red-300">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            NEW
          </span>
        );
      case 'reviewing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3" />
            IN REVIEW
          </span>
        );
      case 'quoted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <DollarSign className="w-3 h-3" />
            QUOTED
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-300">
            <CheckCircle2 className="w-3 h-3" />
            APPROVED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-700 border border-slate-300">
            {status || 'PENDING'}
          </span>
        );
    }
  };

  return (
    <div dir="ltr" className="doorhome-admin-workspace bg-slate-50 text-slate-900 font-sans flex h-screen overflow-hidden antialiased">
      
      {/* LEFT SIDEBAR NAVIGATION - RED BRAND PALETTE WITH WHITE TEXT & ICONS */}
      <aside className="w-64 bg-red-600 text-white border-r border-red-700 shrink-0 flex flex-col justify-between hidden md:flex h-full overflow-y-auto z-30 shadow-md select-none">
        <div>
          {/* Logo & Brand Header */}
          <div className="p-5 border-b border-red-500/60 flex items-center gap-3">
            <div className="h-10 w-10 bg-white rounded-xl p-1 flex items-center justify-center shrink-0 shadow-sm">
              <img
                src={DOORHOME_CONTACT.logo}
                alt="Doorhome Logo"
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DOORHOME_CONTACT.logoFallback;
                }}
              />
            </div>
            <div>
              <h1 className="text-sm font-black text-white leading-tight tracking-wide">
                Doorhome Console
              </h1>
              <span className="text-[10px] text-red-100 font-medium">
                {currentLanguage.code === 'ar' ? 'لوحة الإدارة الهندسية' : currentLanguage.code === 'ckb' ? 'پەنێڵی بەڕێوەبردن' : 'Architecture & Catalog'}
              </span>
            </div>
          </div>

          {/* Nav Section Links */}
          <div className="p-4 space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-red-200 block px-3 mb-2">
                {currentLanguage.code === 'ar' ? 'القائمة الرئيسية' : currentLanguage.code === 'ckb' ? 'مێنۆی سەرەکی' : 'Main Menu'}
              </span>
              <nav className="space-y-1.5">
                {/* COMBINED PRODUCTS & CATEGORIES TAB */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection('products');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    activeSection === 'products' || activeSection === 'categories'
                      ? 'bg-white text-red-700 font-extrabold shadow-md border border-white'
                      : 'text-white/90 hover:text-white hover:bg-white/15 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package className={`w-4 h-4 ${activeSection === 'products' || activeSection === 'categories' ? 'text-red-600' : 'text-white'}`} />
                    <span>{currentLanguage.code === 'ar' ? 'المنتجات والتصنيفات' : currentLanguage.code === 'ckb' ? 'بەرهەم و هاوپۆلەکان' : 'Products & Categories'}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                    activeSection === 'products' || activeSection === 'categories' ? 'bg-red-100 text-red-700' : 'bg-red-700/80 text-white border border-red-400/40'
                  }`}>
                    {productList.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection('users')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    activeSection === 'users'
                      ? 'bg-white text-red-700 font-extrabold shadow-md border border-white'
                      : 'text-white/90 hover:text-white hover:bg-white/15 font-bold'
                  }`}
                >
                  <Users className={`w-4 h-4 ${activeSection === 'users' ? 'text-red-600' : 'text-white'}`} />
                  <span>{t('admin_tab_users')}</span>
                </button>
              </nav>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-red-200 block px-3 mb-2">
                {currentLanguage.code === 'ar' ? 'المحتوى والهوية' : currentLanguage.code === 'ckb' ? 'ناوەڕۆک و براند' : 'Content & Branding'}
              </span>
              <nav className="space-y-1.5">
                {/* CMS & GALLERY TAB */}
                <button
                  type="button"
                  onClick={() => setActiveSection('cms')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    activeSection === 'cms'
                      ? 'bg-white text-red-700 font-extrabold shadow-md border border-white'
                      : 'text-white/90 hover:text-white hover:bg-white/15 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ImageIcon className={`w-4 h-4 ${activeSection === 'cms' ? 'text-red-600' : 'text-white'}`} />
                    <span>{currentLanguage.code === 'ar' ? 'معرض المشاريع والوسائط' : currentLanguage.code === 'ckb' ? 'پڕۆژەکان و کارۆسێل' : 'CMS & Gallery'}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                    activeSection === 'cms' ? 'bg-red-100 text-red-700' : 'bg-red-700/80 text-white border border-red-400/40'
                  }`}>
                    {galleryImages.length}
                  </span>
                </button>

                {/* PARTNER BRANDS & FLAGS TAB */}
                <button
                  type="button"
                  onClick={() => setActiveSection('logos')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    activeSection === 'logos'
                      ? 'bg-white text-red-700 font-extrabold shadow-md border border-white'
                      : 'text-white/90 hover:text-white hover:bg-white/15 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Globe className={`w-4 h-4 ${activeSection === 'logos' ? 'text-red-600' : 'text-white'}`} />
                    <span>{currentLanguage.code === 'ar' ? 'العلامات والشركاء' : currentLanguage.code === 'ckb' ? 'لۆگۆی هاوبەشەکان' : 'Partner Brands & Flags'}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                    activeSection === 'logos' ? 'bg-red-100 text-red-700' : 'bg-red-700/80 text-white border border-red-400/40'
                  }`}>
                    {partnerLogos.length}
                  </span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Sidebar Action */}
        <div className="p-4 border-t border-red-500/60">
          <button
            type="button"
            onClick={() => {
              window.location.hash = '';
              onBackToHome();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white text-white hover:text-red-700 font-extrabold text-xs transition-all flex items-center justify-center gap-2 border border-white/30 cursor-pointer shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{currentLanguage.code === 'ar' ? 'العودة للموقع الرئيسي' : currentLanguage.code === 'ckb' ? 'گەڕانەوە بۆ ماڵپەڕ' : 'Back to Website'} ↗</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-white">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 py-3 px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {(activeSection === 'products' || activeSection === 'categories') && (currentLanguage.code === 'ar' ? 'المنتجات والتصنيفات الهندسية' : currentLanguage.code === 'ckb' ? 'بەرهەم و هاوپۆلەکان' : 'Products & Categories')}
              {activeSection === 'users' && (t('admin_tab_users') || 'Team & Users')}
              {activeSection === 'cms' && (currentLanguage.code === 'ar' ? 'معرض المشاريع والوسائط' : currentLanguage.code === 'ckb' ? 'پڕۆژەکان و کارۆسێل' : 'CMS & Gallery')}
              {activeSection === 'logos' && (currentLanguage.code === 'ar' ? 'العلامات والشركاء' : currentLanguage.code === 'ckb' ? 'لۆگۆی هاوبەشەکان' : 'Partner Brands & Flags')}
            </h2>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Language Switcher Pill */}
            <div className="flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === 'ckb');
                  if (lang) setLanguage(lang.code);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  currentLanguage.code === 'ckb'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                سۆرانی
              </button>
              <button
                type="button"
                onClick={() => {
                  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === 'ar');
                  if (lang) setLanguage(lang.code);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  currentLanguage.code === 'ar'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                العربية
              </button>
              <button
                type="button"
                onClick={() => {
                  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === 'en');
                  if (lang) setLanguage(lang.code);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  currentLanguage.code === 'en'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                EN
              </button>
            </div>

            {/* View Live Homepage Link Button */}
            <button
              type="button"
              onClick={() => {
                window.location.hash = '';
                onBackToHome();
              }}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">{t('admin_btn_back_home')} ↗</span>
            </button>

            {activeSection === 'products' && (
              <button
                type="button"
                onClick={handleOpenAddProduct}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{t('admin_btn_add_product')}</span>
              </button>
            )}

            <div className="w-7 h-7 rounded-full bg-red-50 text-red-700 font-black text-xs flex items-center justify-center border border-red-200">
              AD
            </div>
          </div>
        </header>

        {/* Mobile Navigation Tabs - Red & White */}
        <div className="md:hidden bg-red-600 text-white border-b border-red-700 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 z-10">
          <button
            type="button"
            onClick={() => setActiveSection('products')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
              activeSection === 'products' || activeSection === 'categories'
                ? 'bg-white text-red-700 shadow-sm'
                : 'text-white/90 hover:bg-white/10'
            }`}
          >
            {currentLanguage.code === 'ar' ? 'المنتجات والتصنيفات' : 'Products & Categories'} ({productList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
              activeSection === 'users'
                ? 'bg-white text-red-700 shadow-sm'
                : 'text-white/90 hover:bg-white/10'
            }`}
          >
            {t('admin_tab_users')}
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('cms')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
              activeSection === 'cms'
                ? 'bg-white text-red-700 shadow-sm'
                : 'text-white/90 hover:bg-white/10'
            }`}
          >
            {currentLanguage.code === 'ar' ? 'معرض المشاريع (CMS)' : 'CMS & Gallery'} ({galleryImages.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('logos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
              activeSection === 'logos'
                ? 'bg-white text-red-700 shadow-sm'
                : 'text-white/90 hover:bg-white/10'
            }`}
          >
            {currentLanguage.code === 'ar' ? 'العلامات والشركاء' : 'Partner Brands'} ({partnerLogos.length})
          </button>
        </div>

        {/* SECTION 2: COMBINED PRODUCTS & CATEGORIES MANAGEMENT */}
        {(activeSection === 'products' || activeSection === 'categories') && (
          <main className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Sub-Navigation Switcher between Products and Categories */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setProductSubTab('products')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                    productSubTab === 'products'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>{currentLanguage.code === 'ar' ? 'قائمة المنتجات والأنظمة' : currentLanguage.code === 'ckb' ? 'لیستی بەرهەمەکان' : 'Products Catalog'}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    productSubTab === 'products' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {productList.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setProductSubTab('categories')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                    productSubTab === 'categories'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>{currentLanguage.code === 'ar' ? 'الأقسام والتصنيفات الهندسية' : currentLanguage.code === 'ckb' ? 'هاوپۆلەکان و بەشەکان' : 'Categories & Divisions'}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    productSubTab === 'categories' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {divisions.length}
                  </span>
                </button>
              </div>

              {productSubTab === 'products' && (
                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{t('admin_btn_add_product')}</span>
                </button>
              )}
            </div>

            {productSubTab === 'products' && (
              <>
            {/* Action Bar & Filters */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    placeholder={t('admin_search_products_ph')}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 font-semibold text-slate-700 cursor-pointer shadow-2xs"
                >
                  <option value="all">{t('admin_filter_all_divisions')}</option>
                  {divisions.map((div) => (
                    <option key={div.id} value={div.key || div.id}>
                      {div.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {productList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all products from the catalog?')) {
                        setProductList([]);
                        saveLocalProducts([]);
                      }
                    }}
                    className="px-3 py-2 rounded-lg bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-700 font-medium text-xs border border-slate-200 hover:border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t('admin_btn_clear_catalog')}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{t('admin_btn_add_product')}</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm border-collapse text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5 text-left">{t('admin_col_name')}</th>
                      <th className="px-6 py-3.5 text-left">{t('admin_col_category')}</th>
                      <th className="px-6 py-3.5 text-right">{t('admin_col_actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map(prod => {
                      const localized = getLocalizedProduct(prod, currentLanguage.code);
                      const division = divisions.find(div => div.key === (prod.division || prod.category));
                      const category = ((division as any)?.translations?.[currentLanguage.code] || (division as any)?.translations?.[currentLanguage.code.split('-')[0]])?.name || (currentLanguage.code === 'ar' ? division?.arabicTitle : currentLanguage.code === 'ckb' ? division?.kurdishTitle : division?.title) || prod.category;
                      return (
                        <tr key={prod.id} className="hover:bg-red-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <a href={prod.image || prod.fallbackImage} target="_blank" rel="noopener noreferrer" className="shrink-0 group">
                                <img
                                  src={prod.image || prod.fallbackImage}
                                  alt={localized.name}
                                  loading="lazy"
                                  className="h-20 w-28 rounded-xl object-cover border border-slate-200/80 shadow-2xs group-hover:scale-102 transition-transform"
                                />
                              </a>
                              <button type="button" onClick={() => handleOpenEditProduct(prod)} className="text-left group cursor-pointer">
                                <span className="block text-sm sm:text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                                  {localized.name}
                                </span>
                                <span className="mt-1 block max-w-lg text-xs leading-relaxed text-slate-500 line-clamp-2">
                                  {localized.description}
                                </span>
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                              {category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditProduct(prod)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5 text-slate-400" />
                                <span>{t('admin_modal_edit_product')}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
              </>
            )}

            {/* Sub-View: Categories Hierarchy */}
            {productSubTab === 'categories' && (
              <AdminCategoriesTab />
            )}
          </main>
        )}

        {/* SECTION 5: TEAM & USER ACCESS CONTROL */}
        {activeSection === 'users' && <AdminUsersTab />}

        {/* SECTION: CMS & GALLERY (3D CAROUSEL, ALL PROJECTS, ARCH CARDS, WINDOWS, DOORS) */}
        {activeSection === 'cms' && (
          <main className="p-6 space-y-6 flex-1 overflow-y-auto bg-slate-50/60">
            {/* Sub-Navigation Pills for CMS - Flex-wrap, ZERO horizontal side-scrolling */}
            <div className="bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center gap-2">
              {/* 1. 3D Carousel (12 Slots) */}
              <button
                type="button"
                onClick={() => setCmsSubTab('3d-carousel')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  cmsSubTab === '3d-carousel'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {currentLanguage.code === 'ar'
                    ? 'كاروسيل 3D التفاعلي (12 سلايد)'
                    : currentLanguage.code === 'ckb'
                    ? 'کارۆسێلی 3D (١٢ سلاید)'
                    : '3D Carousel (12 Slots)'}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    cmsSubTab === '3d-carousel' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  12
                </span>
              </button>

              {/* 2. All Projects Portfolio */}
              <button
                type="button"
                onClick={() => setCmsSubTab('all-projects')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  cmsSubTab === 'all-projects'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>
                  {currentLanguage.code === 'ar'
                    ? 'أرشيف كل المشاريع'
                    : currentLanguage.code === 'ckb'
                    ? 'ئەرشیفی هەموو پڕۆژەکان'
                    : 'All Projects Portfolio'}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    cmsSubTab === 'all-projects' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {galleryImages.length}
                </span>
              </button>

              {/* 3. Architecture Systems & Drawings Showcase */}
              <button
                type="button"
                onClick={() => setCmsSubTab('arch-cards')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  cmsSubTab === 'arch-cards'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>
                  {currentLanguage.code === 'ar'
                    ? 'الأنظمة والرسومات المعمارية'
                    : currentLanguage.code === 'ckb'
                    ? 'سیستەمە تەلارسازییەکان'
                    : 'Architecture Systems Showcase'}
                </span>
              </button>

              {/* 4. Windows Section Media */}
              <button
                type="button"
                onClick={() => setCmsSubTab('windows-section')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  cmsSubTab === 'windows-section'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>
                  {currentLanguage.code === 'ar'
                    ? 'ميديا قسم النوافذ'
                    : currentLanguage.code === 'ckb'
                    ? 'میدیای بەشی پەنجەرەکان'
                    : 'Windows Section Media'}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    cmsSubTab === 'windows-section' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {productList.filter((p) => p.division === 'windows' || p.category === 'windows').length}
                </span>
              </button>

              {/* 5. Doors Section Media */}
              <button
                type="button"
                onClick={() => setCmsSubTab('doors-section')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  cmsSubTab === 'doors-section'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>
                  {currentLanguage.code === 'ar'
                    ? 'ميديا قسم الأبواب'
                    : currentLanguage.code === 'ckb'
                    ? 'میدیای بەشی دەرگاکان'
                    : 'Doors Section Media'}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    cmsSubTab === 'doors-section' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {productList.filter((p) => p.division === 'doors' || p.category === 'doors').length}
                </span>
              </button>
            </div>

            {/* CMS Feedback Banner */}
            {cmsSaveFeedback && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-xs font-black">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{cmsSaveFeedback}</span>
                </div>
                <button type="button" onClick={() => setCmsSaveFeedback('')} className="text-emerald-600 text-xs font-bold">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* TAB 1: 3D INTERACTIVE CAROUSEL (12 SLOTS) */}
            {cmsSubTab === '3d-carousel' && (
              <Admin3DCarouselTab
                galleryImages={galleryImages}
                onUpdateGallery={persistGalleryUpdates}
                onUploadMedia={uploadCmsMediaFile}
                onSaveFeedback={(msg) => {
                  setCmsSaveFeedback(msg);
                  setTimeout(() => setCmsSaveFeedback(''), 4000);
                }}
              />
            )}

            {/* TAB 2: ALL PROJECTS ARCHIVE & PORTFOLIO */}
            {cmsSubTab === 'all-projects' && (
              <AdminAllProjectsTab
                galleryImages={galleryImages}
                onUpdateGallery={persistGalleryUpdates}
                onUploadMedia={uploadCmsMediaFile}
                onSaveFeedback={(msg) => {
                  setCmsSaveFeedback(msg);
                  setTimeout(() => setCmsSaveFeedback(''), 4000);
                }}
                AdvancedTextarea={AdvancedTextarea}
              />
            )}

            {/* TAB 3: ARCHITECTURE CARDS & CATALOGUES */}
            {cmsSubTab === 'arch-cards' && (
              <AdminArchCardsTab
                archCards={archCards}
                onUpdateArchCards={setArchCards}
                onUploadMedia={uploadCmsMediaFile}
                onSaveFeedback={(msg) => {
                  setCmsSaveFeedback(msg);
                  setTimeout(() => setCmsSaveFeedback(''), 4000);
                }}
              />
            )}

            {/* TAB 4: WINDOWS SECTION MEDIA & MODELS */}
            {cmsSubTab === 'windows-section' && (
              <AdminWindowsSectionTab
                productList={productList}
                setProductList={setProductList}
                onUploadMedia={uploadCmsMediaFile}
                onSaveFeedback={(msg) => {
                  setCmsSaveFeedback(msg);
                  setTimeout(() => setCmsSaveFeedback(''), 4000);
                }}
                onOpenNewProductModal={(cat) => handleOpenAddProductForCategory(cat)}
              />
            )}

            {/* TAB 5: DOORS SECTION MEDIA & MODELS */}
            {cmsSubTab === 'doors-section' && (
              <AdminDoorsSectionTab
                productList={productList}
                setProductList={setProductList}
                onUploadMedia={uploadCmsMediaFile}
                onSaveFeedback={(msg) => {
                  setCmsSaveFeedback(msg);
                  setTimeout(() => setCmsSaveFeedback(''), 4000);
                }}
                onOpenNewProductModal={(cat) => handleOpenAddProductForCategory(cat)}
              />
            )}
          </main>
        )}

        {/* SECTION: PARTNER BRANDS & COUNTRY FLAGS */}
        {activeSection === 'logos' && (
          <main className="p-6 space-y-6 flex-1 overflow-y-auto bg-slate-50/60">
            {/* Hidden file inputs for Logo & Flag uploads */}
            <input
              type="file"
              ref={logoFileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleLogoFileUpload}
            />
            <input
              type="file"
              ref={newFlagFileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleNewFlagFileUpload}
            />
            <input
              type="file"
              ref={cardFlagFileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleCardFlagFileUpload}
            />

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-red-600 rounded-full inline-block" />
                  Partner Brands & Country Flags
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage partner brand logos and upload custom country flags (PNG, SVG, WebP) or select flag emojis.
                </p>
              </div>
              {logosSaveFeedback && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-red-600" />
                  {logosSaveFeedback}
                </div>
              )}
            </div>

            {/* Add New Logo Card */}
            <div className="bg-white rounded-2xl border-2 border-red-100 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-red-600 stroke-[3]" /> Add New Partner Brand
                </h3>
                <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                  Image Uploads Supported
                </span>
              </div>

              {/* Country & Flag Quick Presets */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Quick Country & Flag Presets
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { country: 'Kurdistan', flag: '/assets/flags/kurdish_flag.png', label: 'Kurdistan' },
                    { country: 'Iraq', flag: '🇮🇶', label: 'Iraq' },
                    { country: 'Germany', flag: '🇩🇪', label: 'Germany' },
                    { country: 'Italy', flag: '🇮🇹', label: 'Italy' },
                    { country: 'Turkey', flag: '🇹🇷', label: 'Turkey' },
                    { country: 'Belgium', flag: '🇧🇪', label: 'Belgium' },
                    { country: 'Spain', flag: '🇪🇸', label: 'Spain' },
                    { country: 'Greece', flag: '🇬🇷', label: 'Greece' },
                    { country: 'United Kingdom', flag: '🇬🇧', label: 'UK' },
                    { country: 'United States', flag: '🇺🇸', label: 'USA' },
                    { country: 'France', flag: '🇫🇷', label: 'France' },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setNewLogo((prev) => ({ ...prev, country: p.country, flag: p.flag }))}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        newLogo.country === p.country
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-white hover:bg-red-50 hover:border-red-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      {isImageFlag(p.flag) ? (
                        <img src={p.flag} alt="" className="w-4 h-3 object-cover rounded-2xs inline-block shadow-2xs" />
                      ) : (
                        <span>{p.flag}</span>
                      )}
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Brand Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. SCHÜCO"
                    value={newLogo.name}
                    onChange={(e) => setNewLogo((l) => ({ ...l, name: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-red-400 focus:border-red-500 outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Brand Logo Image *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Image URL or upload"
                      value={newLogo.src}
                      onChange={(e) => setNewLogo((l) => ({ ...l, src: e.target.value }))}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-red-400 focus:border-red-500 outline-none bg-white"
                    />
                    <button
                      type="button"
                      disabled={isUploadingLogo}
                      onClick={() => logoFileInputRef.current?.click()}
                      className="shrink-0 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      title="Upload Brand Logo Image"
                    >
                      <Upload className="w-3.5 h-3.5 text-red-600" />
                      <span>{isUploadingLogo ? '...' : 'Upload'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Country Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Germany / Iraq"
                    value={newLogo.country}
                    onChange={(e) => setNewLogo((l) => ({ ...l, country: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-red-400 focus:border-red-500 outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1 flex items-center justify-between">
                    <span>Country Flag (Upload or Emoji)</span>
                    {newLogo.flag && (
                      <button
                        type="button"
                        onClick={() => setNewLogo((l) => ({ ...l, flag: '' }))}
                        className="text-red-600 hover:underline text-[10px] font-semibold"
                      >
                        clear
                      </button>
                    )}
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1 flex items-center">
                      {newLogo.flag && isImageFlag(newLogo.flag) ? (
                        <div className="w-full flex items-center gap-2 border border-slate-300 rounded-xl px-2.5 py-1.5 bg-white">
                          <img
                            src={newLogo.flag}
                            alt="Flag"
                            className="w-6 h-4 object-cover rounded-xs border border-slate-200 shrink-0 shadow-2xs"
                          />
                          <span className="text-xs text-slate-600 truncate flex-1 font-mono text-[11px]">{newLogo.flag}</span>
                        </div>
                      ) : (
                        <input
                          type="text"
                          placeholder="e.g. 🇩🇪 or upload flag image"
                          value={newLogo.flag}
                          onChange={(e) => setNewLogo((l) => ({ ...l, flag: e.target.value }))}
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-red-400 focus:border-red-500 outline-none bg-white"
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      disabled={isUploadingFlag}
                      onClick={() => newFlagFileInputRef.current?.click()}
                      className="shrink-0 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      title="Upload Flag Icon Image"
                    >
                      <Upload className="w-3.5 h-3.5 text-red-600" />
                      <span>{isUploadingFlag ? '...' : 'Upload'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview of logo & flag badge */}
              {newLogo.src && (
                <div className="flex items-center gap-4 p-3 bg-red-50/40 rounded-xl border border-red-100">
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-10 px-4 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-xs">
                      <img
                        src={newLogo.src}
                        alt={newLogo.name}
                        className="max-h-8 max-w-[120px] object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    {newLogo.flag && (
                      <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold shadow-xs">
                        {isImageFlag(newLogo.flag) ? (
                          <img src={newLogo.flag} alt="" className="w-4 h-3 object-cover rounded-2xs inline-block" />
                        ) : (
                          <span>{newLogo.flag}</span>
                        )}
                        {newLogo.country && <span>{newLogo.country}</span>}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-slate-600 font-medium">Live preview of how the brand logo & flag appear</span>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (!newLogo.name.trim() || !newLogo.src.trim()) {
                      alert('Please provide brand name and image URL/file.');
                      return;
                    }
                    const logo = {
                      id: `logo-${Date.now()}`,
                      name: newLogo.name.trim(),
                      src: newLogo.src.trim(),
                      alt: newLogo.alt || newLogo.name.trim(),
                      country: newLogo.country.trim() || undefined,
                      flag: newLogo.flag.trim() || undefined,
                    };
                    const updated = [...partnerLogos, logo];
                    setPartnerLogos(updated);
                    setNewLogo({ name: '', src: '', alt: '', country: '', flag: '' });
                    try {
                      localStorage.setItem('winhome_cms_partner_logos', JSON.stringify(updated));
                      window.dispatchEvent(new Event('cms_partner_logos_updated'));
                    } catch {}
                    void saveSharedCmsSection('partnerLogos', updated).catch(() => {});
                  }}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-red-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add Brand to List</span>
                </button>
              </div>
            </div>

            {/* Active Partner Logos Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  Configured Brands ({partnerLogos.length})
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  Changes save automatically and update the website in real-time.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {partnerLogos.map((logo, idx) => (
                  <div
                    key={logo.id || idx}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-red-300 p-4 shadow-xs flex flex-col justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 flex flex-col items-center gap-1.5">
                        <div className="w-20 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1.5 shadow-2xs">
                          <img
                            src={logo.src}
                            alt={logo.alt || logo.name}
                            className="max-h-10 max-w-[70px] object-contain"
                            onError={(e) => {
                              const t = e.target as HTMLImageElement;
                              t.style.display = 'none';
                            }}
                          />
                        </div>
                        {logo.flag && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-extrabold shadow-2xs">
                            {isImageFlag(logo.flag) ? (
                              <img src={logo.flag} alt="" className="w-4 h-3 object-cover rounded-2xs inline-block" />
                            ) : (
                              <span>{logo.flag}</span>
                            )}
                            {logo.country && <span className="truncate max-w-[65px]">{logo.country}</span>}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="font-extrabold text-sm text-slate-900 truncate">{logo.name}</div>
                        <input
                          type="text"
                          value={logo.country || ''}
                          placeholder="Country (e.g. Italy)"
                          onChange={(e) => {
                            const updated = [...partnerLogos];
                            updated[idx] = { ...updated[idx], country: e.target.value };
                            setPartnerLogos(updated);
                          }}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 outline-none focus:border-red-400 bg-white"
                        />
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={logo.flag || ''}
                            placeholder="Flag (emoji or URL)"
                            onChange={(e) => {
                              const updated = [...partnerLogos];
                              updated[idx] = { ...updated[idx], flag: e.target.value };
                              setPartnerLogos(updated);
                            }}
                            className="flex-1 min-w-0 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 outline-none focus:border-red-400 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setUploadingFlagCardIdx(idx);
                              cardFlagFileInputRef.current?.click();
                            }}
                            className="shrink-0 px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                            title="Upload Flag Image for this brand"
                          >
                            <Upload className="w-3 h-3 text-red-600" />
                            <span>Upload</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx === 0) return;
                            const updated = [...partnerLogos];
                            const temp = updated[idx - 1];
                            updated[idx - 1] = updated[idx];
                            updated[idx - 1] = temp;
                            setPartnerLogos(updated);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 cursor-pointer transition-colors"
                          title="Move Left"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === partnerLogos.length - 1}
                          onClick={() => {
                            if (idx === partnerLogos.length - 1) return;
                            const updated = [...partnerLogos];
                            const temp = updated[idx + 1];
                            updated[idx + 1] = updated[idx];
                            updated[idx] = temp;
                            setPartnerLogos(updated);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 cursor-pointer transition-colors"
                          title="Move Right"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = partnerLogos.filter((_, i) => i !== idx);
                          setPartnerLogos(updated);
                          try {
                            localStorage.setItem('winhome_cms_partner_logos', JSON.stringify(updated));
                            window.dispatchEvent(new Event('cms_partner_logos_updated'));
                          } catch {}
                          void saveSharedCmsSection('partnerLogos', updated).catch(() => {});
                        }}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                        title="Remove Logo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 pb-8">
              <button
                type="button"
                disabled={logosSaving}
                onClick={async () => {
                  setLogosSaving(true);
                  try {
                    await saveSharedCmsSection('partnerLogos', partnerLogos);
                    localStorage.setItem('winhome_cms_partner_logos', JSON.stringify(partnerLogos));
                    window.dispatchEvent(new Event('cms_partner_logos_updated'));
                    setLogosSaveFeedback('✓ Partner logos and flags saved to website!');
                    setTimeout(() => setLogosSaveFeedback(''), 4000);
                  } catch (e: any) {
                    setLogosSaveFeedback('Failed to save: ' + (e?.message || 'Network error'));
                  } finally {
                    setLogosSaving(false);
                  }
                }}
                className="px-7 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-md shadow-red-600/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{logosSaving ? 'Saving to Website...' : 'Save Partner Logos to Website'}</span>
              </button>
            </div>
          </main>
        )}

      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {editingProduct ? t('admin_modal_edit_product') : t('admin_modal_create_product')}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/60 text-slate-600 hover:text-slate-900 flex items-center justify-center font-bold cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-bold text-slate-700">
              {/* Product Basic Info */}
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-slate-900 uppercase text-[10px]">{t('admin_form_name')}</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Sliding Glass Window, Double Glazed Balcony Door..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-extrabold text-sm"
                  />
                </div>

                <div>
                  <AdvancedTextarea
                    value={formDescription}
                    onChange={setFormDescription}
                    placeholder="Describe this product (specifications, thermal rating, glass types...)"
                    label={t('admin_form_desc') || 'Product Description'}
                    rows={4}
                    minHeight="95px"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-slate-900 uppercase text-[10px]">{t('admin_simple_category')}</label>
                  <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)} required className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 font-bold text-slate-900">
                    {divisions.length === 0 && <option value="">Create a category first</option>}
                    {divisions.map((div) => <option key={div.id} value={div.key || div.id}>{div.title}</option>)}
                  </select>
                </div>
              </div>

              {/* Product Image */}
              <div className="space-y-2">
                <label className="block text-slate-900 uppercase text-[10px]">{t('admin_form_image')}</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => productFileInputRef.current?.click()}
                    className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isUploadingProductImage ? t('admin_uploading') : t('admin_form_upload')}</span>
                  </button>
                  <input
                    ref={productFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                    onChange={handleProductImageFileUpload}
                    className="hidden"
                  />

                </div>

                {formImage && (
                  <div className="flex items-center gap-3 p-2 bg-slate-100 rounded-xl border border-slate-200 mt-2">
                    {/\.(mp4|webm|mov)(\?|#|$)/i.test(formImage) ? (
                      <video src={formImage} muted autoPlay loop playsInline className="w-12 h-12 rounded-lg object-cover bg-black" />
                    ) : (
                      <img src={formImage} alt="Product preview" className="w-12 h-12 rounded-lg object-contain bg-white p-1" />
                    )}
                    <span className="text-[11px] font-bold text-slate-900">{t('admin_image_ready')}</span>
                  </div>
                )}
              </div>

              {productFormError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{productFormError}</p>}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {t('admin_form_cancel')}
                </button>

                <button
                  type="submit"
                  disabled={isUploadingProductImage}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {t('admin_form_save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST & CONTACT MESSAGE INSPECTION MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-red-600 text-white font-black text-base flex items-center justify-center shadow-sm shrink-0">
                  {selectedRequest.customer?.fullName ? selectedRequest.customer.fullName[0].toUpperCase() : 'C'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 truncate">
                      {selectedRequest.customer?.fullName || 'Client Inquiry'}
                    </h3>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                      (selectedRequest.status as string) === 'quoted' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      (selectedRequest.status as string) === 'reviewing' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      (selectedRequest.status as string) === 'closed' ? 'bg-slate-200 text-slate-700' :
                      'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}>
                      {selectedRequest.status || 'New'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span className="font-mono">{selectedRequest.id}</span>
                    <span>•</span>
                    <span>{selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleString() : 'Recent'}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 hover:text-slate-900 flex items-center justify-center font-bold cursor-pointer transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Contact & Inquiry Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Contact Card */}
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Customer Contact</span>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 font-bold flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-red-600" />
                        <span>Phone:</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${selectedRequest.customer?.phone || ''}`}
                          className="font-extrabold text-slate-900 hover:text-red-600 transition-colors"
                        >
                          {selectedRequest.customer?.phone || 'N/A'}
                        </a>
                        {selectedRequest.customer?.phone && (
                          <a
                            href={`https://wa.me/${selectedRequest.customer.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 font-bold flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-red-600" />
                        <span>Email:</span>
                      </span>
                      <a
                        href={`mailto:${selectedRequest.customer?.email || ''}`}
                        className="font-extrabold text-blue-600 hover:underline truncate max-w-[170px]"
                      >
                        {selectedRequest.customer?.email || '—'}
                      </a>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 font-bold flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-600" />
                        <span>Location:</span>
                      </span>
                      <span className="font-extrabold text-slate-900 truncate">
                        {[selectedRequest.customer?.city, selectedRequest.customer?.country].filter(Boolean).join(', ') || 'Iraq'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inquiry Details Card */}
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Inquiry Details</span>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 font-bold">Category:</span>
                      <span className="font-extrabold px-2 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-[11px]">
                        {selectedRequest.customer?.projectType || selectedRequest.customer?.serviceNeeded || 'General Inquiry'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 font-bold">Preferred:</span>
                      <span className="font-extrabold text-slate-900 uppercase text-[11px]">
                        {selectedRequest.customer?.preferredContact || 'Phone'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-slate-500 font-bold">Status:</span>
                      <select
                        value={editStatus}
                        onChange={(e) => {
                          const nextStatus = e.target.value as any;
                          setEditStatus(nextStatus);
                          void updateRequestStatus(selectedRequest.id, nextStatus, editAdminNotes, editQuotedAmount ? parseFloat(editQuotedAmount) : undefined).then((up) => {
                            if (up) {
                              setSelectedRequest(up);
                              setRequests((prev) => prev.map((r) => (r.id === up.id ? up : r)));
                            }
                          });
                        }}
                        className="font-extrabold px-2 py-1 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs cursor-pointer"
                      >
                        <option value="new">New</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="quoted">Quoted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Message Card */}
              {selectedRequest.customer?.additionalNotes && (
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-red-600" />
                      <span>Client Message / Scope</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedRequest.customer?.additionalNotes) {
                          navigator.clipboard.writeText(selectedRequest.customer.additionalNotes);
                          setCopiedMsg(true);
                          setTimeout(() => setCopiedMsg(false), 2000);
                        }
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedMsg ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 font-medium text-slate-800 text-xs leading-relaxed whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                    {selectedRequest.customer.additionalNotes}
                  </div>
                </div>
              )}

              {/* Configured Systems (if quotation RFQ) */}
              {!!selectedRequest.items?.length && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black uppercase text-[10px] text-slate-500 tracking-wider">
                      Configured Fenestration Systems ({selectedRequest.items.length})
                    </h4>
                    <span className="font-extrabold text-xs text-red-700">
                      Total Area: {selectedRequest.totalAreaSqm || 0} m²
                    </span>
                  </div>
                  <div className="space-y-2">
                    {selectedRequest.items.map((it, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center gap-3">
                        <div className="min-w-0">
                          <span className="font-extrabold text-slate-900 block truncate">{it?.productName || 'System'}</span>
                          <span className="text-[11px] text-slate-500">
                            {it?.quantity || 1} units • {it?.widthMm || 0} × {it?.heightMm || 0} mm ({it?.color || 'Standard'})
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-black text-red-700 text-xs block">{it?.estimatedAreaSqm || 0} m²</span>
                          <span className="text-[10px] text-slate-500 font-bold">${(it as any)?.subtotalUsd || it?.totalPrice || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer with Direct Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/90 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                {selectedRequest.customer?.phone && (
                  <a
                    href={`https://wa.me/${selectedRequest.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedRequest.customer.fullName || ''}, thank you for contacting Doorhome Company regarding your request ${selectedRequest.id}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
                {selectedRequest.customer?.email && (
                  <a
                    href={`mailto:${selectedRequest.customer.email}?subject=${encodeURIComponent(`Doorhome Inquiry Reference: ${selectedRequest.id}`)}`}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteRequest(selectedRequest.id);
                    setSelectedRequest(null);
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Delete Request"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl font-extrabold text-slate-800 text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

        

    </div>
  );
};

export default AdminPortalPage;
