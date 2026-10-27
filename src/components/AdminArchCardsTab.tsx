import React, { useState, useRef, useEffect } from 'react';
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
  Image as ImageIcon,
  Languages
} from 'lucide-react';
import {
  ArchitectureShowcaseItem,
  DEFAULT_ARCHITECTURE_SHOWCASE_ITEMS,
  loadArchitectureShowcaseItems,
  saveArchitectureShowcaseItems,
  ArchitectureCatalogueCard,
  DEFAULT_CATALOGUE_CARDS,
  loadArchitectureCards,
  saveArchitectureCards
} from '../services/architectureCardsService';
import { saveSharedCmsSection, loadSharedCmsSection } from '../services/cmsService';
import { useLanguage } from '../context/LanguageContext';

interface AdminArchCardsTabProps {
  onUploadMedia: (file: File) => Promise<string>;
  onSaveFeedback: (msg: string) => void;
  archCards?: ArchitectureCatalogueCard[];
  onUpdateArchCards?: (cards: ArchitectureCatalogueCard[]) => void;
}

export const AdminArchCardsTab: React.FC<AdminArchCardsTabProps> = ({
  onUploadMedia,
  onSaveFeedback
}) => {
  const { currentLanguage } = useLanguage();
  const isAr = currentLanguage.code === 'ar' || currentLanguage.code.startsWith('ar');

  // 1. Architecture Systems Showcase (The interactive 1/4 slider with drawings, titles, descriptions & PDF)
  const [showcaseItems, setShowcaseItems] = useState<ArchitectureShowcaseItem[]>(() =>
    loadArchitectureShowcaseItems()
  );

  useEffect(() => {
    void (async () => {
      try {
        const remote = await loadSharedCmsSection<ArchitectureShowcaseItem[]>('archShowcase');
        if (remote && Array.isArray(remote) && remote.length > 0) {
          setShowcaseItems(remote);
          saveArchitectureShowcaseItems(remote);
        }
      } catch {}
    })();
  }, []);

  const [activeUploadTarget, setActiveUploadTarget] = useState<{
    itemIndex: number;
    type: 'image' | 'pdf';
  } | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const persistShowcase = (updated: ArchitectureShowcaseItem[]) => {
    setShowcaseItems(updated);
    saveArchitectureShowcaseItems(updated);
    void saveSharedCmsSection('archShowcase', updated);
  };

  const handleUpdateField = (
    index: number,
    field: keyof ArchitectureShowcaseItem,
    value: string
  ) => {
    const updated = [...showcaseItems];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    persistShowcase(updated);
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= showcaseItems.length) return;

    const updated = [...showcaseItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    persistShowcase(updated);
    onSaveFeedback(`✓ Moved system card to position #${targetIndex + 1}`);
  };

  const handleDeleteItem = (index: number) => {
    if (showcaseItems.length <= 1) {
      alert('You must have at least one architecture system card.');
      return;
    }
    const itemTitle = showcaseItems[index]?.title || `Card #${index + 1}`;
    if (!confirm(`Delete "${itemTitle}"?`)) return;

    const updated = showcaseItems.filter((_, i) => i !== index);
    persistShowcase(updated);
    onSaveFeedback('✓ Architecture system card deleted.');
  };

  const handleAddItem = () => {
    const newItem: ArchitectureShowcaseItem = {
      id: `system-${Date.now()}`,
      image: '/assets/showcase/wiek_hidden_hinge-04.png',
      title: 'New Architectural System',
      titleAr: 'نظام معماري وهندسي جديد',
      description: 'Precision architectural profile engineering with multi-point perimeter security locking.',
      descriptionAr: 'أنظمة هندسية معمارية متطورة مصممة للمشاريع المودرن الفاخرة مع نقاط إغلاق محكمة.',
      pdfUrl: '/catalogs/wiek-general-catalog-2026.pdf',
      buttonText: 'Open Technical Catalog (PDF)',
      buttonTextAr: 'فتح الكتالوج المعتمد (PDF)',
      brand: 'European Partner'
    };

    const updated = [...showcaseItems, newItem];
    persistShowcase(updated);
    onSaveFeedback('✓ Added new architecture system card. Upload drawing image and PDF below.');
  };

  const triggerUpload = (itemIndex: number, type: 'image' | 'pdf') => {
    setActiveUploadTarget({ itemIndex, type });
    if (type === 'image') imageInputRef.current?.click();
    else if (type === 'pdf') pdfInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadTarget) return;

    try {
      setIsUploading(true);
      const url = await onUploadMedia(file);
      const { itemIndex, type } = activeUploadTarget;

      const updated = [...showcaseItems];
      if (type === 'image') {
        updated[itemIndex] = { ...updated[itemIndex], image: url };
        onSaveFeedback(`✓ Slide #${itemIndex + 1} image updated!`);
      } else if (type === 'pdf') {
        updated[itemIndex] = { ...updated[itemIndex], pdfUrl: url, fileName: file.name };
        onSaveFeedback(`✓ Slide #${itemIndex + 1} PDF file uploaded!`);
      }

      persistShowcase(updated);
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
      {/* Hidden file inputs for image and PDF uploads */}
      <input
        ref={imageInputRef}
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
                {isAr
                  ? `أنظمة الواجهات والعمارة التفاعلية (${showcaseItems.length})`
                  : `Architecture Systems & Drawings Showcase (${showcaseItems.length})`}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {isAr
                ? 'إدارة شرائح العرض المعماري والهندسي التفاعلي المعروضة على الصفحة الرئيسية. تحتوي كل بطاقة على الرسم التخطيطي/الصورة، العنوان والوصف باللغتين العربية والإنجليزية، والكتالوج الفني المعتمد PDF.'
                : 'Manage the architectural systems slideshow rendered on the homepage. Each card includes its technical drawing/image, title and description in both English and Arabic, and downloadable technical PDF file.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleAddItem}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{isAr ? 'إضافة بطاقة نظام جديدة' : 'Add New Architecture System Card'}</span>
            </button>
          </div>
        </div>

        {/* System Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {showcaseItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-xs flex flex-col justify-between gap-4 transition-all"
            >
              {/* Card Header: Slot & Order Controls */}
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-white font-mono font-black text-xs">
                    SLIDE #{String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-bold text-slate-700 truncate max-w-[180px]">
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveItem(idx, 'up')}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-700 transition-colors cursor-pointer"
                    title="Move Earlier in Slideshow"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === showcaseItems.length - 1}
                    onClick={() => handleMoveItem(idx, 'down')}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-700 transition-colors cursor-pointer"
                    title="Move Later in Slideshow"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(idx)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer ms-1"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 1. Technical Drawing / System Diagram Image */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Technical Drawing / System Diagram Image *
                </label>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center group p-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/showcase/wiek_hidden_hinge-04.png';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-1 text-xs">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                      <span>No Diagram Uploaded</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
                    <button
                      type="button"
                      onClick={() => triggerUpload(idx, 'image')}
                      className="px-3.5 py-2 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Replace Drawing Image</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => triggerUpload(idx, 'image')}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {isUploading && activeUploadTarget?.itemIndex === idx && activeUploadTarget.type === 'image'
                      ? 'Uploading Image…'
                      : 'Upload / Replace Drawing Image'}
                  </span>
                </button>
              </div>

              {/* 2. Titles in English & Arabic */}
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    System Title (English) *
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateField(idx, 'title', e.target.value)}
                    placeholder="e.g. WIEK Concealed Tilt & Turn System"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 bg-slate-50/60 focus:bg-white outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
                    <span>عنوان النظام (العربية) *</span>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">يظهر عند اختيار العربية</span>
                  </label>
                  <input
                    type="text"
                    value={item.titleAr || ''}
                    onChange={(e) => handleUpdateField(idx, 'titleAr', e.target.value)}
                    placeholder="مثال: نظام WIEK للمفصلات المخفية"
                    dir="rtl"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 bg-slate-50/60 focus:bg-white outline-none focus:border-red-500 text-right"
                  />
                </div>
              </div>

              {/* 3. Descriptions in English & Arabic */}
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    System Description (English) *
                  </label>
                  <textarea
                    value={item.description}
                    onChange={(e) => handleUpdateField(idx, 'description', e.target.value)}
                    placeholder="Flush concealed hinge mechanism engineered for modern minimalist architecture with 130 kg sash load capacity..."
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-slate-50/60 focus:bg-white outline-none focus:border-red-500 resize-y leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
                    <span>شرح ومواصفات النظام (العربية) *</span>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">يظهر عند اختيار العربية</span>
                  </label>
                  <textarea
                    value={item.descriptionAr || ''}
                    onChange={(e) => handleUpdateField(idx, 'descriptionAr', e.target.value)}
                    placeholder="مفصلات مخفية بالكامل مدمجة داخل قطاع الألمنيوم والـ uPVC مصممة للمشاريع المودرن الفاخرة بتحمل وزن يصل إلى 130 كغم..."
                    rows={3}
                    dir="rtl"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-slate-50/60 focus:bg-white outline-none focus:border-red-500 resize-y leading-relaxed text-right"
                  />
                </div>
              </div>

              {/* 4. PDF File & Button Labels */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Technical PDF Catalog File *
                  </label>
                  {item.pdfUrl && (
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Preview PDF</span>
                    </a>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={item.pdfUrl || ''}
                    onChange={(e) => handleUpdateField(idx, 'pdfUrl', e.target.value)}
                    placeholder="PDF URL (e.g. /catalogs/wiek.pdf)"
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-slate-50/60 focus:bg-white outline-none focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => triggerUpload(idx, 'pdf')}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload PDF</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      Button Label (EN)
                    </label>
                    <input
                      type="text"
                      value={item.buttonText || 'Open Technical Catalog (PDF)'}
                      onChange={(e) => handleUpdateField(idx, 'buttonText', e.target.value)}
                      placeholder="Open Technical Catalog (PDF)"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50/60 focus:bg-white outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1 text-right">
                      نص الزر (العربية)
                    </label>
                    <input
                      type="text"
                      value={item.buttonTextAr || 'فتح الكتالوج المعتمد (PDF)'}
                      onChange={(e) => handleUpdateField(idx, 'buttonTextAr', e.target.value)}
                      placeholder="فتح الكتالوج المعتمد (PDF)"
                      dir="rtl"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50/60 focus:bg-white outline-none focus:border-red-500 text-right"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
