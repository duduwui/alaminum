import React, { useState, useEffect, useRef } from 'react';
import { WINHOME_CONTACT } from '../data/winhomeData';
import { Phone, ChevronDown, Search, Menu, X, ArrowRight, ShieldCheck, Mail } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuoteModal: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuoteModal,
  onOpenSearch
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md transition-all duration-200">
      {/* Top Corporate Contact Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-6">
            <a
              id="top-hotline-link"
              href={`tel:${WINHOME_CONTACT.hotlineRaw}`}
              className="flex items-center gap-1.5 text-white font-medium hover:text-sky-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span>Erbil Desk: {WINHOME_CONTACT.hotline}</span>
            </a>
            <span className="hidden sm:inline-block text-slate-500">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{WINHOME_CONTACT.emails[0]}</span>
            </div>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <div className="hidden md:block text-slate-400">
              <span>{WINHOME_CONTACT.workHours}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden lg:inline-flex items-center gap-1.5 text-sky-400 text-[11px] font-semibold tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Severe Climate Class S Certified</span>
            </span>
            <button
              onClick={onOpenQuoteModal}
              className="px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold text-[11px] uppercase tracking-wider transition-colors shadow-xs"
            >
              Get Free Quote
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar: Exact tabs as shown in the screenshot */}
      <div
        className={`w-full bg-white border-b border-slate-200 transition-all duration-200 ${
          isScrolled ? 'shadow-md py-2.5 sm:py-3' : 'py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Authentic Logo */}
          <a
            id="brand-logo-link"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="flex items-center gap-3 group focus:outline-none shrink-0"
          >
            <img
              src={WINHOME_CONTACT.logo}
              alt="Winhome Company"
              onError={(e) => {
                // Fallback if local asset is not rendered
                (e.target as HTMLImageElement).src = WINHOME_CONTACT.logoFallback;
              }}
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </a>

          {/* Desktop Navigation Tabs (HOME, ABOUT, PRODUCTS ▼, GALLERY, BROCHURES, CONTACT, 🔍) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <button
              id="nav-tab-home"
              onClick={() => handleNavClick('home')}
              className={`text-xs xl:text-sm font-bold tracking-wider uppercase transition-colors ${
                activeTab === 'home'
                  ? 'text-sky-600'
                  : 'text-slate-800 hover:text-sky-600'
              }`}
            >
              HOME
            </button>

            <button
              id="nav-tab-about"
              onClick={() => handleNavClick('about')}
              className={`text-xs xl:text-sm font-bold tracking-wider uppercase transition-colors ${
                activeTab === 'about'
                  ? 'text-sky-600'
                  : 'text-slate-800 hover:text-sky-600'
              }`}
            >
              ABOUT
            </button>

            {/* PRODUCTS Dropdown as shown in image */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setProductsDropdownOpen(true)}
              onMouseLeave={() => setProductsDropdownOpen(false)}
            >
              <button
                id="nav-tab-products"
                onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                className={`inline-flex items-center gap-1.5 text-xs xl:text-sm font-bold tracking-wider uppercase transition-colors ${
                  isProductTab
                    ? 'text-sky-600'
                    : 'text-slate-800 hover:text-sky-600'
                }`}
              >
                <span>PRODUCTS</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${productsDropdownOpen ? 'rotate-180 text-sky-600' : ''}`} />
              </button>

              {/* Dropdown Menu matching image */}
              {productsDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 z-50 w-48 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-white rounded-lg shadow-xl border border-slate-200 py-2 overflow-hidden">
                    <button
                      id="dropdown-item-aluminum"
                      onClick={() => handleNavClick('aluminum')}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors block ${
                        activeTab === 'aluminum'
                          ? 'text-sky-600 font-semibold bg-sky-50'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-sky-600'
                      }`}
                    >
                      Aluminum
                    </button>
                    <button
                      id="dropdown-item-upvc"
                      onClick={() => handleNavClick('upvc')}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors block ${
                        activeTab === 'upvc'
                          ? 'text-sky-600 font-semibold bg-sky-50'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-sky-600'
                      }`}
                    >
                      uPVC
                    </button>
                    <button
                      id="dropdown-item-accessories"
                      onClick={() => handleNavClick('accessories')}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors block ${
                        activeTab === 'accessories'
                          ? 'text-sky-600 font-semibold bg-sky-50'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-sky-600'
                      }`}
                    >
                      Accessories
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              id="nav-tab-gallery"
              onClick={() => handleNavClick('gallery')}
              className={`text-xs xl:text-sm font-bold tracking-wider uppercase transition-colors ${
                activeTab === 'gallery'
                  ? 'text-sky-600'
                  : 'text-slate-800 hover:text-sky-600'
              }`}
            >
              GALLERY
            </button>

            <button
              id="nav-tab-brochures"
              onClick={() => handleNavClick('brochures')}
              className={`text-xs xl:text-sm font-bold tracking-wider uppercase transition-colors ${
                activeTab === 'brochures'
                  ? 'text-sky-600'
                  : 'text-slate-800 hover:text-sky-600'
              }`}
            >
              BROCHURES
            </button>

            <button
              id="nav-tab-contact"
              onClick={() => handleNavClick('contact')}
              className={`text-xs xl:text-sm font-bold tracking-wider uppercase transition-colors ${
                activeTab === 'contact'
                  ? 'text-sky-600'
                  : 'text-slate-800 hover:text-sky-600'
              }`}
            >
              CONTACT
            </button>

            {/* Search Icon */}
            <button
              id="nav-search-button"
              onClick={onOpenSearch}
              className="p-2 text-slate-700 hover:text-sky-600 hover:bg-slate-100 rounded-full transition-colors"
              title="Search Systems & Profiles"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </nav>

          {/* Mobile Right Controls: Search + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenSearch}
              className="p-2.5 text-slate-700 hover:text-sky-600 hover:bg-slate-100 rounded-lg"
              aria-label="Search systems"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-800 hover:text-sky-600 hover:bg-slate-100 rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer (Prioritizing Mobile Users!) */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-2 animate-in slide-in-from-top-3 duration-200">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left py-3 px-3 rounded-lg text-sm font-bold uppercase tracking-wider ${
                activeTab === 'home' ? 'text-sky-600 bg-sky-50' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              HOME
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`w-full text-left py-3 px-3 rounded-lg text-sm font-bold uppercase tracking-wider ${
                activeTab === 'about' ? 'text-sky-600 bg-sky-50' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              ABOUT
            </button>

            {/* Mobile Products Accordion */}
            <div>
              <button
                onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                className={`w-full flex items-center justify-between py-3 px-3 rounded-lg text-sm font-bold uppercase tracking-wider ${
                  isProductTab ? 'text-sky-600 bg-sky-50' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>PRODUCTS</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileProductsOpen ? 'rotate-180 text-sky-600' : ''}`} />
              </button>

              {mobileProductsOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50 rounded-lg mt-1 border-l-2 border-sky-500">
                  <button
                    onClick={() => handleNavClick('aluminum')}
                    className="w-full text-left py-2.5 px-3 text-sm font-semibold text-slate-700 hover:text-sky-600 block"
                  >
                    • Aluminum Systems
                  </button>
                  <button
                    onClick={() => handleNavClick('upvc')}
                    className="w-full text-left py-2.5 px-3 text-sm font-semibold text-slate-700 hover:text-sky-600 block"
                  >
                    • uPVC Profiles
                  </button>
                  <button
                    onClick={() => handleNavClick('accessories')}
                    className="w-full text-left py-2.5 px-3 text-sm font-semibold text-slate-700 hover:text-sky-600 block"
                  >
                    • Accessories & Hardware
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('gallery')}
              className={`w-full text-left py-3 px-3 rounded-lg text-sm font-bold uppercase tracking-wider ${
                activeTab === 'gallery' ? 'text-sky-600 bg-sky-50' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              GALLERY
            </button>

            <button
              onClick={() => handleNavClick('brochures')}
              className={`w-full text-left py-3 px-3 rounded-lg text-sm font-bold uppercase tracking-wider ${
                activeTab === 'brochures' ? 'text-sky-600 bg-sky-50' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              BROCHURES
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`w-full text-left py-3 px-3 rounded-lg text-sm font-bold uppercase tracking-wider ${
                activeTab === 'contact' ? 'text-sky-600 bg-sky-50' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              CONTACT
            </button>

            {/* Mobile Call & Quote Actions */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <a
                href={`tel:${WINHOME_CONTACT.hotlineRaw}`}
                className="flex items-center justify-center gap-1.5 py-3 rounded-lg bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider"
              >
                <Phone className="w-4 h-4 text-sky-600" />
                <span>Direct Call</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuoteModal();
                }}
                className="flex items-center justify-center gap-1.5 py-3 rounded-lg bg-sky-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm"
              >
                <span>Instant Quote</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
