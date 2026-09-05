import React from 'react';
import CardSwap, { Card } from './CardSwap';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ProductItem, UPVC_PRODUCTS, ALUMINUM_PRODUCTS } from '../data/winhomeData';

interface SignatureShowcaseProps {
  onSelectProduct?: (product: ProductItem) => void;
  onSelectProductByName?: (name: string) => void;
  onOpenQuote?: (productName: string) => void;
  onOpenQuoteModal?: (productName?: string) => void;
  onGoToProducts?: (category?: string) => void;
}

export const SignatureShowcase: React.FC<SignatureShowcaseProps> = ({
  onSelectProduct,
  onSelectProductByName,
  onOpenQuote,
  onOpenQuoteModal,
  onGoToProducts
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

  const showcaseItems = React.useMemo(() => {
    const customImages = cmsMedia?.showcaseImages || {};
    return [
      {
        id: 'legend-80',
        title: 'Deceuninck Legend 80',
        shortName: 'Legend 80',
        category: 'Passive uPVC Window & Door',
        brand: 'Deceuninck Belgium',
        image: customImages['legend-80'] || '/assets/winhome/10.png',
        fallbackImage: '/assets/winhome/photo_2023-07-03_15-41-20-1280x820.jpg',
        badge: 'Passive House Standard',
        description: 'Flagship European passive-certified uPVC series engineered with 6 insulation chambers to withstand Erbil summer heat over 50°C.',
        specs: [
          { label: 'Profile Depth', val: '80 mm' },
          { label: 'Structure', val: '6 Chambers' },
          { label: 'Insulation', val: 'Uf 0.92 W/m²K' }
        ]
      },
      {
        id: 'lorenzo-70ls',
        title: 'Lorenzoline 70LS Monumental',
        shortName: 'Lorenzo 70LS',
        category: 'Thermal Lift & Slide Aluminum',
        brand: 'Lorenzoline Systems',
        image: customImages['lorenzo-70ls'] || '/assets/winhome/LIFT-SLIDE-70LS-Medium-300x300.jpeg',
        fallbackImage: '/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg',
        badge: 'Monumental Glazing',
        description: 'Architectural sliding system enabling panoramic floor-to-ceiling glass spans up to 3 meters with finger-touch glide.',
        specs: [
          { label: 'Leaf Depth', val: '70 mm' },
          { label: 'Max Load', val: '300 kg / Leaf' },
          { label: 'Thermal Break', val: 'Polyamide 24mm' }
        ]
      },
      {
        id: 'curtain-50f',
        title: 'Façade 50F Curtain Wall',
        shortName: 'Façade 50F',
        category: 'Commercial Facade System',
        brand: 'Architectural Aluminum',
        image: customImages['curtain-50f'] || '/assets/winhome/24-1.jpg',
        fallbackImage: '/assets/winhome/photo_2023-07-03_15-42-28-1120x716.jpg',
        badge: 'EN-13830 Certified',
        description: 'Structural mullion facade system fabricated for corporate towers, automobile showrooms, and luxury modern villas across Iraq.',
        specs: [
          { label: 'Sightline', val: '50 mm' },
          { label: 'Structure', val: 'Mullion Grid' },
          { label: 'Glass Specs', val: 'Structural Double' }
        ]
      },
      {
        id: 'hs76-sliding',
        title: 'Hebe-Schiebe HS76 System',
        shortName: 'HS76 Sliding',
        category: 'Heavy-Duty uPVC Sliding',
        brand: 'Deceuninck / Winsa',
        image: customImages['hs76-sliding'] || '/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg',
        fallbackImage: '/assets/winhome/2-1.png',
        badge: 'Class 4 Airtight',
        description: 'Heavyweight lift-and-slide engineering delivering airtight sealing against high-velocity dry desert winds and seasonal sandstorms.',
        specs: [
          { label: 'Frame Depth', val: '175 mm' },
          { label: 'Reinforcement', val: 'Steel Core' },
          { label: 'Wind Seal', val: 'Multi EPDM' }
        ]
      },
      {
        id: 'winsa-dorado-76',
        title: 'Winsa Dorado 76 Acoustic',
        shortName: 'Dorado 76',
        category: 'Class A Soundproof uPVC',
        brand: 'Winsa Windows & Doors',
        image: customImages['winsa-dorado-76'] || '/assets/winhome/2-1.png',
        fallbackImage: '/assets/winhome/photo_2023-07-03_15-41-20-1280x820.jpg',
        badge: 'Sound Proof 44 dB',
        description: 'Class A wall-thickness acoustic profile with multi-chamber interior baffling to isolate indoor spaces from heavy city traffic noise.',
        specs: [
          { label: 'Profile Depth', val: '76 mm' },
          { label: 'Acoustic Baffle', val: '5 Chambers' },
          { label: 'Noise Barrier', val: 'Rw = 44 dB' }
        ]
      }
    ];
  }, [cmsMedia]);

  const handleSelectProduct = (title: string, id: string) => {
    if (onSelectProduct) {
      const allProducts = [...UPVC_PRODUCTS, ...ALUMINUM_PRODUCTS];
      const found = allProducts.find(
        (p) => p.name.toLowerCase().includes(title.toLowerCase().slice(0, 10)) || p.id === id
      );
      if (found) {
        onSelectProduct(found);
        return;
      }
      const item = showcaseItems.find((s) => s.id === id || s.title === title);
      if (item) {
        onSelectProduct({
          id: item.id,
          name: item.title,
          category: item.category.toLowerCase().includes('aluminum') ? 'aluminum' : 'upvc',
          image: item.image,
          fallbackImage: item.fallbackImage,
          description: item.description,
          depth: item.specs[0]?.val || '',
          insulationValue: item.specs[2]?.val || '',
          features: [
            `${item.brand} certified profile extrusion`,
            `${item.specs[0]?.label}: ${item.specs[0]?.val}`,
            `${item.specs[1]?.label}: ${item.specs[1]?.val}`,
            `${item.specs[2]?.label}: ${item.specs[2]?.val}`,
            'Class S severe climate resistance for Erbil and Kurdistan Region'
          ]
        });
        return;
      }
    }
    if (onSelectProductByName) {
      onSelectProductByName(title);
    }
  };

  const handleOpenQuoteCall = (productTitle?: string) => {
    if (onOpenQuoteModal) {
      onOpenQuoteModal(productTitle);
    } else if (onOpenQuote) {
      onOpenQuote(productTitle || '');
    }
  };

  return (
    <section
      id="signature-systems"
      className="scroll-mt-24 pt-6 sm:pt-8 pb-4 sm:pb-12 border-b border-slate-200 relative overflow-hidden"
    >
      {/* Fixed background image layer for smooth parallax/fixed texture on scroll */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none"
        style={{ backgroundImage: "url('/assets/winhome/bg.jpeg')" }}
      />

      {/* Light translucent overlay so bg.jpeg texture is rich & clearly visible */}
      <div className="absolute inset-0 bg-white/25 backdrop-blur-[1px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 1. MOBILE/TABLET VIEW: React Bits ScrollStack (< lg) */}
        <div className="block lg:hidden">
          {/* Mobile Header */}
          <div className="max-w-3xl mb-6">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              5 Signature Architectural Systems <br className="hidden sm:inline" />
              <span className="text-sky-600">Engineered for Extreme Climates</span>
            </h2>

            <p className="text-xs sm:text-base text-slate-600 font-medium leading-relaxed mt-1.5">
              Explore our 5 top European fenestration profiles fabricated in our Erbil plant. From passive-certified uPVC with 6 thermal chambers to monumental lift & slide aluminum.
            </p>
          </div>

          <ScrollStack useWindowScroll={true} itemDistance={50} itemScale={0.03} itemStackDistance={18} stackPosition="15%">
            {showcaseItems.map((item) => (
              <ScrollStackItem key={item.id} itemClassName="bg-white/95 backdrop-blur-md border border-slate-200 p-5 rounded-3xl shadow-xl">
                <div className="space-y-3.5">
                  {/* Card Header Row */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-[10px] font-black text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-sky-100 shrink-0">
                        {item.brand}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 truncate">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-900 text-white px-2.5 py-0.5 rounded-full shrink-0">
                      {item.badge}
                    </span>
                  </div>

                  {/* Product Image Stage */}
                  <div className="relative h-40 w-full bg-slate-50/80 rounded-2xl p-3 flex items-center justify-center border border-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain drop-shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = item.fallbackImage;
                      }}
                    />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Clean 3-Column Specs Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50/90 p-2.5 rounded-2xl border border-slate-100">
                    {item.specs.map((spec, i) => (
                      <div key={i} className="text-center px-1">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider truncate">
                          {spec.label}
                        </span>
                        <span className="text-xs font-extrabold text-slate-800 block mt-0.5 truncate">
                          {spec.val}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <button
                      onClick={() => handleOpenQuoteCall(item.title)}
                      className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all text-center"
                    >
                      Estimate Cost
                    </button>
                    <button
                      onClick={() => handleSelectProduct(item.title, item.id)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-800 text-xs font-bold border border-slate-200 transition-all text-center flex items-center justify-center gap-1"
                    >
                      <span>Full Specs</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>

        {/* 2. DESKTOP / LAPTOP VIEW: Side-by-Side Unified Grid (>= lg) */}
        <div className="hidden lg:grid grid-cols-12 gap-8 lg:gap-12 items-start pt-1">
          {/* Left Column: Title Header + 5 Profile Bullets (Aligned to left edge) */}
          <div className="col-span-6 space-y-5">
            {/* Title Header */}
            <div>
              <h2 className="text-3xl xl:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                5 Signature Architectural Systems <br />
                <span className="text-sky-600">Engineered for Extreme Climates</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-2.5 max-w-xl">
                Explore our 5 top European fenestration profiles fabricated in our Erbil plant. From passive-certified uPVC with 6 thermal chambers to monumental lift & slide aluminum.
              </p>
            </div>

            {/* 5 Bullet Cards with comfortable gap */}
            <div className="space-y-3">
              {showcaseItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectProduct(item.title, item.id)}
                  className="w-full text-left py-3 px-4 rounded-2xl bg-white/80 backdrop-blur-md hover:bg-white transition-all border border-slate-200/80 hover:border-sky-400 shadow-xs hover:shadow-md flex items-center justify-between text-xs group cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-slate-900 block text-sm sm:text-base group-hover:text-sky-600 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-slate-500 text-[11px] font-medium mt-0.5 block">
                      {item.brand} • {item.category}
                    </span>
                  </div>

                  <span className="text-sky-600 font-bold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform shrink-0">
                    <span>{item.specs[0]?.val}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: 3D CardSwap Deck */}
          <div className="col-span-6 flex justify-end items-start pt-6 lg:pt-4 pl-4 lg:pl-8">
            <div className="relative w-full max-w-[400px] h-[460px] flex items-center justify-end">
              <CardSwap
                width={370}
                height={420}
                cardDistance={32}
                verticalDistance={26}
                delay={2200}
                pauseOnHover={true}
                skewAmount={4}
                easing="elastic"
              >
                {showcaseItems.map((item) => (
                  <Card
                    key={item.id}
                    className="p-5 flex flex-col justify-between bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden cursor-pointer group"
                    onClick={() => handleSelectProduct(item.title, item.id)}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5 mb-2.5">
                        <span className="text-[10px] font-black text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {item.brand}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {item.category}
                        </span>
                      </div>

                      <div className="relative h-44 w-full bg-slate-50 rounded-2xl overflow-hidden mb-3 p-2 flex items-center justify-center border border-slate-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = item.fallbackImage;
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </div>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-snug line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <div className="grid grid-cols-3 gap-1.5 text-center text-xs mb-3 bg-slate-50 p-2 rounded-xl">
                        {item.specs.map((spec, i) => (
                          <div key={i}>
                            <span className="text-[9px] text-slate-400 block font-semibold uppercase">{spec.label}</span>
                            <span className="font-extrabold text-slate-800 text-[11px] truncate block">{spec.val}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-sky-600 font-bold group-hover:translate-x-1 transition-transform">
                        <span>Click card to inspect system</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



