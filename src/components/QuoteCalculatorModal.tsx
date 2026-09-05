import React, { useState } from 'react';
import { WINHOME_CONTACT } from '../data/winhomeData';
import { GlowButton } from './GlowButton';
import { X, Calculator, MessageSquare, Phone, Layers, ShieldCheck, ArrowRight, Check } from 'lucide-react';

interface QuoteCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: string;
}

export const QuoteCalculatorModal: React.FC<QuoteCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialProduct,
}) => {
  const [material, setMaterial] = useState<'upvc' | 'aluminum'>('upvc');
  const [system, setSystem] = useState<string>(initialProduct || 'Deceuninck Legend Art 70mm');
  const [windowType, setWindowType] = useState<string>('Tilt & Turn Window');
  const [widthCm, setWidthCm] = useState<number>(140);
  const [heightCm, setHeightCm] = useState<number>(160);
  const [glassType, setGlassType] = useState<string>('Double Glazed Low-E (28mm)');
  const [unitsCount, setUnitsCount] = useState<number>(4);
  const [clientName, setClientName] = useState<string>('');
  const [clientCity, setClientCity] = useState<string>('Erbil');

  if (!isOpen) return null;

  // Calculation estimates
  const singleAreaM2 = (widthCm * heightCm) / 10000;
  const totalAreaM2 = singleAreaM2 * unitsCount;

  // Estimation base rates per m2 for reference
  const baseRate = material === 'upvc' ? 120 : 165;
  const glassFactor =
    glassType.includes('Triple') ? 1.35 : glassType.includes('Low-E') ? 1.15 : 1.0;
  const estimatedCost = Math.round(totalAreaM2 * baseRate * glassFactor);

  const whatsappMessage = encodeURIComponent(
    `Hello Winhome Erbil,\nI calculated an estimate using your online cost calculator:\n` +
    `• Material: ${material.toUpperCase()}\n` +
    `• System Series: ${system}\n` +
    `• Type: ${windowType}\n` +
    `• Dimensions: ${widthCm}cm W × ${heightCm}cm H (${singleAreaM2.toFixed(2)} m² each)\n` +
    `• Units: ${unitsCount} units (Total ${totalAreaM2.toFixed(2)} m²)\n` +
    `• Glazing: ${glassType}\n` +
    `• Project City: ${clientCity}\n` +
    (clientName ? `• Client: ${clientName}\n` : '') +
    `Please provide an official quotation and availability schedule.`
  );

  const whatsappUrl = `https://wa.me/${WINHOME_CONTACT.hotlineRaw.replace('+', '')}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* FIXED HEADER BAR - Separate from body scroll container */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/60 flex items-center justify-between text-white shrink-0 z-20">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center font-bold shrink-0">
              <Calculator className="w-5 h-5 text-sky-300" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-300 bg-sky-500/20 border border-sky-400/30 px-2 py-0.5 rounded-full">
                Cost Estimator Hub
              </span>
              <h3 className="text-base sm:text-xl font-black text-white tracking-tight truncate mt-0.5">
                Architectural Fenestration Estimator
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400 shrink-0 ml-3"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* INTERNAL SCROLLABLE FORM BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 text-xs text-slate-700">
          
          {/* Material Select */}
          <div className="space-y-2.5">
            <label className="block font-black text-slate-900 uppercase tracking-wider text-[11px]">
              1. Select Primary Frame Material
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMaterial('upvc');
                  setSystem('Deceuninck Legend Art 70mm');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  material === 'upvc'
                    ? 'border-sky-500 bg-sky-50/90 text-slate-900 ring-2 ring-sky-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900">European uPVC Systems</span>
                  {material === 'upvc' && <Check className="w-4 h-4 text-sky-600 stroke-[3]" />}
                </div>
                <span className="block text-[11px] font-medium text-slate-500 mt-1">
                  Deceuninck & Winsa Profiles
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMaterial('aluminum');
                  setSystem('Lorenzoline Opening 60T');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  material === 'aluminum'
                    ? 'border-sky-500 bg-sky-50/90 text-slate-900 ring-2 ring-sky-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900">Thermal Break Aluminum</span>
                  {material === 'aluminum' && <Check className="w-4 h-4 text-sky-600 stroke-[3]" />}
                </div>
                <span className="block text-[11px] font-medium text-slate-500 mt-1">
                  Lorenzoline & Façade 50F
                </span>
              </button>
            </div>
          </div>

          {/* System & Type Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-black text-slate-900 mb-1.5 uppercase tracking-wider text-[11px]">
                System Series
              </label>
              <select
                value={system}
                onChange={(e) => setSystem(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white font-bold"
              >
                {material === 'upvc' ? (
                  <>
                    <option value="Deceuninck Legend 80 Passive (6-Chamber)">Deceuninck Legend 80 Passive (80mm)</option>
                    <option value="Deceuninck Legend Art (70mm)">Deceuninck Legend Art (70mm)</option>
                    <option value="Winsa Dorado 76 (5-Chamber)">Winsa Dorado 76 (76mm)</option>
                    <option value="Winsa HS76 Hebe-Schiebe">Winsa HS76 Hebe-Schiebe Heavy Sliding</option>
                  </>
                ) : (
                  <>
                    <option value="Lorenzoline Opening 60T Thermal">Lorenzoline Opening 60T Thermal Break</option>
                    <option value="Lorenzoline Opening 74T Passive">Lorenzoline Opening 74T Ultra Insulation</option>
                    <option value="Lorenzoline 70LS Lift & Slide">Lorenzoline 70LS Panoramic Lift & Slide</option>
                    <option value="Lorenzoline Façade 50F Curtain Wall">Lorenzoline Façade 50F Curtain Wall</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block font-black text-slate-900 mb-1.5 uppercase tracking-wider text-[11px]">
                Opening Configuration
              </label>
              <select
                value={windowType}
                onChange={(e) => setWindowType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white font-bold"
              >
                <option value="Tilt & Turn Window">Tilt & Turn European Sash Window</option>
                <option value="Heavy Lift & Slide Door">Heavy Lift & Slide Panoramic Door</option>
                <option value="Parallel Sliding Window">Parallel Sliding Soft-Close Window</option>
                <option value="Fixed Architectural Glass">Fixed Panoramic Structural Frame</option>
                <option value="Curtain Wall Mullion">Curtain Wall Glass Facade Unit</option>
              </select>
            </div>
          </div>

          {/* Dimensions & Quantities */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">Width (cm)</label>
              <input
                type="number"
                value={widthCm}
                onChange={(e) => setWidthCm(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-extrabold text-slate-900"
              />
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-extrabold text-slate-900"
              />
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">Units Count</label>
              <input
                type="number"
                value={unitsCount}
                onChange={(e) => setUnitsCount(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-extrabold text-slate-900"
              />
            </div>
          </div>

          {/* Estimated Calculations Summary Box */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-700 shadow-md flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Estimated Total Area</span>
              <span className="text-lg font-black text-sky-300">{totalAreaM2.toFixed(2)} m²</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Rough Market Value</span>
              <span className="text-lg font-black text-emerald-400">~${estimatedCost} USD</span>
            </div>
          </div>
        </div>

        {/* FIXED FOOTER BAR */}
        <div className="px-6 py-4 bg-slate-50/95 backdrop-blur-md border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0 rounded-b-3xl z-20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GlowButton variant="primary" size="sm">
              <MessageSquare className="w-4 h-4" />
              <span>Send Specs to WhatsApp</span>
            </GlowButton>
          </a>
        </div>

      </div>
    </div>
  );
};

export default QuoteCalculatorModal;
