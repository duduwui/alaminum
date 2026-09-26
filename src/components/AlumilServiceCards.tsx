import React from 'react';
import { PhoneCall, Ruler, ShieldCheck, ArrowRight, MessageCircle } from 'lucide-react';
import { DOORHOME_CONTACT } from '../data/winhomeData';

interface AlumilServiceCardsProps {
  onOpenQuoteModal: () => void;
  onNavigate: (sectionId: string) => void;
}

export const AlumilServiceCards: React.FC<AlumilServiceCardsProps> = ({
  onOpenQuoteModal,
  onNavigate
}) => {
  const cards = [
    {
      id: 'consultation',
      title: 'Direct Engineering Consultation',
      description:
        'Speak directly with our senior facade engineers for custom window sizing, thermal calculations, and profile recommendations.',
      actionText: 'Call +964 750 444 0402',
      action: () => {
        const p = (DOORHOME_CONTACT.phone || DOORHOME_CONTACT.hotlineRaw || '+9647504440402').replace(/\s+/g, '');
        window.location.href = `tel:${p}`;
      },
      icon: PhoneCall,
      isExternal: true
    },
    {
      id: 'survey',
      title: 'Free On-Site Laser Survey',
      description:
        'Schedule our technical team for complimentary high-precision laser measurements at your villa or commercial site in Kurdistan.',
      actionText: 'Book Site Measurement',
      action: onOpenQuoteModal,
      icon: Ruler,
      isExternal: false
    },
    {
      id: 'installation',
      title: 'Certified Installation & Warranty',
      description:
        'Factory-trained master installers ensure airtight EPDM sealing, acoustic dampening, and 15-year guaranteed profile performance.',
      actionText: 'Discover Warranty Coverage',
      action: () => onNavigate('about'),
      icon: ShieldCheck,
      isExternal: false
    }
  ];

  return (
    <section className="w-full py-12 sm:py-16 bg-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={card.action}
                className="bg-gradient-to-br from-red-600 to-red-800 text-white rounded-2xl p-6 sm:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group cursor-pointer border border-red-500"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform backdrop-blur-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-black text-white mb-2 leading-tight">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-red-50 leading-relaxed font-medium">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5 group-hover:underline">
                    {card.actionText}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
