import React, { useState } from 'react';
import { ArrowRight, Eye, Plus, Check } from 'lucide-react';
import { ProductItem, ALL_PRODUCTS } from '../data/winhomeData';
import { RequestItem } from '../types/requests';

interface AlumilProductRangeProps {
  onSelectProduct: (product: ProductItem) => void;
  onAddToCart?: (item: RequestItem) => void;
  onGoToShop?: (category: string) => void;
}

type CategoryTab = 'homes' | 'apartments' | 'hotels';

export const AlumilProductRange: React.FC<AlumilProductRangeProps> = ({
  onSelectProduct,
  onAddToCart,
  onGoToShop
}) => {
  const [activeTab, setActiveTab] = useState<CategoryTab>('homes');
  const [addedIds, setAddedIds] = useState<{ [id: string]: boolean }>({});

  const categories = {
    homes: {
      title: 'For Single-Family Homes',
      summary:
        'Shape your single-family home (detached or semi-detached) based on your inspiration and select among advanced architectural systems by Doorhome. Aesthetically upgrade your space, enhance natural lighting, ensure thermal comfort and energy savings, and shield your home in terms of security.',
      items: [
        {
          id: 'lorenzo-70ls',
          name: 'Windows & Doors (Lorenzo 70LS)',
          category: 'Windows & Doors',
          image: './assets/showcase/showcase_lorenzo70ls_1789926091155.jpg',
          fallback: './assets/doorhome/03-2.jpg'
        },
        {
          id: 'legend-80',
          name: 'Entrance Doors (Thermal Pivot)',
          category: 'Entrance Doors',
          image: './assets/showcase/showcase_legend80_1789926007847.jpg',
          fallback: './assets/doorhome/4-2.jpg'
        },
        {
          id: 'fences',
          name: 'Fences & Architectural Railings',
          category: 'Fences',
          image: './assets/doorhome/signature-bg.jpg',
          fallback: './assets/doorhome/20-2.jpg'
        },
        {
          id: 'pergolas',
          name: 'Bioclimatic Pergolas',
          category: 'Pergolas',
          image: './assets/doorhome/hero-bg.png',
          fallback: './assets/doorhome/1-2.jpg'
        }
      ]
    },
    apartments: {
      title: 'For Apartments',
      summary:
        'Doorhome’s wide product range can meet the requirements of an apartment. Whether you are looking for high performance or you are focusing on functionality, you will undoubtedly find a system that covers your needs. At the same time, the variety of typologies offers you flexibility, regardless of the size of your apartment.',
      items: [
        {
          id: 'winsa-dorado-76',
          name: 'Acoustic Windows & Doors (Dorado 76)',
          category: 'Windows & Doors',
          image: './assets/showcase/showcase_dorado76_1789926204321.jpg',
          fallback: './assets/doorhome/2-1.png'
        },
        {
          id: 'shutters',
          name: 'Rolling Shutters & Insect Screens',
          category: 'Shutters',
          image: './assets/doorhome/22-1.jpg',
          fallback: './assets/doorhome/6-2.jpg'
        },
        {
          id: 'railings',
          name: 'Balcony Glass Railings',
          category: 'Railings',
          image: './assets/doorhome/23-1.jpg',
          fallback: './assets/doorhome/17-2.jpg'
        },
        {
          id: 'legend-80',
          name: 'Acoustic Entrance Doors',
          category: 'Entrance Doors',
          image: './assets/showcase/showcase_legend80_1789926007847.jpg',
          fallback: './assets/doorhome/4-2.jpg'
        }
      ]
    },
    hotels: {
      title: 'For Hotels & Commercial',
      summary:
        'The creation of a hotel or commercial facility is a demanding and complex task. At Doorhome, we have substantial experience with high-traffic projects and provide complete turnkey solutions. From curtain walls and entrance doors to frames, pergolas, and fencing systems.',
      items: [
        {
          id: 'facade-50f',
          name: 'Curtain Wall Facade 50F',
          category: 'Curtain Walls',
          image: './assets/showcase/showcase_curtain50f_1789926115841.jpg',
          fallback: './assets/doorhome/3-2.jpg'
        },
        {
          id: 'lorenzo-70ls',
          name: 'Monumental Sliding Spans',
          category: 'Windows & Doors',
          image: './assets/showcase/showcase_lorenzo70ls_1789926091155.jpg',
          fallback: './assets/doorhome/03-2.jpg'
        },
        {
          id: 'pergolas',
          name: 'Hotel Patio Pergolas',
          category: 'Pergolas',
          image: './assets/doorhome/signature-bg.jpg',
          fallback: './assets/doorhome/hero-bg.png'
        },
        {
          id: 'atriums',
          name: 'Skylight Atriums & Glass Roofs',
          category: 'Atriums',
          image: './assets/doorhome/24-1.jpg',
          fallback: './assets/doorhome/1-2.jpg'
        }
      ]
    }
  };

  const currentCategory = categories[activeTab];

  const handleQuickAdd = (itemId: string, name: string, image: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      const found = ALL_PRODUCTS.find((p) => p.id === itemId) || ALL_PRODUCTS[0];
      onAddToCart({
        productId: found.id,
        productName: name,
        category: found.category,
        quantity: 1,
        systemType: found.material,
        profileSystem: found.modelNumber,
        unitPrice: found.pricing?.unitPrice || 150,
        estimatedTotal: found.pricing?.unitPrice || 150,
        image
      });

      setAddedIds((prev) => ({ ...prev, [itemId]: true }));
      setTimeout(() => {
        setAddedIds((prev) => ({ ...prev, [itemId]: false }));
      }, 2000);
    }
  };

  return (
    <section id="typology" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Subtitle Block */}
        <div className="max-w-3xl mb-10">
          <h4 className="text-xs font-black tracking-widest uppercase text-slate-400 mb-2">
            Product Range
          </h4>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#3E4346] tracking-tight">
            Certified & advanced products for every type of building
          </h2>
        </div>

        {/* Top Category Select Tabs (Alumil style) */}
        <div className="flex border-b border-slate-200 gap-6 sm:gap-10 mb-8 overflow-x-auto">
          {(['homes', 'apartments', 'hotels'] as CategoryTab[]).map((tabKey) => {
            const cat = categories[tabKey];
            const isActive = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`pb-4 text-sm sm:text-base font-bold whitespace-nowrap transition-all relative cursor-pointer ${
                  isActive
                    ? 'text-red-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-red-600'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {cat.title}
              </button>
            );
          })}
        </div>

        {/* Category Summary Paragraph */}
        <div className="max-w-4xl text-xs sm:text-sm text-slate-600 leading-relaxed mb-10">
          {currentCategory.summary}
        </div>

        {/* Product Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentCategory.items.map((item, idx) => {
            const isAdded = addedIds[item.id];
            return (
              <div
                key={idx}
                className="group cursor-pointer flex flex-col justify-between bg-slate-50 rounded-xl overflow-hidden border border-slate-200/80 hover:shadow-xl transition-all duration-300"
                onClick={() => {
                  const found = ALL_PRODUCTS.find((p) => p.id === item.id) || ALL_PRODUCTS[0];
                  onSelectProduct(found);
                }}
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-200 relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = item.fallback;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-[#3E4346] group-hover:text-red-600 transition-colors mt-1">
                      {item.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#3E4346] group-hover:text-red-600 transition-colors flex items-center gap-1">
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(item.id, item.name, item.image, e)}
                      className={`p-2 rounded-lg transition-colors ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                      }`}
                      title="Add to quotation cart"
                    >
                      {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
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
