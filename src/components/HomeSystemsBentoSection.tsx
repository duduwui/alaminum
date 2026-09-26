import React, { useState } from 'react';
import {
  Home,
  Building2,
  Hotel,
  ArrowRight,
  ShieldCheck,
  Eye,
  Plus,
  Check,
  Sliders,
  Sparkles,
  Layers,
  Thermometer,
  Volume2
} from 'lucide-react';
import { ProductItem, ALL_PRODUCTS } from '../data/winhomeData';
import { RequestItem } from '../types/requests';

interface HomeSystemsBentoSectionProps {
  onSelectProduct?: (product: ProductItem) => void;
  onGoToShop?: (category?: string) => void;
  onAddToCart?: (item: RequestItem) => void;
}

type TypologyType = 'villas' | 'apartments' | 'commercial';

interface TypologyConfig {
  id: TypologyType;
  label: string;
  subtitle: string;
  description: string;
  icon: any;
  featuredProductIds: string[];
}

const TYPOLOGIES: TypologyConfig[] = [
  {
    id: 'villas',
    label: 'Single-Family Villas & Mansions',
    subtitle: 'Luxury Panoramic Openings & High-Insulation Envelopes',
    description:
      'Engineered for high-end residential estates requiring monumental sliding glass walls, zero-barrier thresholds, custom pivot entrance doors, and bioclimatic outdoor living pergolas.',
    icon: Home,
    featuredProductIds: ['lorenzo-70ls', 'legend-80', 'lorenzo-58tt', 'winsa-dorado-76', 'stac-multipoint']
  },
  {
    id: 'apartments',
    label: 'Multi-Family Apartments & Towers',
    subtitle: 'Acoustic Soundproofing & Energy-Efficient Comfort',
    description:
      'Optimized for luxury urban high-rises and residential developments. High acoustic isolation (45dB), motorized rolling shutters for sun protection, and durable tilt-and-turn windows.',
    icon: Building2,
    featuredProductIds: ['winsa-dorado-76', 'legend-80', 'lorenzo-58tt', 'everest-max-60', 'comunello-hinges']
  },
  {
    id: 'commercial',
    label: 'Commercial, Hotels & Offices',
    subtitle: 'High-Span Curtain Walls & Structural Facades',
    description:
      'Engineered for corporate headquarters, boutique hotels, and shopping centers requiring certified wind-load resistance (Class C5), large glass facades, and heavy-traffic automatic entrances.',
    icon: Hotel,
    featuredProductIds: ['facade-50f', 'lorenzo-70ls', 'stac-multipoint', 'comunello-hinges']
  }
];

export const HomeSystemsBentoSection: React.FC<HomeSystemsBentoSectionProps> = ({
  onSelectProduct,
  onGoToShop,
  onAddToCart
}) => {
  const [activeTypology, setActiveTypology] = useState<TypologyType>('villas');
  const [addedItemIds, setAddedItemIds] = useState<{ [id: string]: boolean }>({});

  const currentTypology = TYPOLOGIES.find((t) => t.id === activeTypology) || TYPOLOGIES[0];

  // Get matching products for active typology
  const matchingProducts = React.useMemo(() => {
    const list: ProductItem[] = [];
    currentTypology.featuredProductIds.forEach((pid) => {
      const found = ALL_PRODUCTS.find((p) => p.id === pid);
      if (found) list.push(found);
    });

    // If less than 4, fill from all products
    if (list.length < 4) {
      ALL_PRODUCTS.forEach((p) => {
        if (!list.some((it) => it.id === p.id) && list.length < 6) {
          list.push(p);
        }
      });
    }
    return list;
  }, [currentTypology]);

  const handleQuickAdd = (product: ProductItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart({
        productId: product.id,
        productName: product.name,
        category: product.category,
        quantity: 1,
        systemType: product.material,
        profileSystem: product.modelNumber,
        unitPrice: product.pricing?.unitPrice || 0,
        estimatedTotal: product.pricing?.unitPrice || 0,
        image: product.image
      });

      setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
      }, 2000);
    }
  };

  return (
    <section id="typology" className="w-full py-16 sm:py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-red-700 text-xs font-black uppercase tracking-widest border border-slate-200 shadow-2xs mb-3">
              <Sliders className="w-3.5 h-3.5 text-red-600" />
              <span>Tailored Solutions by Building Typology</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Product Range for <span className="text-red-600">Every Architecture</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Select your building type to discover certified European aluminium and uPVC systems engineered specifically for structural, acoustic, and thermal demands.
            </p>
          </div>

          {/* View All Products Button */}
          <button
            onClick={() => onGoToShop && onGoToShop('all')}
            className="self-start md:self-end px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider border border-slate-200 transition-all flex items-center gap-2 shadow-2xs cursor-pointer shrink-0 hover:text-red-600"
          >
            <span>View Full Product Catalog</span>
            <ArrowRight className="w-4 h-4 text-red-600" />
          </button>
        </div>

        {/* Typology Selector Tabs (Alumil style) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-xs mb-8">
          {TYPOLOGIES.map((typ) => {
            const Icon = typ.icon;
            const isActive = activeTypology === typ.id;
            return (
              <button
                key={typ.id}
                onClick={() => setActiveTypology(typ.id)}
                className={`flex-1 min-w-[200px] py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{typ.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Typology Context Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-red-600">
                {currentTypology.subtitle}
              </div>
              <p className="text-sm text-slate-700 mt-1 max-w-3xl leading-relaxed">
                {currentTypology.description}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-semibold text-slate-500">
                Showing {matchingProducts.length} Recommended Systems
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {matchingProducts.map((product) => {
            const isAdded = addedItemIds[product.id];
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                onClick={() => onSelectProduct && onSelectProduct(product)}
              >
                {/* Product Image Container */}
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = './assets/doorhome/10.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Top Badge: Category & Material */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-red-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider border border-white/10">
                      {product.category}
                    </span>
                    <span className="px-2 py-1 rounded-md bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold uppercase tracking-wider">
                      {product.material}
                    </span>
                  </div>

                  {/* Bottom Image Spec Pills */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-semibold">
                    <span className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                      {product.modelNumber || 'Standard Series'}
                    </span>
                    <span className="text-red-300 font-bold">
                      {product.specs?.thermal || 'Uw ≤ 1.1 W/m²K'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-red-600 transition-colors leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Specs Key Matrix */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-[11px]">
                      <div className="bg-slate-50 p-2 rounded-lg text-slate-600">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Frame Depth</span>
                        <strong className="text-slate-900 font-semibold">{product.specs?.depth || '70 - 80 mm'}</strong>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg text-slate-600">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Acoustic Cut</span>
                        <strong className="text-slate-900 font-semibold">{product.specs?.acoustic || 'Up to 45 dB'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectProduct) onSelectProduct(product);
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>Specifications</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(product, e)}
                      className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                      }`}
                      title="Add system to RFQ quotation cart"
                    >
                      {isAdded ? (
                        <Check className="w-4 h-4 text-white animate-in zoom-in" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
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
