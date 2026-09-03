import React, { useState, useEffect } from 'react';
import { WINHOME_CONTACT } from '../data/winhomeData';
import { ArrowRight, Phone, Calculator, ShieldCheck } from 'lucide-react';
import ScrollExpand from './ScrollExpand';

interface HeroSectionProps {
  onExploreProducts: () => void;
  onOpenQuoteModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProducts,
  onOpenQuoteModal
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="home" className="relative w-full bg-slate-950">
      <ScrollExpand
        src="/assets/winhome/03-2.jpg"
        alt="Winhome European Architectural uPVC and Aluminum Systems in Erbil, Iraq"
        title="WINHOME"
        scrollHint="Scroll to expand"
        startWidth={isMobile ? 90 : 48}
        startHeight={isMobile ? 65 : 56}
        startRadius={isMobile ? 16 : 22}
        endRadius={0}
        mediaZoom={1.2}
        scrollDistance={isMobile ? 0.75 : 1.0}
        holdDistance={isMobile ? 0.35 : 0.45}
        smoothing={0.08}
        overlayScrim={0.6}
        useWindowScroll={true}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-white space-y-3 sm:space-y-5">
          {/* Main Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            European Architectural <br className="hidden sm:inline" />
            <span className="text-sky-400">uPVC & Aluminum</span> Systems
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-base lg:text-lg text-slate-200 font-normal leading-relaxed max-w-xl mx-auto line-clamp-2 sm:line-clamp-none">
            High-precision CNC fabrication and certified distribution of Deceuninck, Winsa, Lorenzoline & Master Italy fenestration in Erbil, Iraq.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
            <button
              id="hero-explore-btn"
              onClick={onExploreProducts}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-sky-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Explore Systems</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-quote-btn"
              onClick={onOpenQuoteModal}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-lg bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <Calculator className="w-4 h-4 text-sky-600" />
              <span>Cost Calculator</span>
            </button>

            <a
              id="hero-call-btn"
              href={`tel:${WINHOME_CONTACT.hotlineRaw}`}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/20 transition-all"
            >
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
              <span>{WINHOME_CONTACT.hotline}</span>
            </a>
          </div>
        </div>
      </ScrollExpand>
    </section>
  );
};
