import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Upload,
  Check,
  ExternalLink,
  Layers,
  Save,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Eye
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

interface AdminArchCardsTabProps {
  onUploadMedia: (file: File) => Promise<string>;
  onSaveFeedback: (msg: string) => void;
  archCards?: ArchitectureCatalogueCard[];
  onUpdateArchCards?: (cards: ArchitectureCatalogueCard[]) => void;
}

export const AdminArchCardsTab: React.FC<AdminArchCardsTabProps> = ({
  onUploadMedia,
  onSaveFeedback,
  archCards,
  onUpdateArchCards
}) => {
  // -------------------------------------------------------------
  // SECTION 1: PDF Architecture Catalogue Cards (WIEK & STAC etc.)
  // -------------------------------------------------------------
  const [cards, setCards] = useState<ArchitectureCatalogueCard[]>(() => {
    if (archCards && archCards.length > 0) return archCards;
    return loadArchitectureCards();
  });

  useEffect(() => {
    if (archCards && archCards.length > 0) {
      setCards(archCards);
    }
  }, [archCards]);

  useEffect(() => {
    void (async () => {
      try {
        const remoteCards = await loadSharedCmsSection<ArchitectureCatalogueCard[]>('archCards');
        if (remoteCards && Array.isArray(remoteCards) && remoteCards.length > 0) {
          setCards(remoteCards);
          saveArchitectureCards(remoteCards);
          onUpdateArchCards?.(remoteCards);
        }
      } catch {}
    })();
  }, []);

  const persistCards = (updated: ArchitectureCatalogueCard[]) => {
    setCards(updated);
    saveArchitectureCards(updated);
    void saveSharedCmsSection('archCards', updated);
    if (onUpdateArchCards) {
      onUpdateArchCards(updated);
    }
  };

  const handleUpdateCardField = (
    index: number,
    field: 'title' | 'desc' | 'buttonText' | 'pdfUrl' | 'company' | 'brand' | 'image',
    value: string
  ) => {
    const updated = [...cards];
    const current = { ...updated[index] };

    if (field === 'title') {
      current.title = value;
      current.translations = {
        ...current.translations,
        ar: { ...(current.translations?.ar || {}), title: value },
        en: { ...(current.translations?.en || {}), title: value },
        ckb: { ...(current.translations?.ckb || {}), title: value }
      };
    } else if (field === 'desc') {
      current.desc = value;
      current.translations = {
        ...current.translations,
        ar: { ...(current.translations?.ar || {}), desc: value },
        en: { ...(current.translations?.en || {}), desc: value },
        ckb: { ...(current.translations?.ckb || {}), desc: value }
      };
    } else if (field === 'buttonText') {
      current.buttonText = value;
      current.translations = {
        ...current.translations,
        ar: { ...(current.translations?.ar || {}), buttonText: value },
        en: { ...(current.translations?.en || {}), buttonText: value },
        ckb: { ...(current.translations?.ckb || {}), buttonText: value }
      };
    } else if (field === 'company') {
      current.company = value;
      current.brand = value;
    } else {
      (current as any)[field] = value;
    }

    updated[index] = current;
    persistCards(updated);
  };

  const handleAddCard = () => {
    const newCard: ArchitectureCatalogueCard = {
      id: `cat-${Date.now()}`,
      brand: 'كتالوج معماري جديد',
      company: 'كتالوج شريك معتمد',
      logo: '',
      image: '/assets/showcase/wiek_hidden_hinge-04.png',
      title: 'كتالوج معماري جديد',
      desc: 'مواصفات وأنظمة معمارية فاخرة للأبواب والنوافذ والواجهات الزجاجية.',
      pdfUrl: '/catalogs/wiek-general-catalog-2026.pdf',
      buttonText: 'فتح الكتالوج (PDF)',
      translations: {
        ar: {
          title: 'كتالوج معماري جديد',
          desc: 'مواصفات وأنظمة معمارية فاخرة للأبواب والنوافذ والواجهات الزجاجية.',
          buttonText: 'فتح الكتالوج (PDF)'
        }
      }
    };
    const updated = [...cards, newCard];
    persistCards(updated);
    onSaveFeedback('✓ تم إضافة بطاقة كتالوج جديدة');
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= cards.length) return;
    const updated = [...cards];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    persistCards(updated);
    onSaveFeedback(`✓ تم تعديل الترتيب`);
  };

  const handleDeleteCard = (index: number) => {
    if (cards.length <= 1) {
      alert('يجب أن تحتوي الصفحة على كتالوج واحد على الأقل.');
      return;
    }
    const cardTitle = cards[index]?.translations?.ar?.title || cards[index]?.title || `كتالوج #${index + 1}`;
    if (!confirm(`حذف "${cardTitle}"؟`)) return;
    const updated = cards.filter((_, i) => i !== index);
    persistCards(updated);
    onSaveFeedback('✓ تم حذف الكتالوج.');
  };

  // -------------------------------------------------------------
  // SECTION 2: Architecture Systems & Accessories Showcase (Slider)
  // -------------------------------------------------------------
  const [showcaseItems, setShowcaseItems] = useState<ArchitectureShowcaseItem[]>(() =>
    loadArchitectureShowcaseItems()
  );

  useEffect(() => {
    void (async () => {
      try {
        const remoteShowcase = await loadSharedCmsSection<ArchitectureShowcaseItem[]>('archShowcase');
        if (remoteShowcase && Array.isArray(remoteShowcase) && remoteShowcase.length > 0) {
          setShowcaseItems(remoteShowcase);
          saveArchitectureShowcaseItems(remoteShowcase);
        }
      } catch {}
    })();
  }, []);

  const persistShowcase = (updated: ArchitectureShowcaseItem[]) => {
    setShowcaseItems(updated);
    saveArchitectureShowcaseItems(updated);
    void saveSharedCmsSection('archShowcase', updated);
  };

  const handleUpdateShowcaseField = (
    index: number,
    field: 'title' | 'description' | 'buttonText' | 'pdfUrl' | 'brand' | 'image',
    value: string
  ) => {
    const updated = [...showcaseItems];
    const current = { ...updated[index] };

    if (field === 'title') {
      current.title = value;
      current.titleAr = value;
    } else if (field === 'description') {
      current.description = value;
      current.descriptionAr = value;
    } else if (field === 'buttonText') {
      current.buttonText = value;
      current.buttonTextAr = value;
    } else {
      (current as any)[field] = value;
    }

    updated[index] = current;
    persistShowcase(updated);
  };

  const handleAddShowcaseItem = () => {
    const newItem: ArchitectureShowcaseItem = {
      id: `system-${Date.now()}`,
      image: '/assets/showcase/stac_window_handles-044.png',
      title: 'نظام معماري جديد',
      titleAr: 'نظام معماري جديد',
      description: 'تفاصيل ومواصفات هندسية متطورة مصممة للمشاريع المودرن الفاخرة مع أعلى معايير العزل والأمان.',
      descriptionAr: 'تفاصيل ومواصفات هندسية متطورة مصممة للمشاريع المودرن الفاخرة مع أعلى معايير العزل والأمان.',
      pdfUrl: '/catalogs/stac-hardware-accessories.pdf',
      buttonText: 'فتح الكتالوج المعتمد (PDF)',
      buttonTextAr: 'فتح الكتالوج المعتمد (PDF)',
      brand: 'نظام أوروبي معتمد'
    };
    const updated = [...showcaseItems, newItem];
    persistShowcase(updated);
    onSaveFeedback('✓ تم إضافة شريحة نظام جديدة');
  };

  const handleMoveShowcaseItem = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= showcaseItems.length) return;
    const updated = [...showcaseItems];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    persistShowcase(updated);
    onSaveFeedback(`✓ تم تعديل الترتيب`);
  };

  const handleDeleteShowcaseItem = (index: number) => {
    if (showcaseItems.length <= 1) {
      alert('يجب أن تحتوي شريحة الأنظمة على عنصر واحد على الأقل.');
      return;
    }
    const itemTitle = showcaseItems[index]?.titleAr || showcaseItems[index]?.title || `شريحة #${index + 1}`;
    if (!confirm(`حذف "${itemTitle}"؟`)) return;
    const updated = showcaseItems.filter((_, i) => i !== index);
    persistShowcase(updated);
    onSaveFeedback('✓ تم حذف شريحة النظام.');
  };

  // -------------------------------------------------------------
  // UNIFIED UPLOAD CONTROLLER
  // -------------------------------------------------------------
  const [activeUploadTarget, setActiveUploadTarget] = useState<{
    section: 'cards' | 'showcase';
    index: number;
    field: 'image' | 'pdf';
  } | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const triggerUpload = (
    section: 'cards' | 'showcase',
    index: number,
    field: 'image' | 'pdf'
  ) => {
    setActiveUploadTarget({ section, index, field });
    if (field === 'image') {
      imageInputRef.current?.click();
    } else {
      pdfInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadTarget) return;

    try {
      setIsUploading(true);
      const url = await onUploadMedia(file);
      const { section, index, field } = activeUploadTarget;

      if (section === 'cards') {
        const updated = [...cards];
        if (field === 'image') {
          updated[index] = { ...updated[index], image: url };
          onSaveFeedback(`✓ تم تحديث صورة الكتالوج`);
        } else if (field === 'pdf') {
          updated[index] = { ...updated[index], pdfUrl: url, fileName: file.name };
          onSaveFeedback(`✓ تم رفع ملف الـ PDF`);
        }
        persistCards(updated);
      } else if (section === 'showcase') {
        const updated = [...showcaseItems];
        if (field === 'image') {
          updated[index] = { ...updated[index], image: url };
          onSaveFeedback(`✓ تم تحديث صورة النظام`);
        } else if (field === 'pdf') {
          updated[index] = { ...updated[index], pdfUrl: url, fileName: file.name };
          onSaveFeedback(`✓ تم رفع ملف الـ PDF`);
        }
        persistShowcase(updated);
      }
    } catch (err: any) {
      alert(err.message || 'فشل في رفع الملف');
    } finally {
      setIsUploading(false);
      setActiveUploadTarget(null);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Hidden file upload inputs */}
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

      {/* ========================================================================= */}
      {/* SECTION 1: PDF ARCHITECTURE CARDS (European Catalogues: WIEK, STAC, etc.) */}
      {/* ========================================================================= */}
      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <h3 className="text-base font-black text-slate-900">
              كتالوجات الشركاء المعماريين ({cards.length})
            </h3>
            <span className="text-[11px] text-slate-400 font-normal">
              (البطاقات العلوية في صفحة العمارة)
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddCard}
            className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>إضافة كتالوج</span>
          </button>
        </div>

        {/* Compact Cards List */}
        <div className="space-y-3">
          {cards.map((card, idx) => {
            const cardTitleAr = card.translations?.ar?.title || card.title || '';
            const cardDescAr = card.translations?.ar?.desc || card.desc || '';
            const cardBtnAr = card.translations?.ar?.buttonText || card.buttonText || 'فتح الكتالوج (PDF)';

            return (
              <div
                key={card.id || idx}
                className="bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-3.5 transition-all shadow-2xs"
              >
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  {/* Thumbnail & Upload */}
                  <div className="w-full md:w-44 shrink-0 flex flex-col gap-1.5">
                    <div className="relative aspect-video md:aspect-[4/3] rounded-lg overflow-hidden bg-white border border-slate-200 flex items-center justify-center group p-1.5">
                      {card.image ? (
                        <img
                          src={card.image}
                          alt={cardTitleAr}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/showcase/wiek_hidden_hinge-04.png';
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-300" />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => triggerUpload('cards', idx, 'image')}
                      className="w-full py-1 px-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <Upload className="w-3 h-3 text-slate-500" />
                      <span>
                        {isUploading && activeUploadTarget?.section === 'cards' && activeUploadTarget?.index === idx && activeUploadTarget.field === 'image'
                          ? 'جاري الرفع…'
                          : 'تغيير الصورة'}
                      </span>
                    </button>
                  </div>

                  {/* Form Details (Compact & Clean) */}
                  <div className="flex-1 w-full space-y-2">
                    {/* Header Row: Badge, Title Input, Move & Delete */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono font-black text-[10px] shrink-0">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <input
                          type="text"
                          value={cardTitleAr}
                          onChange={(e) => handleUpdateCardField(idx, 'title', e.target.value)}
                          placeholder="عنوان الكتالوج (مثال: كتالوج شركة WIEK بلجيكا)"
                          className="flex-1 font-bold text-xs text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-red-400"
                        />
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveCard(idx, 'up')}
                          className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-20 text-slate-600 transition-colors cursor-pointer"
                          title="تحريك لأعلى"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === cards.length - 1}
                          onClick={() => handleMoveCard(idx, 'down')}
                          className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-20 text-slate-600 transition-colors cursor-pointer"
                          title="تحريك لأسفل"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCard(idx)}
                          className="p-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer ms-0.5"
                          title="حذف"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Description Textarea */}
                    <textarea
                      value={cardDescAr}
                      onChange={(e) => handleUpdateCardField(idx, 'desc', e.target.value)}
                      placeholder="وصف ومواصفات الكتالوج..."
                      rows={2}
                      className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-red-400 resize-none leading-relaxed"
                    />

                    {/* Bottom Inline Bar: Partner Name, PDF Upload, Button Text */}
                    <div className="flex flex-wrap md:flex-nowrap items-center gap-2 pt-1 border-t border-slate-200/70">
                      <input
                        type="text"
                        value={card.company || card.brand || ''}
                        onChange={(e) => handleUpdateCardField(idx, 'company', e.target.value)}
                        placeholder="اسم الشركة (WIEK Belgium)"
                        className="w-full md:w-1/3 text-[11px] text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-red-400"
                      />

                      <div className="flex items-center gap-1.5 flex-1 w-full">
                        <input
                          type="text"
                          value={card.pdfUrl || ''}
                          onChange={(e) => handleUpdateCardField(idx, 'pdfUrl', e.target.value)}
                          placeholder="رابط ملف PDF"
                          dir="ltr"
                          className="flex-1 font-mono text-[11px] text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-red-400"
                        />
                        <button
                          type="button"
                          onClick={() => triggerUpload('cards', idx, 'pdf')}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Upload className="w-3 h-3" />
                          <span>رفع PDF</span>
                        </button>
                        {card.pdfUrl && (
                          <a
                            href={card.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors shrink-0"
                            title="معاينة PDF"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      <input
                        type="text"
                        value={cardBtnAr}
                        onChange={(e) => handleUpdateCardField(idx, 'buttonText', e.target.value)}
                        placeholder="نص الزر"
                        className="w-full md:w-36 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-red-400 shrink-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: ACCESSORIES & SYSTEMS SHOWCASE (1/4 Slider with Handles, etc.) */}
      {/* ========================================================================= */}
      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <h3 className="text-base font-black text-slate-900">
              أنظمة ورسومات العمارة التفاعلية ({showcaseItems.length})
            </h3>
            <span className="text-[11px] text-slate-400 font-normal">
              (شريط السلايدر الدوار)
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddShowcaseItem}
            className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>إضافة شريحة</span>
          </button>
        </div>

        {/* Compact Showcase List */}
        <div className="space-y-3">
          {showcaseItems.map((item, idx) => {
            const itemTitleAr = item.titleAr || item.title || '';
            const itemDescAr = item.descriptionAr || item.description || '';
            const itemBtnAr = item.buttonTextAr || item.buttonText || 'فتح الكتالوج المعتمد (PDF)';

            return (
              <div
                key={item.id || idx}
                className="bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-3.5 transition-all shadow-2xs"
              >
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  {/* Thumbnail & Upload */}
                  <div className="w-full md:w-44 shrink-0 flex flex-col gap-1.5">
                    <div className="relative aspect-video md:aspect-[4/3] rounded-lg overflow-hidden bg-white border border-slate-200 flex items-center justify-center group p-1.5">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={itemTitleAr}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/showcase/wiek_hidden_hinge-04.png';
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-300" />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => triggerUpload('showcase', idx, 'image')}
                      className="w-full py-1 px-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <Upload className="w-3 h-3 text-slate-500" />
                      <span>
                        {isUploading && activeUploadTarget?.section === 'showcase' && activeUploadTarget?.index === idx && activeUploadTarget.field === 'image'
                          ? 'جاري الرفع…'
                          : 'تغيير الصورة'}
                      </span>
                    </button>
                  </div>

                  {/* Form Details (Compact & Clean) */}
                  <div className="flex-1 w-full space-y-2">
                    {/* Header Row: Badge, Title Input, Move & Delete */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono font-black text-[10px] shrink-0">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <input
                          type="text"
                          value={itemTitleAr}
                          onChange={(e) => handleUpdateShowcaseField(idx, 'title', e.target.value)}
                          placeholder="عنوان النظام (مثال: نظام WIEK للمفصلات المخفية)"
                          className="flex-1 font-bold text-xs text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-red-400"
                        />
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveShowcaseItem(idx, 'up')}
                          className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-20 text-slate-600 transition-colors cursor-pointer"
                          title="تحريك لأعلى"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === showcaseItems.length - 1}
                          onClick={() => handleMoveShowcaseItem(idx, 'down')}
                          className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-20 text-slate-600 transition-colors cursor-pointer"
                          title="تحريك لأسفل"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteShowcaseItem(idx)}
                          className="p-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer ms-0.5"
                          title="حذف"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Description Textarea */}
                    <textarea
                      value={itemDescAr}
                      onChange={(e) => handleUpdateShowcaseField(idx, 'description', e.target.value)}
                      placeholder="شرح ومواصفات النظام..."
                      rows={2}
                      className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-red-400 resize-none leading-relaxed"
                    />

                    {/* Bottom Inline Bar: Brand, PDF Upload, Button Text */}
                    <div className="flex flex-wrap md:flex-nowrap items-center gap-2 pt-1 border-t border-slate-200/70">
                      <input
                        type="text"
                        value={item.brand || ''}
                        onChange={(e) => handleUpdateShowcaseField(idx, 'brand', e.target.value)}
                        placeholder="الماركة / النظام (WIEK SYSTEM)"
                        className="w-full md:w-1/3 text-[11px] text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-red-400"
                      />

                      <div className="flex items-center gap-1.5 flex-1 w-full">
                        <input
                          type="text"
                          value={item.pdfUrl || ''}
                          onChange={(e) => handleUpdateShowcaseField(idx, 'pdfUrl', e.target.value)}
                          placeholder="رابط ملف PDF"
                          dir="ltr"
                          className="flex-1 font-mono text-[11px] text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-red-400"
                        />
                        <button
                          type="button"
                          onClick={() => triggerUpload('showcase', idx, 'pdf')}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Upload className="w-3 h-3" />
                          <span>رفع PDF</span>
                        </button>
                        {item.pdfUrl && (
                          <a
                            href={item.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors shrink-0"
                            title="معاينة PDF"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      <input
                        type="text"
                        value={itemBtnAr}
                        onChange={(e) => handleUpdateShowcaseField(idx, 'buttonText', e.target.value)}
                        placeholder="نص الزر"
                        className="w-full md:w-36 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-red-400 shrink-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
