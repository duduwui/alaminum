import React, { useState, useRef, useEffect } from 'react';
import './AlumilHeader.css';
import { DOORHOME_CONTACT, ProductItem } from '../data/winhomeData';
import { useLanguage } from '../context/LanguageContext';
import { LanguageModal } from './LanguageModal';
import { ProductCategoryDivision } from '../data/productNavigationData';
import { loadProductDivisions, subscribeToDivisions } from '../services/productNavigationService';
import { loadLocalProducts, subscribeToLocalProducts } from '../services/productService';
import {
  HomepageSectionConfig,
  loadHomepageSections,
  subscribeToHomepageSections,
  getLocalizedSectionHeader
} from '../services/homepageSectionsService';
import { getCurrentUser, logoutUser } from '../services/authService';
import { User as UserType } from '../types/auth';
import { getLocalizedProduct } from '../utils/localizedContent';
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  User,
  UserPlus,
  UserCheck,
  LogOut,
  Globe,
  Menu,
  X,
  ShoppingCart,
  ArrowRight,
  Phone,
  FileText,
  HelpCircle,
  Briefcase,
  Layers,
  Building,
  Home as HomeIcon,
  Shield,
  Sliders,
  Award,
  LayoutGrid,
  Clock,
  Star,
  BookOpen
} from 'lucide-react';

interface AlumilHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuoteModal: () => void;
  onOpenSearch?: () => void;
  onOpenUserModal?: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
  onSelectProduct?: (product: ProductItem) => void;
}

export const AlumilHeader: React.FC<AlumilHeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuoteModal,
  onOpenSearch,
  onOpenUserModal,
  cartCount = 0,
  onOpenCart,
  onSelectProduct
}) => {
  const { currentLanguage, t } = useLanguage();
  const [divisions, setDivisions] = useState<ProductCategoryDivision[]>(() => loadProductDivisions());
  const [sections, setSections] = useState<HomepageSectionConfig[]>(() => loadHomepageSections());
  const [productList, setProductList] = useState<ProductItem[]>(() => loadLocalProducts());
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [selectedDivisionKey, setSelectedDivisionKey] = useState<string>(() => {
    const initialSections = loadHomepageSections();
    return initialSections[0]?.key || 'windows';
  });
  const [mobileProductsOpen, setMobileProductsOpen] = useState<boolean>(false);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => getCurrentUser());
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleAuth = () => setCurrentUser(getCurrentUser());
    window.addEventListener('auth-changed', handleAuth);
    window.addEventListener('storage', handleAuth);
    return () => {
      window.removeEventListener('auth-changed', handleAuth);
      window.removeEventListener('storage', handleAuth);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  useEffect(() => {
    return subscribeToDivisions((updated) => {
      setDivisions(updated);
    });
  }, []);

  useEffect(() => {
    return subscribeToHomepageSections((updated) => {
      setSections(updated);
    });
  }, []);

  useEffect(() => {
    return subscribeToLocalProducts((updated) => {
      setProductList(updated);
    });
  }, []);

  const isKurdish = currentLanguage.code === 'ckb';
  const isKurmanji = currentLanguage.code === 'kmr';
  const isTurkish = currentLanguage.code === 'tr';
  const isArabic = currentLanguage.code === 'ar';
  // Keep hidden from header navigation bar as requested, while routes and pages remain fully accessible
  const SHOW_ARTICLES_AND_REVIEWS_TABS = false;

  const getSectionProducts = (sectionKey: string) => {
    const keyLower = (sectionKey || '').toLowerCase();
    return productList.filter((p) => {
      const pCat = (p.category || '').toLowerCase();
      const pDiv = (p.division || '').toLowerCase();
      return pDiv === keyLower || pCat === keyLower;
    });
  };

  const handleProductClick = (product: ProductItem) => {
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      handleNavClick(product.division || product.category || 'products');
    }
  };


  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleModelClick = (model: { id: string; productId?: string; categoryTarget?: string }, divisionTarget: string) => {
    const product = productList.find((item) => item.id === model.productId || item.modelId === model.id);
    if (product && onSelectProduct) {
      setActiveMegaMenu(null);
      setMobileMenuOpen(false);
      onSelectProduct(product);
    } else {
      handleNavClick(divisionTarget);
    }
  };

  return (
    <>
      {/* 1. Alumil Top Utility Bar (header-buttons) */}
      <div className="bg-[#F8F8F8] border-b border-slate-200 hidden md:block text-[#3E4346] text-[13px] font-bold z-40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <ul className="hidden md:flex items-center m-0 p-0 list-none">
            <li>
              <button
                onClick={() => handleNavClick('typology')}
                className="px-4 py-2.5 hover:text-red-600 text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-red-600" />
                <span>{t('nav_help_choose')}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('about')}
                className="px-4 py-2.5 hover:text-red-600 text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5 text-red-600" />
                <span>{t('nav_why_doorhome')}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('contact')}
                className="px-4 py-2.5 hover:text-red-600 text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <span>{t('nav_contact') || 'Contact'}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Main Alumil Mega-Navbar */}
      <header className="doorhome-glass-header sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="doorhome-header-brand flex items-center gap-2 shrink-0"
          >
            <img
              src={DOORHOME_CONTACT.logo}
              alt="Doorhome"
              className="h-11 md:h-13 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DOORHOME_CONTACT.logoFallback;
              }}
            />
            <span className="doorhome-brand-name font-black tracking-tight" translate="no">
              {t('brand_name')}
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[15px] font-bold text-[#3E4346]">
            {/* 1. Products Mega-Menu Trigger */}
            <div
              className="doorhome-products-trigger"
              onMouseEnter={() => setActiveMegaMenu('products')}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button
                onClick={() => handleNavClick('products')}
                className={`py-6 flex items-center gap-1 hover:text-red-600 transition-colors relative ${
                  ['products', 'windows', 'doors', 'glass', 'railings', 'accessories', 'upvc', 'aluminum'].includes(activeTab)
                    ? 'text-red-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-red-600'
                    : ''
                }`}
              >
                <span>{t('nav_products')}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Products Mega-Menu Dropdown with Live Homepage Sections & Products */}
              {activeMegaMenu === 'products' && (() => {
                const currentSection = sections.find((s) => s.key === selectedDivisionKey || s.id === selectedDivisionKey) || sections[0];
                if (!currentSection) return null;
                const currentHeader = getLocalizedSectionHeader(currentSection, currentLanguage.code);
                const sectionProducts = getSectionProducts(currentSection.key);
                const featuredImg = (sectionProducts.length > 0 && (sectionProducts[0].image || sectionProducts[0].fallbackImage))
                  ? (sectionProducts[0].image || sectionProducts[0].fallbackImage)
                  : './assets/doorhome/03-2.jpg';

                return (
                  <div className="doorhome-products-menu bg-white/98 backdrop-blur-xl rounded-b-3xl shadow-[0_30px_80px_-20px_rgba(15,23,42,0.3)] border border-slate-200/90 p-6 z-50 animate-in fade-in duration-150">
                    <div className="grid grid-cols-12 gap-6 items-start">
                      {/* Left: Live Dynamic Sections */}
                      <div className="col-span-4 border-r border-slate-100 pr-4 space-y-1.5">
                        <div className="text-[11px] font-black uppercase text-slate-400 tracking-wider px-3 pb-1">
                          {isArabic ? 'الأقسام الرئيسية' : isKurdish ? 'بەشە سەرەکییەکان' : isKurmanji ? 'Beşên Sereke' : isTurkish ? 'Ana Bölümler' : 'Main Sections'}
                        </div>
                        {sections.map((sec) => {
                          const isSelected = currentSection.key === sec.key || currentSection.id === sec.id;
                          const secHeader = getLocalizedSectionHeader(sec, currentLanguage.code);
                          const count = getSectionProducts(sec.key).length;
                          return (
                            <button
                              key={sec.id}
                              onMouseEnter={() => setSelectedDivisionKey(sec.key)}
                              onClick={() => {
                                setSelectedDivisionKey(sec.key);
                                handleNavClick(sec.key);
                              }}
                              className={`w-full text-start px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-2 group cursor-pointer ${
                                isSelected
                                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                                  : 'text-slate-800 hover:bg-slate-50'
                              }`}
                            >
                              <span dir="auto" className="text-xs font-black leading-snug truncate">
                                {secHeader.title}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/70'
                                }`}>
                                  {count}
                                </span>
                                <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-0.5 text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                              </div>
                            </button>
                          );
                        })}

                        <div className="pt-3 mt-3 border-t border-slate-100">
                          <button
                            onClick={() => handleNavClick('products')}
                            className="w-full text-start px-3.5 py-2.5 text-xs font-extrabold text-red-600 hover:text-red-700 flex items-center justify-between rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <span>
                              {isArabic
                                ? 'عرض جميع المنتجات في المتجر'
                                : isKurdish
                                  ? 'بینینی گشت بەرهەمەکان لە فرۆشگا'
                                  : isKurmanji
                                    ? 'Hemû Berheman Bibîne'
                                    : isTurkish
                                      ? 'Tüm Ürünleri Görüntüle'
                                      : 'View All Products in Catalog'}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                          </button>
                        </div>
                      </div>

                      {/* Middle Column: Live Products in Selected Section */}
                      <div className="col-span-5 space-y-3 max-h-[390px] overflow-y-auto pr-2 no-scrollbar">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span dir="auto" className="text-xs font-black text-slate-900 truncate">
                            {currentHeader.title}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400 shrink-0">
                            {sectionProducts.length} {isArabic ? 'منتج' : isKurdish ? 'بەرهەم' : isKurmanji ? 'berhem' : isTurkish ? 'ürün' : 'items'}
                          </span>
                        </div>

                        {sectionProducts.length > 0 ? (
                          <div className="space-y-2">
                            {sectionProducts.map((prod) => {
                              const localizedProd = getLocalizedProduct(prod, currentLanguage.code);
                              return (
                                <button
                                  key={prod.id}
                                  onClick={() => handleProductClick(prod)}
                                  className="w-full text-start p-2.5 rounded-2xl bg-slate-50/70 hover:bg-red-50/60 hover:border-red-200 border border-slate-200/70 transition-all flex items-center justify-between gap-3 group cursor-pointer shadow-2xs hover:shadow-sm"
                                >
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-200/80 shrink-0">
                                      <img
                                        src={localizedProd.image || localizedProd.fallbackImage || './assets/doorhome/03-2.jpg'}
                                        alt={localizedProd.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = './assets/doorhome/03-2.jpg';
                                        }}
                                      />
                                    </div>
                                    <div className="space-y-0.5 min-w-0 flex-1">
                                      <span dir="auto" className="text-xs font-black text-slate-900 group-hover:text-red-700 transition-colors block truncate">
                                        {localizedProd.name}
                                      </span>
                                      <p dir="auto" className="text-[11px] text-slate-500 line-clamp-1 leading-relaxed">
                                        {localizedProd.description}
                                      </p>
                                    </div>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <p className="text-xs font-bold text-slate-400">
                              {isArabic ? 'لا توجد منتجات حالياً في هذا القسم' : isKurdish ? 'هیچ بەرهەمێک بەردەست نییە لەم بەشەدا' : 'No products in this section'}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right Column: Featured Section Showcase Card */}
                      <div className="col-span-3">
                        <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/80 shadow-md relative group/photo flex flex-col justify-between">
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={featuredImg}
                              alt={currentHeader.title}
                              className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = './assets/doorhome/03-2.jpg';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
                            <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                              <span className="text-[10px] font-black uppercase tracking-widest text-red-400 block">
                                Doorhome
                              </span>
                              <h4 dir="auto" className="text-sm font-black leading-snug text-white mt-0.5 line-clamp-2">
                                {currentHeader.title}
                              </h4>
                            </div>
                          </div>
                          <div className="p-3.5 bg-white space-y-3">
                            <p dir="auto" className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                              {currentHeader.description}
                            </p>
                            <button
                              onClick={() => handleNavClick(currentSection.key)}
                              className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                            >
                              <span dir="auto" className="truncate">
                                {isArabic
                                  ? `استكشف ${currentHeader.title}`
                                  : isKurdish
                                    ? `بینینی ${currentHeader.title}`
                                    : isKurmanji
                                      ? `Vekole ${currentHeader.title}`
                                      : isTurkish
                                        ? `${currentHeader.title} Keşfet`
                                        : `Explore ${currentHeader.title}`}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 2. Projects */}
            <button
              onClick={() => handleNavClick('projects')}
              className={`py-6 hover:text-red-600 transition-colors relative ${
                activeTab === 'projects'
                  ? 'text-red-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-red-600'
                  : ''
              }`}
            >
              {t('nav_projects')}
            </button>

            {/* 3. Articles & Knowledge Hub (Hidden from public navigation bar as requested, routes remain active) */}
            {SHOW_ARTICLES_AND_REVIEWS_TABS && (
              <button
                onClick={() => handleNavClick('articles')}
                className={`py-6 hover:text-red-600 transition-colors relative flex items-center gap-1.5 ${
                  activeTab === 'articles'
                    ? 'text-red-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-red-600'
                    : ''
                }`}
              >
                <BookOpen className="w-4 h-4 text-red-600" />
                <span>{isArabic ? 'المقالات والدليل' : isKurdish ? 'وتارەکان' : 'Articles & Guides'}</span>
              </button>
            )}

            {/* 4. Client Reviews & Rating (Hidden from public navigation bar as requested, routes remain active) */}
            {SHOW_ARTICLES_AND_REVIEWS_TABS && (
              <button
                onClick={() => handleNavClick('reviews')}
                className={`py-6 hover:text-red-600 transition-colors relative flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'text-red-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-red-600'
                    : ''
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{isArabic ? 'تقييم العملاء' : isKurdish ? 'هەڵسەنگاندن' : 'Reviews & Rating'}</span>
              </button>
            )}

            {/* 3. Support & Tools */}
            <button
              onClick={() => handleNavClick('typology')}
              className={`py-6 hover:text-red-600 transition-colors relative ${
                activeTab === 'typology'
                  ? 'text-red-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-red-600'
                  : ''
              }`}
            >
              {t('nav_solutions')}
            </button>

            {/* 4. Why Doorhome */}
            <button
              onClick={() => handleNavClick('about')}
              className={`py-6 hover:text-red-600 transition-colors relative ${
                activeTab === 'about'
                  ? 'text-red-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-red-600'
                  : ''
              }`}
            >
              {t('nav_why_doorhome')}
            </button>

            {/* 6. Contact */}
            <button
              onClick={() => handleNavClick('contact')}
              className={`py-6 hover:text-red-600 transition-colors relative ${
                activeTab === 'contact'
                  ? 'text-red-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-red-600'
                  : ''
              }`}
            >
              {t('nav_contact')}
            </button>
          </nav>

          {/* Right Header Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Language Selector Trigger */}
            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(true)}
              className="px-2 sm:px-2.5 py-1.5 text-slate-700 hover:text-red-600 hover:bg-slate-100 rounded-full transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200/80 hover:border-red-300 shadow-xs shrink-0"
              title={`${t('language_label')} (${currentLanguage.nativeName})`}
              aria-label={t('language_label')}
            >
              <Globe className="w-4.5 h-4.5 text-slate-600" />
              {currentLanguage.flagImage ? (
                <img
                  src={currentLanguage.flagImage}
                  alt={currentLanguage.name}
                  className="w-5 h-3.5 object-cover rounded shadow-xs shrink-0 border border-slate-200"
                />
              ) : (
                <span className="text-sm leading-none shrink-0">{currentLanguage.flag}</span>
              )}
            </button>

            {/* Cart button hidden — users contact via WhatsApp */}

            {/* 4. Mobile Burger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-slate-800 hover:text-red-600 lg:hidden focus:outline-none cursor-pointer shrink-0"
              aria-label={t('ui_menu')}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs drawer-backdrop-anim"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div data-doorhome-drawer className="relative ml-auto w-full max-w-[340px] sm:max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 drawer-slide-anim text-right">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-row-reverse">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <img src={DOORHOME_CONTACT.logo} alt="Doorhome" className="h-8 w-auto object-contain rounded" />
                  <span className="doorhome-brand-name font-black text-slate-900" translate="no">{t('brand_name')}</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer" aria-label="Close menu">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="mt-3 text-xs sm:text-sm font-semibold text-red-700 text-right">{t('working_hours_compact')}</p>

              {/* Navigation Links - Right Aligned */}
              <div className="py-4 space-y-2 text-[17px] font-black text-slate-900 text-right">
                <button
                  onClick={() => handleNavClick('home')}
                  className="w-full text-right py-2.5 px-2.5 hover:text-red-600 transition-colors cursor-pointer block"
                >
                  {t('nav_home')}
                </button>

                {/* Mobile Products Nested Dropdown Accordion */}
                <div className="border-y border-slate-100 py-1.5 my-1.5">
                  <button
                    onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                    className="w-full text-right py-2.5 px-2.5 flex items-center justify-between flex-row-reverse text-slate-900 hover:text-red-600 font-black text-[17px] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5 flex-row-reverse">
                      <LayoutGrid className="w-5 h-5 text-red-600" />
                      <span>{t('nav_products')}</span>
                    </span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${mobileProductsOpen ? 'rotate-180 text-red-600' : ''}`} />
                  </button>

                  {mobileProductsOpen && (
                    <div className="pr-3 pl-1 py-2 space-y-2 border-r-2 border-slate-100 mr-2 animate-in fade-in duration-200 text-right">
                      {/* Direct 'See All Products' Action Banner at top of products dropdown */}
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleNavClick('products');
                        }}
                        className="w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/80 rounded-xl font-black text-sm flex items-center justify-between flex-row-reverse transition-all cursor-pointer shadow-xs"
                      >
                        <span className="flex items-center gap-2 flex-row-reverse">
                          <LayoutGrid className="w-4 h-4 text-red-600 shrink-0" />
                          <span>{isArabic ? 'تصفح جميع المنتجات' : isKurdish ? 'بینینی هەموو بەرهەمەکان' : 'See All Products'}</span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-red-600 rotate-180" />
                      </button>

                      {sections.map((sec) => {
                        const isCatOpen = mobileExpandedCategory === sec.key || mobileExpandedCategory === sec.id;
                        const secHeader = getLocalizedSectionHeader(sec, currentLanguage.code);
                        const secProds = getSectionProducts(sec.key);
                        return (
                          <div key={sec.id} className="space-y-1">
                            {/* Category Level 2 */}
                            <button
                              onClick={() => setMobileExpandedCategory(isCatOpen ? null : sec.key)}
                              className={`w-full text-right py-3 px-3 rounded-xl flex items-center justify-between flex-row-reverse text-[15px] sm:text-base transition-colors cursor-pointer ${
                                isCatOpen
                                  ? 'bg-red-50 text-red-700 font-black'
                                  : 'text-slate-800 hover:bg-slate-50 hover:text-red-600 font-bold'
                              }`}
                            >
                              <span dir="auto">
                                {secHeader.title}
                              </span>
                              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCatOpen ? 'rotate-180 text-red-600' : 'text-slate-400'}`} />
                            </button>

                            {/* Live Products Level 3 */}
                            {isCatOpen && (
                              <div className="pr-3 pl-1 py-1.5 space-y-1 border-r-2 border-red-200/80 mr-3 animate-in fade-in duration-150 text-right">
                                {secProds.slice(0, 10).map((prod) => {
                                  const localizedProd = getLocalizedProduct(prod, currentLanguage.code);
                                  return (
                                    <button
                                      key={prod.id}
                                      onClick={() => handleProductClick(prod)}
                                      className="w-full text-right py-2 px-2.5 rounded-lg text-[14px] sm:text-[15px] font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50/50 transition-colors flex items-center justify-between flex-row-reverse gap-2.5 group cursor-pointer"
                                    >
                                      <div className="flex items-center gap-2.5 flex-row-reverse min-w-0">
                                        {localizedProd.image && (
                                          <img
                                            src={localizedProd.image}
                                            alt=""
                                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).src = './assets/doorhome/03-2.jpg';
                                            }}
                                          />
                                        )}
                                        <span dir="auto" className="truncate">
                                          {localizedProd.name}
                                        </span>
                                      </div>
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-red-600 transition-all shrink-0 rotate-180" />
                                    </button>
                                  );
                                })}

                                {/* View all in this section */}
                                <button
                                  onClick={() => handleNavClick(sec.key)}
                                  className="w-full text-right py-2.5 px-3 text-xs sm:text-sm font-black text-red-600 hover:underline flex items-center justify-end gap-1 cursor-pointer pt-1.5"
                                >
                                  <span dir="auto">
                                    {isArabic
                                      ? `عرض جميع ${secHeader.title} ←`
                                      : isKurdish
                                        ? `بینینی گشت ${secHeader.title} ←`
                                        : `View all ${secHeader.title} →`}
                                  </span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Prominent Bottom See All Products Button */}
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleNavClick('products');
                        }}
                        className="w-full mt-3 py-3 px-4 bg-slate-900 hover:bg-red-600 text-white rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                      >
                        <LayoutGrid className="w-4 h-4 text-red-400" />
                        <span>{isArabic ? 'فتح كتالوج المنتجات بالكامل' : isKurdish ? 'کردنەوەی کەتەلۆکی گشت بەرهەمەکان' : 'Open Full Products Catalog'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <button onClick={() => handleNavClick('projects')} className="w-full text-right py-2.5 px-2.5 hover:text-red-600 transition-colors cursor-pointer block">
                  {t('nav_projects')}
                </button>
                {SHOW_ARTICLES_AND_REVIEWS_TABS && (
                  <>
                    <button onClick={() => handleNavClick('articles')} className="w-full text-right py-2.5 px-2.5 hover:text-red-600 transition-colors cursor-pointer flex items-center justify-end gap-2">
                      <span>{isArabic ? 'المقالات والدليل الهندسي (30 مقال)' : isKurdish ? 'وتار و ڕێبەری ئەندازیاری' : 'Articles & Guides (30)'}</span>
                      <BookOpen className="w-4 h-4 text-red-600" />
                    </button>
                    <button onClick={() => handleNavClick('reviews')} className="w-full text-right py-2.5 px-2.5 hover:text-red-600 transition-colors cursor-pointer flex items-center justify-end gap-2">
                      <span>{isArabic ? 'تقييم الشركة وآراء العملاء' : isKurdish ? 'هەڵسەنگاندنی کۆمپانیا' : 'Rate Us & Reviews'}</span>
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </button>
                  </>
                )}
                <button onClick={() => handleNavClick('typology')} className="w-full text-right py-2.5 px-2.5 hover:text-red-600 transition-colors cursor-pointer block">
                  {t('nav_solutions')}
                </button>
                <button onClick={() => handleNavClick('about')} className="w-full text-right py-2.5 px-2.5 hover:text-red-600 transition-colors cursor-pointer block">
                  {t('nav_why_doorhome')}
                </button>
                <button onClick={() => handleNavClick('contact')} className="w-full text-right py-2.5 px-2.5 hover:text-red-600 transition-colors cursor-pointer block">
                  {t('nav_contact')}
                </button>
              </div>
            </div>

            {/* Bottom Actions in Drawer */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-right">
              {/* Language Switcher in Mobile Drawer */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsLanguageModalOpen(true);
                }}
                className="w-full py-2.5 px-3 bg-slate-50 hover:bg-red-50 text-slate-800 hover:text-red-700 border border-slate-200 rounded-lg flex items-center justify-between flex-row-reverse text-sm font-bold transition-colors cursor-pointer notranslate"
                translate="no"
              >
                <span className="flex items-center gap-2 flex-row-reverse notranslate" translate="no">
                  <Globe className="w-4 h-4 text-red-600" />
                  <span className="capitalize notranslate" translate="no">{t('language_label')}</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 font-bold notranslate" translate="no">
                  {currentLanguage.flagImage ? (
                    <img
                      src={currentLanguage.flagImage}
                      alt=""
                      className="w-5 h-3.5 object-cover rounded shadow-xs border border-slate-200"
                    />
                  ) : (
                    <span>{currentLanguage.flag}</span>
                  )}
                  <span className="notranslate" translate="no">{currentLanguage.nativeName}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language Selection Modal */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />
    </>
  );
};
