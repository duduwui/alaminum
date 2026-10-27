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
  Plus,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon
} from 'lucide-react';
import {
  ArchitectureCatalogueCard,
  DEFAULT_CATALOGUE_CARDS,
  saveArchitectureCards
} from '../services/architectureCardsService';
import { saveSharedCmsSection } from '../services/cmsService';

interface AdminArchCardsTabProps {
  archCards: ArchitectureCatalogueCard[];
  onUpdateArchCards: (cards: ArchitectureCatalogueCard[]) => void;
  onUploadMedia: (file: File) => Promise<string>;
  onSaveFeedback: (msg: string) => void;
  homepageMedia?: any;
  setHomepageMedia?: React.Dispatch<React.SetStateAction<any>>;
}

export const AdminArchCardsTab: React.FC<AdminArchCardsTabProps> = ({
  archCards,
  onUpdateArchCards,
  onUploadMedia,
  onSaveFeedback
}) => {
  const cards = archCards && archCards.length > 0 ? archCards : DEFAULT_CATALOGUE_CARDS;

  const [activeUploadTarget, setActiveUploadTarget] = useState<{
    cardIndex: number;
    type: 'image' | 'logo' | 'pdf';
  } | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const persistCards = (updated: ArchitectureCatalogueCard[]) => {
    onUpdateArchCards(updated);
    saveArchitectureCards(updated);
    void saveSharedCmsSection('archCards', updated);
  };

  const handleUpdateField = (
    cardIndex: number,
    field: keyof ArchitectureCatalogueCard,
    value: string
  ) => {
    const updated = [...cards];
    updated[cardIndex] = {
      ...updated[cardIndex],
      [field]: value
    };
    persistCards(updated);
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= cards.length) return;

    const updated = [...cards];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    persistCards(updated);
    onSaveFeedback(`✓ Moved catalogue card to position #${targetIndex + 1}`);
  };

  const handleDeleteCard = (index: number) => {
    if (cards.length <= 1) {
      alert('You must have at least one catalogue card.');
      return;
    }
    if (!confirm(`Delete "${cards[index]?.title || `Card #${index + 1}`}"?`)) return;

    const updated = cards.filter((_, i) => i !== index);
    persistCards(updated);
    onSaveFeedback('✓ Catalogue card deleted.');
  };

  const handleAddCard = () => {
    const newCard: ArchitectureCatalogueCard = {
      id: `cat-${Date.now()}`,
      brand: 'New Partner',
      logo: '/assets/showcase/wiek-logo.png',
      image: '/assets/showcase/wiek_hidden_hinge-04.png',
      title: 'New Architectural Catalog',
      desc: 'Technical fenestration specifications and architectural profile drawings.',
      pdfUrl: '',
      fileName: 'Catalog.pdf',
      company: 'European Systems',
      buttonText: 'Open Catalog'
    };

    const updated = [...cards, newCard];
    persistCards(updated);
    onSaveFeedback('✓ Added new architectural catalogue card. Upload media and files below.');
  };

  const triggerUpload = (cardIndex: number, type: 'image' | 'logo' | 'pdf') => {
    setActiveUploadTarget({ cardIndex, type });
    if (type === 'image') imageInputRef.current?.click();
    else if (type === 'logo') logoInputRef.current?.click();
    else if (type === 'pdf') pdfInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadTarget) return;

    try {
      setIsUploading(true);
      const url = await onUploadMedia(file);
      const { cardIndex, type } = activeUploadTarget;

      const updated = [...cards];
      if (type === 'image') {
        updated[cardIndex] = { ...updated[cardIndex], image: url };
        onSaveFeedback(`✓ Card #${cardIndex + 1} image updated!`);
      } else if (type === 'logo') {
        updated[cardIndex] = { ...updated[cardIndex], logo: url };
        onSaveFeedback(`✓ Card #${cardIndex + 1} logo updated!`);
      } else if (type === 'pdf') {
        updated[cardIndex] = { ...updated[cardIndex], pdfUrl: url, fileName: file.name };
        onSaveFeedback(`✓ Card #${cardIndex + 1} PDF file uploaded!`);
      }

      persistCards(updated);
    } catch (err: any) {
      alert(err.message || 'File upload failed');
    } finally {
      setIsUploading(false);
      setActiveUploadTarget(null);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden file inputs for image, logo and PDF uploads */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={pdfInputRef}
        type="file"
        accept="application/pdf,image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Main Header & Add New Action */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <h3 className="text-lg font-black text-slate-900">
                Official European Architectural Catalogues & System Cards ({cards.length})
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Manage technical engineering catalogues displayed on the homepage. Each card includes its product/system image, company logo, title, description, and downloadable PDF file. You can add as many cards and catalogues as needed.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleAddCard}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Catalogue Card</span>
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-2">
          {cards.map((card, idx) => (
            <div
              key={card.id || idx}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-xs flex flex-col justify-between gap-4 transition-all"
            >
              {/* Card Header: Slot & Order Controls */}
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-white font-mono font-black text-xs">
                    CARD #{String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-bold text-slate-600 truncate max-w-[140px]">
                    {card.company || card.brand || 'Partner'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveCard(idx, 'up')}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-700 transition-colors cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === cards.length - 1}
                    onClick={() => handleMoveCard(idx, 'down')}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-700 transition-colors cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCard(idx)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer ms-1"
                    title="Delete Card"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 1. Card Image Stage */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Card Feature Image / System Photo
                </label>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center group">
                  {card.image ? (
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/showcase/wiek_hidden_hinge-04.png';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-1 text-xs">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                      <span>No Image Uploaded</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
                    <button
                      type="button"
                      onClick={() => triggerUpload(idx, 'image')}
                      className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Change Image</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => triggerUpload(idx, 'image')}
                  className="w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {isUploading && activeUploadTarget?.cardIndex === idx && activeUploadTarget.type === 'image'
                      ? 'Uploading Image…'
                      : 'Upload / Replace Image'}
                  </span>
                </button>
              </div>

              {/* 2. Brand Logo & Company Name */}
              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    Brand Logo
                  </label>
                  <div className="h-11 rounded-xl border border-slate-200 bg-slate-50 p-1 flex items-center justify-between gap-2">
                    <div className="h-full w-20 flex items-center justify-center">
                      {card.logo ? (
                        <img
                          src={card.logo}
                          alt="logo"
                          className="max-h-7 max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400">No Logo</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => triggerUpload(idx, 'logo')}
                      className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-[10px] cursor-pointer"
                    >
                      Upload
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    Company / Attribution
                  </label>
                  <input
                    type="text"
                    value={card.company || ''}
                    onChange={(e) => handleUpdateField(idx, 'company', e.target.value)}
                    placeholder="e.g. WIEK Belgium"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50/60 focus:bg-white outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* 3. Title */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Card Title
                </label>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => handleUpdateField(idx, 'title', e.target.value)}
                  placeholder="e.g. WIEK Belgium Architectural Catalog"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 bg-slate-50/60 focus:bg-white outline-none focus:border-red-500"
                />
              </div>

              {/* 4. Description */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Card Description
                </label>
                <textarea
                  value={card.desc}
                  onChange={(e) => handleUpdateField(idx, 'desc', e.target.value)}
                  placeholder="Detailed architectural specifications..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-slate-50/60 focus:bg-white outline-none focus:border-red-500 resize-y leading-relaxed"
                />
              </div>

              {/* 5. PDF File & Button Text */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Technical PDF / Catalog
                  </label>
                  {card.pdfUrl && (
                    <a
                      href={card.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Preview File</span>
                    </a>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={card.pdfUrl || ''}
                    onChange={(e) => handleUpdateField(idx, 'pdfUrl', e.target.value)}
                    placeholder="PDF URL (e.g. /catalogs/wiek.pdf)"
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-slate-50/60 focus:bg-white outline-none focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => triggerUpload(idx, 'pdf')}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload PDF</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={card.buttonText || 'Open Catalog'}
                    onChange={(e) => handleUpdateField(idx, 'buttonText', e.target.value)}
                    placeholder="e.g. Open Catalog"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50/60 focus:bg-white outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
