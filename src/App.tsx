import React, { useState, useEffect } from 'react';
import { AlumilHeader } from './components/AlumilHeader';
import { HeroSection } from './components/HeroSection';
import { PartnerLogos } from './components/PartnerLogos';
import { SignatureShowcase } from './components/SignatureShowcase';
import { AboutSection } from './components/AboutSection';
import { WindowsSection } from './components/WindowsSection';
import { DoorsSection } from './components/DoorsSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { ArchitecturalFaqSection } from './components/ArchitecturalFaqSection';
import { AlumilContactPage } from './components/AlumilContactPage';
import { FloatingContactBadge } from './components/FloatingContactBadge';
import { ProductShopPage } from './components/ProductShopPage';
import { AlumilFooter } from './components/AlumilFooter';
import { ProductDetailPage } from './components/ProductDetailPage';
import { ArticlesPage } from './components/ArticlesPage';
import { ReviewsRatingPage } from './components/ReviewsRatingPage';
import { SearchModal } from './components/SearchModal';
import { RequestCartDrawer } from './components/RequestCartDrawer';
import { QuotationRequestStepperModal } from './components/QuotationRequestStepperModal';
import { AdminPortalPage } from './components/AdminPortalPage';
import { AdminGuardModal } from './components/AdminGuardModal';
import { UserAccountModal } from './components/UserAccountModal';
import { UserAuthPage } from './components/UserAuthPage';
import { TranslationLoader } from './components/TranslationLoader';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useLanguage } from './context/LanguageContext';
import { ProductItem } from './data/winhomeData';
import { RequestItem, QuotationRequest } from './types/requests';
import { loadActiveCart, saveActiveCart } from './services/requestService';
import { getCurrentUser, logoutUser } from './services/authService';
import { loadLocalProducts, saveLocalProducts } from './services/productService';
import { hasAdminCmsSession, loadSharedCmsSection } from './services/cmsService';
import { normalizeGalleryItems, saveGalleryItems } from './services/galleryContentService';
import { loadProductDivisions, saveProductDivisions } from './services/productNavigationService';
import { ProductCategoryDivision } from './data/productNavigationData';
import { SEARCH_PAGES, SITE_URL, searchPagePath } from './utils/searchMetadata';
import { initScrollRevealObserver } from './utils/scrollObserver';

export default function App() {
  const { isTranslating, targetLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const rawHash = window.location.hash.replace('#', '').toLowerCase();
      const rawPath = window.location.pathname.replace('/', '').toLowerCase();
      const hash = rawHash.split('?')[0];
      const path = rawPath.split('?')[0];
      const route = hash || path;
      if (route === 'admin') return 'admin';
      if (route === 'projects') return 'projects';
      if (route === 'articles' || route.startsWith('article-')) return 'articles';
      if (route === 'reviews' || route === 'rate' || route === 'feedback') return 'reviews';
      if (route === 'auth' || route === 'login' || route === 'register') return 'auth';
      if (route === 'products' || loadProductDivisions().some((division) => division.key === route)) return route;
      if (route === 'contact' || route === 'contactus') return 'contact';
    }
    return 'home';
  });

  const [activeArticleSlug, setActiveArticleSlug] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const rawHash = window.location.hash.replace('#', '').toLowerCase();
      if (rawHash.startsWith('article-')) return rawHash.replace('article-', '');
    }
    return null;
  });

  const [shopCategory, setShopCategory] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const rawHash = window.location.hash.replace('#', '').toLowerCase();
      const rawPath = window.location.pathname.replace('/', '').toLowerCase();
      const hash = rawHash.split('?')[0];
      const path = rawPath.split('?')[0];
      const route = hash || path;
      if (loadProductDivisions().some((division) => division.key === route)) return route;
      if (route === 'products') return 'all';
    }
    return 'all';
  });
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  useEffect(() => {
    const isPrivate = ['admin', 'auth', 'login', 'register'].includes(activeTab);
    const pathname = window.location.hash === '#contact' ? '/contact' : searchPagePath(activeTab);
    const page = SEARCH_PAGES[pathname];
    document.title = isPrivate ? `Doorhome | ${activeTab === 'admin' ? 'Administration' : 'Sign in'}` : page.title;
    const setMeta = (selector: string, content: string) => document.querySelector(selector)?.setAttribute('content', content);
    setMeta('meta[name="description"]', page.description);
    setMeta('meta[name="robots"]', isPrivate ? 'noindex, follow' : 'index, follow, max-image-preview:large');
    setMeta('meta[property="og:title"]', page.title);
    setMeta('meta[property="og:description"]', page.description);
    setMeta('meta[property="og:url"]', `${SITE_URL}${pathname}`);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${SITE_URL}${pathname}`);
  }, [activeTab, selectedProduct]);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  // User Authentication Modal State
  const [isUserAccountModalOpen, setIsUserAccountModalOpen] = useState<boolean>(false);

  // Admin Security Gate State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    const user = getCurrentUser();
    return user?.role === 'admin' || user?.role === 'super_admin';
  });
  const [adminSessionStatus, setAdminSessionStatus] = useState<'checking' | 'valid' | 'missing'>('checking');
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (activeTab !== 'admin') return;
    if (!isAdminAuthenticated) {
      setAdminSessionStatus('missing');
      return;
    }

    let cancelled = false;
    setAdminSessionStatus('checking');
    void hasAdminCmsSession().then((valid) => {
      if (cancelled) return;
      setAdminSessionStatus(valid ? 'valid' : 'missing');
    }).catch(() => {
      if (cancelled) return;
      setAdminSessionStatus('missing');
    });
    return () => { cancelled = true; };
  }, [activeTab, isAdminAuthenticated]);

  // E-Commerce Architectural Request Cart State
  const [cartItems, setCartItems] = useState<RequestItem[]>(() => loadActiveCart());
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isStepperModalOpen, setIsStepperModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (getCurrentUser()?.role === 'admin' || window.location.hash === '#admin') return;
    let visitorId = localStorage.getItem('doorhome_visitor_id');
    if (!visitorId) { visitorId = crypto.randomUUID(); localStorage.setItem('doorhome_visitor_id', visitorId); }

    const sendLeave = () => {
      try {
        if (navigator.sendBeacon) {
          const blob = new Blob([JSON.stringify({ visitorId })], { type: 'application/json' });
          navigator.sendBeacon('/api/visits/leave', blob);
        } else {
          void fetch('/api/visits/leave', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ visitorId }), keepalive: true
          }).catch(() => {});
        }
      } catch { /* ignore */ }
    };

    const heartbeat = () => {
      if (getCurrentUser()?.role === 'admin' || window.location.hash === '#admin') return;
      void fetch('/api/visits/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId })
      }).catch(() => {});
    };

    heartbeat();
    const timer = window.setInterval(heartbeat, 10_000);

    // visibilitychange fires reliably on mobile when tab switches or browser closes
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        sendLeave();
      } else {
        heartbeat(); // user came back — send heartbeat immediately
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', sendLeave);
    window.addEventListener('pagehide', sendLeave);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', sendLeave);
      window.removeEventListener('pagehide', sendLeave);
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'admin') return;
    let cancelled = false;
    void Promise.all([
      loadSharedCmsSection<Record<string, unknown>>('homepage'),
      loadSharedCmsSection<unknown>('gallery'),
      loadSharedCmsSection<unknown>('products'),
      loadSharedCmsSection<unknown>('divisions')
    ]).then(([homepage, gallery, products, divisions]) => {
      if (cancelled) return;
      if (homepage && typeof homepage === 'object' && !Array.isArray(homepage)) {
        localStorage.setItem('winhome_cms_homepage_media', JSON.stringify(homepage));
        window.dispatchEvent(new Event('cms_homepage_updated'));
      }
      if (Array.isArray(gallery)) saveGalleryItems(normalizeGalleryItems(gallery));
      if (Array.isArray(products)) saveLocalProducts(products as ProductItem[]);
      if (Array.isArray(divisions)) saveProductDivisions(divisions as ProductCategoryDivision[]);
    }).catch(() => { /* Keep local content when the shared server is unavailable. */ });
    return () => { cancelled = true; };
  }, [activeTab]);

  // Disable browser scroll restoration on refresh
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Sync cart with localStorage
  useEffect(() => {
    saveActiveCart(cartItems);
  }, [cartItems]);

  // High-performance dynamic scroll reveal animation engine
  useEffect(() => {
    return initScrollRevealObserver();
  }, [activeTab, selectedProduct]);

  // URL routing & Hash synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '').toLowerCase();
      const rawPath = window.location.pathname.replace('/', '').toLowerCase();
      const hash = rawHash.split('?')[0];
      const path = rawPath.split('?')[0];
      const route = hash || path;

      if (!rawHash || rawHash === 'home' || route === 'home' || !route) {
        setSelectedProduct(null);
        setActiveTab('home');
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        return;
      }

      if (route.startsWith('product-')) {
        const prodId = route.replace('product-', '');
        const all = loadLocalProducts();
        const found = all.find((p) => p.id.toLowerCase() === prodId || p.id === prodId);
        if (found) {
          setSelectedProduct(found);
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
        return;
      }

      // Clear product view if navigating away from product-*
      setSelectedProduct(null);

      if (route === 'admin') {
        setActiveTab('admin');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (route === 'projects') {
        setActiveTab('projects');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (route.startsWith('article-')) {
        const slug = route.replace('article-', '');
        setActiveArticleSlug(slug);
        setActiveTab('articles');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (route === 'articles') {
        setActiveArticleSlug(null);
        setActiveTab('articles');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (route === 'reviews' || route === 'rate' || route === 'feedback') {
        setActiveTab('reviews');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (route === 'auth' || route === 'login' || route === 'register') {
        setActiveTab('auth');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (route === 'products' || loadProductDivisions().some((division) => division.key === route)) {
        setActiveTab(route);
        setShopCategory(route === 'products' ? 'all' : route);
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (route === 'contact' || route === 'contactus') {
        setActiveTab('home');
        setTimeout(() => {
          const element = document.getElementById('contact');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 120);
      } else if (['about', 'typology', 'gallery', 'support', 'services', 'achievements'].includes(route)) {
        setActiveTab('home');
        setTimeout(() => {
          const element = document.getElementById(route);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 80);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdminAuthenticated]);

  const handleNavigate = (id: string) => {
    setSelectedProduct(null);
    if (id === 'admin') {
      setAdminSessionStatus('checking');
      setActiveTab('admin');
      window.location.hash = '#admin';
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (id === 'auth' || id === 'login' || id === 'register') {
      setActiveTab('auth');
      window.location.hash = '#auth';
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (id === 'projects') {
      setActiveTab('projects');
      window.location.hash = '#projects';
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (id === 'products' || loadProductDivisions().some((division) => division.key === id)) {
      setActiveTab(id);
      setShopCategory(id === 'products' ? 'all' : id);
      window.location.hash = `#${id}`;
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (id === 'contact' || id === 'contactus') {
      setActiveTab('home');
      window.location.hash = '#contact';
      setTimeout(() => {
        const element = document.getElementById('contact');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    // Home Section Navigation
    setActiveTab('home');
    window.location.hash = `#${id}`;
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 80);
  };

  const handleSelectProduct = (product: ProductItem) => {
    setSelectedProduct(product);
    window.location.hash = `#product-${product.id}`;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleBackFromProduct = () => {
    setSelectedProduct(null);
    if (activeTab === 'admin') {
      setActiveTab('admin');
      window.location.hash = '#admin';
    } else {
      const cat = isProductShopView && shopCategory ? shopCategory : 'all';
      setActiveTab(cat === 'all' ? 'products' : cat);
      setShopCategory(cat);
      window.location.hash = cat === 'all' ? '#products' : `#${cat}`;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleGoToProductShop = (category = 'all') => {
    setSelectedProduct(null);
    setActiveTab(category === 'all' ? 'products' : category);
    setShopCategory(category);
    window.location.hash = category === 'all' ? '#products' : `#${category}`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToHome = () => {
    setSelectedProduct(null);
    setActiveTab('home');
    window.location.hash = '#home';
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Cart Management Handlers
  const handleAddToCart = (newItem: RequestItem) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((it) => it.productId === newItem.productId);
      if (existingIdx > -1) {
        const updated = [...prev];
        const prevItem = updated[existingIdx];
        const nextQty = prevItem.quantity + newItem.quantity;
        const unitPrice = newItem.unitPrice || prevItem.unitPrice || 140;
        updated[existingIdx] = {
          ...prevItem,
          quantity: nextQty,
          totalPrice: unitPrice * nextQty
        };
        return updated;
      }
      return [newItem, ...prev];
    });

    setIsCartDrawerOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((it) => {
          if (it.id === id) {
            const nextQty = it.quantity + delta;
            if (nextQty <= 0) return null;
            const unitPrice = it.unitPrice || 140;
            return {
              ...it,
              quantity: nextQty,
              totalPrice: unitPrice * nextQty
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

  const handleSuccessfulRequestSubmission = (newRequest: QuotationRequest) => {
    setCartItems([]);
    saveActiveCart([]);
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0);
  const isProductShopView = activeTab === 'products' || loadProductDivisions().some((division) => division.key === activeTab);
  const isAdminView = activeTab === 'admin';
  const isAuthView = activeTab === 'auth' || activeTab === 'login' || activeTab === 'register';

  return (
    <div className={`min-h-screen ${isAuthView ? 'bg-[#dde1e7]' : 'bg-white'} text-[#3E4346] flex flex-col font-sans relative overflow-x-clip`}>
      {/* 1. Alumil Exact Header & Mega Menu */}
      {!isAdminView && !isAuthView && (
        <AlumilHeader
          activeTab={activeTab}
          setActiveTab={handleNavigate}
          onOpenQuoteModal={() => setIsStepperModalOpen(true)}
          onOpenSearch={() => setSearchModalOpen(true)}
          onOpenUserModal={() => handleNavigate('auth')}
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartDrawerOpen(true)}
          onSelectProduct={handleSelectProduct}
        />
      )}

      {/* Main Body */}
      <main className="flex-1 w-full relative" data-doorhome-page={`${activeTab}:${selectedProduct?.id || ''}`}>
        {isAdminView ? (
          /* Admin Portal View (#admin) */
          <div key="admin" className="min-h-screen w-full bg-slate-950">
            {adminSessionStatus === 'checking' ? (
              <div role="status" className="p-12 text-center text-slate-600">Checking administrator session…</div>
            ) : isAdminAuthenticated && adminSessionStatus === 'valid' ? (
              <ErrorBoundary fallbackTitle="Admin Portal Error">
                <AdminPortalPage
                  onBackToHome={handleBackToHome}
                  onGoToProducts={() => handleGoToProductShop('all')}
                />
              </ErrorBoundary>
            ) : (
              <AdminGuardModal
                isOpen={true}
                onClose={handleBackToHome}
                onCancel={handleBackToHome}
                onSuccess={(user) => {
                  setIsAdminAuthenticated(true);
                  setAdminSessionStatus('valid');
                }}
              />
            )}
          </div>
        ) : activeTab === 'auth' ? (
          /* Dedicated User Authentication & Profile Page (#auth) */
          <div key="auth" className="page-transition">
            <ErrorBoundary fallbackTitle="Authentication Error">
              <UserAuthPage
                onBackToHome={handleBackToHome}
                onAuthSuccess={(user) => {
                  if (user.role === 'admin') {
                    setIsAdminAuthenticated(true);
                  }
                }}
                onNavigateToAdmin={() => handleNavigate('admin')}
                onNavigateToShop={() => handleGoToProductShop('all')}
              />
            </ErrorBoundary>
          </div>
        ) : selectedProduct ? (
          /* Dedicated simplified product detail page */
          <div key={`prod-${selectedProduct.id}`} className="page-transition">
            <ProductDetailPage
              product={selectedProduct}
              onBack={handleBackFromProduct}
              onAddToCart={handleAddToCart}
              onSelectProduct={handleSelectProduct}
            />
          </div>
        ) : activeTab === 'projects' ? (
          <div key="projects" className="page-transition">
            <GallerySection fullPage onBack={handleBackToHome} />
          </div>
        ) : activeTab === 'articles' ? (
          <div key="articles" className="page-transition">
            <ArticlesPage
              initialSlug={activeArticleSlug}
              onNavigateToReviews={() => {
                setActiveTab('reviews');
                window.location.hash = '#reviews';
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              onOpenQuoteModal={() => setIsStepperModalOpen(true)}
              onBackToHome={handleBackToHome}
            />
          </div>
        ) : activeTab === 'reviews' ? (
          <div key="reviews" className="page-transition">
            <ReviewsRatingPage
              onBackToHome={handleBackToHome}
              onOpenQuoteModal={() => setIsStepperModalOpen(true)}
            />
          </div>
        ) : isProductShopView ? (
          /* Full Product Shop View (#products) */
          <div key={`shop-${shopCategory}`} className="page-transition">
            <ProductShopPage
              key={shopCategory}
              initialCategory={shopCategory}
              onSelectProduct={handleSelectProduct}
              onBackToHome={handleBackToHome}
              cartCount={totalCartCount}
              onOpenCart={() => setIsCartDrawerOpen(true)}
            />
          </div>
        ) : (
          /* Classic Rich Doorhome Homepage with Smooth Scroll Animations */
          <div key="home" className="page-transition">
            {/* 1. Hero Section with Responsive Backgrounds & ShinyText */}
            <HeroSection
              onExploreProducts={() => handleGoToProductShop('all')}
              onOpenQuoteModal={() => setIsStepperModalOpen(true)}
            />

            {/* Architectural Section Separator Line */}
            <div className="w-full relative flex items-center justify-center my-0 py-0 z-10" aria-hidden="true">
              <div className="w-full border-t-2 border-slate-900/25" />
              <div className="absolute w-20 sm:w-28 h-1 bg-red-600 rounded-full shadow-sm" />
            </div>

            {/* 2. Partner Brand Carousel */}
            <PartnerLogos />

            {/* Architectural Section Separator Line */}
            <div className="w-full relative flex items-center justify-center my-0 py-0 z-10" aria-hidden="true">
              <div className="w-full border-t-2 border-slate-900/25" />
              <div className="absolute w-20 sm:w-28 h-1 bg-red-600 rounded-full shadow-sm" />
            </div>

            {/* 3. 5 Signature Architectural Systems with 3D CardSwap Deck */}
            <SignatureShowcase
              onSelectProduct={handleSelectProduct}
              onOpenQuote={(name) => {
                const found = selectedProduct || null;
                if (found) setSelectedProduct(found);
                setIsStepperModalOpen(true);
              }}
              onOpenQuoteModal={() => setIsStepperModalOpen(true)}
              onGoToProducts={handleGoToProductShop}
            />

            {/* Architectural Section Separator Line */}
            <div className="w-full relative flex items-center justify-center my-0 py-0 z-10" aria-hidden="true">
              <div className="w-full border-t-2 border-slate-900/25" />
              <div className="absolute w-20 sm:w-28 h-1 bg-red-600 rounded-full shadow-sm" />
            </div>

            {/* 4. Material Superiority & Engineering Pillars */}
            <AboutSection
              onExploreTypologies={() => handleNavigate('typology')}
              onOpenQuoteModal={() => setIsStepperModalOpen(true)}
            />

            {/* Architectural Section Separator Line */}
            <div className="w-full relative flex items-center justify-center my-0 py-0 z-10" aria-hidden="true">
              <div className="w-full border-t-2 border-slate-900/25" />
              <div className="absolute w-20 sm:w-28 h-1 bg-red-600 rounded-full shadow-sm" />
            </div>

            {/* 5. Architectural Windows Systems */}
            <WindowsSection
              onSelectProduct={handleSelectProduct}
              onOpenQuote={(name) => {
                const found = selectedProduct || null;
                if (found) setSelectedProduct(found);
                setIsStepperModalOpen(true);
              }}
              onExploreCategory={handleGoToProductShop}
            />

            {/* Architectural Section Separator Line */}
            <div className="w-full relative flex items-center justify-center my-0 py-0 z-10" aria-hidden="true">
              <div className="w-full border-t-2 border-slate-900/25" />
              <div className="absolute w-20 sm:w-28 h-1 bg-red-600 rounded-full shadow-sm" />
            </div>

            {/* 6. Architectural Doors & Entrances */}
            <DoorsSection
              onSelectProduct={handleSelectProduct}
              onOpenQuote={(name) => {
                const found = selectedProduct || null;
                if (found) setSelectedProduct(found);
                setIsStepperModalOpen(true);
              }}
              onExploreCategory={handleGoToProductShop}
            />

            {/* Architectural Section Separator Line */}
            <div className="w-full relative flex items-center justify-center my-0 py-0 z-10" aria-hidden="true">
              <div className="w-full border-t-2 border-slate-900/25" />
              <div className="absolute w-20 sm:w-28 h-1 bg-red-600 rounded-full shadow-sm" />
            </div>

            {/* 8. Project Gallery (Installed Villas & Commercial Towers) */}
            <GallerySection onShowAll={() => {
              setSelectedProduct(null);
              setActiveTab('projects');
              window.location.hash = '#projects';
              window.scrollTo({ top: 0, behavior: 'instant' });
            }} />

            {/* Architectural Section Separator Line */}
            <div className="w-full relative flex items-center justify-center my-0 py-0 z-10" aria-hidden="true">
              <div className="w-full border-t-2 border-slate-900/25" />
              <div className="absolute w-20 sm:w-28 h-1 bg-red-600 rounded-full shadow-sm" />
            </div>

            {/* 9. Contact */}
            <ContactSection onOpenQuoteModal={() => setIsStepperModalOpen(true)} />
          </div>
        )}
      </main>

      {/* Alumil Exact Footer */}
      {!isAdminView && !isAuthView && (
        <ErrorBoundary fallbackTitle="Footer Error">
          <AlumilFooter
            onNavigate={handleNavigate}
            onOpenQuote={() => setIsStepperModalOpen(true)}
          />
        </ErrorBoundary>
      )}

      {/* Floating Alumil Contact Badge (Bottom Right) */}
      {!isAdminView && !isAuthView && (
        <FloatingContactBadge onClick={() => handleNavigate('contact')} />
      )}

      {/* User Login & Registration Account Modal */}
      <UserAccountModal
        isOpen={isUserAccountModalOpen}
        onClose={() => setIsUserAccountModalOpen(false)}
        onAuthSuccess={(user) => {
          if (user.role === 'admin') {
            setIsAdminAuthenticated(true);
          }
        }}
        onNavigateToAdmin={() => handleNavigate('admin')}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectProduct={(p) => {
          handleSelectProduct(p);
          setSearchModalOpen(false);
        }}
      />

      {/* RFQ Quotation Cart Drawer */}
      <RequestCartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToQuote={() => {
          setIsCartDrawerOpen(false);
          setIsStepperModalOpen(true);
        }}
        onExploreMore={() => {
          setIsCartDrawerOpen(false);
          handleGoToProductShop('all');
        }}
      />

      {/* 4-Step Dynamic Quotation Stepper */}
      <QuotationRequestStepperModal
        isOpen={isStepperModalOpen}
        onClose={() => setIsStepperModalOpen(false)}
        cartItems={cartItems}
        onSuccess={handleSuccessfulRequestSubmission}
      />

      {/* Admin Login Modal */}
      <AdminGuardModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={() => {
          setAdminSessionStatus('checking');
          setIsAdminAuthenticated(true);
          setIsAdminAuthModalOpen(false);
          setActiveTab('admin');
          window.location.hash = '#admin';
        }}
      />
      {/* Full Page Translation Loader Overlay */}
      <TranslationLoader isOpen={isTranslating} targetLanguage={targetLanguage} />
    </div>
  );
}
