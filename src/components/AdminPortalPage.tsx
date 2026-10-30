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
import { logoutUser } from '../services/authService';
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
import { AdminDynamicSectionTab } from './AdminDynamicSectionTab';
import { AdminSidebar } from './admin/AdminSidebar';
import { AdminProductsTab } from './admin/AdminProductsTab';
import { AdminProductModal } from './admin/AdminProductModal';
import { AdminCmsTab } from './admin/AdminCmsTab';
import { AdminPartnerLogosTab } from './admin/AdminPartnerLogosTab';
import { AdvancedTextarea } from './admin/AdvancedTextarea';
import {
  HomepageSectionConfig,
  loadHomepageSections,
  saveHomepageSections,
  getLocalizedSectionHeader
} from '../services/homepageSectionsService';

interface AdminPortalPageProps {
  onBackToHome: () => void;
  onGoToProducts: () => void;
  onSignOut?: () => void;
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
  onGoToProducts,
  onSignOut
}) => {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const isRtl = ['ckb', 'kmr', 'ar'].includes(currentLanguage.code);

  const handleSignOut = () => {
    logoutUser();
    if (onSignOut) {
      onSignOut();
    } else {
      window.location.hash = '';
      onBackToHome();
    }
  };

  // Navigation tab state
  const [activeSection, setActiveSection] = useState<
    'products' | 'users' | 'cms' | 'logos'
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
  const [cmsSubTab, setCmsSubTab] = useState<string>('3d-carousel');
  const [homepageSections, setHomepageSections] = useState<HomepageSectionConfig[]>(() => loadHomepageSections());
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionSubtitle, setNewSectionSubtitle] = useState('');
  const [newSectionIsProduct, setNewSectionIsProduct] = useState(true);
  const [isCreatingSection, setIsCreatingSection] = useState(false);

  // Architecture Catalogue Cards State
  const [archCards, setArchCards] = useState<ArchitectureCatalogueCard[]>(() => loadArchitectureCards());
  const [archCardsSaving, setArchCardsSaving] = useState(false);
  const [archCardsSaveFeedback, setArchCardsSaveFeedback] = useState('');
  const archLogoInput1Ref = React.useRef<HTMLInputElement>(null);
  const archLogoInput2Ref = React.useRef<HTMLInputElement>(null);
  const archPdfInput1Ref = React.useRef<HTMLInputElement>(null);
  const archPdfInput2Ref = React.useRef<HTMLInputElement>(null);
  const [isUploadingArchFile, setIsUploadingArchFile] = useState(false);

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

  // Unified Section / Category Options (Strictly homepage sections designated as product sections)
  const allCategoryOptions = useMemo(() => {
    const list: Array<{ key: string; label: string }> = [];
    const seen = new Set<string>();

    homepageSections.forEach((sec) => {
      // Exclude showcase / media sections that are not product categories
      if (sec.isProductSection === false) return;
      const k = sec.key || sec.id;
      if (!seen.has(k)) {
        seen.add(k);
        const header = getLocalizedSectionHeader(sec, currentLanguage.code);
        list.push({
          key: k,
          label: header.title || sec.title || k
        });
      }
    });

    return list;
  }, [homepageSections, currentLanguage.code]);

  const getProductCategoryLabel = (prod: ProductItem) => {
    const key = prod.division || prod.category || '';
    const foundOpt = allCategoryOptions.find((opt) => opt.key === key || opt.key.toLowerCase() === key.toLowerCase());
    if (foundOpt) return foundOpt.label;

    const sec = homepageSections.find((s) => s.key === key || s.id === key);
    if (sec) return getLocalizedSectionHeader(sec, currentLanguage.code).title || sec.title;

    if (key === 'windows') return currentLanguage.code === 'ar' ? 'أنظمة النوافذ' : 'Windows';
    if (key === 'doors') return currentLanguage.code === 'ar' ? 'أنظمة الأبواب' : 'Doors';
    if (key === 'accessories') return currentLanguage.code === 'ar' ? 'الإكسسوارات' : 'Accessories';
    if (key.includes('stair') || key === 'sec-1793119387374') return currentLanguage.code === 'ar' ? 'حواجز السلالم الزجاجية' : (currentLanguage.code === 'ckb' ? 'مەحاجەرەی شووشەیی قادرمە' : 'Glass Staircase Railings');
    if (key.includes('balcon') || key.includes('shorfa') || key === 'sec-1793119430295' || key === 'railings') return currentLanguage.code === 'ar' ? 'حواجز الشرفات الزجاجية' : (currentLanguage.code === 'ckb' ? 'حاجزی بالکۆنی شووشەیی' : 'Glass Balcony Railings');
    if (key === 'glass') return currentLanguage.code === 'ar' ? 'الزجاج والواجهات' : 'Glass & Facades';
    return key;
  };

  useEffect(() => {
    if (productCategoryFilter !== 'all' && !allCategoryOptions.some((opt) => opt.key === productCategoryFilter)) {
      setProductCategoryFilter('all');
    }
  }, [allCategoryOptions, productCategoryFilter]);
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Product Form State - Simple & Clear
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<string>(() => allCategoryOptions[0]?.key || 'windows');
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
    setFormCategory(allCategoryOptions[0]?.key || '');
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
    setFormCategory(allCategoryOptions.some((opt) => opt.key === categoryOrDivision) ? categoryOrDivision : allCategoryOptions[0]?.key || '');
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
      divisions.forEach((division) => (division.subCategories || []).forEach((sub) => (sub.items || []).forEach((model) => {
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
    const cat = prod.division || prod.category || '';
    setFormCategory(allCategoryOptions.some((opt) => opt.key === cat) ? cat : allCategoryOptions[0]?.key || '');
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
    if (!formImage.trim()) {
      setProductFormError('Please upload an image first.');
      return;
    }
    setProductFormError('');
    const productId = editingProduct?.id || `prod-${Date.now()}`;
    const safeName = formName.trim();
    const safeDesc = formDescription.trim();
    const categoryChanged = Boolean(editingProduct && editingProduct.category !== formCategory);
    if (editingProduct?.modelId) {
      const ownedDivision = divisions.find((division) => (division.subCategories || []).some((sub) => (sub.items || []).some((model) => model.id === editingProduct.modelId && model.productId === productId)));
      if (ownedDivision) {
        if (categoryChanged) deleteModelFromDivision(ownedDivision.id, editingProduct.modelId);
        else updateModelInDivision(ownedDivision.id, editingProduct.modelId, { name: safeName, description: safeDesc, image: formImage.trim() });
      }
    }

    // Auto-translate if not already done manually and text is provided
    let fullTranslations = formTranslations;
    if (!fullTranslations && (safeName || safeDesc)) {
      try {
        fullTranslations = await autoTranslateFullProduct({ name: safeName, description: safeDesc });
      } catch (err) {
        console.error('Auto translate on save error:', err);
      }
    }

    const arName = fullTranslations?.['ar']?.name || (safeName.match(/[\u0600-\u06FF]/) ? safeName : undefined);
    const arDesc = fullTranslations?.['ar']?.description || (safeDesc.match(/[\u0600-\u06FF]/) ? safeDesc : undefined);
    const kuName = fullTranslations?.['ckb']?.name || fullTranslations?.['ku']?.name || fullTranslations?.['kmr']?.name;
    const kuDesc = fullTranslations?.['ckb']?.description || fullTranslations?.['ku']?.description || fullTranslations?.['kmr']?.description;

    if (editingProduct) {
      // Update existing
      const updatedProduct: ProductItem = {
        ...editingProduct,
        name: safeName,
        category: formCategory,
        division: formCategory,
        subCategory: categoryChanged ? undefined : editingProduct.subCategory,
        modelId: categoryChanged ? undefined : editingProduct.modelId,
        modelNumber: categoryChanged ? undefined : editingProduct.modelNumber,
        image: formImage.trim(),
        description: safeDesc,
        pricePerSqm: formSellingPrice,
        unitPrice: formSellingPrice,
        pricing: editingProduct.pricing ? { ...editingProduct.pricing, unitPrice: formSellingPrice, pricePerSqm: formSellingPrice } : undefined,
        translations: fullTranslations || editingProduct.translations,
        arabicName: arName ?? editingProduct.arabicName,
        arabicDescription: arDesc ?? editingProduct.arabicDescription,
        kurdishName: kuName ?? editingProduct.kurdishName,
        kurdishDescription: kuDesc ?? editingProduct.kurdishDescription
      };
      setProductList((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
      );
      saveProductToCloud(updatedProduct);
    } else {
      // Create new
      const newProd: ProductItem = {
        id: productId,
        name: safeName,
        category: formCategory,
        division: formCategory,
        image: formImage.trim(),
        fallbackImage: './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg',
        description: safeDesc,
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
      divisions.forEach((division) => (division.subCategories || []).forEach((sub) => (sub.items || []).forEach((model) => {
        if (model.productId === id) deleteModelFromDivision(division.id, model.id);
      })));
      setProductList((prev) => prev.filter((p) => p.id !== id));
      deleteProductFromCloud(id);
    }
  };

  const handleSaveProductFromModal = async (data: {
    id?: string;
    name: string;
    description: string;
    category: string;
    image: string;
  }) => {
    let fullTranslations: Record<string, { name: string; description: string }> | undefined;
    if (data.name || data.description) {
      try {
        fullTranslations = await autoTranslateFullProduct({
          name: data.name,
          description: data.description
        });
      } catch (err) {
        console.warn('Auto translate product warning:', err);
      }
    }

    const arName = fullTranslations?.ar?.name || data.name;
    const arDesc = fullTranslations?.ar?.description || data.description;
    const kuName = fullTranslations?.ckb?.name;
    const kuDesc = fullTranslations?.ckb?.description;
    const safeName = fullTranslations?.en?.name || data.name;
    const safeDesc = fullTranslations?.en?.description || data.description;

    if (data.id) {
      const existing = productList.find((p) => p.id === data.id);
      const updatedProduct: ProductItem = {
        ...(existing || ({} as any)),
        id: data.id,
        name: safeName,
        category: data.category as any,
        division: data.category as any,
        image: data.image || existing?.image || '',
        fallbackImage: data.image || existing?.fallbackImage || './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg',
        description: safeDesc,
        arabicName: arName,
        arabicDescription: arDesc,
        kurdishName: kuName,
        kurdishDescription: kuDesc,
        translations: fullTranslations || existing?.translations
      };
      setProductList((prev) => prev.map((p) => (p.id === data.id ? updatedProduct : p)));
      saveProductToCloud(updatedProduct);
    } else {
      const newProd: ProductItem = {
        id: `prod-${Date.now()}`,
        name: safeName,
        category: data.category as any,
        division: data.category as any,
        image: data.image,
        fallbackImage: data.image || './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg',
        description: safeDesc,
        basePrice: 0,
        currency: 'USD',
        pricePerSqm: 0,
        unitPrice: 0,
        features: [],
        translations: fullTranslations,
        arabicName: arName,
        arabicDescription: arDesc,
        kurdishName: kuName,
        kurdishDescription: kuDesc
      };
      setProductList((prev) => [newProd, ...prev]);
      saveProductToCloud(newProd);
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
      loadSharedCmsSection<ArchitectureCatalogueCard[]>('archCards').catch(() => null),
      loadSharedCmsSection<HomepageSectionConfig[]>('homepageSections').catch(() => null)
    ]).then(([sharedHomepage, sharedGallery, sharedProducts, sharedDivisions, sharedLogos, sharedArchCards, sharedHomepageSections]) => {
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
      if (Array.isArray(sharedHomepageSections) && sharedHomepageSections.length > 0) {
        setHomepageSections(sharedHomepageSections);
        saveHomepageSections(sharedHomepageSections);
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
      
      {/* MODULAR ADMIN SIDEBAR & MOBILE NAVIGATION */}
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        productsCount={productList.length}
        cmsCount={galleryImages.length}
        logosCount={partnerLogos.length}
        currentLanguage={currentLanguage}
        setLanguage={setLanguage}
        onBackToHome={onBackToHome}
        onSignOut={handleSignOut}
        t={t}
        supportedLanguages={SUPPORTED_LANGUAGES}
      />

      {/* RIGHT MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-white">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 py-3 px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {activeSection === 'products' && (currentLanguage.code === 'ar' ? 'إدارة المنتجات والكتالوج' : currentLanguage.code === 'ckb' ? 'بەڕێوەبردنی بەرهەمەکان' : 'Products & Catalog')}
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

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 font-bold text-xs border border-rose-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Sign Out of Admin Console"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>{currentLanguage.code === 'ar' ? 'تسجيل الخروج' : currentLanguage.code === 'ckb' ? 'چوونەدەرەوە' : 'Sign Out'}</span>
            </button>

            <div className="w-7 h-7 rounded-full bg-red-50 text-red-700 font-black text-xs flex items-center justify-center border border-red-200">
              AD
            </div>
          </div>
        </header>

        {/* SECTION 1: PRODUCTS TAB */}
        {activeSection === 'products' && (
          <AdminProductsTab
            productList={productList}
            allCategoryOptions={allCategoryOptions}
            getProductCategoryLabel={getProductCategoryLabel}
            onOpenAddProduct={handleOpenAddProduct}
            onOpenEditProduct={handleOpenEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onClearCatalog={() => {
              if (confirm('Are you sure you want to clear all products from the catalog?')) {
                setProductList([]);
                saveLocalProducts([]);
              }
            }}
            currentLanguage={currentLanguage}
            t={t}
          />
        )}

        {/* SECTION 5: TEAM & USER ACCESS CONTROL */}
        {activeSection === 'users' && <AdminUsersTab />}

        {/* SECTION 3: CMS & DYNAMIC SECTIONS */}
        {activeSection === 'cms' && (
          <AdminCmsTab
            cmsSubTab={cmsSubTab}
            setCmsSubTab={setCmsSubTab}
            homepageSections={homepageSections}
            setHomepageSections={setHomepageSections}
            galleryImages={galleryImages}
            persistGalleryUpdates={persistGalleryUpdates}
            archCards={archCards}
            setArchCards={setArchCards}
            productList={productList}
            setProductList={setProductList}
            onUploadMedia={uploadCmsMediaFile}
            cmsSaveFeedback={cmsSaveFeedback}
            setCmsSaveFeedback={setCmsSaveFeedback}
            currentLanguage={currentLanguage}
            t={t}
          />
        )}

        {/* SECTION 4: PARTNER BRANDS & COUNTRY FLAGS */}
        {activeSection === 'logos' && (
          <AdminPartnerLogosTab
            partnerLogos={partnerLogos}
            setPartnerLogos={setPartnerLogos}
            onUploadMedia={uploadCmsMediaFile}
            onSaveFeedback={(msg) => {
              setCmsSaveFeedback(msg);
              setTimeout(() => setCmsSaveFeedback(''), 4000);
            }}
            currentLanguage={currentLanguage}
          />
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        editingProduct={editingProduct}
        allCategoryOptions={allCategoryOptions}
        onSave={handleSaveProductFromModal}
        onUploadMedia={uploadCmsMediaFile}
        currentLanguage={currentLanguage}
        t={t}
      />

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
