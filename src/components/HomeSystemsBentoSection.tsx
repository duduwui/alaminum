import React from 'react';
import { MagicBento, BentoCardData } from './MagicBento';
import { ArrowRight, Layers } from 'lucide-react';
import { ProductItem, ALL_PRODUCTS } from '../data/winhomeData';
import GlowButton from './GlowButton';

interface HomeSystemsBentoSectionProps {
  onSelectProduct?: (product: ProductItem) => void;
  onGoToShop?: (category?: string) => void;
  onViewAllProducts?: (category?: string) => void;
}

export const HomeSystemsBentoSection: React.FC<HomeSystemsBentoSectionProps> = ({
  onSelectProduct,
  onGoToShop,
  onViewAllProducts
}) => {
  const cmsMedia = React.useMemo(() => {
    const saved = localStorage.getItem('winhome_cms_homepage_media');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  }, []);

  const bentoItems: BentoCardData[] = React.useMemo(() => {
    const customBento = cmsMedia?.bentoImages || {};
    return [
      {
        id: 'legend-80',
        image: customBento['legend-80'] || '/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg',
        fallbackImage: '/assets/winhome/10.png',
        title: 'Deceuninck Legend 80',
        description: 'Passive House 6-Chamber uPVC profile engineered for 50°C summer heat',
        label: 'Passive uPVC',
        category: 'upvc'
      },
      {
        id: 'lorenzo-70ls',
        image: customBento['lorenzo-70ls'] || '/assets/winhome/photo_2023-07-03_15-41-20-1280x820.jpg',
        fallbackImage: '/assets/winhome/LIFT-SLIDE-70LS-Medium-300x300.jpeg',
        title: 'Lorenzoline 70LS Monumental',
        description: 'Heavyweight thermal-break sliding spans up to 3 meters with finger-touch glide',
        label: 'Monumental Sliding',
        category: 'aluminum'
      },
      {
        id: 'facade-50f',
        image: customBento['facade-50f'] || '/assets/winhome/photo_2023-07-03_15-42-28-1120x716.jpg',
        fallbackImage: '/assets/winhome/24-1.jpg',
        title: 'Commercial 50F Curtain Wall',
        description: 'Structural glass mullion facade fabricated for towers and car showrooms',
        label: 'Curtain Wall Facade',
        category: 'aluminum'
      },
      {
        id: 'winsa-dorado',
        image: customBento['winsa-dorado'] || '/assets/winhome/photo_2023-07-03_15-50-46-1104x700.jpg',
        fallbackImage: '/assets/winhome/2-1.png',
        title: 'Winsa Dorado 76 Acoustic',
        description: 'Class A acoustic insulation isolating spaces from heavy city noise',
        label: 'Acoustic Soundproof',
        category: 'upvc'
      },
      {
        id: 'hardware-master',
        image: customBento['hardware-master'] || '/assets/winhome/2026-04-14-21.53.50-1000x650.jpg',
        fallbackImage: '/assets/winhome/3-1.png',
        title: 'Master Italy & STAC Hardware',
        description: 'Concealed European hinges, perimeter multipoint locks and automation',
        label: 'Italian Hardware',
        category: 'accessories'
      },
      {
        id: 'villa-panoramic',
        image: customBento['villa-panoramic'] || '/assets/winhome/photo_2023-07-03_15-49-24-760x485.jpg',
        fallbackImage: '/assets/winhome/1-2.jpg',
        title: 'Low-E Solar Glazing Systems',
        description: 'Double & triple glazed argon gas units engineered in our Erbil facility',
        label: 'Solar Control Glass',
        category: 'upvc'
      }
    ];
  }, [cmsMedia]);

  const handleBrowseAll = () => {
    if (onGoToShop) {
      onGoToShop('all');
    } else if (onViewAllProducts) {
      onViewAllProducts('all');
    }
  };

  const handleCardClick = (card: BentoCardData) => {
    const found = ALL_PRODUCTS.find(
      (p) => p.id === card.id || p.name.toLowerCase().includes(card.title.toLowerCase().slice(0, 10))
    );

    const productToOpen: ProductItem = found || {
      id: card.id || 'bento-product',
      name: card.title,
      category: (card.category as 'upvc' | 'aluminum' | 'accessories') || 'upvc',
      image: card.image || '',
      fallbackImage: card.fallbackImage || '',
      description: card.description,
      depth: 'European Standard',
      insulationValue: 'Severe Climate Class S',
      features: [
        `${card.label} profile system`,
        'Engineered for extreme summer heat up to 50°C',
        'Fabricated in Erbil automated plant'
      ]
    };

    if (onSelectProduct) {
      onSelectProduct(productToOpen);
    }
    if (onGoToShop) {
      onGoToShop(card.category || 'all');
    } else if (onViewAllProducts) {
      onViewAllProducts(card.category || 'all');
    }
  };

  return (
    <section id="featured-systems" className="py-14 sm:py-20 bg-[#1B4EF5] text-white relative overflow-hidden">
      {/* Background subtle mesh glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12 border-b border-white/20 pb-6 sm:pb-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Featured European Profiles <br className="hidden sm:inline" />
              <span className="text-sky-200">Fabricated in Erbil, Kurdistan</span>
            </h2>

            <p className="text-sm sm:text-base text-blue-100/90 font-medium leading-relaxed mt-2.5">
              Explore our premier architectural profile systems engineered for maximum thermal insulation, acoustic comfort, and structural elegance. Select any featured profile below or view our full product catalog.
            </p>
          </div>

          <div className="shrink-0">
            <GlowButton
              onClick={handleBrowseAll}
              variant="outline"
              isDarkTheme={true}
              size="md"
            >
              <Layers className="w-4 h-4 text-white" />
              <span>See All Systems (30+)</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </GlowButton>
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
            glowColor="255, 255, 255"
            onCardClick={handleCardClick}
          />
        </div>
      </div>
    </section>
  );
};

export default HomeSystemsBentoSection;
