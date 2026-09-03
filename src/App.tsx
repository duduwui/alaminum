import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PartnerLogos } from './components/PartnerLogos';
import { SignatureShowcase } from './components/SignatureShowcase';
import { AboutSection } from './components/AboutSection';
import { AluminumSection } from './components/AluminumSection';
import { UpvcSection } from './components/UpvcSection';
import { AccessoriesSection } from './components/AccessoriesSection';
import { GallerySection } from './components/GallerySection';
import { BrochuresSection } from './components/BrochuresSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { QuoteCalculatorModal } from './components/QuoteCalculatorModal';
import { SearchModal } from './components/SearchModal';
import { ProductItem, WINHOME_CONTACT } from './data/winhomeData';
import { MessageSquare, Calculator } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [initialQuoteProduct, setInitialQuoteProduct] = useState<string>('');
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  const handleOpenQuoteWithProduct = (productName: string) => {
    setInitialQuoteProduct(productName);
    setQuoteModalOpen(true);
  };

  const handleOpenGeneralQuote = () => {
    setInitialQuoteProduct('');
    setQuoteModalOpen(true);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappDirectUrl = `https://wa.me/${WINHOME_CONTACT.hotlineRaw.replace('+', '')}?text=${encodeURIComponent(
    'Hello Winhome Company, I would like to consult with an engineer regarding your uPVC & Aluminum systems.'
  )}`;

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-sky-600 selection:text-white flex flex-col font-sans relative overflow-x-clip">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuoteModal={handleOpenGeneralQuote}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1 w-full relative">
        {/* 1. Hero Section with parallax reveal & full image visibility before scroll */}
        <HeroSection
          onExploreProducts={() => handleNavigate('upvc')}
          onOpenQuoteModal={handleOpenGeneralQuote}
        />

        {/* 2. Partner Brand Carousel */}
        <PartnerLogos />

        {/* 3. Signature Systems Showcase using CardSwap React Bits Component */}
        <SignatureShowcase
          onSelectProduct={(p) => setSelectedProduct(p)}
          onOpenQuote={handleOpenQuoteWithProduct}
        />

        {/* 4. About Winhome & Nafza Almanzl Holding */}
        <AboutSection />

        {/* 5. Architectural Aluminum Section with Blue Banner matching reference image */}
        <AluminumSection
          onSelectProduct={(p) => setSelectedProduct(p)}
          onOpenQuote={handleOpenQuoteWithProduct}
        />

        {/* 6. uPVC Systems Section with Blue Banner matching reference image */}
        <UpvcSection
          onSelectProduct={(p) => setSelectedProduct(p)}
          onOpenQuote={handleOpenQuoteWithProduct}
        />

        {/* 7. Accessories & Hardware Lines with Blue Banner matching reference image */}
        <AccessoriesSection
          onSelectProduct={(p) => setSelectedProduct(p)}
          onOpenQuote={handleOpenQuoteWithProduct}
        />

        {/* 8. Project Gallery (Installed Villas & Commercial Towers) */}
        <GallerySection />

        {/* 9. Technical Catalogues & Brochures */}
        <BrochuresSection onOpenQuote={handleOpenQuoteWithProduct} />

        {/* 10. Contact & Branch Details */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenQuote={handleOpenGeneralQuote}
      />

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

      {/* Floating Action Buttons: Cost Estimator & WhatsApp */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <button
          id="fab-cost-estimator-btn"
          onClick={handleOpenGeneralQuote}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-slate-800 hover:text-sky-700 text-xs font-bold shadow-lg transition-all border border-slate-200 hover:border-sky-300 hover:shadow-xl transform hover:-translate-y-0.5"
          title="Open Cost Estimator"
        >
          <Calculator className="w-4 h-4 text-sky-600" />
          <span>Cost Estimator</span>
        </button>

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
