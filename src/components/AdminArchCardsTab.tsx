import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Check,
  ExternalLink,
  Sparkles,
  Layers,
  Save,
  Trash2,
  Plus
} from 'lucide-react';
import {
  ArchitectureCatalogueCard,
  DEFAULT_CATALOGUE_CARDS,
  saveArchitectureCards
} from '../services/architectureCardsService';
import { saveSharedCmsSection } from '../services/cmsService';
import { SHOWCASE_TEXT_BY_LANG } from './SignatureShowcase';

interface AdminArchCardsTabProps {
  archCards: ArchitectureCatalogueCard[];
  onUpdateArchCards: (cards: ArchitectureCatalogueCard[]) => void;
  onUploadMedia: (file: File) => Promise<string>;
  onSaveFeedback: (msg: string) => void;
  homepageMedia: any;
  setHomepageMedia: React.Dispatch<React.SetStateAction<any>>;
}

export const AdminArchCardsTab: React.FC<AdminArchCardsTabProps> = ({
  archCards,
  onUpdateArchCards,
  onUploadMedia,
  onSaveFeedback,
  homepageMedia,
  setHomepageMedia
}) => {
  const cards = archCards && archCards.length >= 2 ? archCards : DEFAULT_CATALOGUE_CARDS;
  const card1 = cards[0];
  const card2 = cards[1];

  const logo1InputRef = useRef<HTMLInputElement>(null);
  const logo2InputRef = useRef<HTMLInputElement>(null);
  const pdf1InputRef = useRef<HTMLInputElement>(null);
  const pdf2InputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState<string | null>(null);

  const handleUpdateCard = (cardIndex: 0 | 1, field: keyof ArchitectureCatalogueCard, value: string) => {
    const updated = [...cards];
    updated[cardIndex] = {
      ...updated[cardIndex],
      [field]: value
    };
    onUpdateArchCards(updated);
    saveArchitectureCards(updated);
    void saveSharedCmsSection('archCards', updated).catch(() => {});
  };

  const handleUploadCardFile = async (
    cardIndex: 0 | 1,
    field: 'logo' | 'pdfUrl',
    file: File
  ) => {
    try {
      setIsUploading(`${cardIndex}-${field}`);
      const uploadedUrl = await onUploadMedia(file);
      handleUpdateCard(cardIndex, field, uploadedUrl);
      if (field === 'pdfUrl') {
        handleUpdateCard(cardIndex, 'fileName', file.name);
      }
      onSaveFeedback(`✓ Uploaded ${field === 'logo' ? 'logo image' : 'PDF catalogue'} for Card #${cardIndex + 1}!`);
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setIsUploading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden file inputs for Card 1 & Card 2 */}
      <input
        ref={logo1InputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleUploadCardFile(0, 'logo', f);
          e.target.value = '';
        }}
      />
      <input
        ref={pdf1InputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleUploadCardFile(0, 'pdfUrl', f);
          e.target.value = '';
        }}
      />
      <input
        ref={logo2InputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleUploadCardFile(1, 'logo', f);
          e.target.value = '';
        }}
      />
      <input
        ref={pdf2InputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleUploadCardFile(1, 'pdfUrl', f);
          e.target.value = '';
        }}
      />

      {/* Header Explainer Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            2 Official European Architectural Catalogues & Cards
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Manage the two official European architectural partner cards displayed directly on the homepage (WIEK Belgium & STAC Spain).
            Replace brand logos, edit card titles and descriptions, and upload or link new technical PDF catalogues.
          </p>
        </div>

        {/* 2 Architecture Cards Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Card 1: WIEK Belgium */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-red-300 p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-extrabold text-[11px] border border-red-200">
                  CARD 01: WIEK BELGIUM
                </span>
                <span className="text-xs text-slate-400 font-bold">{card1.company}</span>
              </div>

              {/* Logo / Image Stage */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Brand Logo / Header Image
                </label>
                <div className="flex items-center gap-3">
                  <div className="h-16 w-32 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-2 shadow-2xs">
                    <img
                      src={card1.logo}
                      alt={card1.title}
                      className="max-h-12 max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/showcase/wiek-logo.png';
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => logo1InputRef.current?.click()}
                    className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading === '0-logo' ? 'Uploading…' : 'Upload Logo'}</span>
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-0.5">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={card1.title}
                    onChange={(e) => handleUpdateCard(0, 'title', e.target.value)}
                    placeholder="e.g. WIEK Belgium Architectural Catalog"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-red-400 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-0.5">
                    Card Subtitle / Description
                  </label>
                  <textarea
                    rows={2}
                    value={card1.desc}
                    onChange={(e) => handleUpdateCard(0, 'desc', e.target.value)}
                    placeholder="e.g. Concealed hinge solutions & architectural fenestration"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-red-400 bg-slate-50/50 resize-y"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-0.5">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={card1.buttonText || 'Open Catalog'}
                    onChange={(e) => handleUpdateCard(0, 'buttonText', e.target.value)}
                    placeholder="Open Catalog / فتح الكتالوج"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-red-400 bg-slate-50/50"
                  />
                </div>

                {/* PDF Catalog Link & Direct File Upload */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-0.5">
                    Technical PDF Catalogue File
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={card1.pdfUrl}
                      onChange={(e) => handleUpdateCard(0, 'pdfUrl', e.target.value)}
                      placeholder="/catalogs/wiek-general-catalog-2026.pdf"
                      className="flex-1 min-w-0 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 outline-none focus:border-red-400 bg-slate-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => pdf1InputRef.current?.click()}
                      className="shrink-0 px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{isUploading === '0-pdfUrl' ? 'Uploading…' : 'Upload PDF'}</span>
                    </button>
                    {card1.pdfUrl && (
                      <a
                        href={card1.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Preview PDF"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Live preview on Homepage</span>
              <button
                type="button"
                onClick={() => {
                  onSaveFeedback('✓ Card 1 (WIEK) changes saved to website!');
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Card 1</span>
              </button>
            </div>
          </div>

          {/* Card 2: STAC Spain */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-red-300 p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-extrabold text-[11px] border border-red-200">
                  CARD 02: STAC SPAIN
                </span>
                <span className="text-xs text-slate-400 font-bold">{card2.company}</span>
              </div>

              {/* Logo / Image Stage */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Brand Logo / Header Image
                </label>
                <div className="flex items-center gap-3">
                  <div className="h-16 w-32 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-2 shadow-2xs">
                    <img
                      src={card2.logo}
                      alt={card2.title}
                      className="max-h-12 max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/showcase/stac-logo.png';
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => logo2InputRef.current?.click()}
                    className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading === '1-logo' ? 'Uploading…' : 'Upload Logo'}</span>
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-0.5">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={card2.title}
                    onChange={(e) => handleUpdateCard(1, 'title', e.target.value)}
                    placeholder="e.g. STAC Spain Hardware Catalog"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-red-400 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-0.5">
                    Card Subtitle / Description
                  </label>
                  <textarea
                    rows={2}
                    value={card2.desc}
                    onChange={(e) => handleUpdateCard(1, 'desc', e.target.value)}
                    placeholder="e.g. Minimalist cremones & monumental lift & slide hardware"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-red-400 bg-slate-50/50 resize-y"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-0.5">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={card2.buttonText || 'Open Catalog'}
                    onChange={(e) => handleUpdateCard(1, 'buttonText', e.target.value)}
                    placeholder="Open Catalog / فتح الكتالوج"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-red-400 bg-slate-50/50"
                  />
                </div>

                {/* PDF Catalog Link & Direct File Upload */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-0.5">
                    Technical PDF Catalogue File
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={card2.pdfUrl}
                      onChange={(e) => handleUpdateCard(1, 'pdfUrl', e.target.value)}
                      placeholder="/catalogs/stac-hardware-accessories.pdf"
                      className="flex-1 min-w-0 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 outline-none focus:border-red-400 bg-slate-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => pdf2InputRef.current?.click()}
                      className="shrink-0 px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{isUploading === '1-pdfUrl' ? 'Uploading…' : 'Upload PDF'}</span>
                    </button>
                    {card2.pdfUrl && (
                      <a
                        href={card2.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Preview PDF"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Live preview on Homepage</span>
              <button
                type="button"
                onClick={() => {
                  onSaveFeedback('✓ Card 2 (STAC) changes saved to website!');
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Card 2</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
