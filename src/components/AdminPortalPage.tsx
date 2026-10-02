import { getLocalizedProduct } from '../utils/localizedContent';
import { VisitsHistoryModal } from './VisitsHistoryModal';
import React, { useState, useEffect, useMemo } from 'react';
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

const uploadCmsMediaFile = async (file: File): Promise<string> => {
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'].includes(file.type)) {
    throw new Error('Use a JPG, PNG, WebP, GIF, MP4, or WebM file.');
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
    'dashboard' | 'products' | 'categories' | 'requests' | 'users' | 'cms'
  >('dashboard');

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
    if (!formName.trim() || !formDescription.trim() || !formImage.trim() || !divisions.some((division) => division.key === formCategory) || !Number.isFinite(formSellingPrice) || formSellingPrice <= 0) {
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
      loadSharedCmsSection<unknown>('divisions')
    ]).then(([sharedHomepage, sharedGallery, sharedProducts, sharedDivisions]) => {
      if (cancelled) return;
      if (sharedHomepage && typeof sharedHomepage === 'object' && !Array.isArray(sharedHomepage)) {
        setHomepageMedia((previous) => ({ ...previous, ...sharedHomepage }));
      }
      if (Array.isArray(sharedGallery)) setGalleryImages(normalizeGalleryItems(sharedGallery));
      if (Array.isArray(sharedProducts)) setProductList(sharedProducts as ProductItem[]);
      if (Array.isArray(sharedDivisions)) {
        saveProductDivisions(sharedDivisions as ProductCategoryDivision[]);
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
          for (const selectedFile of files) {
            try {
              const uploadedUrl = await uploadCmsMediaFile(selectedFile);
              setGalleryImages((prev) => [{ id: `proj-${crypto.randomUUID()}`, title: newGalleryTitle.trim(), description: newGalleryDescription.trim(), src: uploadedUrl, mediaType: selectedFile.type.startsWith('video/') ? 'video' : 'image', category: 'villa', location: '', system: '' }, ...prev]);
              uploadedCount++;
            } catch (error) {
              failures.push(`${selectedFile.name}: ${error instanceof Error ? error.message : 'Upload failed'}`);
            }
          }
          if (!failures.length) {
            setNewGalleryTitle('');
            setNewGalleryDescription('');
          }
          setGalleryUploadError(failures.join('\n'));
          setCmsSaveFeedback(`${uploadedCount} of ${files.length} project files added.`);
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

  const handleReplaceGalleryImage = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setGalleryUploadError('');
        const uploadedUrl = await uploadCmsMediaFile(file);
        if (uploadedUrl) {
          setGalleryImages((prev) => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], src: uploadedUrl, mediaType: file.type.startsWith('video/') ? 'video' : 'image' };
            return updated;
          });
          setCmsSaveFeedback('✓ Image Card Replaced Successfully!');
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
        saveSharedCmsSection('gallery', galleryImages)
      ]);
      setCmsSaveFeedback('✓ All Section Media & Text Confirmed & Saved to Website!');
      setTimeout(() => setCmsSaveFeedback(''), 4000);
    } catch (err) {
      console.error(err);
      setCmsSaveFeedback('Saved in this browser only. Sign in again to publish across devices.');
    }
  };

  const handleDeleteGalleryImage = (idx: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== idx));
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
    <div dir={isRtl ? 'rtl' : 'ltr'} className="doorhome-admin-workspace bg-slate-100 text-slate-900 font-sans flex overflow-hidden">
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className={`w-64 bg-white ${isRtl ? 'border-l' : 'border-r'} border-slate-200 shrink-0 flex flex-col justify-between hidden md:flex sticky top-0 h-screen z-30 shadow-xs`}>
        <div>
          {/* Logo & Brand Header */}
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <img
              src={DOORHOME_CONTACT.logo}
              alt="Doorhome Logo"
              className="h-10 w-auto object-contain shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DOORHOME_CONTACT.logoFallback;
              }}
            />
            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight">
                {t('admin_title')}
              </h1>
              <span className="text-[10px] text-slate-500 font-bold">{t('admin_tagline')}</span>
            </div>
          </div>

          {/* Nav Section Links */}
          <div className="p-4 space-y-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block px-3 mb-2">
                {isRtl ? 'بەشە سەرەکییەکان' : 'General Navigation'}
              </span>
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveSection('dashboard')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeSection === 'dashboard'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-red-600'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t('admin_tab_dashboard')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection('products')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeSection === 'products'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-red-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4" />
                    <span>{t('admin_tab_products')}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    activeSection === 'products' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {productList.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection('categories')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeSection === 'categories'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-red-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="w-4 h-4" />
                    <span>{t('admin_tab_categories')}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    activeSection === 'categories' ? 'bg-white/20 text-white' : 'bg-red-50 text-red-700'
                  }`}>
                    {divisions.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection('requests')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeSection === 'requests'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-red-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ClipboardList className="w-4 h-4" />
                    <span>{t('admin_tab_requests')}</span>
                  </div>
                  {newRequestsCount > 0 && (
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black animate-pulse">
                      {newRequestsCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection('users')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeSection === 'users'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-red-600'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>{t('admin_tab_users')}</span>
                </button>
              </nav>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block px-3 mb-2">
                {isRtl ? 'ڕاپۆرت و ناوەڕۆک' : 'Reports & Content'}
              </span>
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveSection('cms')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeSection === 'cms'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-red-600'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>{t('admin_tab_cms')}</span>
                </button>

              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Sidebar Action */}
        <div className="p-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              window.location.hash = '';
              onBackToHome();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-xs transition-all flex items-center justify-center gap-2 border border-red-200 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{t('admin_btn_back_home')} ↗</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 py-3.5 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-base sm:text-xl font-black text-slate-900">
              {activeSection === 'dashboard' && t('admin_tab_dashboard')}
              {activeSection === 'products' && t('admin_tab_products')}
              {activeSection === 'categories' && t('admin_tab_categories')}
              {activeSection === 'requests' && t('admin_tab_requests')}
              {activeSection === 'users' && t('admin_tab_users')}
              {activeSection === 'cms' && t('admin_tab_cms')}
            </h2>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Language Switcher Pill */}
            <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === 'ckb');
                  if (lang) setLanguage(lang.code);
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currentLanguage.code === 'ckb'
                    ? 'bg-white text-red-600 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
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
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currentLanguage.code === 'ar'
                    ? 'bg-white text-red-600 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
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
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currentLanguage.code === 'en'
                    ? 'bg-white text-red-600 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
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
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">{t('admin_btn_back_home')} ↗</span>
            </button>

            {activeSection === 'products' && (
              <button
                type="button"
                onClick={handleOpenAddProduct}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{t('admin_btn_add_product')}</span>
              </button>
            )}

            <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 font-black text-xs flex items-center justify-center border border-red-200">
              AD
            </div>
          </div>
        </header>

        {/* SECTION 1: DASHBOARD OVERVIEW */}
        {activeSection === 'dashboard' && (
          <main className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Real visit metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {([
                ['live',  'Live Now',    'emerald'],
                ['today', 'Today',       'blue'],
                ['week',  'This Week',   'red'],
                ['month', 'This Month',  'red'],
                ['total', 'All-Time',    'red'],
              ] as const).map(([key, label, color]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setShowVisitsModal(true)}
                  className={`bg-white p-4 rounded-2xl border border-slate-200 shadow-sm border-t-[3px] text-left w-full transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${
                    color === 'emerald' ? 'border-t-emerald-500' : color === 'blue' ? 'border-t-blue-500' : 'border-t-red-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</span>
                    {key === 'live' && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-2xl font-black text-slate-900">{visits ? visits[key].visits.toLocaleString() : '—'}</p>
                  <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                    <span className={`font-bold ${key === 'live' ? 'text-emerald-700' : key === 'today' ? 'text-blue-700' : 'text-red-700'}`}>
                      {visits ? visits[key].unique.toLocaleString() : '—'}
                    </span>{' '}
                    {key === 'live' ? 'online now' : 'unique'}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-1">click for details →</p>
                </button>
              ))}
            </div>

            {/* Visits History Modal */}
            <VisitsHistoryModal
              isOpen={showVisitsModal}
              onClose={() => setShowVisitsModal(false)}
              adminToken={localStorage.getItem('dh_admin_token')}
            />

            {/* Product distribution and request attention */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">Products by category</h3>
                <p className="text-xs text-slate-500">Current product counts from your catalog</p>
                <div className="space-y-4 pt-2">
                  {divisions.map((division) => {
                    const count = productList.filter((item) => item.division === division.key || item.category === division.key).length;
                    return <div key={division.key} className="grid grid-cols-[minmax(100px,1fr)_3fr_auto] items-center gap-3 text-xs"><span className="font-bold text-slate-700 truncate">{division.title || division.key}</span><div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-red-500 to-rose-700 rounded-full" style={{ width: `${productList.length ? count / productList.length * 100 : 0}%` }} /></div><span className="font-black text-slate-900">{count}</span></div>;
                  })}
                </div>
              </div>

              <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">Needs attention</h3>
                <div className="rounded-2xl bg-red-50 border border-red-100 p-5"><p className="text-xs font-bold text-red-700 uppercase">Pending requests</p><p className="text-4xl font-black text-red-700 mt-2">{newRequestsCount}</p><p className="text-xs text-red-700/80 mt-1">Contact messages and product requests awaiting review</p></div>
                <button type="button" onClick={() => setActiveSection('requests')} className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs">Review requests</button>
              </div>
            </div>

            {/* Bottom Recent Inquiries Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
              <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-extrabold text-slate-900">Customer requests</h3>
                <div className="flex gap-2">
                  <select aria-label="Request type" value={requestTypeFilter} onChange={(e) => setRequestTypeFilter(e.target.value as typeof requestTypeFilter)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold"><option value="all">All types</option><option value="product">Product requests</option><option value="contact">Contact messages</option></select>
                  <select aria-label="Request status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold"><option value="all">All statuses</option><option value="new">Pending</option><option value="reviewing">Reviewing</option><option value="quoted">Quoted</option><option value="approved">Approved</option></select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Client</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Sent</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                          No quotation requests or inquiries logged yet.
                        </td>
                      </tr>
                    ) : (
                      paginatedRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-red-600">{req.id}</td>
                          <td className="p-3.5 font-bold text-slate-900">{req.customer?.fullName || 'Client'}</td>
                          <td className="p-3.5 font-medium text-slate-600">{req.kind === 'contact' || !req.items?.length ? 'Contact' : 'Product cart'}</td>
                          <td className="p-3.5 text-slate-600">{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : '—'}</td>
                          <td className="p-3.5 text-center">{getStatusBadge(req.status)}</td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenRequestDetail(req)}
                              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-600"><span>{filteredRequests.length} requests · {requestsPageSize === 999999 ? 'Showing all' : '30 per page'}</span><div className="flex items-center gap-2"><button type="button" onClick={() => setRequestsPageSize(requestsPageSize === 999999 ? 30 : 999999)} className="font-bold text-red-700">{requestsPageSize === 999999 ? 'Show 30 per page' : 'Show all'}</button><button type="button" disabled={requestsPage <= 1} onClick={() => setRequestsPage((page) => page - 1)} className="rounded border px-2 py-1 disabled:opacity-40">Previous</button><span>{requestsPage} / {requestsTotalPages}</span><button type="button" disabled={requestsPage >= requestsTotalPages} onClick={() => setRequestsPage((page) => page + 1)} className="rounded border px-2 py-1 disabled:opacity-40">Next</button></div></div>
            </div>
          </main>
        )}

        {/* SECTION 2: FULL PRODUCT MANAGEMENT (CRUD!) */}
        {activeSection === 'products' && (
          <main className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Action Bar & Filters */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className={`w-4 h-4 text-slate-400 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} />
                  <input
                    type="text"
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    placeholder={t('admin_search_products_ph')}
                    className={`w-full ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-red-600 font-medium`}
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-red-600 font-bold"
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
                    className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t('admin_btn_clear_catalog')}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{t('admin_btn_add_product')}</span>
                </button>
              </div>
            </div>

            <div className="doorhome-admin-products overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className={`w-full min-w-[720px] text-sm border-collapse ${isRtl ? 'text-right' : 'text-left'}`}>
                  <thead className="bg-slate-900 text-white"><tr>
                    <th className="p-5">{t('admin_col_name')}</th><th className="p-5">{t('admin_col_category')}</th><th className="p-5">{t('admin_col_selling')}</th><th className="p-5">{t('admin_col_actions')}</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map(prod => {
                      const localized = getLocalizedProduct(prod, currentLanguage.code);
                      const price = prod.unitPrice ?? prod.pricePerSqm ?? prod.basePrice;
                      const division = divisions.find(div => div.key === (prod.division || prod.category));
                      const category = ((division as any)?.translations?.[currentLanguage.code] || (division as any)?.translations?.[currentLanguage.code.split('-')[0]])?.name || (currentLanguage.code === 'ar' ? division?.arabicTitle : currentLanguage.code === 'ckb' ? division?.kurdishTitle : division?.title) || prod.category;
                      return <tr key={prod.id} className="hover:bg-red-50/30">
                        <td className="p-5"><div className="flex items-center gap-5">
                          <a href={prod.image || prod.fallbackImage} target="_blank" rel="noopener noreferrer" className="shrink-0"><img src={prod.image || prod.fallbackImage} alt={localized.name} loading="lazy" className="h-24 w-32 rounded-xl object-cover border border-slate-200" /></a>
                          <button type="button" onClick={() => handleOpenEditProduct(prod)} className="text-start"><span className="block text-base font-bold text-slate-900">{localized.name}</span><span className="mt-2 block max-w-md text-sm leading-relaxed text-slate-500 line-clamp-2">{localized.description}</span></button>
                        </div></td>
                        <td className="p-5 font-semibold text-red-700">{category}</td>
                        <td className="p-5 whitespace-nowrap text-base font-bold">{price == null ? '—' : prod.currency === 'IQD' ? price.toLocaleString() + ' IQD' : '$' + price.toLocaleString()}</td>
                        <td className="p-5"><div className="flex items-center gap-3"><button type="button" onClick={() => handleOpenEditProduct(prod)} className="rounded-lg bg-red-100 px-4 py-3 font-bold text-red-800"><Edit className="inline h-4 w-4" /> {t('admin_modal_edit_product')}</button><button type="button" onClick={() => handleDeleteProduct(prod.id)} className="rounded-lg p-3 text-red-700 hover:bg-red-50"><Trash2 className="h-5 w-5" /></button></div></td>
                      </tr>;
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* SECTION: CATEGORIES & HIERARCHY MANAGEMENT */}
        {activeSection === 'categories' && <AdminCategoriesTab />}

        {/* SECTION 3: QUOTATION REQUESTS */}
        {activeSection === 'requests' && (
          <main className="p-6 space-y-6 flex-1 overflow-y-auto">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-6 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={requestSearchQuery}
                    onChange={(e) => setRequestSearchQuery(e.target.value)}
                    placeholder="Search by ID, name, phone..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-red-600 font-medium"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select value={requestTypeFilter} onChange={(e) => setRequestTypeFilter(e.target.value as typeof requestTypeFilter)} className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold"><option value="all">All request types</option><option value="product">Product requests</option><option value="contact">Contact messages</option></select>
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  >
                    <option value="all">All Request Statuses</option>
                    <option value="new">New RFQs</option>
                    <option value="reviewing">In Review</option>
                    <option value="quoted">Quoted</option>
                    <option value="approved">Approved</option>
                  </select>
                </div>

              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Client</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">City</th>
                      <th className="p-3.5 text-center">Units</th>
                      <th className="p-3.5 text-right">Glass Area</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedRequests.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400">
                          No quotation requests found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      paginatedRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-red-600">{req.id}</td>
                          <td className="p-3.5 font-bold text-slate-900">{req.customer?.fullName || 'Client'}</td>
                          <td className="p-3.5 font-semibold text-slate-700">{req.kind === 'contact' || !req.items?.length ? 'Contact' : 'Product cart'}</td>
                          <td className="p-3.5 font-semibold text-slate-700">{req.customer?.city || 'Iraq'}</td>
                          <td className="p-3.5 text-center font-bold text-slate-900">{req.totalQuantity || 0}</td>
                          <td className="p-3.5 text-right font-bold text-red-700">{(req.totalAreaSqm || 0).toFixed(2)} m²</td>
                          <td className="p-3.5 text-center">{getStatusBadge(req.status)}</td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenRequestDetail(req)}
                              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-2xs cursor-pointer"
                            >
                              Inspect Specs
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Requests Pagination Controls */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-900">{filteredRequests.length === 0 ? 0 : (requestsPage - 1) * requestsPageSize + 1}</span> to{' '}
                  <span className="font-bold text-slate-900">{Math.min(requestsPage * requestsPageSize, filteredRequests.length)}</span> of{' '}
                  <span className="font-bold text-slate-900">{filteredRequests.length}</span> RFQs
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-slate-600 font-bold">
                    <span>Per page:</span>
                    <select
                      value={requestsPageSize}
                      onChange={(e) => setRequestsPageSize(Number(e.target.value))}
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
                    >
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={30}>30</option>
                      <option value={999999}>Show all</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setRequestsPage((p) => Math.max(1, p - 1))}
                      disabled={requestsPage <= 1}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-900">
                      {requestsPage} / {requestsTotalPages}
                    </span>

                    <button
                      type="button"
                      onClick={() => setRequestsPage((p) => Math.min(requestsTotalPages, p + 1))}
                      disabled={requestsPage >= requestsTotalPages}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* SECTION 5: TEAM & USER ACCESS CONTROL */}
        {activeSection === 'users' && <AdminUsersTab />}

        {/* SECTION 5: CMS HOMEPAGE & GALLERY MANAGEMENT */}
        {activeSection === 'cms' && (
          <main className="p-6 space-y-6 flex-1 overflow-y-auto">
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

            {/* CARD 1: DOORS SYSTEMS (CATEGORY SECTION - UNLIMITED UPLOADS & DELETIONS) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">
                      أنظمة الأبواب والمداخل — Door Systems ({doorProducts.length})
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[11px] border border-emerald-200">
                      Unlimited Systems • غير محدود
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 font-extrabold text-[11px] border border-red-200">
                      Live on Homepage
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage doors displayed in the "أنظمة الأبواب والمداخل" category section on the homepage. You can upload as many door systems as you like without limits, replace current photos, or delete doors.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenAddProductForCategory('doors')}
                    className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-600/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>+ Add Door System (إضافة باب جديد)</span>
                  </button>
                </div>
              </div>

              {/* Doors Grid */}
              {doorProducts.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-bold text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  No door systems currently in catalog. Click "+ Add Door System" above to upload a new door.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {doorProducts.map((door) => (
                    <div
                      key={door.id}
                      className="rounded-2xl border border-slate-200 bg-white p-3 space-y-3 shadow-xs hover:border-red-300 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-950 border border-slate-100">
                          {Boolean(door.videoUrl) || /\.(mp4|webm|mov)(\?|#|$)/i.test(door.image) ? (
                            <video src={door.videoUrl || door.image} muted autoPlay loop playsInline className="w-full h-full object-cover" />
                          ) : (
                            <img
                              src={door.image}
                              alt={door.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = door.fallbackImage || './assets/doorhome/03-2.jpg';
                              }}
                            />
                          )}
                        </div>

                        <div>
                          <h5 className="font-extrabold text-slate-900 text-xs line-clamp-1">{door.name}</h5>
                          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{door.description}</p>
                        </div>
                      </div>

                      {/* Action Buttons: Replace Media, Edit, Delete */}
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <label className="w-full py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs">
                          <Upload className="w-3 h-3" />
                          <span>Replace Media (صورة / فيديو)</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                            onChange={(e) => handleDirectReplaceProductImage(door.id, e)}
                            className="hidden"
                          />
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditProduct(door)}
                            className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDirectDeleteProduct(door.id, door.name)}
                            className="flex-1 py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-[11px] flex items-center justify-center gap-1 border border-rose-200 transition-all cursor-pointer"
                            title="Delete door system"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CARD 2: WINDOWS SYSTEMS (CATEGORY SECTION - UNLIMITED UPLOADS & DELETIONS) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">
                      أنظمة النوافذ والتصاميم — Window Systems ({windowProducts.length})
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[11px] border border-emerald-200">
                      Unlimited Systems • غير محدود
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 font-extrabold text-[11px] border border-red-200">
                      Live on Homepage
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage windows displayed in the "أنظمة النوافذ والتصاميم" category section on the homepage. You can upload as many window systems as you like without limits, replace current photos, or delete windows.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenAddProductForCategory('windows')}
                    className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-600/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>+ Add Window System (إضافة شباك جديد)</span>
                  </button>
                </div>
              </div>

              {/* Windows Grid */}
              {windowProducts.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-bold text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  No window systems currently in catalog. Click "+ Add Window System" above to upload a new window.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {windowProducts.map((win) => (
                    <div
                      key={win.id}
                      className="rounded-2xl border border-slate-200 bg-white p-3 space-y-3 shadow-xs hover:border-red-300 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-950 border border-slate-100">
                          {Boolean(win.videoUrl) || /\.(mp4|webm|mov)(\?|#|$)/i.test(win.image) ? (
                            <video src={win.videoUrl || win.image} muted autoPlay loop playsInline className="w-full h-full object-cover" />
                          ) : (
                            <img
                              src={win.image}
                              alt={win.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = win.fallbackImage || './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg';
                              }}
                            />
                          )}
                        </div>

                        <div>
                          <h5 className="font-extrabold text-slate-900 text-xs line-clamp-1">{win.name}</h5>
                          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{win.description}</p>
                        </div>
                      </div>

                      {/* Action Buttons: Replace Media, Edit, Delete */}
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <label className="w-full py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs">
                          <Upload className="w-3 h-3" />
                          <span>Replace Media (صورة / فيديو)</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                            onChange={(e) => handleDirectReplaceProductImage(win.id, e)}
                            className="hidden"
                          />
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditProduct(win)}
                            className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDirectDeleteProduct(win.id, win.name)}
                            className="flex-1 py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-[11px] flex items-center justify-center gap-1 border border-rose-200 transition-all cursor-pointer"
                            title="Delete window system"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CARD 3: ACTIVE SHOWCASE GALLERY (UNLIMITED PROJECTS + DIRECT ADD BUTTON) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
              {/* Header with Title & Direct Card Add Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Projects That Define Kurdistan’s Skyline ({galleryImages.length})</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Add images or videos, edit each title and description, and replace or delete any project.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleManualSaveCMS}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Save All</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <label className="block text-xs font-bold text-slate-800">Project title
                  <input value={newGalleryTitle} onChange={(e) => setNewGalleryTitle(e.target.value)} placeholder="Project title" className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900" />
                </label>
                <label className="block text-xs font-bold text-slate-800">Description
                  <textarea value={newGalleryDescription} onChange={(e) => setNewGalleryDescription(e.target.value)} placeholder="Project description" rows={3} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900" />
                </label>
                <button type="button" disabled={isUploadingGalleryMedia} onClick={() => galleryFileInputRef.current?.click()} className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50">
                  <Upload className="h-4 w-4" /> {isUploadingGalleryMedia ? 'Uploading…' : 'Upload images and videos'}
                </button>
                <input ref={galleryFileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm" onChange={handleFileUpload} className="hidden" />
                <p className="text-xs text-slate-500">Select several files together. Each gets its own card with this title and description; you can edit them individually afterward.</p>
                {galleryUploadError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">{galleryUploadError}</p>}
              </div>

              {/* Active Photos Grid */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Current Gallery Media ({galleryImages.length})
                </h4>

                {galleryImages.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 font-bold text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    No projects in the gallery yet. Upload an image or video above.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryImages.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-200 bg-white p-2.5 space-y-2.5 shadow-xs hover:border-red-300 transition-all flex flex-col justify-between"
                      >
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-100">
                          {item.mediaType === 'video' ? <video src={item.src} muted playsInline preload="metadata" className="h-full w-full object-cover" /> : <img src={item.src} alt={item.title} className="w-full h-full object-cover" />}
                        </div>

                        <input value={item.title} onChange={(e) => setGalleryImages((prev) => prev.map((entry, i) => i === idx ? { ...entry, title: e.target.value } : entry))} aria-label="Project title" className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-900" />
                        <textarea value={item.description} onChange={(e) => setGalleryImages((prev) => prev.map((entry, i) => i === idx ? { ...entry, description: e.target.value } : entry))} aria-label="Project description" rows={2} className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-900" />
                        {/* Replace & Delete Buttons for each project */}
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                          <label className="flex-1 py-1.5 px-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-[11px] flex items-center justify-center gap-1 border border-red-200 transition-all cursor-pointer">
                            <Upload className="w-3 h-3" />
                            <span>Replace</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                              onChange={(e) => handleReplaceGalleryImage(idx, e)}
                              className="hidden"
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryImage(idx)}
                            className="flex-1 py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-[11px] flex items-center justify-center gap-1 border border-rose-200 transition-all cursor-pointer"
                            title="Delete photo"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CARD 2: 3D SIGNATURE SYSTEMS SHOWCASE DECK (FIXED LAYOUT SLOTS) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-slate-900">
                    5 Architectural Window & Door Systems — Card Content
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Replace each card image, title, and description. The five card slots stay fixed.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[11px] border border-slate-200">
                  Fixed Slots (5 Signature Cards)
                </span>
              </div>

              <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h5 className="text-sm font-black text-slate-900">Section heading and introduction</h5>
                    <p className="text-xs text-slate-500">Edit the text above the five cards for each website language.</p>
                  </div>
                  <select value={showcaseTextLanguage} onChange={(event) => setShowcaseTextLanguage(event.target.value)} aria-label="Showcase text language" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800">
                    <option value="en">English</option><option value="ckb">Sorani</option><option value="kmr">Kurmanji</option><option value="ar">Arabic</option><option value="tr">Turkish</option><option value="de">German</option>
                  </select>
                </div>
                <label className="block text-[11px] font-bold text-slate-700">Heading</label>
                <input value={homepageMedia.showcaseSectionText?.[showcaseTextLanguage]?.title ?? SHOWCASE_TEXT_BY_LANG[showcaseTextLanguage].title} onChange={(event) => setHomepageMedia((previous) => ({ ...previous, showcaseSectionText: { ...(previous.showcaseSectionText || {}), [showcaseTextLanguage]: { ...(previous.showcaseSectionText?.[showcaseTextLanguage] || {}), title: event.target.value } } }))} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900" />
                <label className="block text-[11px] font-bold text-slate-700">Introduction</label>
                <textarea rows={3} value={homepageMedia.showcaseSectionText?.[showcaseTextLanguage]?.subtitle ?? SHOWCASE_TEXT_BY_LANG[showcaseTextLanguage].subtitle} onChange={(event) => setHomepageMedia((previous) => ({ ...previous, showcaseSectionText: { ...(previous.showcaseSectionText || {}), [showcaseTextLanguage]: { ...(previous.showcaseSectionText?.[showcaseTextLanguage] || {}), subtitle: event.target.value } } }))} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">
                {[
                  { key: 'legend-80', title: 'Deceuninck Legend 80', description: 'Flagship European passive-certified uPVC series engineered with 6 insulation chambers to withstand Erbil summer heat over 50°C.', category: 'Passive uPVC', defaultSrc: './assets/doorhome/10.png' },
                  { key: 'lorenzo-70ls', title: 'Lorenzoline 70LS Monumental', description: 'Architectural sliding system enabling panoramic floor-to-ceiling glass spans up to 3 meters with finger-touch glide.', category: 'Monumental Sliding', defaultSrc: './assets/doorhome/LIFT-SLIDE-70LS-Medium-300x300.jpeg' },
                  { key: 'curtain-50f', title: 'Façade 50F Curtain Wall', description: 'Structural mullion facade system fabricated for corporate towers, automobile showrooms, and luxury modern villas across Iraq.', category: 'Commercial Facade', defaultSrc: './assets/doorhome/24-1.jpg' },
                  { key: 'hs76-sliding', title: 'Hebe-Schiebe HS76 System', description: 'Heavyweight lift-and-slide engineering delivering airtight sealing against high-velocity dry desert winds and seasonal sandstorms.', category: 'uPVC Lift & Slide', defaultSrc: './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg' },
                  { key: 'winsa-dorado-76', title: 'Winsa Dorado 76 Acoustic', description: 'Class A wall-thickness acoustic profile with multi-chamber interior baffling to isolate indoor spaces from heavy city traffic noise.', category: 'Class A Soundproof', defaultSrc: './assets/doorhome/2-1.png' }
                ].map((sys) => {
                  const currentSrc = homepageMedia.showcaseImages?.[sys.key] || sys.defaultSrc;
                  return (
                    <div key={sys.key} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="aspect-square rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center p-2">
                          <img src={currentSrc} alt={sys.title} className="max-h-full max-w-full object-contain" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-600">Title</label>
                        <input value={showcaseCardValue(sys.key, 'title', ITEM_LOCALES[showcaseTextLanguage]?.[sys.key]?.title || sys.title)} onChange={(e) => updateShowcaseCardValue(sys.key, 'title', e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900" />
                        <label className="block text-[10px] font-bold text-slate-600">Line under title</label>
                        <input value={showcaseCardValue(sys.key, 'subtitle', '')} placeholder={[ITEM_LOCALES[showcaseTextLanguage]?.[sys.key]?.brand, ITEM_LOCALES[showcaseTextLanguage]?.[sys.key]?.category].filter(Boolean).join(' • ') || 'Optional — small line in the five-card list'} onChange={(e) => updateShowcaseCardValue(sys.key, 'subtitle', e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900" />
                        <label className="block text-[10px] font-bold text-slate-600">Description</label>
                        <textarea rows={3} value={showcaseCardValue(sys.key, 'description', ITEM_LOCALES[showcaseTextLanguage]?.[sys.key]?.description || sys.description)} onChange={(e) => updateShowcaseCardValue(sys.key, 'description', e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900" />
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        <label className="flex-1 py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs">
                          <Upload className="w-3 h-3" />
                          <span>Replace File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleReplaceShowcaseImage(sys.key, e)}
                            className="hidden"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() =>
                            setHomepageMedia((prev) => ({
                              ...prev,
                              showcaseImages: { ...(prev.showcaseImages || {}), [sys.key]: sys.defaultSrc }
                            }))
                          }
                          className="py-1.5 px-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-[11px] transition-all cursor-pointer"
                          title="Reset to default image"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CARD 3 & 4: ABOUT SECTION AND HERO BANNER CMS MEDIA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* About Section Media & Text Manager */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-slate-900">Why Choose Doorhome — Image</h4>
                    <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Homepage Live</span>
                  </div>
                  <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group">
                    <img src={homepageMedia.aboutFactoryImage} alt="About factory" className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Upload File & Reset Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => aboutFileInputRef.current?.click()}
                      className="flex-1 cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload / Replace File</span>
                    </button>
                    <input
                      ref={aboutFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'about')}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => setHomepageMedia((prev) => ({ ...prev, aboutFactoryImage: './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg' }))}
                      className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs border border-rose-200 flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleManualSaveCMS}
                    className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Confirm & Apply About Section</span>
                  </button>
                </div>
              </div>

              {/* Hero Section Background / Poster Manager */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-slate-900">Hero Section — Main Banner Poster</h4>
                    <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Homepage Live</span>
                  </div>
                  <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group">
                    <img src={homepageMedia.heroPosterImage} alt="Hero banner" className="w-full h-full object-cover" />
                  </div>

                  {/* Upload File & Reset Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => heroFileInputRef.current?.click()}
                      className="flex-1 cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload / Replace File</span>
                    </button>
                    <input
                      ref={heroFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'hero')}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => setHomepageMedia((prev) => ({ ...prev, heroPosterImage: './assets/doorhome/photo_2023-07-03_15-41-20-1280x820.jpg' }))}
                      className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs border border-rose-200 flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleManualSaveCMS}
                    className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Confirm & Apply Hero Banner</span>
                  </button>
                </div>
              </div>
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
                  <label className="mb-1 block text-slate-900 uppercase text-[10px]">{t('admin_form_desc')}</label>
                  <textarea required rows={4} value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Describe this product" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900" />
                </div>

                {/* Multi-Language Auto Translation Box */}
                <div className="p-3.5 bg-gradient-to-br from-blue-50/90 via-indigo-50/60 to-purple-50/50 border border-blue-200/80 rounded-2xl space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-blue-950">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span className="text-[11px] font-black uppercase tracking-wider">Auto Multi-Language Translation</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoTranslateProduct}
                      disabled={isTranslatingProduct || (!formName.trim() && !formDescription.trim())}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-extrabold text-[11px] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      <Languages className="w-3.5 h-3.5" />
                      <span>{isTranslatingProduct ? 'Translating...' : 'Auto-Translate (AR, EN, KU, TR, DE)'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    Type in <strong>Arabic</strong> (or English). When saved, it automatically translates into Kurdish (Sorani & Kurmanji), Turkish, German, English, and Arabic so all website visitors see it in their language.
                  </p>

                  {translationSuccessMsg && (
                    <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl">
                      {translationSuccessMsg}
                    </div>
                  )}

                  {formTranslations && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                      {Object.entries(formTranslations).map(([code, tr]) => (
                        <div key={code} className="bg-white/95 p-2 rounded-xl border border-blue-100 shadow-2xs text-[10px] space-y-0.5">
                          <span className="font-black text-blue-700 uppercase block tracking-wider">{code === 'ckb' ? 'Kurdish (Sorani)' : code === 'kmr' || code === 'ku' ? 'Kurdish (Kurmanji)' : code === 'ar' ? 'Arabic' : code === 'tr' ? 'Turkish' : code === 'de' ? 'German' : code === 'en' ? 'English' : code}</span>
                          <p className="font-bold text-slate-900 truncate" title={tr.name}>{tr.name || '—'}</p>
                          <p className="text-slate-500 line-clamp-1 text-[9px]" title={tr.description}>{tr.description || '—'}</p>
                        </div>
                      ))}
                    </div>
                  )}
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

              <div>
                <label className="mb-1 block text-slate-900 uppercase text-[10px]">{t('admin_simple_price')} ({editingProduct?.currency === 'IQD' ? 'IQD' : 'USD'})</label>
                <input type="number" min="0.01" step="0.01" required value={formSellingPrice || ''} onChange={(e) => setFormSellingPrice(Number(e.target.value))} placeholder="Enter price" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-900" />
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
