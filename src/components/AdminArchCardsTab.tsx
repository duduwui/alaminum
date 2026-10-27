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
  FolderOpen,
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

  // Sync if prop updates from outside
  useEffect(() => {
    if (archCards && archCards.length > 0) {
      setCards(archCards);
    }
  }, [archCards]);

  // Load from remote shared CMS on mount
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
    onSaveFeedback('✓ تم إضافة بطاقة كتالوج جديدة بنجاح!');
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= cards.length) return;
    const updated = [...cards];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    persistCards(updated);
    onSaveFeedback(`✓ تم نقل الكتالوج إلى الترتيب #${target + 1}`);
  };

  const handleDeleteCard = (index: number) => {
    if (cards.length <= 1) {
      alert('يجب أن تحتوي الصفحة على كتالوج واحد على الأقل.');
      return;
    }
    const cardTitle = cards[index]?.translations?.ar?.title || cards[index]?.title || `كتالوج #${index + 1}`;
    if (!confirm(`هل أنت متأكد من حذف "${cardTitle}"؟`)) return;
    const updated = cards.filter((_, i) => i !== index);
    persistCards(updated);
    onSaveFeedback('✓ تم حذف الكتالوج بنجاح.');
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
      current.titleKu = value;
    } else if (field === 'description') {
      current.description = value;
      current.descriptionAr = value;
      current.descriptionKu = value;
    } else if (field === 'buttonText') {
      current.buttonText = value;
      current.buttonTextAr = value;
      current.buttonTextKu = value;
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
      title: 'نظام وإكسسوار معماري جديد',
      titleAr: 'نظام وإكسسوار معماري جديد',
      description: 'تفاصيل ومواصفات هندسية متطورة مصممة للمشاريع المودرن الفاخرة مع أعلى معايير العزل والأمان.',
      descriptionAr: 'تفاصيل ومواصفات هندسية متطورة مصممة للمشاريع المودرن الفاخرة مع أعلى معايير العزل والأمان.',
      pdfUrl: '/catalogs/stac-hardware-accessories.pdf',
      buttonText: 'فتح الكتالوج المعتمد (PDF)',
      buttonTextAr: 'فتح الكتالوج المعتمد (PDF)',
      brand: 'نظام أوروبي معتمد'
    };
    const updated = [...showcaseItems, newItem];
    persistShowcase(updated);
    onSaveFeedback('✓ تم إضافة شريحة نظام/إكسسوار جديدة بنجاح!');
  };

  const handleMoveShowcaseItem = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= showcaseItems.length) return;
    const updated = [...showcaseItems];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    persistShowcase(updated);
    onSaveFeedback(`✓ تم نقل الشريحة إلى الترتيب #${target + 1}`);
  };

  const handleDeleteShowcaseItem = (index: number) => {
    if (showcaseItems.length <= 1) {
      alert('يجب أن تحتوي شريحة الأنظمة على عنصر واحد على الأقل.');
      return;
    }
    const itemTitle = showcaseItems[index]?.titleAr || showcaseItems[index]?.title || `شريحة #${index + 1}`;
    if (!confirm(`هل أنت متأكد من حذف "${itemTitle}"؟`)) return;
    const updated = showcaseItems.filter((_, i) => i !== index);
    persistShowcase(updated);
    onSaveFeedback('✓ تم حذف شريحة النظام بنجاح.');
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
          onSaveFeedback(`✓ تم تحديث صورة الكتالوج #${index + 1}`);
        } else if (field === 'pdf') {
          updated[index] = { ...updated[index], pdfUrl: url, fileName: file.name };
          onSaveFeedback(`✓ تم رفع ملف الـ PDF للكتالوج #${index + 1}`);
        }
        persistCards(updated);
      } else if (section === 'showcase') {
        const updated = [...showcaseItems];
        if (field === 'image') {
          updated[index] = { ...updated[index], image: url };
          onSaveFeedback(`✓ تم تحديث صورة النظام #${index + 1}`);
        } else if (field === 'pdf') {
          updated[index] = { ...updated[index], pdfUrl: url, fileName: file.name };
          onSaveFeedback(`✓ تم رفع ملف الـ PDF للنظام #${index + 1}`);
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
    <div className="space-y-10" dir="rtl">
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

      {/* TOP NOTIFICATION / HELPER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-sm border border-slate-700/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-xl font-black tracking-tight">
                إدارة قسم العمارة والكتالوجات الهندسية
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              هذه الصفحة مقسمة إلى قسمين رئيسيين وفقاً لتصميم الموقع. لا داعي لكتابة النصوص باللغة الإنجليزية، يكفي إدخال العناوين والوصف باللغة العربية وسيتم تطبيقها مباشرة على الموقع.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 shrink-0">
            <span>اللغة المدخلة:</span>
            <span className="text-emerald-400">العربية فقط</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: PDF ARCHITECTURE CARDS (European Catalogues: WIEK, STAC, etc.) */}
      {/* ========================================================================= */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                القسم الأول: كتالوجات الشركاء المعماريين (PDF)
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg ms-2">
                  {cards.length} كتالوجات
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              البطاقات المعروضة في أعلى قسم العمارة في الصفحة الرئيسية (مثل كتالوج WIEK بلجيكا وSTAC إسبانيا). يمكنك إضافة بطاقات جديدة، رفع صور الغلاف والشعارات، وإرفاق ملف الـ PDF.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddCard}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>إضافة كتالوج جديد</span>
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, idx) => {
            const cardTitleAr = card.translations?.ar?.title || card.title || '';
            const cardDescAr = card.translations?.ar?.desc || card.desc || '';
            const cardBtnAr = card.translations?.ar?.buttonText || card.buttonText || 'فتح الكتالوج (PDF)';

            return (
              <div
                key={card.id || idx}
                className="bg-slate-50/50 rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-xs flex flex-col justify-between gap-4 transition-all"
              >
                {/* Header Controls: Number & Sorting */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-red-600 text-white font-mono font-black text-xs">
                      كتالوج #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[180px]">
                      {cardTitleAr || `كتالوج #${idx + 1}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveCard(idx, 'up')}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-20 text-slate-700 transition-colors cursor-pointer"
                      title="تحريك لأعلى"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === cards.length - 1}
                      onClick={() => handleMoveCard(idx, 'down')}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-20 text-slate-700 transition-colors cursor-pointer"
                      title="تحريك لأسفل"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCard(idx)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer ms-1"
                      title="حذف الكتالوج"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 1. Card Cover Image */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-700">
                    صورة غلاف الكتالوج / النظام *
                  </label>
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center group p-3">
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
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-1 text-xs">
                        <ImageIcon className="w-8 h-8 opacity-40" />
                        <span>لم يتم رفع صورة</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
                      <button
                        type="button"
                        onClick={() => triggerUpload('cards', idx, 'image')}
                        className="px-3.5 py-2 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>استبدال الصورة</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => triggerUpload('cards', idx, 'image')}
                    className="w-full py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {isUploading && activeUploadTarget?.section === 'cards' && activeUploadTarget?.index === idx && activeUploadTarget.field === 'image'
                        ? 'جاري رفع الصورة…'
                        : 'رفع / تغيير صورة الغلاف'}
                    </span>
                  </button>
                </div>

                {/* 2. Arabic Title */}
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    عنوان الكتالوج (بالعربية) *
                  </label>
                  <input
                    type="text"
                    value={cardTitleAr}
                    onChange={(e) => handleUpdateCardField(idx, 'title', e.target.value)}
                    placeholder="مثال: كتالوج شركة WIEK بلجيكا للأنظمة المعمارية"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 bg-white focus:border-red-500 outline-none"
                  />
                </div>

                {/* 3. Arabic Description */}
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    شرح ومواصفات الكتالوج (بالعربية) *
                  </label>
                  <textarea
                    value={cardDescAr}
                    onChange={(e) => handleUpdateCardField(idx, 'desc', e.target.value)}
                    placeholder="مثال: المفصلات المخفية والأنظمة المعمارية المعتمدة 2026..."
                    rows={2}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-white focus:border-red-500 outline-none resize-y leading-relaxed"
                  />
                </div>

                {/* 4. Company / Partner Name */}
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    اسم الشركة / الشريك
                  </label>
                  <input
                    type="text"
                    value={card.company || card.brand || ''}
                    onChange={(e) => handleUpdateCardField(idx, 'company', e.target.value)}
                    placeholder="مثال: WIEK Belgium أو STAC Spain"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 bg-white focus:border-red-500 outline-none"
                  />
                </div>

                {/* 5. PDF File & Button Text */}
                <div className="space-y-2 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between gap-2">
                    <label className="block text-[11px] font-black text-slate-700">
                      ملف الكتالوج الفني (PDF) *
                    </label>
                    {card.pdfUrl && (
                      <a
                        href={card.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>معاينة ملف PDF</span>
                      </a>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={card.pdfUrl || ''}
                      onChange={(e) => handleUpdateCardField(idx, 'pdfUrl', e.target.value)}
                      placeholder="/catalogs/wiek-general-catalog-2026.pdf"
                      dir="ltr"
                      className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-white focus:border-red-500 outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => triggerUpload('cards', idx, 'pdf')}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>رفع PDF</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-700 mb-1">
                      نص الزر (مثال: فتح الكتالوج PDF)
                    </label>
                    <input
                      type="text"
                      value={cardBtnAr}
                      onChange={(e) => handleUpdateCardField(idx, 'buttonText', e.target.value)}
                      placeholder="فتح الكتالوج (PDF)"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 bg-white focus:border-red-500 outline-none"
                    />
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
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                القسم الثاني: بطاقات أنظمة وإكسسوارات العمارة التفاعلية
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg ms-2">
                  {showcaseItems.length} شرائح
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              معرض الأنظمة والإكسسوارات التفاعلي الدوار (Slider) أسفل الكتالوجات (المفصلات المخفية، المقابض، وتروس السحب والرفع). يمكنك إضافة بطاقات جديدة، رفع صور المخططات والإكسسوارات، وربط كل نظام بالكتالوج الفني الخاص به.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddShowcaseItem}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>إضافة بطاقة نظام جديدة</span>
          </button>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {showcaseItems.map((item, idx) => {
            const itemTitleAr = item.titleAr || item.title || '';
            const itemDescAr = item.descriptionAr || item.description || '';
            const itemBtnAr = item.buttonTextAr || item.buttonText || 'فتح الكتالوج المعتمد (PDF)';

            return (
              <div
                key={item.id || idx}
                className="bg-slate-50/50 rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-xs flex flex-col justify-between gap-4 transition-all"
              >
                {/* Header Controls: Number & Sorting */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-white font-mono font-black text-xs">
                      شريحة #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[180px]">
                      {itemTitleAr || `نظام #${idx + 1}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveShowcaseItem(idx, 'up')}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-20 text-slate-700 transition-colors cursor-pointer"
                      title="تحريك لأعلى"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === showcaseItems.length - 1}
                      onClick={() => handleMoveShowcaseItem(idx, 'down')}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-20 text-slate-700 transition-colors cursor-pointer"
                      title="تحريك لأسفل"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteShowcaseItem(idx)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer ms-1"
                      title="حذف النظام"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 1. Accessory / Drawing Image */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-700">
                    صورة الإكسسوار / المخطط الهندسي للنظام *
                  </label>
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center group p-3">
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
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-1 text-xs">
                        <ImageIcon className="w-8 h-8 opacity-40" />
                        <span>لم يتم رفع مخطط أو صورة</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
                      <button
                        type="button"
                        onClick={() => triggerUpload('showcase', idx, 'image')}
                        className="px-3.5 py-2 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>استبدال الصورة</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => triggerUpload('showcase', idx, 'image')}
                    className="w-full py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {isUploading && activeUploadTarget?.section === 'showcase' && activeUploadTarget?.index === idx && activeUploadTarget.field === 'image'
                        ? 'جاري رفع الصورة…'
                        : 'رفع / تغيير صورة الإكسسوار أو المخطط'}
                    </span>
                  </button>
                </div>

                {/* 2. Arabic Title */}
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    عنوان النظام أو الإكسسوار (بالعربية) *
                  </label>
                  <input
                    type="text"
                    value={itemTitleAr}
                    onChange={(e) => handleUpdateShowcaseField(idx, 'title', e.target.value)}
                    placeholder="مثال: نظام WIEK للمفصلات المخفية الفاخرة"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 bg-white focus:border-red-500 outline-none"
                  />
                </div>

                {/* 3. Arabic Description */}
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    شرح ومواصفات النظام (بالعربية) *
                  </label>
                  <textarea
                    value={itemDescAr}
                    onChange={(e) => handleUpdateShowcaseField(idx, 'description', e.target.value)}
                    placeholder="مثال: مفصلات مخفية بالكامل مدمجة داخل قطاع الألمنيوم والـ uPVC مصممة للمشاريع المودرن الفاخرة بتحمل وزن يصل إلى 130 كغم..."
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-white focus:border-red-500 outline-none resize-y leading-relaxed"
                  />
                </div>

                {/* 4. Brand / Series */}
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    اسم الماركة / النظام
                  </label>
                  <input
                    type="text"
                    value={item.brand || ''}
                    onChange={(e) => handleUpdateShowcaseField(idx, 'brand', e.target.value)}
                    placeholder="مثال: WIEK SYSTEM أو STAC Spain"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 bg-white focus:border-red-500 outline-none"
                  />
                </div>

                {/* 5. PDF File & Button Text */}
                <div className="space-y-2 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between gap-2">
                    <label className="block text-[11px] font-black text-slate-700">
                      ملف الكتالوج الفني (PDF) *
                    </label>
                    {item.pdfUrl && (
                      <a
                        href={item.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>معاينة ملف PDF</span>
                      </a>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={item.pdfUrl || ''}
                      onChange={(e) => handleUpdateShowcaseField(idx, 'pdfUrl', e.target.value)}
                      placeholder="/catalogs/stac-hardware-accessories.pdf"
                      dir="ltr"
                      className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-white focus:border-red-500 outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => triggerUpload('showcase', idx, 'pdf')}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>رفع PDF</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-700 mb-1">
                      نص الزر (مثال: فتح الكتالوج المعتمد PDF)
                    </label>
                    <input
                      type="text"
                      value={itemBtnAr}
                      onChange={(e) => handleUpdateShowcaseField(idx, 'buttonText', e.target.value)}
                      placeholder="فتح الكتالوج المعتمد (PDF)"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 bg-white focus:border-red-500 outline-none"
                    />
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
