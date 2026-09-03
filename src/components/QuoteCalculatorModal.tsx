import React, { useState } from 'react';
import { WINHOME_CONTACT } from '../data/winhomeData';
import { X, Calculator, MessageSquare, Phone } from 'lucide-react';

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

  // Rough estimation base rates per m2 for Iraqi market reference
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Architectural Fenestration Cost Estimator
              </h3>
              <p className="text-xs text-slate-500">
                Instant preliminary price calculator for Erbil & Kurdistan projects
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calculator Form Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Material Select */}
          <div>
            <label className="block font-bold text-slate-900 mb-1.5 uppercase tracking-wider text-[11px]">
              1. Select Primary Frame Material
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMaterial('upvc');
                  setSystem('Deceuninck Legend Art 70mm');
                }}
                className={`p-3 rounded-lg border text-center font-bold transition-all ${
                  material === 'upvc'
                    ? 'border-sky-600 bg-sky-50 text-sky-900 ring-2 ring-sky-600/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                European uPVC Systems
                <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                  Deceuninck & Winsa Profiles
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMaterial('aluminum');
                  setSystem('Lorenzoline Opening 60T');
                }}
                className={`p-3 rounded-lg border text-center font-bold transition-all ${
                  material === 'aluminum'
                    ? 'border-sky-600 bg-sky-50 text-sky-900 ring-2 ring-sky-600/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                Thermal Break Aluminum
                <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                  Lorenzoline & Façade 50F
                </span>
              </button>
            </div>
          </div>

          {/* System & Type Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-900 mb-1.5">
                System Series
              </label>
              <select
                value={system}
                onChange={(e) => setSystem(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white"
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
              <label className="block font-bold text-slate-900 mb-1.5">
                Opening Configuration
              </label>
              <select
                value={windowType}
                onChange={(e) => setWindowType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white"
              >
                <option value="Tilt & Turn Window">Tilt & Turn German Mechanism</option>
                <option value="Two-Sash Sliding Window">Two-Sash Horizontal Sliding</option>
                <option value="Monumental Lift-and-Slide Door">Monumental Lift-and-Slide Door</option>
                <option value="Casement Balcony Door">French Casement Balcony Door</option>
                <option value="Fixed Architectural Glass Wall">Fixed Architectural Picture Window</option>
              </select>
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Width (cm)
              </label>
              <input
                type="number"
                min={40}
                max={600}
                value={widthCm}
                onChange={(e) => setWidthCm(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                min={40}
                max={400}
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Quantity (Units)
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={unitsCount}
                onChange={(e) => setUnitsCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Glass Type & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-900 mb-1.5">
                Glass Specification
              </label>
              <select
                value={glassType}
                onChange={(e) => setGlassType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white"
              >
                <option value="Double Glazed Low-E (28mm)">Double Glazed Low-E Argon (28mm)</option>
                <option value="Double Glazed Standard (24mm)">Double Glazed Standard (24mm)</option>
                <option value="Triple Glazed Acoustic Low-E (44mm)">Triple Glazed Acoustic Low-E (44mm)</option>
                <option value="Reflective Solar Control (28mm)">Reflective Bronze/Blue Solar Control (28mm)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1.5">
                City in Iraq / Kurdistan
              </label>
              <select
                value={clientCity}
                onChange={(e) => setClientCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white"
              >
                <option value="Erbil">Erbil (Showroom & Factory Hub)</option>
                <option value="Sulaymaniyah">Sulaymaniyah</option>
                <option value="Duhok">Duhok</option>
                <option value="Baghdad">Baghdad</option>
                <option value="Basra">Basra</option>
                <option value="Other">Other Governorate</option>
              </select>
            </div>
          </div>

          {/* Live Estimate Display Banner */}
          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">
                Calculated Preliminary Cost
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                ${estimatedCost.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-500">USD Approx.</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Total Area: <strong className="text-slate-900">{totalAreaM2.toFixed(2)} m²</strong> ({singleAreaM2.toFixed(2)} m² per unit × {unitsCount} units)
              </p>
            </div>

            <div className="text-right text-[11px] text-slate-500 max-w-xs">
              *Includes European extrusions, dual EPDM gaskets, and Master hardware. Final fabrication price confirmed upon site survey.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${WINHOME_CONTACT.hotlineRaw}`}
              className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-sky-600" />
              <span>Call Desk</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send Calculation to WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
