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
import { AdminGuardModal } from './components/AdminGuardModal';
import { ProductItem, WINHOME_CONTACT } from './data/winhomeData';
import { RequestItem, QuotationRequest } from './types/requests';
import { loadActiveCart, saveActiveCart } from './services/requestService';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [shopCategory, setShopCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [initialQuoteProduct, setInitialQuoteProduct] = useState<string>('');
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  // Admin Access Security Gate State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);

  // E-Commerce Architectural Request Cart State
  const [cartItems, setCartItems] = useState<RequestItem[]>(() => loadActiveCart());
  const [configuringProduct, setConfiguringProduct] = useState<ProductItem | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  // Disable browser scroll restoration on refresh so page loads cleanly at top
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

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
        if (isAdminAuthenticated) {
          setActiveTab('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setIsAdminAuthModalOpen(true);
        }
      } else if (['products', 'upvc', 'aluminum', 'accessories'].includes(route)) {
        setActiveTab(route);
        setShopCategory(route);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (['home', 'about', 'gallery', 'brochures', 'contact'].includes(route)) {
        setActiveTab(route);
        if (route !== 'home') {
          const element = document.getElementById(route);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdminAuthenticated]);

  const handleNavigate = (id: string) => {
    if (id === 'admin') {
      if (isAdminAuthenticated) {
        setActiveTab('admin');
        window.location.hash = '#admin';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setIsAdminAuthModalOpen(true);
      }
      return;
    }

    if (['products', 'upvc', 'aluminum', 'accessories'].includes(id)) {
      setActiveTab(id);
      setShopCategory(id);
      window.location.hash = `#${id}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActiveTab(id);
    window.location.hash = `#${id}`;
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGoToProductShop = (category = 'all') => {
    setActiveTab(category === 'all' ? 'products' : category);
    setShopCategory(category);
    window.location.hash = category === 'all' ? '#products' : `#${category}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setActiveTab('home');
    window.location.hash = '#home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenGeneralQuote = () => {
    setInitialQuoteProduct('');
    setQuoteModalOpen(true);
  };

  const handleOpenQuoteWithProduct = (productTitle: string) => {
    setInitialQuoteProduct(productTitle);
    setQuoteModalOpen(true);
  };

  // Cart Management Handlers
  const handleAddToCart = (newItem: RequestItem) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((it) => it.id === newItem.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        const prevItem = updated[existingIdx];
        const nextQty = prevItem.quantity + newItem.quantity;
        const singleArea = (newItem.widthMm * newItem.heightMm) / 1000000;
        updated[existingIdx] = {
          ...prevItem,
          quantity: nextQty,
          estimatedAreaSqm: Number((singleArea * nextQty).toFixed(2))
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
  const isProductShopView = ['products', 'upvc', 'aluminum', 'accessories'].includes(activeTab);
  const isAdminView = activeTab === 'admin';

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-sky-600 selection:text-white flex flex-col font-sans relative overflow-x-clip">
      {/* Top Standardized Liquid Glass Navbar (Hidden on Admin Portal) */}
      {!isAdminView && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={handleNavigate}
          onOpenQuoteModal={handleOpenGeneralQuote}
          onOpenSearch={() => setSearchModalOpen(true)}
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartDrawerOpen(true)}
          isVisible={true}
        />
      )}

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
          /* Homepage (#home): Hero with Boomerang video playback, Partners, Showcase, About, Gallery, Brochures & Contact */
          <>
            {/* 1. Boomerang Video Hero Section */}
            <HeroSection
              onOpenQuoteModal={handleOpenGeneralQuote}
              onExploreProducts={() => handleGoToProductShop('all')}
            />

            {/* 2. Official Brand Partners & Certifications */}
            <PartnerLogos />

            {/* 3. Interactive 3D Card Deck - European Architectural Showcase */}
            <SignatureShowcase
              onSelectProduct={(p) => setSelectedProduct(p)}
              onOpenQuoteModal={handleOpenGeneralQuote}
              onGoToProducts={handleGoToProductShop}
            />

            {/* 4. MagicBento Interactive Grid Showcase */}
            <HomeSystemsBentoSection
              onSelectProduct={(p) => setSelectedProduct(p)}
              onGoToShop={handleGoToProductShop}
            />

            {/* 5. Company Overview & Manufacturing Excellence */}
            <AboutSection onOpenQuoteModal={handleOpenGeneralQuote} />

            {/* 6. High-Definition Architectural Project Gallery */}
            <GallerySection />

            {/* 7. Technical Catalogs & Official Downloads */}
            <BrochuresSection />

            {/* 8. Verified Direct Contact & Erbil Factory Location */}
            <ContactSection onOpenQuoteModal={handleOpenGeneralQuote} />
          </>
        )}
      </main>

      {/* Footer */}
      {!isAdminView && (
        <Footer
          activeTab={activeTab}
          setActiveTab={handleNavigate}
          onOpenQuoteModal={handleOpenGeneralQuote}
        />
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenQuote={handleOpenQuoteWithProduct}
        onConfigureProduct={(p) => {
          setSelectedProduct(null);
          setConfiguringProduct(p);
        }}
      />

      {/* Instant Estimation & Price Calculator Modal */}
      <QuoteCalculatorModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialProductName={initialQuoteProduct}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Configure Specifications Modal */}
      <ConfigureItemModal
        product={configuringProduct}
        isOpen={Boolean(configuringProduct)}
        onClose={() => setConfiguringProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Request Cart Drawer */}
      <RequestCartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onSuccessfulSubmission={handleSuccessfulRequestSubmission}
        onBrowseMore={() => {
          setIsCartDrawerOpen(false);
          handleGoToProductShop('all');
        }}
      />

      {/* Quotation Request Stepper Modal */}
      <QuotationRequestStepperModal
        isOpen={isStepperModalOpen}
        onClose={() => setIsStepperModalOpen(false)}
        items={cartItems}
        onSuccessfulSubmission={handleSuccessfulRequestSubmission}
      />

      {/* Security Gate Passcode Modal for Admin Access */}
      <AdminGuardModal
        isOpen={isAdminAuthModalOpen}
        onSuccess={() => {
          setIsAdminAuthenticated(true);
          setIsAdminAuthModalOpen(false);
          setActiveTab('admin');
          window.location.hash = '#admin';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onCancel={() => {
          setIsAdminAuthModalOpen(false);
          if (activeTab === 'admin') {
            setActiveTab('home');
            window.location.hash = '#home';
          }
        }}
      />
    </div>
  );
}
