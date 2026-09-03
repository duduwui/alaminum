import React from 'react';
import { MagicBento, BentoCardData } from './MagicBento';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';

interface HomeSystemsBentoSectionProps {
  onViewAllProducts: (category?: string) => void;
}

export const HomeSystemsBentoSection: React.FC<HomeSystemsBentoSectionProps> = ({
  onViewAllProducts
}) => {
  const bentoItems: BentoCardData[] = [
    {
      id: 'legend-80',
      image: '/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg',
      fallbackImage: '/assets/winhome/10.png',
      title: 'Deceuninck Legend 80',
      description: 'Passive House 6-Chamber uPVC profile engineered for 50°C summer heat',
      label: 'Passive uPVC',
      category: 'upvc'
    },
    {
      id: 'lorenzo-70ls',
      image: '/assets/winhome/photo_2023-07-03_15-41-20-1280x820.jpg',
      fallbackImage: '/assets/winhome/LIFT-SLIDE-70LS-Medium-300x300.jpeg',
      title: 'Lorenzoline 70LS Monumental',
      description: 'Heavyweight thermal-break sliding spans up to 3 meters with finger-touch glide',
      label: 'Monumental Sliding',
      category: 'aluminum'
    },
    {
      id: 'facade-50f',
      image: '/assets/winhome/photo_2023-07-03_15-42-28-1120x716.jpg',
      fallbackImage: '/assets/winhome/24-1.jpg',
      title: 'Commercial 50F Curtain Wall',
      description: 'Structural glass mullion facade fabricated for towers and car showrooms',
      label: 'Curtain Wall Facade',
      category: 'aluminum'
    },
    {
      id: 'winsa-dorado',
      image: '/assets/winhome/photo_2023-07-03_15-50-46-1104x700.jpg',
      fallbackImage: '/assets/winhome/2-1.png',
      title: 'Winsa Dorado 76 Acoustic',
      description: 'Class A acoustic insulation isolating spaces from heavy city noise',
      label: 'Acoustic Soundproof',
      category: 'upvc'
    },
    {
      id: 'hardware-master',
      image: '/assets/winhome/2026-04-14-21.53.50-1000x650.jpg',
      fallbackImage: '/assets/winhome/3-1.png',
      title: 'Master Italy & STAC Hardware',
      description: 'Concealed European hinges, perimeter multipoint locks and automation',
      label: 'Italian Hardware',
      category: 'accessories'
    },
    {
      id: 'villa-panoramic',
      image: '/assets/winhome/photo_2023-07-03_15-49-24-760x485.jpg',
      fallbackImage: '/assets/winhome/1-2.jpg',
      title: 'Low-E Solar Glazing Systems',
      description: 'Double & triple glazed argon gas units engineered in our Erbil facility',
      label: 'Solar Control Glass',
      category: 'upvc'
    }
  ];

  const handleCardClick = (card: BentoCardData) => {
    onViewAllProducts(card.category);
  };

  return (
    <section id="featured-systems" className="py-14 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background subtle mesh glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12 border-b border-slate-800/80 pb-6 sm:pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Architectural Systems Showcase</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Featured European Profiles <br className="hidden sm:inline" />
              <span className="text-sky-400">Fabricated in Erbil, Kurdistan</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mt-2.5">
              Explore example architectural systems with interactive spotlights and 3D hover physics. Click any system preview or use the button to explore our complete shop catalog.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => onViewAllProducts()}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/30 hover:shadow-sky-500/40 transition-all group"
            >
              <Layers className="w-4 h-4" />
              <span>See All Systems (30+)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* MagicBento Interactive Component */}
        <div className="w-full">
          <MagicBento
            items={bentoItems}
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={280}
            particleCount={10}
            glowColor="2, 132, 199"
            onCardClick={handleCardClick}
          />
        </div>

        {/* Bottom Helper Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Click any preview above to browse in the dedicated Products Shop</span>
          </div>

          <button
            onClick={() => onViewAllProducts()}
            className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Open E-Commerce Catalog with live search & filters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeSystemsBentoSection;
