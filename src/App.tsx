import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PartnerLogos } from './components/PartnerLogos';
import { SignatureShowcase } from './components/SignatureShowcase';
import { HomeSystemsBentoSection } from './components/HomeSystemsBentoSection';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { BrochuresSection } from './components/BrochuresSection';
import { ContactSection } from './components/ContactSection';
import { ProductShopPage } from './components/ProductShopPage';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { QuoteCalculatorModal } from './components/QuoteCalculatorModal';
import { SearchModal } from './components/SearchModal';
import { ConfigureItemModal } from './components/ConfigureItemModal';
import { RequestCartDrawer } from './components/RequestCartDrawer';
import { QuotationRequestStepperModal } from './components/QuotationRequestStepperModal';
import { AdminPortalPage } from './components/AdminPortalPage';
import { ProductItem, WINHOME_CONTACT } from './data/winhomeData';
import { RequestItem, QuotationRequest } from './types/requests';
import { loadActiveCart, saveActiveCart } from './services/requestService';
import { MessageSquare, Calculator, ClipboardList } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [shopCategory, setShopCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [initialQuoteProduct, setInitialQuoteProduct] = useState<string>('');
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  // E-Commerce Architectural Request Cart State
  const [cartItems, setCartItems] = useState<RequestItem[]>(() => loadActiveCart());
  const [configuringProduct, setConfiguringProduct] = useState<ProductItem | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isStepperModalOpen, setIsStepperModalOpen] = useState<boolean>(false);

  // Sync cart with localStorage
  useEffect(() => {
    saveActiveCart(cartItems);
  }, [cartItems]);

  // URL routing & Hash synchronization (supports #admin, #products, etc.)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const path = window.location.pathname.replace('/', '').toLowerCase();
      const route = hash || path;

      if (route === 'admin') {
        setActiveTab('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (['products', 'upvc', 'aluminum', 'accessories'].includes(route)) {
        setActiveTab(route);
        setShopCategory(route === 'products' ? 'all' : route);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (route === 'home' || route === '') {
        setActiveTab('home');
      } else {
        setActiveTab('home');
        setTimeout(() => {
          const el = document.getElementById(route);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isProductShopView = ['products', 'upvc', 'aluminum', 'accessories'].includes(activeTab);
  const isAdminView = activeTab === 'admin';

  const handleOpenQuoteWithProduct = (productName: string) => {
    setInitialQuoteProduct(productName);
    setQuoteModalOpen(true);
  };

  const handleOpenGeneralQuote = () => {
    setInitialQuoteProduct('');
    setQuoteModalOpen(true);
  };

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'admin') {
      setActiveTab('admin');
      window.location.hash = '#admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (['products', 'upvc', 'aluminum', 'accessories'].includes(sectionId)) {
      setShopCategory(sectionId === 'products' ? 'all' : sectionId);
      setActiveTab(sectionId);
      window.location.hash = `#${sectionId}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Navigating to a homepage section
    setActiveTab(sectionId);
    window.location.hash = `#${sectionId}`;
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If coming from shop or admin, wait for re-render before scrolling
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleGoToProductShop = (category?: string) => {
    const cat = category || 'all';
    setShopCategory(cat);
    const target = cat === 'all' ? 'products' : cat;
    setActiveTab(target);
    window.location.hash = `#${target}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    handleNavigate('home');
  };

  // Cart operations
  const handleAddToCart = (newItem: RequestItem) => {
    setCartItems((prev) => {
      // Check if identical spec exists, otherwise append
      const existingIdx = prev.findIndex(
        (it) =>
          it.productId === newItem.productId &&
          it.widthMm === newItem.widthMm &&
          it.heightMm === newItem.heightMm &&
          it.color === newItem.color &&
          it.glazing === newItem.glazing &&
          it.openingType === newItem.openingType
      );

      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + newItem.quantity,
          estimatedAreaSqm: Number(
            (
              ((newItem.widthMm * newItem.heightMm) / 1000000) *
              (updated[existingIdx].quantity + newItem.quantity)
            ).toFixed(2)
          )
        };
        return updated;
      }
      return [newItem, ...prev];
    });

    setConfiguringProduct(null);
    setIsCartDrawerOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((it) => {
          if (it.id === id) {
            const nextQty = it.quantity + delta;
            if (nextQty <= 0) return null;
            const singleArea = (it.widthMm * it.heightMm) / 1000000;
            return {
              ...it,
              quantity: nextQty,
              estimatedAreaSqm: Number((singleArea * nextQty).toFixed(2))
            };
          }
          return it;
        })
        .filter(Boolean) as RequestItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleStartQuotationStepper = () => {
    setIsCartDrawerOpen(false);
    setIsStepperModalOpen(true);
  };

  const handleSuccessfulRequestSubmission = (newRequest: QuotationRequest) => {
    setCartItems([]);
    saveActiveCart([]);
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0);

  const whatsappDirectUrl = `https://wa.me/${WINHOME_CONTACT.hotlineRaw.replace('+', '')}?text=${encodeURIComponent(
    'Hello Winhome Company, I would like to consult with an engineer regarding your uPVC & Aluminum systems.'
  )}`;

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-sky-600 selection:text-white flex flex-col font-sans relative overflow-x-clip">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        onOpenQuoteModal={handleOpenGeneralQuote}
        onOpenSearch={() => setSearchModalOpen(true)}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartDrawerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full relative">
        {isAdminView ? (
          /* Dedicated Admin Dashboard View (#admin) */
          <AdminPortalPage
            onBackToHome={handleBackToHome}
            onGoToProducts={() => handleGoToProductShop('all')}
          />
        ) : isProductShopView ? (
          /* Dedicated E-Commerce Style Product Shop Page (#products) */
          <ProductShopPage
            key={shopCategory}
            initialCategory={shopCategory}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onOpenQuote={handleOpenQuoteWithProduct}
            onBackToHome={handleBackToHome}
            onConfigureProduct={(p) => setConfiguringProduct(p)}
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartDrawerOpen(true)}
          />
        ) : (
          /* Homepage (#home): Includes Hero, Partners, 3D Deck, MagicBento Showcase, About, Gallery, Brochures & Contact */
          <>
            {/* 1. Hero Section with parallax reveal */}
            <HeroSection
              onExploreProducts={() => handleGoToProductShop('all')}
              onOpenQuoteModal={handleOpenGeneralQuote}
            />

            {/* 2. Partner Brand Carousel */}
            <PartnerLogos />

            {/* 3. Signature Systems Showcase with 3D CardSwap Deck */}
            <SignatureShowcase
              onSelectProduct={(p) => setSelectedProduct(p)}
              onOpenQuote={handleOpenQuoteWithProduct}
            />

            {/* 4. MagicBento Showcase Gallery: Visual examples with spotlights, 3D tilt and direct link to shop */}
            <HomeSystemsBentoSection
              onViewAllProducts={handleGoToProductShop}
            />

            {/* 5. About Winhome & Nafza Almanzl Holding */}
            <AboutSection />

            {/* 6. Project Gallery (Installed Villas & Commercial Towers) */}
            <GallerySection />

            {/* 7. Technical Catalogues & Brochures */}
            <BrochuresSection onOpenQuote={handleOpenQuoteWithProduct} />

            {/* 8. Contact & Branch Details */}
            <ContactSection />
          </>
        )}
      </main>

      {/* Footer */}
      {!isAdminView && (
        <Footer
          onNavigate={handleNavigate}
          onOpenQuote={handleOpenGeneralQuote}
        />
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenQuote={handleOpenQuoteWithProduct}
      />

      {/* Interactive Cost & Specification Calculator Modal */}
      <QuoteCalculatorModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialProduct={initialQuoteProduct}
      />

      {/* Universal Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Configure Custom Specifications Modal (Width, Height, Glazing, Color, Quantity) */}
      <ConfigureItemModal
        product={configuringProduct}
        isOpen={Boolean(configuringProduct)}
        onClose={() => setConfiguringProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Request Cart Drawer (Side Drawer with Itemized List & Calculations) */}
      <RequestCartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOpenStepperModal={handleStartQuotationStepper}
        onBrowseMore={() => {
          setIsCartDrawerOpen(false);
          handleGoToProductShop('all');
        }}
      />

      {/* 4-Step React Bits Stepper Modal (Form: Review -> Project Specs -> Contact Info -> Confirm) */}
      <QuotationRequestStepperModal
        isOpen={isStepperModalOpen}
        onClose={() => setIsStepperModalOpen(false)}
        items={cartItems}
        onSuccessfulSubmission={handleSuccessfulRequestSubmission}
      />

      {/* Floating Action Buttons: Cost Estimator, Request Cart & WhatsApp */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Floating Cart Indicator if items exist */}
        {cartItems.length > 0 && !isAdminView && (
          <button
            id="fab-request-cart-btn"
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-95 animate-bounce"
            title="Open Architectural Request Cart"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Request List ({totalCartCount} items)</span>
          </button>
        )}

        {!isAdminView && (
          <button
            id="fab-cost-estimator-btn"
            onClick={handleOpenGeneralQuote}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-slate-800 hover:text-sky-700 text-xs font-bold shadow-lg transition-all border border-slate-200 hover:border-sky-300 hover:shadow-xl transform hover:-translate-y-0.5"
            title="Open Cost Estimator"
          >
            <Calculator className="w-4 h-4 text-sky-600" />
            <span>Cost Estimator</span>
          </button>
        )}

        <a
          id="fab-whatsapp-btn"
          href={whatsappDirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:scale-105 transition-all"
          aria-label="Direct WhatsApp Message"
          title="Chat on WhatsApp"
        >
          <MessageSquare className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}

