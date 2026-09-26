import React, { useState, useRef, useEffect } from 'react';
import { DOORHOME_CONTACT } from '../data/winhomeData';
import { useLanguage } from '../context/LanguageContext';
import { LanguageModal } from './LanguageModal';
import {
  ChevronDown,
  Menu,
  X,
  ShoppingCart,
  Search,
  Globe,
  Phone,
  FileText,
  Sliders,
  ShieldCheck,
  Building2,
  Home,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuoteModal: () => void;
  onOpenSearch?: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
  isVisible?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuoteModal,
  onOpenSearch,
  cartCount = 0,
  onOpenCart
}) => {
  const { currentLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    setProductsDropdownOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isProductTab = ['products', 'upvc', 'aluminum', 'accessories'].includes(activeTab);

  return (
    <>
      {/* 1. Alumil-Style Top Utility Bar */}
      <div className="bg-[#0A192F] text-slate-300 text-[11px] font-medium tracking-wider border-b border-slate-800 z-50 relative hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
          {/* Left: Hotline */}
          <div className="flex items-center gap-6">
            <a
              href={`tel:${(DOORHOME_CONTACT.phone || DOORHOME_CONTACT.hotlineRaw || '+9647504440402').replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-slate-300 hover:text-red-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-red-600" />
              <span>{DOORHOME_CONTACT.phone || DOORHOME_CONTACT.hotline || '+964 750 444 0402'}</span>
            </a>
          </div>

          {/* Right: Quick Action Links */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => handleNavClick('typology')}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Sliders className="w-3 h-3 text-red-600" />
              <span>Product Advisor</span>
            </button>
            <button
              onClick={() => handleNavClick('brochures')}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <FileText className="w-3 h-3 text-red-600" />
              <span>Catalogs & Specs</span>
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3 text-red-600" />
              <span>Why Doorhome</span>
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="text-slate-400 hover:text-red-400 transition-colors text-[10px] uppercase font-bold tracking-widest bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Mega-Menu Navbar */}
      <header
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 border-b border-slate-200'
            : 'bg-white shadow-xs py-3.5 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="flex items-center gap-3 group focus:outline-none shrink-0"
          >
            <img
              src={DOORHOME_CONTACT.logo}
              alt="Doorhome Fenestration Systems"
              className="h-9 sm:h-11 md:h-12 w-auto object-contain transition-transform group-hover:scale-102"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DOORHOME_CONTACT.logoFallback;
              }}
            />
            <div className="hidden lg:flex flex-col border-l border-slate-200 pl-3">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                European Systems
              </span>
              <span className="text-[11px] font-bold text-[#0A192F]">
                Aluminium & uPVC
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-[13px] font-bold tracking-wider uppercase transition-colors py-1 relative ${
                activeTab === 'home'
                  ? 'text-red-600 after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2.5px] after:bg-red-600'
                  : 'text-slate-700 hover:text-red-600'
              }`}
            >
              Home
            </button>

            {/* PRODUCTS Dropdown with Alumil Mega-preview */}
            <div
              className="relative group"
              onMouseEnter={() => setProductsDropdownOpen(true)}
              onMouseLeave={() => setProductsDropdownOpen(false)}
            >
              <button
                onClick={() => handleNavClick('products')}
                className={`text-[13px] font-bold tracking-wider uppercase transition-colors py-1 flex items-center gap-1 ${
                  isProductTab
                    ? 'text-red-600 after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2.5px] after:bg-red-600'
                    : 'text-slate-700 hover:text-red-600'
                }`}
              >
                <span>{t('nav_products')}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    productsDropdownOpen ? 'rotate-180 text-red-600' : ''
                  }`}
                />
              </button>

              {/* Mega Dropdown Menu */}
              {productsDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 w-[580px] animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 overflow-hidden">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                      <span className="text-xs font-black uppercase tracking-widest text-[#002B49]">
                        Architectural Product Catalog
                      </span>
                      <button
                        onClick={() => handleNavClick('products')}
                        className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <span>View All Categories</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Item 1: Aluminium */}
                      <button
                        onClick={() => handleNavClick('aluminum')}
                        className="text-left p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 group/item flex items-start gap-3"
                      >
                        <div className="p-2.5 rounded-lg bg-red-50 text-red-600 group-hover/item:bg-red-600 group-hover/item:text-white transition-colors">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover/item:text-red-600">
                            Aluminium Systems
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            Thermal-break sliding (Lorenzo 70LS), curtain walls & facades.
                          </p>
                        </div>
                      </button>

                      {/* Item 2: uPVC */}
                      <button
                        onClick={() => handleNavClick('upvc')}
                        className="text-left p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 group/item flex items-start gap-3"
                      >
                        <div className="p-2.5 rounded-lg bg-red-50 text-red-600 group-hover/item:bg-red-600 group-hover/item:text-white transition-colors">
                          <Home className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover/item:text-red-600">
                            uPVC Profiles
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            Legend 80 & Everest Max 6-chamber triple glazing for acoustic isolation.
                          </p>
                        </div>
                      </button>

                      {/* Item 3: Accessories & Hardware */}
                      <button
                        onClick={() => handleNavClick('accessories')}
                        className="text-left p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 group/item flex items-start gap-3"
                      >
                        <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover/item:text-[#002B49]">
                            Accessories & Hardware
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            STAC & Comunello Italian multi-point security mechanisms.
                          </p>
                        </div>
                      </button>

                      {/* Item 4: Typologies */}
                      <button
                        onClick={() => handleNavClick('typology')}
                        className="text-left p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 group/item flex items-start gap-3"
                      >
                        <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 group-hover/item:bg-purple-600 group-hover/item:text-white transition-colors">
                          <Sliders className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover/item:text-[#002B49]">
                            Building Typologies
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            Tailored solutions for Villas, Multi-Family & Commercial.
                          </p>
                        </div>
                      </button>
                    </div>

                    {/* Bottom banner in dropdown */}
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 flex items-center justify-between border border-slate-100">
                      <div className="text-[11px] text-slate-600 font-medium">
                        Need thermal calculation or DWG drawings?
                      </div>
                      <button
                        onClick={() => handleNavClick('brochures')}
                        className="text-[11px] font-bold text-[#002B49] hover:underline"
                      >
                        Download Catalogs →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('typology')}
              className={`text-[13px] font-bold tracking-wider uppercase transition-colors py-1 ${
                activeTab === 'typology'
                  ? 'text-red-600 after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2.5px] after:bg-red-600'
                  : 'text-slate-700 hover:text-red-600'
              }`}
            >
              Typologies
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`text-[13px] font-bold tracking-wider uppercase transition-colors py-1 ${
                activeTab === 'about'
                  ? 'text-red-600 after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2.5px] after:bg-red-600'
                  : 'text-slate-700 hover:text-red-600'
              }`}
            >
              Why Doorhome
            </button>

            <button
              onClick={() => handleNavClick('gallery')}
              className={`text-[13px] font-bold tracking-wider uppercase transition-colors py-1 ${
                activeTab === 'gallery'
                  ? 'text-red-600 after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2.5px] after:bg-red-600'
                  : 'text-slate-700 hover:text-red-600'
              }`}
            >
              Projects
            </button>

            <button
              onClick={() => handleNavClick('brochures')}
              className={`text-[13px] font-bold tracking-wider uppercase transition-colors py-1 ${
                activeTab === 'brochures'
                  ? 'text-red-600 after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2.5px] after:bg-red-600'
                  : 'text-slate-700 hover:text-red-600'
              }`}
            >
              Downloads
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`text-[13px] font-bold tracking-wider uppercase transition-colors py-1 ${
                activeTab === 'contact'
                  ? 'text-red-600 after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2.5px] after:bg-red-600'
                  : 'text-slate-700 hover:text-red-600'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Icons & CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Modal */}
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-2 text-slate-700 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title={t('nav_search')}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Language Selector Trigger with Flag */}
            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(true)}
              className="px-2.5 py-1.5 text-slate-700 hover:text-red-600 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200/80 shadow-xs"
              title={`Change Language (${currentLanguage.nativeName})`}
              aria-label="Change Language"
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

            {/* Cart Drawer Trigger Button */}
            <button
              type="button"
              onClick={() => onOpenCart && onOpenCart()}
              className="relative p-2 text-slate-700 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title={t('nav_cart')}
              aria-label={`View Cart (${cartCount} items)`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white animate-in zoom-in duration-150">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Primary CTA Quote Button */}
            <button
              onClick={onOpenQuoteModal}
              className="hidden sm:inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-red-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-700 transition-all shadow-sm hover:shadow-md cursor-pointer border border-red-600"
            >
              <span>{t('nav_request_quote')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>

            {/* Mobile Burger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-slate-800 hover:text-[#002B49] rounded-lg lg:hidden focus:outline-none cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. Mobile Slide-Over Menu (Alumil style) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative ml-auto w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div>
              <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50">
                <img
                  src={DOORHOME_CONTACT.logo}
                  alt="Doorhome"
                  className="h-9 w-auto object-contain"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-1">
                <button
                  onClick={() => handleNavClick('home')}
                  className="w-full text-left px-3 py-2.5 rounded-lg font-bold text-slate-800 hover:bg-slate-50 text-sm uppercase tracking-wider"
                >
                  Home
                </button>

                <div className="border-y border-slate-100 py-1 my-1">
                  <span className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Product Systems
                  </span>
                  <button
                    onClick={() => handleNavClick('products')}
                    className="w-full text-left px-3 py-2 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 text-xs"
                  >
                    All Products Overview
                  </button>
                  <button
                    onClick={() => handleNavClick('aluminum')}
                    className="w-full text-left px-3 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-50 text-xs pl-6"
                  >
                    • Aluminium Windows & Sliding
                  </button>
                  <button
                    onClick={() => handleNavClick('upvc')}
                    className="w-full text-left px-3 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-50 text-xs pl-6"
                  >
                    • uPVC 6-Chamber Profiles
                  </button>
                  <button
                    onClick={() => handleNavClick('accessories')}
                    className="w-full text-left px-3 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-50 text-xs pl-6"
                  >
                    • STAC & Comunello Accessories
                  </button>
                </div>

                <button
                  onClick={() => handleNavClick('typology')}
                  className="w-full text-left px-3 py-2.5 rounded-lg font-bold text-slate-800 hover:bg-slate-50 text-sm uppercase tracking-wider"
                >
                  Building Typologies
                </button>

                <button
                  onClick={() => handleNavClick('about')}
                  className="w-full text-left px-3 py-2.5 rounded-lg font-bold text-slate-800 hover:bg-slate-50 text-sm uppercase tracking-wider"
                >
                  Why Doorhome
                </button>

                <button
                  onClick={() => handleNavClick('gallery')}
                  className="w-full text-left px-3 py-2.5 rounded-lg font-bold text-slate-800 hover:bg-slate-50 text-sm uppercase tracking-wider"
                >
                  Project Gallery
                </button>

                <button
                  onClick={() => handleNavClick('brochures')}
                  className="w-full text-left px-3 py-2.5 rounded-lg font-bold text-slate-800 hover:bg-slate-50 text-sm uppercase tracking-wider"
                >
                  Catalogs & Downloads
                </button>

                <button
                  onClick={() => handleNavClick('contact')}
                  className="w-full text-left px-3 py-2.5 rounded-lg font-bold text-slate-800 hover:bg-slate-50 text-sm uppercase tracking-wider"
                >
                  Contact & Showroom
                </button>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-3">
              {/* Language Switcher in Mobile Drawer */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsLanguageModalOpen(true);
                }}
                className="w-full py-2.5 px-3 bg-white hover:bg-red-50 text-slate-800 hover:text-red-700 border border-slate-200 rounded-lg flex items-center justify-between text-xs font-bold transition-colors cursor-pointer notranslate"
                translate="no"
              >
                <span className="flex items-center gap-2 notranslate" translate="no">
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

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuoteModal();
                }}
                className="w-full py-3 rounded-lg bg-red-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm hover:bg-red-700 transition-colors"
              >
                <span>{t('nav_request_quote')}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                <a
                  href={`tel:${(DOORHOME_CONTACT.phone || DOORHOME_CONTACT.hotlineRaw || '+9647504440402').replace(/\s+/g, '')}`}
                  className="hover:text-red-600 font-semibold flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5 text-red-600" />
                  <span>{DOORHOME_CONTACT.phone || DOORHOME_CONTACT.hotline || '+964 750 444 0402'}</span>
                </a>
                <button
                  onClick={() => handleNavClick('admin')}
                  className="text-[11px] font-bold text-slate-400 hover:text-slate-800 uppercase"
                >
                  Admin Portal
                </button>
              </div>
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
