import React, { useState, useMemo } from 'react';
import {
  ProductItem,
  ALL_PRODUCTS,
  UPVC_PRODUCTS,
  ALUMINUM_PRODUCTS,
  ACCESSORIES_LINES,
  WINHOME_CONTACT
} from '../data/winhomeData';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Calculator,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Layers,
  ChevronRight,
  Home,
  CheckCircle2,
  Info,
  Ruler,
  ClipboardList
} from 'lucide-react';

interface ProductShopPageProps {
  initialCategory?: string;
  onSelectProduct: (product: ProductItem) => void;
  onOpenQuote: (productName: string) => void;
  onBackToHome: () => void;
  onConfigureProduct?: (product: ProductItem) => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

export const ProductShopPage: React.FC<ProductShopPageProps> = ({
  initialCategory = 'all',
  onSelectProduct,
  onOpenQuote,
  onBackToHome,
  onConfigureProduct,
  cartCount = 0,
  onOpenCart
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'depth-desc' | 'insulation'>('featured');

  // Brands extracted from catalog
  const brandList = [
    { id: 'all', label: 'All European Brands' },
    { id: 'deceuninck', label: 'Deceuninck (Belgium)' },
    { id: 'winsa', label: 'Winsa (Europe)' },
    { id: 'lorenzoline', label: 'Lorenzoline (Europe)' },
    { id: 'master', label: 'Master Italy' },
    { id: 'comunello', label: 'Comunello (Italy)' },
    { id: 'stac', label: 'STAC (Spain)' },
    { id: 'vorne', label: 'Vorne (Europe)' }
  ];

  // Applications
  const applicationList = [
    { id: 'all', label: 'All Applications' },
    { id: 'sliding', label: 'Sliding Systems' },
    { id: 'casement', label: 'Casement & Tilt-Turn' },
    { id: 'facade', label: 'Curtain Wall & Facade' },
    { id: 'passive', label: 'Passive House (Uf ≤ 1.0)' },
    { id: 'door', label: 'Heavy Entrance Doors' }
  ];

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'upvc' && product.category !== 'upvc') return false;
        if (selectedCategory === 'aluminum' && product.category !== 'aluminum') return false;
        if (selectedCategory === 'accessories' && product.category !== 'accessories') return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesSub = product.subCategory?.toLowerCase().includes(query);
        const matchesDepth = product.depth?.toLowerCase().includes(query);
        const matchesFeatures = product.features.some((f) => f.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesSub && !matchesDepth && !matchesFeatures) {
          return false;
        }
      }

      // Brand filter
      if (selectedBrand !== 'all') {
        const combined = `${product.name} ${product.description} ${product.features.join(' ')}`.toLowerCase();
        if (!combined.includes(selectedBrand.toLowerCase())) {
          return false;
        }
      }

      // Application filter
      if (selectedApplication !== 'all') {
        const combined = `${product.name} ${product.description} ${product.subCategory || ''} ${product.features.join(' ')}`.toLowerCase();
        if (selectedApplication === 'sliding' && !combined.includes('slid') && !combined.includes('lift')) return false;
        if (selectedApplication === 'casement' && !combined.includes('casement') && !combined.includes('opening') && !combined.includes('tilt')) return false;
        if (selectedApplication === 'facade' && !combined.includes('facade') && !combined.includes('façade') && !combined.includes('curtain')) return false;
        if (selectedApplication === 'passive' && !combined.includes('passive') && !product.insulationValue?.includes('0.9')) return false;
        if (selectedApplication === 'door' && !combined.includes('door')) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'depth-desc') {
        const depthA = parseInt(a.depth || '0', 10) || 0;
        const depthB = parseInt(b.depth || '0', 10) || 0;
        return depthB - depthA;
      }
      if (sortBy === 'insulation') {
        const valA = parseFloat(a.insulationValue?.replace(/[^0-9.]/g, '') || '99');
        const valB = parseFloat(b.insulationValue?.replace(/[^0-9.]/g, '') || '99');
        return valA - valB;
      }
      return 0; // default featured
    });
  }, [selectedCategory, searchQuery, selectedBrand, selectedApplication, sortBy]);

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedBrand !== 'all' ? 1 : 0) +
    (selectedApplication !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedApplication('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  const getProductWhatsAppUrl = (product: ProductItem) => {
    const text = `Hello Winhome Company, I am interested in the ${product.name} system (${product.category.toUpperCase()}). Please provide technical drawings, quotation rates, and availability for my project in Iraq.`;
    return `https://wa.me/${WINHOME_CONTACT.hotlineRaw.replace('+', '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pt-24 pb-20">
      {/* Breadcrumb & Sub-Header */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 hover:text-sky-600 transition-colors font-semibold"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">Products Shop</span>
            {selectedCategory !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-sky-600 font-semibold uppercase">{selectedCategory}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-600">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>100% Official European Extrusions</span>
            </span>
            <button
              onClick={onBackToHome}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="bg-slate-900 text-white py-10 sm:py-14 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Architectural Fenestration Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              European Architectural Systems Shop
            </h1>
            <p className="text-xs sm:text-base text-slate-300 mt-2.5 leading-relaxed">
              Explore our full inventory of passive uPVC profiles, monumental thermal-break aluminum, commercial curtain wall facades, and Italian architectural hardware. Fabricated to precision in Erbil.
            </p>
          </div>

          {/* Catalog Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Profiles</span>
              <span className="text-lg sm:text-xl font-bold text-white">{ALL_PRODUCTS.length}+ Systems</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">uPVC Series</span>
              <span className="text-lg sm:text-xl font-bold text-sky-400">{UPVC_PRODUCTS.length} Systems</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Aluminum Series</span>
              <span className="text-lg sm:text-xl font-bold text-indigo-400">{ALUMINUM_PRODUCTS.length} Systems</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Hardware & Lines</span>
              <span className="text-lg sm:text-xl font-bold text-emerald-400">{ACCESSORIES_LINES.length} Collections</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & Shop Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Category Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>All Systems ({ALL_PRODUCTS.length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('upvc')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
              selectedCategory === 'upvc'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
            }`}
          >
            <span>uPVC Systems ({UPVC_PRODUCTS.length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('aluminum')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
              selectedCategory === 'aluminum'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
            }`}
          >
            <span>Architectural Aluminum ({ALUMINUM_PRODUCTS.length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('accessories')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
              selectedCategory === 'accessories'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
            }`}
          >
            <span>Hardware & Accessories ({ACCESSORIES_LINES.length})</span>
          </button>
        </div>

        {/* Search, Filter Controls & Sorters */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
            {/* Live Search Input */}
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search systems, specs, depths, brands..."
                className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-slate-900 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Brand Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full py-2.5 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 text-slate-800 font-medium cursor-pointer"
              >
                {brandList.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Application Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedApplication}
                onChange={(e) => setSelectedApplication(e.target.value)}
                className="w-full py-2.5 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 text-slate-800 font-medium cursor-pointer"
              >
                {applicationList.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="md:col-span-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full py-2.5 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 text-slate-800 font-medium cursor-pointer"
                >
                  <option value="featured">Featured Sort</option>
                  <option value="name">Name (A - Z)</option>
                  <option value="depth-desc">Depth (High to Low)</option>
                  <option value="insulation">Thermal (Lowest Uf)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Bar */}
          {activeFiltersCount > 0 && (
            <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-500 font-semibold mr-1">Active Filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-medium">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-medium uppercase">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedBrand !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-medium">
                    Brand: {selectedBrand}
                    <button onClick={() => setSelectedBrand('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedApplication !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-medium">
                    App: {selectedApplication}
                    <button onClick={() => setSelectedApplication('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline transition-all"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Counter & Active Request Cart Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 text-xs text-slate-600">
          <div>
            Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> systems in catalog
          </div>

          {cartCount > 0 && onOpenCart && (
            <button
              onClick={onOpenCart}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all active:scale-98 animate-pulse"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Architectural Request Cart ({cartCount} {cartCount === 1 ? 'system' : 'systems'})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {cartCount === 0 && (
            <div className="text-slate-400">
              Click "Request Specs" on any system to customize sizes and create an engineering request
            </div>
          )}
        </div>

        {/* Products Grid (E-Commerce Cards) */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-12">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4 border border-sky-100">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No systems match your criteria</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              We couldn't find any architectural profile matching your active search or filters. Try adjusting the keywords or clear filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container with Badge */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="relative h-56 w-full bg-slate-50 overflow-hidden cursor-pointer flex items-center justify-center p-4 border-b border-slate-100"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = product.fallbackImage;
                      }}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Category Pill */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-sky-800 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full uppercase tracking-wider border border-slate-200 shadow-xs">
                        {product.category}
                      </span>
                      {product.subCategory && (
                        <span className="hidden sm:inline-block text-[10px] font-semibold text-slate-700 bg-white/80 backdrop-blur-xs px-2 py-1 rounded-full border border-slate-200">
                          {product.subCategory}
                        </span>
                      )}
                    </div>

                    {/* Passive/Insulation Badge if present */}
                    {product.insulationValue && (
                      <div className="absolute top-3 right-3 bg-slate-900/85 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                        {product.insulationValue}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors cursor-pointer leading-snug"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-1.5 text-center text-xs pt-1">
                      {product.depth && (
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-[9px] text-slate-400 block uppercase font-semibold">Depth</span>
                          <span className="font-bold text-slate-800 text-[11px] truncate block">{product.depth}</span>
                        </div>
                      )}
                      {product.chambers && (
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-[9px] text-slate-400 block uppercase font-semibold">Structure</span>
                          <span className="font-bold text-slate-800 text-[11px] block">{product.chambers} Chambers</span>
                        </div>
                      )}
                      {product.acousticValue && (
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-[9px] text-slate-400 block uppercase font-semibold">Acoustic</span>
                          <span className="font-bold text-sky-700 text-[11px] block">{product.acousticValue}</span>
                        </div>
                      )}
                    </div>

                    {/* Features Snippet */}
                    <div className="space-y-1 pt-1">
                      {product.features.slice(0, 2).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Colors Preview */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Available Finishes:</span>
                        <div className="flex items-center gap-1">
                          {product.colors.slice(0, 4).map((col, cIdx) => (
                            <span
                              key={cIdx}
                              title={col}
                              className="text-[10px] bg-slate-100 text-slate-700 font-medium px-1.5 py-0.5 rounded"
                            >
                              {col}
                            </span>
                          ))}
                          {product.colors.length > 4 && (
                            <span className="text-[10px] text-slate-400 font-medium">+{product.colors.length - 4}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-5 pt-0 border-t border-slate-100 mt-2 space-y-2">
                  {/* Primary Action: Configure & Request with Specifications */}
                  <div className="pt-3">
                    <button
                      onClick={() => onConfigureProduct ? onConfigureProduct(product) : onOpenQuote(product.name)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-98"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Request / Define Custom Specs</span>
                    </button>
                  </div>

                  {/* Secondary Actions: Datasheet, Cost Estimate, WhatsApp */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 active:scale-98 text-center"
                      title="View Technical Blueprints"
                    >
                      <span>Datasheet</span>
                    </button>

                    <button
                      onClick={() => onOpenQuote(product.name)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all border border-slate-200 active:scale-98 flex items-center justify-center gap-1"
                    >
                      <Calculator className="w-3 h-3 text-sky-600" />
                      <span>Estimate</span>
                    </button>

                    <a
                      href={getProductWhatsAppUrl(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                      title="Consult Engineer on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Consultation Banner */}
        <div className="mt-16 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Need Engineering Consultation?
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2.5">
              Custom Profiles & Large-Scale Bill of Quantities (BOQ)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              Our Erbil engineering office assists architects, developers, and homeowners with thermal calculations, wind load inertia checks, and shop drawings.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenQuote('')}
              className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all"
            >
              Open Cost Calculator
            </button>
            <a
              href={`https://wa.me/${WINHOME_CONTACT.hotlineRaw.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all"
            >
              WhatsApp Engineering Desk
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShopPage;
