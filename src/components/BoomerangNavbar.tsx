import React from 'react';
import { BoomerangBrand } from './BoomerangLogo';

export const BoomerangNavbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-10 md:px-14 py-4 sm:py-5 bg-transparent">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Zone: Logo + Wordmark */}
        <a href="#" className="flex items-center group">
          <BoomerangBrand />
        </a>

        {/* Center Zone: Nav Links (desktop md:flex) */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#product"
            className="text-sm text-[#191919]/70 hover:text-[#191919] transition-colors duration-200"
          >
            Product
          </a>
          <a
            href="#solutions"
            className="text-sm text-[#191919]/70 hover:text-[#191919] transition-colors duration-200"
          >
            Solutions
          </a>
          <a
            href="#pricing"
            className="text-sm text-[#191919]/70 hover:text-[#191919] transition-colors duration-200"
          >
            Pricing
          </a>
          <a
            href="#company"
            className="text-sm text-[#191919]/70 hover:text-[#191919] transition-colors duration-200"
          >
            Company
          </a>
        </nav>

        {/* Right Zone: CTA Button */}
        <div>
          <button className="px-5 py-2.5 bg-[#191919] text-white text-sm font-medium rounded-lg hover:bg-[#191919]/90 transition-colors duration-200 cursor-pointer">
            Book A Demo
          </button>
        </div>
      </div>
    </header>
  );
};
