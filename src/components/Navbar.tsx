import React, { useState, useRef } from 'react';
import { WINHOME_CONTACT } from '../data/winhomeData';
import { ChevronDown, Menu, X, ShoppingCart } from 'lucide-react';

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
  cartCount = 0,
  onOpenCart
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-2xs py-3 sm:py-3.5 transition-all duration-300">
      <div className="w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Brand Logo - Left */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="flex items-center group shrink-0 focus:outline-none"
        >
          <img
            src={WINHOME_CONTACT.logo}
            alt="Winhome Company"
            className="h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = WINHOME_CONTACT.logoFallback;
            }}
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-10 xl:gap-12">
          <button
            onClick={() => handleNavClick('home')}
            className={`text-xs xl:text-sm font-bold tracking-widest uppercase transition-all relative py-1 ${
              activeTab === 'home'
                ? 'text-blue-600 after:content-[""] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2.5px] after:bg-blue-600 after:rounded-full'
                : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            HOME
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`text-xs xl:text-sm font-bold tracking-widest uppercase transition-all relative py-1 ${
              activeTab === 'about'
                ? 'text-blue-600 after:content-[""] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2.5px] after:bg-blue-600 after:rounded-full'
                : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            ABOUT
          </button>

          {/* PRODUCTS Dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setProductsDropdownOpen(true)}
            onMouseLeave={() => setProductsDropdownOpen(false)}
          >
            <div className="flex items-center gap-1 cursor-pointer">
              <button
                onClick={() => handleNavClick('products')}
                className={`text-xs xl:text-sm font-bold tracking-widest uppercase transition-all relative py-1 ${
                  isProductTab
                    ? 'text-blue-600 after:content-[""] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2.5px] after:bg-blue-600 after:rounded-full'
                    : 'text-slate-700 hover:text-blue-600'
                }`}
              >
                PRODUCTS
              </button>
              <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${productsDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {productsDropdownOpen && (
              <div className="absolute top-full left-0 pt-2 z-50 w-56 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/80 py-2.5 overflow-hidden text-slate-800">
                  <button
                    onClick={() => handleNavClick('products')}
                    className="w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-600 hover:bg-blue-50 block border-b border-slate-100"
                  >
                    Browse All Products
                  </button>
                  <button
                    onClick={() => handleNavClick('aluminum')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors block"
                  >
                    Aluminum Systems
                  </button>
                  <button
                    onClick={() => handleNavClick('upvc')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors block"
                  >
                    uPVC Profiles
                  </button>
                  <button
                    onClick={() => handleNavClick('accessories')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors block"
                  >
                    Accessories & Hardware
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavClick('gallery')}
            className={`text-xs xl:text-sm font-bold tracking-widest uppercase transition-all relative py-1 ${
              activeTab === 'gallery'
                ? 'text-blue-600 after:content-[""] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2.5px] after:bg-blue-600 after:rounded-full'
                : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            GALLERY
          </button>

          <button
            onClick={() => handleNavClick('brochures')}
            className={`text-xs xl:text-sm font-bold tracking-widest uppercase transition-all relative py-1 ${
              activeTab === 'brochures'
                ? 'text-blue-600 after:content-[""] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2.5px] after:bg-blue-600 after:rounded-full'
                : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            BROCHURES
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className={`text-xs xl:text-sm font-bold tracking-widest uppercase transition-all relative py-1 ${
              activeTab === 'contact'
                ? 'text-blue-600 after:content-[""] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2.5px] after:bg-blue-600 after:rounded-full'
                : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            CONTACT
          </button>
        </nav>

        {/* Right Action: Dedicated CART Tab */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenCart && onOpenCart()}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 font-extrabold text-xs tracking-wider transition-all cursor-pointer shadow-2xs group"
            title="View Architectural Request Cart"
          >
            <ShoppingCart className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">CART</span>
            {cartCount > 0 ? (
              <span className="bg-sky-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                {cartCount}
              </span>
            ) : (
              <span className="text-[10px] text-sky-600 font-bold bg-sky-200/60 px-1.5 py-0.5 rounded-full">
                0
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-800 hover:text-blue-600 rounded-lg md:hidden focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 mx-4 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-2xl p-4 shadow-2xl space-y-2.5 animate-in fade-in slide-in-from-top-3 duration-200">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
              activeTab === 'home' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            HOME
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`w-full text-left px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
              activeTab === 'about' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            ABOUT
          </button>

          <button
            onClick={() => handleNavClick('products')}
            className={`w-full text-left px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
              isProductTab ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            PRODUCTS
          </button>

          <button
            onClick={() => handleNavClick('gallery')}
            className={`w-full text-left px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
              activeTab === 'gallery' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            GALLERY
          </button>

          <button
            onClick={() => handleNavClick('brochures')}
            className={`w-full text-left px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
              activeTab === 'brochures' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            BROCHURES
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className={`w-full text-left px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
              activeTab === 'contact' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            CONTACT
          </button>

          {/* Mobile Cart Action Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenCart) onOpenCart();
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-colors bg-sky-600 text-white flex items-center justify-between border border-sky-600 shadow-md shadow-sky-600/20 mt-2"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-white" />
              <span>VIEW REQUEST CART</span>
            </div>
            <span className="bg-white text-sky-800 px-2 py-0.5 rounded-full text-[10px] font-black">
              {cartCount}
            </span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
