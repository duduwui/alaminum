import React, { useState } from 'react';
import { ProductItem } from '../data/winhomeData';
import { RequestItem } from '../types/requests';
import {
  X,
  Plus,
  Minus,
  Check,
  Ruler,
  Palette,
  Shield,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface ConfigureItemModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: RequestItem) => void;
}

export const ConfigureItemModal: React.FC<ConfigureItemModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart
}) => {
  if (!isOpen || !product) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [widthMm, setWidthMm] = useState<number>(1600);
  const [heightMm, setHeightMm] = useState<number>(2100);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0] : 'Anthracite Grey (RAL 7016)'
  );
  const [selectedGlazing, setSelectedGlazing] = useState<string>(
    'Double Glazed Low-E Argon (6+16Ar+6mm)'
  );
  const [selectedOpening, setSelectedOpening] = useState<string>(
    product.category === 'aluminum' ? 'Heavy Lift & Slide Glide' : 'Tilt & Turn European Sash'
  );
  const [customNotes, setCustomNotes] = useState<string>('');

  const areaSqm = Number(((widthMm * heightMm * quantity) / 1000000).toFixed(2));

  const glazingOptions = [
    {
      id: 'double-low-e',
      label: 'Double Glazed Low-E Argon (6+16Ar+6mm)',
      desc: 'Standard high-performance solar control for Iraqi climate'
    },
    {
      id: 'triple-acoustic',
      label: 'Triple Glazed Passive Acoustic (4+12+4+12+4mm)',
      desc: 'Maximum soundproofing & extreme thermal insulation (Uf ≤ 0.95)'
    },
    {
      id: 'solar-bronze',
      label: 'Solar Reflective Bronze / Grey Tinted (6+16Ar+6mm)',
      desc: 'Enhanced daytime privacy and solar heat deflection'
    },
    {
      id: 'clear-tempered',
      label: 'Clear Double Tempered Safety Glass (8+14Ar+8mm)',
      desc: 'For monumental sliding doors and ground-level facades'
    },
    {
      id: 'profile-only',
      label: 'Extrusion / Profile Only (No Glass)',
      desc: 'Fabricated frames for existing on-site glazing contractors'
    }
  ];

  const openingOptions = [
    'Tilt & Turn European Sash',
    'Heavy Lift & Slide Glide',
    'Parallel Sliding with Soft-Close',
    'Casement Side-Hung Inward',
    'Casement Outward with Friction Stays',
    'Fixed Panoramic Architectural Glass',
    'Structural Facade Mullion with Concealed Vent'
  ];

  const colorPresets = product.colors && product.colors.length > 0
    ? product.colors
    : [
        'Anthracite Grey (RAL 7016)',
        'Golden Oak Woodgrain',
        'Traffic White (RAL 9016)',
        'Deep Bronze Anodized',
        'Silver Metallic Anodized',
        'Jet Black (RAL 9005)'
      ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: RequestItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId: product.id,
      productName: product.name,
      category: product.category,
      image: product.image,
      quantity,
      widthMm,
      heightMm,
      color: selectedColor,
      glazing: selectedGlazing,
      openingType: selectedOpening,
      notes: customNotes.trim() || undefined,
      estimatedAreaSqm: areaSqm
    };

    onAddToCart(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-sky-700 uppercase bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                  {product.category}
                </span>
                <span className="text-xs text-slate-400">Custom Engineering</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                Configure {product.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Top Specification Preview Banner */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = product.fallbackImage;
              }}
              className="w-16 h-16 object-contain bg-white rounded-xl p-1 border border-slate-200 shrink-0"
            />
            <div className="flex-1 text-xs text-slate-600 space-y-0.5">
              <p className="font-semibold text-slate-900">{product.name}</p>
              <p className="line-clamp-1 text-slate-500">{product.description}</p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {product.depth && (
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px] font-semibold text-slate-700">
                    Depth: {product.depth}
                  </span>
                )}
                {product.insulationValue && (
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px] font-semibold text-sky-700">
                    {product.insulationValue}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 1. Quantity & Dimensions */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-sky-600" />
              <span>1. Dimensions & Quantity</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Width */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                  Width (mm)
                </span>
                <input
                  type="number"
                  min={400}
                  max={12000}
                  step={10}
                  value={widthMm}
                  onChange={(e) => setWidthMm(Math.max(300, Number(e.target.value)))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                />
                <span className="text-[10px] text-slate-400 block mt-1">{(widthMm / 1000).toFixed(2)} meters</span>
              </div>

              {/* Height */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                  Height (mm)
                </span>
                <input
                  type="number"
                  min={400}
                  max={8000}
                  step={10}
                  value={heightMm}
                  onChange={(e) => setHeightMm(Math.max(300, Number(e.target.value)))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                />
                <span className="text-[10px] text-slate-400 block mt-1">{(heightMm / 1000).toFixed(2)} meters</span>
              </div>

              {/* Quantity Counter */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                  Total Units
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-14 text-center bg-white border border-slate-200 rounded-lg py-1 text-sm font-bold text-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-sky-700 font-semibold block mt-1">
                  Total Area: {areaSqm} m²
                </span>
              </div>
            </div>
          </div>

          {/* 2. Color / Architectural Finish */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-sky-600" />
              <span>2. Profile Finish & Architectural Color</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between gap-1.5 ${
                    selectedColor === color
                      ? 'bg-sky-50 border-sky-500 text-sky-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="line-clamp-1">{color}</span>
                  {selectedColor === color && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Glazing Specification */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-sky-600" />
              <span>3. Insulated Glass Unit (IGU) Specification</span>
            </label>
            <div className="space-y-2">
              {glazingOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-2.5 sm:p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedGlazing === opt.label
                      ? 'bg-sky-50/80 border-sky-500 text-sky-950'
                      : 'bg-white border-slate-200 hover:bg-slate-50/60 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="glazing-option"
                    checked={selectedGlazing === opt.label}
                    onChange={() => setSelectedGlazing(opt.label)}
                    className="mt-0.5 text-sky-600 focus:ring-sky-500"
                  />
                  <div>
                    <span className="text-xs font-bold block">{opt.label}</span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      {opt.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Opening Mechanism / Hardware */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-600" />
              <span>4. Sash Mechanism & Master Italy Hardware</span>
            </label>
            <select
              value={selectedOpening}
              onChange={(e) => setSelectedOpening(e.target.value)}
              className="w-full py-2.5 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 font-medium text-slate-900"
            >
              {openingOptions.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Custom Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              5. Special Dimensions / Location Notes (Optional)
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. Master Bedroom on 2nd Floor, requires motorized blinds, or sub-frame info..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900"
            />
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Configuring <span className="font-bold text-slate-900">{quantity} units</span> • Total{' '}
              <span className="font-bold text-sky-700">{areaSqm} m²</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5 active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Request List</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigureItemModal;
