import React from 'react';
import { WINHOME_CONTACT } from '../data/winhomeData';
import { Phone, Mail, MapPin, Clock, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenQuote: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenQuote }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 relative">
      {/* Top CTA Band */}
      <div className="bg-sky-600 text-white py-10 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Ready to Upgrade Your Building with European Systems?
            </h3>
            <p className="text-sky-100 text-xs sm:text-sm mt-1">
              Visit our Erbil showroom or consult our engineering desk for architectural drawings and cost estimations.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenQuote}
              className="px-6 py-3 rounded-lg bg-slate-950 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Open Cost Estimator
            </button>
            <a
              href={`tel:${WINHOME_CONTACT.hotlineRaw}`}
              className="px-6 py-3 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Call {WINHOME_CONTACT.hotline}
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Brand & Parent Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3 bg-white p-2 rounded-lg inline-block w-fit">
              <img
                src={WINHOME_CONTACT.logo}
                alt="Winhome Company"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = WINHOME_CONTACT.logoFallback;
                }}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              <strong className="text-white font-semibold">Winhome Company</strong> is the authorized regional partner for Deceuninck, Winsa, Lorenzoline, and Master Italy across the Kurdistan Region and Iraq. Certified Class S severe climate fenestration.
            </p>
            <div className="pt-2 text-[11px] text-slate-500">
              A Subsidiary of <strong className="text-slate-300">Nafza Almanzl Holding Group</strong>
            </div>
          </div>

          {/* Col 2: Navigation Links matching user's image */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="text-sky-400 font-semibold hover:text-sky-300 transition-colors"
                >
                  All Products Shop (30+)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('aluminum')}
                  className="hover:text-white transition-colors"
                >
                  Aluminum Systems
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('upvc')}
                  className="hover:text-white transition-colors"
                >
                  uPVC Profiles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('accessories')}
                  className="hover:text-white transition-colors"
                >
                  Accessories & Hardware
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-white transition-colors"
                >
                  Project Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('brochures')}
                  className="hover:text-white transition-colors"
                >
                  Technical Brochures
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact & Branches
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Systems */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Engineered Profiles
            </h4>
            <ul className="space-y-2 text-xs">
              <li>Deceuninck Legend 80mm Passive (6-Chamber)</li>
              <li>Deceuninck Legend Art 70mm (5-Chamber)</li>
              <li>Lorenzoline 70LS Monumental Lift & Slide</li>
              <li>Lorenzoline Opening 60T Thermal Break</li>
              <li>Façade 50F Commercial Curtain Wall</li>
              <li>Master Italy Empire Perimeter Hardware</li>
            </ul>
          </div>

          {/* Col 4: Erbil Headquarters Contacts */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Erbil Headquarters
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="text-slate-400">{WINHOME_CONTACT.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`tel:${WINHOME_CONTACT.hotlineRaw}`} className="text-slate-300 hover:text-white font-semibold">
                  {WINHOME_CONTACT.hotline}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-slate-300">{WINHOME_CONTACT.emails[0]}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="text-slate-400">{WINHOME_CONTACT.workHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-footer Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Winhome Company for General Trading & Industry Ltd. All Rights Reserved. Erbil, Kurdistan Region, Iraq.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
