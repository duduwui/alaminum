import React, { useState, useEffect, useMemo } from 'react';
import {
  QuotationRequest,
  RequestItem,
  CustomerInfo
} from '../types/requests';
import {
  fetchAllRequests,
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
  WINHOME_CONTACT
} from '../data/winhomeData';
import { GlowButton } from './GlowButton';
import {
  LayoutDashboard,
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
  Settings,
  HelpCircle,
  LogOut,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Sliders,
  Bell,
  User,
  Upload,
  ClipboardList
} from 'lucide-react';

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

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({
  onBackToHome,
  onGoToProducts
}) => {
  // Navigation tab state
  const [activeSection, setActiveSection] = useState<
    'dashboard' | 'products' | 'requests' | 'financials' | 'analytics' | 'cms' | 'settings'
  >('dashboard');

  // File Upload Input Refs for reliable file picker triggering
  const galleryFileInputRef = React.useRef<HTMLInputElement>(null);
  const aboutFileInputRef = React.useRef<HTMLInputElement>(null);
  const heroFileInputRef = React.useRef<HTMLInputElement>(null);
  const productFileInputRef = React.useRef<HTMLInputElement>(null);

  // Requests State
  const [requests, setRequests] = useState<QuotationRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [requestSearchQuery, setRequestSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<QuotationRequest | null>(null);

  // Request inspection edit fields
  const [editStatus, setEditStatus] = useState<QuotationRequest['status']>('new');
  const [editAdminNotes, setEditAdminNotes] = useState<string>('');
  const [editQuotedAmount, setEditQuotedAmount] = useState<string>('');
  const [isSavingRequest, setIsSavingRequest] = useState<boolean>(false);
  const [requestNotification, setRequestNotification] = useState<string>('');

  // Products CRUD State
  const [productList, setProductList] = useState<ProductItem[]>(() => {
    const saved = localStorage.getItem('winhome_admin_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return ALL_PRODUCTS;
  });

  const [productSearchQuery, setProductSearchQuery] = useState<string>('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Product Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'upvc' | 'aluminum' | 'accessories'>('upvc');
  const [formSubCategory, setFormSubCategory] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDepth, setFormDepth] = useState('');
  const [formChambers, setFormChambers] = useState<number>(5);
  const [formInsulation, setFormInsulation] = useState('');
  const [formAcoustic, setFormAcoustic] = useState('');
  const [formBasePrice, setFormBasePrice] = useState<number>(120);
  const [formProfitMargin, setFormProfitMargin] = useState<number>(25);

  // CMS Gallery Images State with LocalStorage Persistence
  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    const saved = localStorage.getItem('winhome_admin_gallery_images');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return [
      '/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg',
      '/assets/winhome/photo_2023-07-03_15-41-20-1280x820.jpg',
      '/assets/winhome/photo_2023-07-03_15-42-28-1120x716.jpg',
      '/assets/winhome/photo_2023-07-03_15-43-10-1280x720.jpg',
      '/assets/winhome/24-1.jpg',
      '/assets/winhome/photo_2023-07-03_15-50-46-1104x700.jpg'
    ];
  });
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Sync products with localStorage
  useEffect(() => {
    localStorage.setItem('winhome_admin_products', JSON.stringify(productList));
  }, [productList]);

  // Sync gallery images with localStorage
  useEffect(() => {
    localStorage.setItem('winhome_admin_gallery_images', JSON.stringify(galleryImages));
  }, [galleryImages]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await fetchAllRequests();
      setRequests(data);
    } catch (err) {
      console.error('Error loading requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (statusFilter !== 'all' && req.status !== statusFilter) return false;
      if (cityFilter !== 'all' && !req.customer.city.toLowerCase().includes(cityFilter.toLowerCase())) return false;
      if (requestSearchQuery.trim()) {
        const query = requestSearchQuery.toLowerCase();
        const matchesId = req.id.toLowerCase().includes(query);
        const matchesName = req.customer.fullName.toLowerCase().includes(query);
        const matchesPhone = req.customer.phone.toLowerCase().includes(query);
        const matchesItems = req.items.some((it) => it.productName.toLowerCase().includes(query));
        if (!matchesId && !matchesName && !matchesPhone && !matchesItems) return false;
      }
      return true;
    });
  }, [requests, statusFilter, cityFilter, requestSearchQuery]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return productList.filter((prod) => {
      if (productCategoryFilter !== 'all' && prod.category !== productCategoryFilter) return false;
      if (productSearchQuery.trim()) {
        const q = productSearchQuery.toLowerCase();
        return (
          prod.name.toLowerCase().includes(q) ||
          prod.description.toLowerCase().includes(q) ||
          (prod.subCategory && prod.subCategory.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [productList, productCategoryFilter, productSearchQuery]);

  // Overall Financial & Analytical Stats
  const totalInquiries = requests.length;
  const newRequestsCount = requests.filter((r) => r.status === 'new').length;
  const quotedCount = requests.filter((r) => r.status === 'quoted').length;
  const totalFabricatedUnits = requests.reduce((sum, r) => sum + r.totalQuantity, 0);
  const totalGlassArea = requests.reduce((sum, r) => sum + r.totalAreaSqm, 0);
  const totalRevenuePipeline = requests.reduce((sum, r) => sum + (r.quotedAmount || 0), 0);
  const estimatedProfit = Math.round(totalRevenuePipeline * 0.28); // 28% avg margin

  // Product Modal Open Handler
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('upvc');
    setFormSubCategory('');
    setFormImage('/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg');
    setFormDescription('');
    setFormDepth('70 mm');
    setFormChambers(5);
    setFormInsulation('Uf = 1.1 W/m²K');
    setFormAcoustic('Rw = 42 dB');
    setFormBasePrice(120);
    setFormProfitMargin(25);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: ProductItem) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormSubCategory(prod.subCategory || '');
    setFormImage(prod.image);
    setFormDescription(prod.description);
    setFormDepth(prod.depth || '70 mm');
    setFormChambers(prod.chambers || 5);
    setFormInsulation(prod.insulationValue || 'Uf = 1.1 W/m²K');
    setFormAcoustic(prod.acousticValue || 'Rw = 40 dB');
    setFormBasePrice(prod.basePrice || 120);
    setFormProfitMargin(prod.profitMargin || 25);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter product name.');
      return;
    }

    const calculatedSellingPrice = Math.round(formBasePrice * (1 + formProfitMargin / 100));

    if (editingProduct) {
      // Update existing
      setProductList((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formName,
                category: formCategory,
                subCategory: formSubCategory,
                image: formImage,
                description: formDescription,
                depth: formDepth,
                chambers: formChambers,
                insulationValue: formInsulation,
                acousticValue: formAcoustic,
                basePrice: formBasePrice,
                profitMargin: formProfitMargin,
                pricePerSqm: calculatedSellingPrice
              }
            : p
        )
      );
    } else {
      // Create new
      const newProd: ProductItem = {
        id: `custom-prod-${Date.now()}`,
        name: formName,
        category: formCategory,
        subCategory: formSubCategory || 'Architectural System',
        image: formImage || '/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg',
        fallbackImage: '/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg',
        description: formDescription || 'High-performance architectural profile system engineered for severe climate insulation.',
        depth: formDepth || '70 mm',
        chambers: formChambers || 5,
        insulationValue: formInsulation || 'Uf = 1.1 W/m²K',
        acousticValue: formAcoustic || 'Rw = 42 dB',
        basePrice: formBasePrice,
        profitMargin: formProfitMargin,
        pricePerSqm: calculatedSellingPrice,
        features: [
          'Severe climate Class S certification',
          'Precision CNC corner welding',
          'European EPDM sealing gaskets'
        ],
        colors: ['Anthracite Grey', 'Golden Oak', 'White', 'Jet Black']
      };
      setProductList((prev) => [newProd, ...prev]);
    }

    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product system from the catalog?')) {
      setProductList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleAddGalleryImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryUrl.trim()) return;
    setGalleryImages((prev) => [newGalleryUrl.trim(), ...prev]);
    setNewGalleryUrl('');
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
      aboutFactoryImage: '/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg',
      aboutTitle: 'Building Iraq’s Most Resilient Window & Door Systems',
      aboutSubtitle: 'Winhome Company, operating under Nafza Almanzl Holding...',
      heroPosterImage: '/assets/winhome/photo_2023-07-03_15-41-20-1280x820.jpg',
      showcaseImages: {
        'legend-80': '/assets/winhome/10.png',
        'lorenzo-70ls': '/assets/winhome/LIFT-SLIDE-70LS-Medium-300x300.jpeg',
        'curtain-50f': '/assets/winhome/24-1.jpg',
        'hs76-sliding': '/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg',
        'winsa-dorado-76': '/assets/winhome/2-1.png'
      },
      bentoImages: {
        'legend-80': '/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg',
        'lorenzo-70ls': '/assets/winhome/photo_2023-07-03_15-41-20-1280x820.jpg',
        'facade-50f': '/assets/winhome/photo_2023-07-03_15-42-28-1120x716.jpg',
        'winsa-dorado': '/assets/winhome/photo_2023-07-03_15-50-46-1104x700.jpg',
        'hardware-master': '/assets/winhome/2026-04-14-21.53.50-1000x650.jpg',
        'villa-panoramic': '/assets/winhome/photo_2023-07-03_15-49-24-760x485.jpg'
      }
    };
  });

  const [cmsSaveFeedback, setCmsSaveFeedback] = useState<string>('');

  // Sync homepage section media with localStorage safely
  useEffect(() => {
    try {
      localStorage.setItem('winhome_cms_homepage_media', JSON.stringify(homepageMedia));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [homepageMedia]);

  // Sync gallery images with localStorage safely
  useEffect(() => {
    try {
      localStorage.setItem('winhome_admin_gallery_images', JSON.stringify(galleryImages));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [galleryImages]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, destination: 'gallery' | 'about' | 'hero' = 'gallery') => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file);
        if (compressed) {
          if (destination === 'gallery') {
            setGalleryImages((prev) => [compressed, ...prev]);
          } else if (destination === 'about') {
            setHomepageMedia((prev) => ({ ...prev, aboutFactoryImage: compressed }));
          } else if (destination === 'hero') {
            setHomepageMedia((prev) => ({ ...prev, heroPosterImage: compressed }));
          }
          setCmsSaveFeedback('✓ New Image Uploaded & Live on Website!');
          setTimeout(() => setCmsSaveFeedback(''), 4000);
        }
      } catch (err) {
        console.error('Image compression error:', err);
      }
    }
  };

  const handleReplaceGalleryImage = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file);
        if (compressed) {
          setGalleryImages((prev) => {
            const updated = [...prev];
            updated[idx] = compressed;
            return updated;
          });
          setCmsSaveFeedback('✓ Image Card Replaced Successfully!');
          setTimeout(() => setCmsSaveFeedback(''), 4000);
        }
      } catch (err) {
        console.error('Replace error:', err);
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

  const handleReplaceBentoImage = async (bentoId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file);
        if (compressed) {
          setHomepageMedia((prev) => ({
            ...prev,
            bentoImages: {
              ...(prev.bentoImages || {}),
              [bentoId]: compressed
            }
          }));
          setCmsSaveFeedback(`✓ Bento Section Image Replaced & Live!`);
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
      try {
        const compressed = await compressImageFile(file);
        if (compressed) {
          setFormImage(compressed);
        }
      } catch (err) {
        console.error('Product image error:', err);
      }
    }
  };

  const handleManualSaveCMS = () => {
    try {
      localStorage.setItem('winhome_cms_homepage_media', JSON.stringify(homepageMedia));
      localStorage.setItem('winhome_admin_gallery_images', JSON.stringify(galleryImages));
      setCmsSaveFeedback('✓ All Section Media & Text Confirmed & Saved to Website!');
      setTimeout(() => setCmsSaveFeedback(''), 4000);
    } catch (err) {
      console.error(err);
      alert('Error saving. Please replace very large images.');
    }
  };

  const handleAddPresetImage = (url: string) => {
    if (!galleryImages.includes(url)) {
      setGalleryImages((prev) => [url, ...prev]);
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-sky-100 text-sky-800 border border-sky-300">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse" />
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
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex overflow-x-hidden">
      
      {/* LEFT SIDEBAR NAVIGATION - Clean Executive Style matching LifeCare Dashboard */}
      <aside className="w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between hidden md:flex sticky top-0 h-screen z-30 shadow-xs">
        <div>
          {/* Logo & Brand Header */}
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
              <img
                src={WINHOME_CONTACT.logo}
                alt="Winhome Logo"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = WINHOME_CONTACT.logoFallback;
                }}
              />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight">
                Winhome Admin
              </h1>
              <span className="text-[11px] text-slate-500 font-bold">Executive Control Center</span>
            </div>
          </div>

          {/* Nav Section Links */}
          <div className="p-4 space-y-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block px-3 mb-2">
                General Navigation
              </span>
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveSection('dashboard')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeSection === 'dashboard'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard Overview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection('products')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeSection === 'products'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4" />
                    <span>Product Catalog</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    activeSection === 'products' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {productList.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection('requests')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeSection === 'requests'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ClipboardList className="w-4 h-4" />
                    <span>Quotation Requests</span>
                  </div>
                  {newRequestsCount > 0 && (
                    <span className="bg-sky-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black animate-pulse">
                      {newRequestsCount}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block px-3 mb-2">
                Reports & Content
              </span>
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveSection('financials')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeSection === 'financials'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Financials & Revenue</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection('analytics')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeSection === 'analytics'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Insights & Analytics</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection('cms')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeSection === 'cms'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Homepage & Gallery CMS</span>
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
            className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs transition-all flex items-center justify-center gap-2 border border-blue-200 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Live Homepage ↗</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 py-3.5 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-base sm:text-xl font-black text-slate-900">
              {activeSection === 'dashboard' && 'Executive Dashboard Overview'}
              {activeSection === 'products' && 'Product Catalog Management'}
              {activeSection === 'requests' && 'Quotation Requests Queue'}
              {activeSection === 'financials' && 'Financial Pipeline & Revenue Analytics'}
              {activeSection === 'analytics' && 'Market Insights & Regional Analytics'}
              {activeSection === 'cms' && 'Homepage Content & Gallery Media CMS'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* View Live Homepage Link Button */}
            <button
              type="button"
              onClick={() => {
                window.location.hash = '';
                onBackToHome();
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Live Homepage ↗</span>
            </button>

            {activeSection === 'products' && (
              <button
                type="button"
                onClick={handleOpenAddProduct}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add New Product</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => exportRequestsToExcel(filteredRequests)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Excel</span>
            </button>

            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center border border-blue-200">
              AD
            </div>
          </div>
        </header>

        {/* SECTION 1: DASHBOARD OVERVIEW */}
        {activeSection === 'dashboard' && (
          <main className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Top 4 LifeCare Style KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Total Revenue Pipeline
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-slate-900">${totalRevenuePipeline.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    +18.4% MoM
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block font-medium">Estimated quote value</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider block">
                  Active Pending RFQs
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-sky-700">{newRequestsCount}</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
                </div>
                <span className="text-[11px] text-slate-400 block font-medium">Needs engineering review</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Active Product Systems
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-slate-900">{productList.length}</span>
                  <Package className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-[11px] text-slate-400 block font-medium">uPVC & Aluminum catalog</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
                  Total Glazing Area
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-indigo-900">{totalGlassArea.toFixed(1)} m²</span>
                  <Ruler className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-[11px] text-slate-400 block font-medium">Double & triple glass</span>
              </div>
            </div>

            {/* Middle Grid: Financial Analytics Chart & Quick Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Revenue & Inquiry Growth Analytics</h3>
                    <p className="text-xs text-slate-500 font-medium">Monthly quote volume in Erbil & Baghdad</p>
                  </div>
                  <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-xl text-slate-700">2026 Financial Year</span>
                </div>

                {/* Simulated Visual Graph Bar Chart */}
                <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100 pb-3">
                  {[
                    { month: 'Jan', height: '40%', val: '$12k' },
                    { month: 'Feb', height: '55%', val: '$18k' },
                    { month: 'Mar', height: '45%', val: '$15k' },
                    { month: 'Apr', height: '70%', val: '$24k' },
                    { month: 'May', height: '85%', val: '$32k' },
                    { month: 'Jun', height: '100%', val: '$45k' }
                  ].map((bar) => (
                    <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {bar.val}
                      </span>
                      <div
                        className="w-full bg-blue-600 hover:bg-blue-700 rounded-t-xl transition-all duration-300 shadow-sm"
                        style={{ height: bar.height }}
                      />
                      <span className="text-xs font-bold text-slate-600">{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Summary Card */}
              <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">Financial Insights</h3>
                
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Estimated Revenue:</span>
                    <span className="font-extrabold text-slate-900">${totalRevenuePipeline.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Est. Net Profit (28%):</span>
                    <span className="font-extrabold text-emerald-600">${estimatedProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Fabrication Capacity:</span>
                    <span className="font-extrabold text-sky-700">85% Utilized</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveSection('products')}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Package className="w-4 h-4" />
                    <span>Manage Products Catalog</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Recent Inquiries Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900">Recent Customer Requests</h3>
                <button
                  type="button"
                  onClick={() => setActiveSection('requests')}
                  className="text-xs font-extrabold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>View All Requests</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Client</th>
                      <th className="p-3.5">Location</th>
                      <th className="p-3.5 text-center">Units</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {requests.slice(0, 5).map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-blue-600">{req.id}</td>
                        <td className="p-3.5 font-bold text-slate-900">{req.customer.fullName}</td>
                        <td className="p-3.5 font-medium text-slate-600">{req.customer.city}</td>
                        <td className="p-3.5 text-center font-bold text-slate-800">{req.totalQuantity}</td>
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
                    ))}
                  </tbody>
                </table>
              </div>
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
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    placeholder="Search product by name, depth..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-600 font-bold"
                >
                  <option value="all">All Categories</option>
                  <option value="upvc">uPVC Profiles</option>
                  <option value="aluminum">Aluminum Systems</option>
                  <option value="accessories">Hardware & Accessories</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleOpenAddProduct}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add New Architectural Product</span>
              </button>
            </div>

            {/* Products Data Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Product System</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Depth</th>
                      <th className="p-4">Chambers</th>
                      <th className="p-4">Price ($/m²)</th>
                      <th className="p-4">Thermal Uf</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 border border-slate-200 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = prod.fallbackImage;
                            }}
                          />
                          <div>
                            <span className="font-extrabold text-slate-900 block">{prod.name}</span>
                            <span className="text-[10px] text-slate-500 block truncate max-w-[220px]">{prod.subCategory}</span>
                          </div>
                        </td>
                        <td className="p-4 uppercase font-bold text-[10px] text-sky-700">{prod.category}</td>
                        <td className="p-4 font-bold text-slate-800">{prod.depth || 'N/A'}</td>
                        <td className="p-4 font-medium text-slate-700">{prod.chambers ? `${prod.chambers} Chambers` : 'N/A'}</td>
                        <td className="p-4 font-black text-emerald-600">${prod.pricePerSqm || prod.basePrice || 140} / m²</td>
                        <td className="p-4 font-bold text-emerald-700">{prod.insulationValue || 'Standard'}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditProduct(prod)}
                              className="px-3 py-1.5 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

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
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-600 font-medium"
                  />
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

                <div className="sm:col-span-3">
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  >
                    <option value="all">All Iraqi Cities</option>
                    <option value="erbil">Erbil (Hawler)</option>
                    <option value="baghdad">Baghdad</option>
                    <option value="sulaymaniyah">Sulaymaniyah</option>
                    <option value="duhok">Duhok</option>
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
                      <th className="p-3.5">City</th>
                      <th className="p-3.5 text-center">Units</th>
                      <th className="p-3.5 text-right">Glass Area</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-blue-600">{req.id}</td>
                        <td className="p-3.5 font-bold text-slate-900">{req.customer.fullName}</td>
                        <td className="p-3.5 font-semibold text-slate-700">{req.customer.city}</td>
                        <td className="p-3.5 text-center font-bold text-slate-900">{req.totalQuantity}</td>
                        <td className="p-3.5 text-right font-bold text-sky-700">{req.totalAreaSqm.toFixed(2)} m²</td>
                        <td className="p-3.5 text-center">{getStatusBadge(req.status)}</td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenRequestDetail(req)}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-2xs cursor-pointer"
                          >
                            Inspect Specs
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* SECTION 4: FINANCIALS & REVENUE */}
        {activeSection === 'financials' && (
          <main className="p-6 space-y-6 flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Gross Revenue Pipeline</span>
                <h3 className="text-3xl font-black text-slate-900">${totalRevenuePipeline.toLocaleString()}</h3>
                <p className="text-xs text-slate-400">Total quoted value of project inquiries</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                <span className="text-xs font-bold text-emerald-600 uppercase">Est. Net Operating Profit</span>
                <h3 className="text-3xl font-black text-emerald-600">${estimatedProfit.toLocaleString()}</h3>
                <p className="text-xs text-slate-400">Average 28% fabrication net margin</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                <span className="text-xs font-bold text-sky-600 uppercase">Avg Order Value</span>
                <h3 className="text-3xl font-black text-sky-700">
                  ${(totalInquiries > 0 ? Math.round(totalRevenuePipeline / totalInquiries) : 0).toLocaleString()}
                </h3>
                <p className="text-xs text-slate-400">Per architectural project inquiry</p>
              </div>
            </div>
          </main>
        )}

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

            {/* CARD 1: ACTIVE SHOWCASE GALLERY (UNLIMITED PHOTOS + CARD HEADER ADD BUTTON) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
              {/* Header with Title & Direct Card Add Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">Active Gallery Showcase Photos ({galleryImages.length})</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[11px] border border-emerald-200">
                      Unlimited Photos
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage project showcase photos. Add as many images as you like. Update or delete existing photos anytime.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* MAIN DIRECT ADD TO GALLERY BUTTON */}
                  <button
                    type="button"
                    onClick={() => galleryFileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>+ Add to Gallery</span>
                  </button>
                  <input
                    ref={galleryFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Save All Button */}
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

            {/* CARD 2: FEATURED EUROPEAN PROFILES BENTO SECTION (HOMEPAGE BENTO SLOTS) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-slate-900">
                    Featured European Profiles — Homepage Bento Cards (Fixed Slots)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update the images for the "Featured European Profiles Fabricated in Erbil" homepage section. Each slot updates live on the website.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[11px] border border-slate-200">
                  Fixed Slots (6 System Cards)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {[
                  { id: 'legend-80', title: 'Deceuninck Legend 80', label: 'Passive uPVC', defaultSrc: '/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg' },
                  { id: 'lorenzo-70ls', title: 'Lorenzoline 70LS Monumental', label: 'Monumental Sliding', defaultSrc: '/assets/winhome/photo_2023-07-03_15-41-20-1280x820.jpg' },
                  { id: 'facade-50f', title: 'Commercial 50F Curtain Wall', label: 'Curtain Wall Facade', defaultSrc: '/assets/winhome/photo_2023-07-03_15-42-28-1120x716.jpg' },
                  { id: 'winsa-dorado', title: 'Winsa Dorado 76 Acoustic', label: 'Acoustic Soundproof', defaultSrc: '/assets/winhome/photo_2023-07-03_15-50-46-1104x700.jpg' },
                  { id: 'hardware-master', title: 'Master Italy & STAC Hardware', label: 'Italian Hardware', defaultSrc: '/assets/winhome/2026-04-14-21.53.50-1000x650.jpg' },
                  { id: 'villa-panoramic', title: 'Low-E Solar Glazing Systems', label: 'Solar Control Glass', defaultSrc: '/assets/winhome/photo_2023-07-03_15-49-24-760x485.jpg' }
                ].map((item) => {
                  const currentSrc = homepageMedia.bentoImages?.[item.id] || item.defaultSrc;
                  return (
                    <div key={item.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-extrabold text-slate-900 truncate max-w-[180px]">{item.title}</span>
                          <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded shrink-0">{item.label}</span>
                        </div>
                        <div className="aspect-video rounded-xl overflow-hidden bg-slate-200 border border-slate-200 relative group">
                          <img src={currentSrc} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        <label className="flex-1 py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs">
                          <Upload className="w-3 h-3" />
                          <span>Replace File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleReplaceBentoImage(item.id, e)}
                            className="hidden"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() =>
                            setHomepageMedia((prev) => ({
                              ...prev,
                              bentoImages: { ...(prev.bentoImages || {}), [item.id]: item.defaultSrc }
                            }))
                          }
                          className="py-1.5 px-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-[11px] transition-all cursor-pointer"
                          title="Reset to default photo"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

              {/* Active Photos Grid */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Current Gallery Photos ({galleryImages.length})
                </h4>

                {galleryImages.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 font-bold text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    No images in gallery. Click "+ Add Photo to Gallery" above to upload images.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-200 bg-white p-2.5 space-y-2.5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
                      >
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-100">
                          <img
                            src={imgUrl}
                            alt={`Gallery item ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg';
                            }}
                          />
                          <span className="absolute top-1.5 left-1.5 text-[9px] font-black text-white bg-slate-900/90 px-2 py-0.5 rounded-md border border-white/20">
                            #{idx + 1}
                          </span>
                        </div>

                        {/* Replace & Delete Buttons for each photo */}
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                          <label className="flex-1 py-1.5 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-[11px] flex items-center justify-center gap-1 border border-blue-200 transition-all cursor-pointer">
                            <Upload className="w-3 h-3" />
                            <span>Replace</span>
                            <input
                              type="file"
                              accept="image/*"
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
                    Signature Systems — 3D Showcase Deck Photos (Fixed Layout Slots)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    These 4 system slots correspond to the 3D interactive card deck on the homepage. You can replace or update each image independently.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[11px] border border-slate-200">
                  Fixed Slots (No extra added)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {[
                  { key: 'legend-80', title: 'Deceuninck Legend 80', category: 'Passive uPVC', defaultSrc: '/assets/winhome/10.png' },
                  { key: 'lorenzo-70ls', title: 'Lorenzoline 70LS', category: 'Monumental Sliding', defaultSrc: '/assets/winhome/LIFT-SLIDE-70LS-Medium-300x300.jpeg' },
                  { key: 'curtain-50f', title: 'Façade 50F Curtain Wall', category: 'Commercial Facade', defaultSrc: '/assets/winhome/24-1.jpg' },
                  { key: 'hs76-sliding', title: 'Hebe-Schiebe HS76', category: 'uPVC Lift & Slide', defaultSrc: '/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg' }
                ].map((sys) => {
                  const currentSrc = homepageMedia.showcaseImages?.[sys.key] || sys.defaultSrc;
                  return (
                    <div key={sys.key} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-extrabold text-slate-900">{sys.title}</span>
                          <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">{sys.category}</span>
                        </div>
                        <div className="aspect-square rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center p-2">
                          <img src={currentSrc} alt={sys.title} className="max-h-full max-w-full object-contain" />
                        </div>
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
                    <h4 className="text-sm font-extrabold text-slate-900">About Section — Media & Content</h4>
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Homepage Live</span>
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
                      onClick={() => setHomepageMedia((prev) => ({ ...prev, aboutFactoryImage: '/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg' }))}
                      className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs border border-rose-200 flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <input
                    type="text"
                    value={homepageMedia.aboutFactoryImage}
                    onChange={(e) => setHomepageMedia((prev) => ({ ...prev, aboutFactoryImage: e.target.value }))}
                    placeholder="Enter image URL..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 font-medium text-slate-900"
                  />

                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Section Headline Title</label>
                      <input
                        type="text"
                        value={homepageMedia.aboutTitle || ''}
                        onChange={(e) => setHomepageMedia((prev) => ({ ...prev, aboutTitle: e.target.value }))}
                        placeholder="Building Iraq’s Most Resilient Window & Door Systems"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Section Subtitle / Body text</label>
                      <textarea
                        rows={2}
                        value={homepageMedia.aboutSubtitle || ''}
                        onChange={(e) => setHomepageMedia((prev) => ({ ...prev, aboutSubtitle: e.target.value }))}
                        placeholder="Winhome Company, operating under Nafza Almanzl Holding..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 font-medium text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleManualSaveCMS}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
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
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Homepage Live</span>
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
                      onClick={() => setHomepageMedia((prev) => ({ ...prev, heroPosterImage: '/assets/winhome/photo_2023-07-03_15-41-20-1280x820.jpg' }))}
                      className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs border border-rose-200 flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <input
                    type="text"
                    value={homepageMedia.heroPosterImage}
                    onChange={(e) => setHomepageMedia((prev) => ({ ...prev, heroPosterImage: e.target.value }))}
                    placeholder="Enter image URL..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 font-medium text-slate-900"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleManualSaveCMS}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
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
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {editingProduct ? 'Edit Product Specifications' : 'Add New Architectural Product'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/60 text-slate-600 hover:text-slate-900 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1 text-slate-900 uppercase text-[10px]">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Deceuninck Legend 80 Passive"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-extrabold text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-900 uppercase text-[10px]">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                  >
                    <option value="upvc">uPVC Profiles</option>
                    <option value="aluminum">Aluminum Systems</option>
                    <option value="accessories">Accessories & Hardware</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 uppercase text-[10px]">Sub Category</label>
                  <input
                    type="text"
                    value={formSubCategory}
                    onChange={(e) => setFormSubCategory(e.target.value)}
                    placeholder="e.g. 6-Chamber Passive Series"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-900 uppercase text-[10px]">Product Main Image *</label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* File Upload Button */}
                  <button
                    type="button"
                    onClick={() => productFileInputRef.current?.click()}
                    className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Image File</span>
                  </button>
                  <input
                    ref={productFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageFileUpload}
                    className="hidden"
                  />

                  <span className="text-xs text-slate-400 font-bold text-center sm:text-left">OR</span>

                  {/* URL Text Input */}
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="Enter image URL or paste link..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-medium text-xs"
                  />
                </div>

                {/* Live Preview Thumbnail */}
                {formImage && (
                  <div className="flex items-center gap-3 p-2 bg-slate-100 rounded-xl border border-slate-200 mt-2">
                    <img src={formImage} alt="Product preview" className="w-12 h-12 rounded-lg object-cover bg-white" />
                    <div className="text-[11px]">
                      <span className="font-bold text-slate-900 block">Image Preview</span>
                      <span className="text-slate-500 font-mono text-[10px] truncate max-w-[280px] block">{formImage}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1 text-slate-900 uppercase text-[10px]">Profile Depth</label>
                  <input
                    type="text"
                    value={formDepth}
                    onChange={(e) => setFormDepth(e.target.value)}
                    placeholder="e.g. 80 mm"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 uppercase text-[10px]">Chambers</label>
                  <input
                    type="number"
                    value={formChambers}
                    onChange={(e) => setFormChambers(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 uppercase text-[10px]">Thermal Uf</label>
                  <input
                    type="text"
                    value={formInsulation}
                    onChange={(e) => setFormInsulation(e.target.value)}
                    placeholder="e.g. Uf = 0.95 W/m²K"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                <div>
                  <label className="block mb-1 text-slate-900 uppercase text-[10px] font-extrabold">Base Cost ($/m²)</label>
                  <input
                    type="number"
                    min={1}
                    value={formBasePrice}
                    onChange={(e) => setFormBasePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-black"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 uppercase text-[10px] font-extrabold">Profit Margin (%)</label>
                  <input
                    type="number"
                    min={0}
                    value={formProfitMargin}
                    onChange={(e) => setFormProfitMargin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-blue-700 font-black"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 uppercase text-[10px] font-extrabold">Selling Price ($/m²)</label>
                  <div className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-100/90 text-emerald-900 font-black text-sm flex items-center justify-between">
                    <span>${Math.round(formBasePrice * (1 + formProfitMargin / 100))}</span>
                    <span className="text-[10px] text-emerald-700 font-bold">/ m²</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-900 uppercase text-[10px]">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-md cursor-pointer"
                >
                  Save Product System
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST INSPECTION MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-base font-extrabold text-slate-900">Request Specs: {selectedRequest.id}</h3>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                <p><strong>Client:</strong> {selectedRequest.customer.fullName}</p>
                <p><strong>Phone:</strong> {selectedRequest.customer.phone}</p>
                <p><strong>City:</strong> {selectedRequest.customer.city}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold uppercase text-[10px] text-slate-500">Configured Systems ({selectedRequest.items.length})</h4>
                {selectedRequest.items.map((it, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 block">{it.productName}</span>
                      <span className="text-[11px] text-slate-500">{it.quantity} units • {it.widthMm} × {it.heightMm} mm ({it.color})</span>
                    </div>
                    <span className="font-bold text-sky-700">{it.estimatedAreaSqm} m²</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 bg-slate-200 rounded-xl font-bold text-slate-800"
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
