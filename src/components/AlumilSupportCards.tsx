import React from 'react';
import { MapPin, Sliders, FileDown, ArrowRight, ShieldCheck, PhoneCall } from 'lucide-react';

interface AlumilSupportCardsProps {
  onNavigate: (sectionId: string) => void;
  onOpenQuoteModal: () => void;
}

export const AlumilSupportCards: React.FC<AlumilSupportCardsProps> = ({
  onNavigate,
  onOpenQuoteModal
}) => {
  const cards = [
    {
      id: 'showroom',
      tag: 'DIRECT ACCESS',
      title: 'Erbil Showroom & Factory',
      description:
        'Experience 1:1 scale working mockups, minimalist sliding systems, and European hardware demonstrations at our Erbil facility.',
      linkText: 'Visit Showroom & Map',
      action: () => onNavigate('contact'),
      icon: MapPin,
      bgColor: 'bg-slate-900',
      accentColor: 'text-red-400'
    },
    {
      id: 'advisor',
      tag: 'SYSTEM SELECTOR',
      title: 'Architectural System Advisor',
      description:
        'Compare thermal ratings (Uw), acoustic soundproofing (45dB), and profile frame depths across luxury villas and commercial high-rises.',
      linkText: 'Explore Typology Guide',
      action: () => onNavigate('typology'),
      icon: Sliders,
      bgColor: 'bg-[#002B49]',
      accentColor: 'text-red-400'
    },
    {
      id: 'catalogs',
      tag: 'CONSULTATION',
      title: 'Architectural Specs & BIM/CAD',
      description:
        'Request complete engineering specs, profile cross-sections, STAC/Comunello hardware diagrams, and certified laboratory test reports from our engineers.',
      linkText: 'Contact Technical Desk',
      action: () => onNavigate('contact'),
      icon: FileDown,
      bgColor: 'bg-slate-850',
      accentColor: 'text-red-400'
    }
  ];

  return (
    <section className="relative z-20 -mt-8 sm:-mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-100/80 hover:shadow-2xl hover:border-slate-200 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              onClick={card.action}
            >
              <div>
                {/* Top Row: Icon & Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-red-600 transition-colors">
                    {card.tag}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-lg font-black text-slate-900 group-hover:text-red-600 transition-colors mb-2">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Bottom Action Link */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 group-hover:text-red-600 transition-colors flex items-center gap-1.5">
                  {card.linkText}
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
