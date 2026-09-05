import React, { useState, useMemo } from 'react';
import { GlowButton } from './GlowButton';
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
  ClipboardList,
  Grid,
  List,
  Eye,
  Filter,
  Check,
  RotateCcw,
  FileText,
  Plus
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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Brands extracted from catalog
  const brandList = [
    { id: 'all', label: 'All Brands' },
    { id: 'winsa', label: 'Winsa (Belgium/Europe)' },
    { id: 'lorenzoline', label: 'Lorenzoline (Architectural)' },
    { id: 'master', label: 'Master Italy Hardware' },
    { id: 'stac', label: 'STAC Spain' }
  ];

  // Applications
  const applicationList = [
    { id: 'all', label: 'All Applications' },
    { id: 'sliding', label: 'Sliding & Panoramic Doors' },
    { id: 'casement', label: 'Casement & Tilt-Turn Windows' },
    { id: 'facade', label: 'Curtain Wall 50F Façades' },
    { id: 'passive', label: 'Severe Climate Class S (Uf ≤ 1.1)' }
  ];

  // Load products list dynamically from Admin storage (or fall back to ALL_PRODUCTS)
  const productsList = useMemo(() => {
    const saved = localStorage.getItem('winhome_admin_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed as ProductItem[];
      } catch (e) {
        console.error(e);
      }
    }
    return ALL_PRODUCTS;
  }, []);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
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
        if (selectedApplication === 'passive' && !combined.includes('passive') && !product.insulationValue?.includes('0.9') && !product.insulationValue?.includes('1.1')) return false;
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

  // Autocomplete Suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase();
    const suggestions = new Set<string>();
    ALL_PRODUCTS.forEach((p) => {
      if (p.name.toLowerCase().includes(query)) suggestions.add(p.name);
      if (p.subCategory && p.subCategory.toLowerCase().includes(query)) suggestions.add(p.subCategory);
    });
    return Array.from(suggestions).slice(0, 5);
  }, [searchQuery]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (searchQuery.trim()) count++;
    if (selectedBrand !== 'all') count++;
    if (selectedApplication !== 'all') count++;
    return count;
  }, [selectedCategory, searchQuery, selectedBrand, selectedApplication]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedBrand('all');
    setSelectedApplication('all');
    setSortBy('featured');
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pt-20 pb-24 font-sans text-slate-900">
      
      {/* Top Header Navigation Bar */}
      <div className="bg-white border-b border-slate-200/80 py-3.5 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 hover:text-blue-600 transition-colors font-bold"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Winhome Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-black">Architectural Products Catalog</span>
            {selectedCategory !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-blue-600 font-bold uppercase tracking-wider">{selectedCategory}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-600 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Certified Severe Climate Class S</span>
            </span>
            <button
              onClick={onBackToHome}
              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors text-xs"
            >
              ← Back to Main Showcase
            </button>
          </div>
        </div>
      </div>

      {/* Main Catalog Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Category Selector Tab Chips */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 mb-5 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Systems ({ALL_PRODUCTS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('upvc')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'upvc'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>uPVC Systems ({UPVC_PRODUCTS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('aluminum')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'aluminum'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>Architectural Aluminum ({ALUMINUM_PRODUCTS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('accessories')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'accessories'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>Hardware & Accessories ({ACCESSORIES_LINES.length})</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Live Search Input */}
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search series, depth (e.g. 76mm, 70LS)..."
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-all text-slate-900 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Autocomplete Dropdown */}
              {searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden text-xs">
                  {searchSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSearchQuery(sug)}
                      className="w-full text-left px-3.5 py-2 hover:bg-blue-50 text-slate-800 font-medium flex items-center justify-between border-b border-slate-50 last:border-0"
                    >
                      <span>{sug}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Brand Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 text-slate-800 font-bold"
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
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 text-slate-800 font-bold"
              >
                {applicationList.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort & Grid Switcher */}
            <div className="md:col-span-2 flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full py-2 px-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 text-slate-800 font-bold"
              >
                <option value="featured">Featured Sort</option>
                <option value="name">Name (A-Z)</option>
                <option value="depth-desc">Depth (High-Low)</option>
                <option value="insulation">Thermal (Best Uf)</option>
              </select>

              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                  title="Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                  title="Table View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Bar */}
          {activeFiltersCount > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-500 font-bold">Active Filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">
                    Search: "{searchQuery}"
                    <button type="button" onClick={() => setSearchQuery('')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px] uppercase">
                    Category: {selectedCategory}
                    <button type="button" onClick={() => setSelectedCategory('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Results Counter & Cart Strip */}
        <div className="flex items-center justify-between gap-3 mb-5 text-xs text-slate-600">
          <div>
            Showing <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> profile systems
          </div>

          {cartCount > 0 && onOpenCart && (
            <button
              type="button"
              onClick={onOpenCart}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all active:scale-98"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Request Cart ({cartCount})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* PRODUCTS CARDS GRID - Sleek, Compact, High-Density */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-md mx-auto my-8 shadow-2xs">
            <Search className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No profile systems match your query</h3>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold">
                    <th className="p-3">System Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Frame Depth</th>
                    <th className="p-3">Price ($/m²)</th>
                    <th className="p-3">Thermal (Uf)</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-9 h-9 object-contain rounded bg-slate-100 p-1 shrink-0 border border-slate-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = product.fallbackImage;
                          }}
                        />
                        <span className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer" onClick={() => onConfigureProduct ? onConfigureProduct(product) : onSelectProduct(product)}>
                          {product.name}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-600 uppercase text-[10px]">{product.category}</td>
                      <td className="p-3 font-bold text-slate-800">{product.depth || 'N/A'}</td>
                      <td className="p-3 font-black text-emerald-600">${product.pricePerSqm || product.basePrice || 140} / m²</td>
                      <td className="p-3 font-bold text-sky-700">{product.insulationValue || 'Standard'}</td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => onConfigureProduct ? onConfigureProduct(product) : onOpenQuote(product.name)}
                          className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer"
                        >
                          Configure
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* SLEEK COMPACT GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Compact Product Image Container */}
                  <div
                    onClick={() => onConfigureProduct ? onConfigureProduct(product) : onSelectProduct(product)}
                    className="relative h-40 w-full bg-slate-50/80 overflow-hidden cursor-pointer flex items-center justify-center p-4 border-b border-slate-100"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = product.fallbackImage;
                      }}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Category Pill Tag */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[9px] font-bold text-slate-700 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md uppercase border border-slate-200">
                        {product.category}
                      </span>
                    </div>

                    {/* Insulation Tag */}
                    {product.insulationValue && (
                      <div className="absolute top-2.5 right-2.5 bg-slate-900/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                        {product.insulationValue}
                      </div>
                    )}
                  </div>

                  {/* Compact Content */}
                  <div className="p-3.5 space-y-2">
                    <div>
                      <h3
                        onClick={() => onConfigureProduct ? onConfigureProduct(product) : onSelectProduct(product)}
                        className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {product.description}
                      </p>
                    </div>

                    {/* Price & Specs Pills */}
                    <div className="flex items-center justify-between text-[11px] font-extrabold pt-0.5 border-t border-slate-100">
                      <span className="text-slate-900 font-black text-xs">
                        ${product.pricePerSqm || product.basePrice || 140} <span className="text-[10px] text-slate-500 font-normal">/ m²</span>
                      </span>
                      <div className="flex items-center gap-1">
                        {product.depth && (
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] border border-blue-200">
                            {product.depth}
                          </span>
                        )}
                        {product.chambers && (
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] border border-slate-200">
                            {product.chambers}C
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Single High-Contrast Primary Action Button */}
                <div className="p-3.5 pt-0">
                  <button
                    type="button"
                    onClick={() => onConfigureProduct ? onConfigureProduct(product) : onOpenQuote(product.name)}
                    className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Configure Specs</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductShopPage;
