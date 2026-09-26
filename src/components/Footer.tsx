import React from 'react';
import { DOORHOME_CONTACT } from '../data/winhomeData';
import {
  Phone,
  Mail,
  Clock,
  ArrowUp,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenQuote: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenQuote }) => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#071324] text-slate-400 text-xs border-t border-slate-800 relative">
      {/* Main Mega Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Brand & Regional Holding (5 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={DOORHOME_CONTACT.logo}
                alt="Doorhome Fenestration Systems"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DOORHOME_CONTACT.logoFallback;
                }}
                className="h-12 w-auto object-contain brightness-110"
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              <strong className="text-white font-semibold">Doorhome Company</strong>, part of the <strong className="text-slate-300">Nafza Al-Manzl Holding Group</strong>, is Kurdistan’s premier architectural engineering and fabrication specialist for certified European aluminium and uPVC fenestration systems.
            </p>

            <div className="pt-2 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Severe Climate Class S Formulation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>German ift Rosenheim & CE Certified</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-3 flex items-center gap-3">
              <a
                href="https://facebook.com/profile.php?id=61590704835636"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-9 h-9 rounded-xl bg-slate-800 hover:bg-[#1877F2] border border-slate-700 hover:border-[#1877F2] flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-[#1877F2]/30"
                title="Doorhome on Facebook"
              >
                <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <div className="text-[11px]">
                <span className="text-slate-400 font-semibold block">Follow us on Facebook</span>
                <span className="text-slate-600">Doorhome Company</span>
              </div>
            </div>
          </div>

          {/* Col 2: Product Systems (2.5 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Architectural Systems
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('aluminum')}
                  className="hover:text-red-400 transition-colors"
                >
                  Thermal Aluminium (Lorenzo 70LS & 58TT)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('upvc')}
                  className="hover:text-red-400 transition-colors"
                >
                  6-Chamber uPVC (Legend 80 & Everest)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-red-400 transition-colors"
                >
                  Curtain Wall Facade 50F High-Span
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('accessories')}
                  className="hover:text-red-400 transition-colors"
                >
                  STAC & Comunello Italian Hardware
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('typology')}
                  className="hover:text-red-300 transition-colors text-red-400 font-semibold"
                >
                  Solutions by Building Typology →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Technical & Case Studies (2.5 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-red-400 transition-colors"
                >
                  Consultations & Inquiries
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-red-400 transition-colors"
                >
                  Reference Projects Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-red-400 transition-colors"
                >
                  Why Doorhome Engineering
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenQuote}
                  className="hover:text-red-300 transition-colors text-red-400 font-semibold"
                >
                  Request Cost Estimate →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Contact
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <a
                  href={`tel:${(DOORHOME_CONTACT.phone || DOORHOME_CONTACT.hotlineRaw || '+9647504440402').replace(/\s+/g, '')}`}
                  className="hover:text-red-400 transition-colors"
                >
                  {DOORHOME_CONTACT.phone || DOORHOME_CONTACT.hotline || '+964 750 444 0402'}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-red-400 shrink-0" />
                <a
                  href={`mailto:${DOORHOME_CONTACT.email || 'info@doorhome.co'}`}
                  className="hover:text-red-400 transition-colors"
                >
                  {DOORHOME_CONTACT.email || 'info@doorhome.co'}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Sat - Thu: 8:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Legal, Admin & Back to Top Strip */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Doorhome Company (Nafza Al-Manzl Holding). All rights reserved.
          </div>

          <div className="flex items-center gap-5">
            <a
              href="https://facebook.com/profile.php?id=61590704835636"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 text-slate-500 hover:text-[#1877F2] transition-colors font-semibold"
              title="Doorhome on Facebook"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </a>

            <button
              onClick={scrollToTop}
              className="hover:text-white transition-colors flex items-center gap-1.5 font-bold"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
