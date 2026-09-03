import React, { useState, useEffect, useRef } from 'react';
import CardSwap, { Card } from './CardSwap';
import { ArrowRight, Calculator, Sparkles, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { ProductItem, UPVC_PRODUCTS, ALUMINUM_PRODUCTS } from '../data/winhomeData';

interface SignatureShowcaseProps {
  onSelectProduct?: (product: ProductItem) => void;
  onSelectProductByName?: (name: string) => void;
  onOpenQuote: (productName: string) => void;
}

export const SignatureShowcase: React.FC<SignatureShowcaseProps> = ({
  onSelectProduct,
  onSelectProductByName,
  onOpenQuote
}) => {
  const [activeMobileIndex, setActiveMobileIndex] = useState<number>(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const showcaseItems = [
    {
      id: 'legend-80',
      title: 'Deceuninck Legend 80',
      shortName: 'Legend 80',
      category: 'Passive uPVC System',
      brand: 'Deceuninck Belgium',
      image: '/assets/winhome/10.png',
      fallbackImage: '/assets/winhome/photo_2023-07-03_15-41-20-1280x820.jpg',
      depth: '80 mm Depth',
      chambers: '6 Internal Chambers',
      insulation: 'Uf = 0.92 W/m²K',
      description: 'Flagship European passive-certified uPVC series engineered with 6 insulation chambers to withstand Erbil desert temperatures exceeding 50°C.',
      badge: 'Passive House Standard'
    },
    {
      id: 'lorenzo-70ls',
      title: 'Lorenzoline 70LS Monumental',
      shortName: 'Lorenzo 70LS',
      category: 'Thermal Lift & Slide',
      brand: 'Lorenzoline Aluminum',
      image: '/assets/winhome/LIFT-SLIDE-70LS-Medium-300x300.jpeg',
      fallbackImage: '/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg',
      depth: '70 mm Leaf Depth',
      chambers: '300 kg Leaf Capacity',
      insulation: 'Polyamide Thermal Break',
      description: 'Monumental architectural sliding system enabling panoramic floor-to-ceiling glass spans up to 3 meters with effortless finger-touch glide.',
      badge: 'Monumental Glazing'
    },
    {
      id: 'curtain-50f',
      title: 'Façade 50F Curtain Wall',
      shortName: 'Façade 50F',
      category: 'Commercial Facade System',
      brand: 'Architectural Aluminum',
      image: '/assets/winhome/24-1.jpg',
      fallbackImage: '/assets/winhome/photo_2023-07-03_15-42-28-1120x716.jpg',
      depth: '50 mm Sightline',
      chambers: 'Multi-Chamber Transom',
      insulation: 'Structural Double Glazing',
      description: 'Engineered structural mullion facade system fabricated for corporate towers, automobile showrooms, and luxury modern villas across Iraq.',
      badge: 'EN-13830 Certified'
    },
    {
      id: 'hs76-sliding',
      title: 'Hebe-Schiebe HS76 System',
      shortName: 'HS76 Sliding',
      category: 'Heavy-Duty Sliding',
      brand: 'Deceuninck / Winsa',
      image: '/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg',
      fallbackImage: '/assets/winhome/2-1.png',
      depth: '175 mm Frame Depth',
      chambers: 'Reinforced Steel Core',
      insulation: 'Multi-Point EPDM Seals',
      description: 'Heavyweight lift-and-slide engineering delivering airtight, dust-proof sealing against high-velocity dry desert winds and seasonal sandstorms.',
      badge: 'Class 4 Airtightness'
    },
    {
      id: 'winsa-dorado-76',
      title: 'Winsa Dorado 76 Acoustic',
      shortName: 'Dorado 76',
      category: 'Class A Acoustic uPVC',
      brand: 'Winsa Windows & Doors',
      image: '/assets/winhome/2-1.png',
      fallbackImage: '/assets/winhome/photo_2023-07-03_15-41-20-1280x820.jpg',
      depth: '76 mm Profile Depth',
      chambers: '5 Acoustic Chambers',
      insulation: 'Rw = 44 dB Sound Barrier',
      description: 'Class A wall-thickness acoustic profile with multi-chamber interior baffling, engineered to isolate indoor spaces from heavy city traffic noise.',
      badge: 'Ultra-Quiet Soundproofing'
    }
  ];

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
          depth: item.depth,
          insulationValue: item.insulation,
          features: [
            `${item.brand} certified profile extrusion`,
            item.depth,
            item.chambers,
            item.insulation,
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

  // Mobile auto-rotation timer (pauses if user interacts)
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setActiveMobileIndex((prev) => (prev + 1) % showcaseItems.length);
    }, 5000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [showcaseItems.length]);

  const activeMobileItem = showcaseItems[activeMobileIndex];

  return (
    <section id="signature-systems" className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Flagship Engineering Showcase</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            5 Signature Architectural Systems <br className="hidden sm:inline" />
            <span className="text-sky-600">Engineered for Extreme Climates</span>
          </h2>

          <p className="text-xs sm:text-base text-slate-600 leading-relaxed mt-2.5">
            Explore our 5 top European fenestration profiles fabricated in our Erbil plant. From passive-certified uPVC with 6 thermal chambers to monumental lift & slide aluminum.
          </p>
        </div>

        {/* 1. MOBILE/TABLET VIEW: Clean, Touch-Friendly Interactive Card Showcase (< lg) */}
        <div className="block lg:hidden">
          {/* System Selection Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none -mx-4 px-4">
            {showcaseItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  if (autoPlayRef.current) clearInterval(autoPlayRef.current);
                  setActiveMobileIndex(idx);
                }}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeMobileIndex === idx
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {item.shortName}
              </button>
            ))}
          </div>

          {/* Active Mobile Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            {/* Top Info Bar */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {activeMobileItem.brand}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {activeMobileItem.category}
                </span>
              </div>

              {/* Prev / Next controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
                    setActiveMobileIndex((prev) => (prev === 0 ? showcaseItems.length - 1 : prev - 1));
                  }}
                  className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
                  aria-label="Previous profile"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold text-slate-400 px-1">
                  0{activeMobileIndex + 1}/0{showcaseItems.length}
                </span>
                <button
                  onClick={() => {
                    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
                    setActiveMobileIndex((prev) => (prev + 1) % showcaseItems.length);
                  }}
                  className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
                  aria-label="Next profile"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Image */}
            <div className="relative h-44 w-full bg-slate-50 rounded-xl overflow-hidden p-3 flex items-center justify-center border border-slate-100">
              <img
                src={activeMobileItem.image}
                alt={activeMobileItem.title}
                className="max-h-full max-w-full object-contain transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = activeMobileItem.fallbackImage;
                }}
              />
              <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                {activeMobileItem.badge}
              </div>
            </div>

            {/* Text & Specs */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {activeMobileItem.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeMobileItem.description}
              </p>

              {/* Specs Pills */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-150">
                  <span className="text-[9px] text-slate-500 block uppercase font-medium">Depth</span>
                  <span className="text-xs font-bold text-slate-800">{activeMobileItem.depth}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-150">
                  <span className="text-[9px] text-slate-500 block uppercase font-medium">Structure</span>
                  <span className="text-xs font-bold text-slate-800">{activeMobileItem.chambers}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-150">
                  <span className="text-[9px] text-slate-500 block uppercase font-medium">Insulation</span>
                  <span className="text-xs font-bold text-sky-700">{activeMobileItem.insulation}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => onOpenQuote(activeMobileItem.title)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm transition-all"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Estimate Cost</span>
              </button>
              <button
                onClick={() => handleSelectProduct(activeMobileItem.title, activeMobileItem.id)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200"
              >
                <span>Full Specs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. DESKTOP / LAPTOP VIEW: Interactive 3D CardSwap Deck (>= lg) */}
        <div className="hidden lg:grid grid-cols-12 gap-10 items-center">
          {/* Left Column: List of profiles & quick inspection */}
          <div className="col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Interactive 3D Deck
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              Precision European Profiles for Villas & High-Rises
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Cards rotate in 3D space automatically. Hover over the deck to pause, or click any system to inspect complete engineering blueprints and insulation certificates.
            </p>

            <div className="space-y-2 pt-2">
              {showcaseItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectProduct(item.title, item.id)}
                  className="w-full text-left p-3 rounded-xl hover:bg-white transition-all border border-transparent hover:border-slate-200 flex items-center justify-between text-xs group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-sky-100 text-slate-600 group-hover:text-sky-700 font-bold flex items-center justify-center text-[11px] transition-colors">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-slate-800 block text-sm group-hover:text-sky-700 transition-colors">
                        {item.title}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {item.brand} • {item.category}
                      </span>
                    </div>
                  </div>

                  <span className="text-sky-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{item.depth}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>All 5 profiles in-stock and fabricated locally in Erbil factory</span>
            </div>
          </div>

          {/* Right Column: 3D CardSwap Deck */}
          <div className="col-span-6 flex justify-center items-center py-6">
            <div className="relative w-full max-w-[420px] h-[480px] flex items-center justify-center">
              <CardSwap
                width={380}
                height={430}
                cardDistance={48}
                verticalDistance={48}
                delay={4500}
                pauseOnHover={true}
                skewAmount={4}
                easing="elastic"
              >
                {showcaseItems.map((item) => (
                  <Card
                    key={item.id}
                    className="p-5 flex flex-col justify-between bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden cursor-pointer group"
                    onClick={() => handleSelectProduct(item.title, item.id)}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5 mb-2.5">
                        <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {item.brand}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {item.category}
                        </span>
                      </div>

                      <div className="relative h-44 w-full bg-slate-50 rounded-xl overflow-hidden mb-3 p-2 flex items-center justify-center border border-slate-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = item.fallbackImage;
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
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
                      <div className="grid grid-cols-3 gap-1.5 text-center text-xs mb-3">
                        <div className="bg-slate-50 py-1.5 px-1 rounded border border-slate-150">
                          <span className="text-[9px] text-slate-500 block">Depth</span>
                          <span className="font-bold text-slate-800 text-[11px]">{item.depth}</span>
                        </div>
                        <div className="bg-slate-50 py-1.5 px-1 rounded border border-slate-150">
                          <span className="text-[9px] text-slate-500 block">Structure</span>
                          <span className="font-bold text-slate-800 text-[11px]">{item.chambers}</span>
                        </div>
                        <div className="bg-slate-50 py-1.5 px-1 rounded border border-slate-150">
                          <span className="text-[9px] text-slate-500 block">Insulation</span>
                          <span className="font-bold text-sky-700 text-[11px]">{item.insulation}</span>
                        </div>
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
