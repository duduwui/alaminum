import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Upload,
  ExternalLink,
  Layers,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Eye,
  X,
  Check,
  Loader2
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
    field: 'title' | 'desc' | 'buttonText' | 'pdfUrl' | 'image',
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
    } else {
      (current as any)[field] = value;
    }

    updated[index] = current;
    persistCards(updated);
  };

  // Modal states for creating a new Catalogue Card
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDesc, setNewCardDesc] = useState('');
  const [newCardImage, setNewCardImage] = useState('/assets/showcase/wiek_hidden_hinge-04.png');
  const [newCardPdfUrl, setNewCardPdfUrl] = useState('');
  const [newCardPdfName, setNewCardPdfName] = useState('');
  const [newCardButtonText, setNewCardButtonText] = useState('فتح الكتالوج (PDF)');
  const [isUploadingNewCardImage, setIsUploadingNewCardImage] = useState(false);
  const [isUploadingNewCardPdf, setIsUploadingNewCardPdf] = useState(false);
  const newCardImageInputRef = useRef<HTMLInputElement>(null);
  const newCardPdfInputRef = useRef<HTMLInputElement>(null);

  const handleUploadNewCardImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingNewCardImage(true);
      const url = await onUploadMedia(file);
      setNewCardImage(url);
      onSaveFeedback('✓ تم رفع صورة الغلاف بنجاح');
    } catch (err: any) {
      alert(err.message || 'فشل في رفع الصورة');
    } finally {
      setIsUploadingNewCardImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleUploadNewCardPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingNewCardPdf(true);
      const url = await onUploadMedia(file);
      setNewCardPdfUrl(url);
      setNewCardPdfName(file.name);
      onSaveFeedback(`✓ تم رفع ملف الـ PDF: ${file.name}`);
    } catch (err: any) {
      alert(err.message || 'فشل في رفع ملف الـ PDF');
    } finally {
      setIsUploadingNewCardPdf(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveNewCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim()) {
      alert('يرجى كتابة اسم أو عنوان الكتالوج أولاً');
      return;
    }

    const finalTitle = newCardTitle.trim();
    const finalDesc = newCardDesc.trim() || 'مواصفات وأنظمة معمارية فاخرة للأبواب والنوافذ والواجهات الزجاجية.';
    const finalButton = newCardButtonText.trim() || 'فتح الكتالوج (PDF)';

    const newCard: ArchitectureCatalogueCard = {
      id: `cat-${Date.now()}`,
      brand: finalTitle,
      company: 'كتالوج شريك معتمد',
      logo: '',
      image: newCardImage || '/assets/showcase/wiek_hidden_hinge-04.png',
      title: finalTitle,
      desc: finalDesc,
      pdfUrl: newCardPdfUrl.trim() || '/catalogs/wiek-general-catalog-2026.pdf',
      fileName: newCardPdfName || undefined,
      buttonText: finalButton,
      translations: {
        ar: { title: finalTitle, desc: finalDesc, buttonText: finalButton },
        en: { title: finalTitle, desc: finalDesc, buttonText: finalButton },
        ckb: { title: finalTitle, desc: finalDesc, buttonText: finalButton }
      }
    };

    const updated = [...cards, newCard];
    persistCards(updated);
    onSaveFeedback(`✓ تم إنشاء وإضافة كتالوج "${finalTitle}" بنجاح!`);

    // Reset & close
    setIsAddCardModalOpen(false);
    setNewCardTitle('');
    setNewCardDesc('');
    setNewCardImage('/assets/showcase/wiek_hidden_hinge-04.png');
    setNewCardPdfUrl('');
    setNewCardPdfName('');
    setNewCardButtonText('فتح الكتالوج (PDF)');
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
  // SECTION 2: Architecture Systems Showcase (Slider)
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
    field: 'title' | 'description' | 'buttonText' | 'pdfUrl' | 'image',
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

  // Modal states for creating a new Showcase System item
  const [isAddShowcaseModalOpen, setIsAddShowcaseModalOpen] = useState(false);
  const [newShowcaseTitle, setNewShowcaseTitle] = useState('');
  const [newShowcaseDesc, setNewShowcaseDesc] = useState('');
  const [newShowcaseImage, setNewShowcaseImage] = useState('/assets/showcase/stac_window_handles-044.png');
  const [newShowcasePdfUrl, setNewShowcasePdfUrl] = useState('');
  const [newShowcasePdfName, setNewShowcasePdfName] = useState('');
  const [newShowcaseButtonText, setNewShowcaseButtonText] = useState('فتح الكتالوج المعتمد (PDF)');
  const [isUploadingNewShowcaseImage, setIsUploadingNewShowcaseImage] = useState(false);
  const [isUploadingNewShowcasePdf, setIsUploadingNewShowcasePdf] = useState(false);
  const newShowcaseImageInputRef = useRef<HTMLInputElement>(null);
  const newShowcasePdfInputRef = useRef<HTMLInputElement>(null);

  const handleUploadNewShowcaseImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingNewShowcaseImage(true);
      const url = await onUploadMedia(file);
      setNewShowcaseImage(url);
      onSaveFeedback('✓ تم رفع صورة النظام بنجاح');
    } catch (err: any) {
      alert(err.message || 'فشل في رفع الصورة');
    } finally {
      setIsUploadingNewShowcaseImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleUploadNewShowcasePdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingNewShowcasePdf(true);
      const url = await onUploadMedia(file);
      setNewShowcasePdfUrl(url);
      setNewShowcasePdfName(file.name);
      onSaveFeedback(`✓ تم رفع ملف الـ PDF: ${file.name}`);
    } catch (err: any) {
      alert(err.message || 'فشل في رفع ملف الـ PDF');
    } finally {
      setIsUploadingNewShowcasePdf(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveNewShowcase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShowcaseTitle.trim()) {
      alert('يرجى كتابة اسم أو عنوان النظام أولاً');
      return;
    }

    const finalTitle = newShowcaseTitle.trim();
    const finalDesc = newShowcaseDesc.trim() || 'تفاصيل ومواصفات هندسية متطورة مصممة للمشاريع المودرن الفاخرة مع أعلى معايير العزل والأمان.';
    const finalButton = newShowcaseButtonText.trim() || 'فتح الكتالوج المعتمد (PDF)';

    const newItem: ArchitectureShowcaseItem = {
      id: `system-${Date.now()}`,
      image: newShowcaseImage || '/assets/showcase/stac_window_handles-044.png',
      title: finalTitle,
      titleAr: finalTitle,
      description: finalDesc,
      descriptionAr: finalDesc,
      pdfUrl: newShowcasePdfUrl.trim() || '/catalogs/stac-hardware-accessories.pdf',
      fileName: newShowcasePdfName || undefined,
      buttonText: finalButton,
      buttonTextAr: finalButton,
      brand: 'نظام أوروبي معتمد'
    };

    const updated = [...showcaseItems, newItem];
    persistShowcase(updated);
    onSaveFeedback(`✓ تم إنشاء وإضافة شريحة نظام "${finalTitle}" بنجاح!`);

    // Reset & close
    setIsAddShowcaseModalOpen(false);
    setNewShowcaseTitle('');
    setNewShowcaseDesc('');
    setNewShowcaseImage('/assets/showcase/stac_window_handles-044.png');
    setNewShowcasePdfUrl('');
    setNewShowcasePdfName('');
    setNewShowcaseButtonText('فتح الكتالوج المعتمد (PDF)');
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
      <section className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>كتالوجات الشركاء المعماريين (PDF)</span>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                  {cards.length}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">البطاقات المعروضة في أعلى قسم العمارة</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAddCardModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>إضافة كتالوج</span>
          </button>
        </div>

        {/* Clean Red & White Cards List */}
        <div className="space-y-4">
          {cards.map((card, idx) => {
            const cardTitleAr = card.translations?.ar?.title || card.title || '';
            const cardDescAr = card.translations?.ar?.desc || card.desc || '';
            const cardBtnAr = card.translations?.ar?.buttonText || card.buttonText || 'فتح الكتالوج (PDF)';

            return (
              <div
                key={card.id || idx}
                className="bg-white rounded-2xl border-2 border-slate-100 hover:border-red-300 p-4 sm:p-5 transition-all shadow-xs hover:shadow-md flex flex-col md:flex-row gap-5 items-stretch"
              >
                {/* Image Stage + Red/White Upload Button */}
                <div className="w-full md:w-52 shrink-0 flex flex-col justify-between gap-2.5">
                  <div className="relative aspect-video md:aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-2.5 group">
                    {card.image ? (
                      <img
                        src={card.image}
                        alt={cardTitleAr}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/showcase/wiek_hidden_hinge-04.png';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => triggerUpload('cards', idx, 'image')}
                    className="w-full py-2 px-3 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold text-xs border border-red-200 hover:border-red-600 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {isUploading && activeUploadTarget?.section === 'cards' && activeUploadTarget?.index === idx && activeUploadTarget.field === 'image'
                        ? 'جاري الرفع…'
                        : 'تغيير الصورة'}
                    </span>
                  </button>
                </div>

                {/* Form Fields: Only Title, Description, PDF Button */}
                <div className="flex-1 flex flex-col justify-between gap-3">
                  {/* Top Bar: Red Badge + Title Input + Move & Delete */}
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-mono font-black text-xs shrink-0 shadow-xs">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <input
                        type="text"
                        value={cardTitleAr}
                        onChange={(e) => handleUpdateCardField(idx, 'title', e.target.value)}
                        placeholder="عنوان الكتالوج..."
                        className="flex-1 font-bold text-sm text-slate-900 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-3.5 py-2 outline-none transition-all"
                      />
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveCard(idx, 'up')}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-red-50 disabled:opacity-20 text-slate-600 hover:text-red-600 border border-slate-200 transition-colors cursor-pointer"
                        title="تحريك لأعلى"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === cards.length - 1}
                        onClick={() => handleMoveCard(idx, 'down')}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-red-50 disabled:opacity-20 text-slate-600 hover:text-red-600 border border-slate-200 transition-colors cursor-pointer"
                        title="تحريك لأسفل"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCard(idx)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 transition-colors cursor-pointer ms-1"
                        title="حذف الكتالوج"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Description Textarea */}
                  <textarea
                    value={cardDescAr}
                    onChange={(e) => handleUpdateCardField(idx, 'desc', e.target.value)}
                    placeholder="وصف ومواصفات الكتالوج..."
                    rows={4}
                    className="w-full text-xs sm:text-sm text-slate-700 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-3.5 py-2.5 min-h-[110px] outline-none resize-y leading-relaxed transition-all"
                  />

                  {/* Bottom Row: PDF File Upload & Button Text */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 flex-1 w-full">
                      <input
                        type="text"
                        value={card.pdfUrl || ''}
                        onChange={(e) => handleUpdateCardField(idx, 'pdfUrl', e.target.value)}
                        placeholder="رابط ملف PDF"
                        dir="ltr"
                        className="flex-1 font-mono text-xs text-slate-800 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-3 py-2 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => triggerUpload('cards', idx, 'pdf')}
                        className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>رفع PDF</span>
                      </button>
                      {card.pdfUrl && (
                        <a
                          href={card.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors shrink-0"
                          title="معاينة PDF"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <input
                      type="text"
                      value={cardBtnAr}
                      onChange={(e) => handleUpdateCardField(idx, 'buttonText', e.target.value)}
                      placeholder="نص الزر (فتح الكتالوج PDF)"
                      className="w-full sm:w-48 text-xs font-bold text-slate-900 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-3 py-2 outline-none transition-all shrink-0"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: ACCESSORIES & SYSTEMS SHOWCASE (Slider) */}
      {/* ========================================================================= */}
      <section className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>أنظمة ورسومات العمارة التفاعلية</span>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                  {showcaseItems.length}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">شريط السلايدر الدوار في الصفحة الرئيسية</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAddShowcaseModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>إضافة شريحة</span>
          </button>
        </div>

        {/* Clean Red & White Showcase List */}
        <div className="space-y-4">
          {showcaseItems.map((item, idx) => {
            const itemTitleAr = item.titleAr || item.title || '';
            const itemDescAr = item.descriptionAr || item.description || '';
            const itemBtnAr = item.buttonTextAr || item.buttonText || 'فتح الكتالوج المعتمد (PDF)';

            return (
              <div
                key={item.id || idx}
                className="bg-white rounded-2xl border-2 border-slate-100 hover:border-red-300 p-4 sm:p-5 transition-all shadow-xs hover:shadow-md flex flex-col md:flex-row gap-5 items-stretch"
              >
                {/* Image Stage + Red/White Upload Button */}
                <div className="w-full md:w-52 shrink-0 flex flex-col justify-between gap-2.5">
                  <div className="relative aspect-video md:aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-2.5 group">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={itemTitleAr}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/showcase/wiek_hidden_hinge-04.png';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => triggerUpload('showcase', idx, 'image')}
                    className="w-full py-2 px-3 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold text-xs border border-red-200 hover:border-red-600 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {isUploading && activeUploadTarget?.section === 'showcase' && activeUploadTarget?.index === idx && activeUploadTarget.field === 'image'
                        ? 'جاري الرفع…'
                        : 'تغيير الصورة'}
                    </span>
                  </button>
                </div>

                {/* Form Fields: Only Title, Description, PDF Button */}
                <div className="flex-1 flex flex-col justify-between gap-3">
                  {/* Top Bar: Red Badge + Title Input + Move & Delete */}
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-mono font-black text-xs shrink-0 shadow-xs">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <input
                        type="text"
                        value={itemTitleAr}
                        onChange={(e) => handleUpdateShowcaseField(idx, 'title', e.target.value)}
                        placeholder="عنوان النظام..."
                        className="flex-1 font-bold text-sm text-slate-900 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-3.5 py-2 outline-none transition-all"
                      />
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveShowcaseItem(idx, 'up')}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-red-50 disabled:opacity-20 text-slate-600 hover:text-red-600 border border-slate-200 transition-colors cursor-pointer"
                        title="تحريك لأعلى"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === showcaseItems.length - 1}
                        onClick={() => handleMoveShowcaseItem(idx, 'down')}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-red-50 disabled:opacity-20 text-slate-600 hover:text-red-600 border border-slate-200 transition-colors cursor-pointer"
                        title="تحريك لأسفل"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteShowcaseItem(idx)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 transition-colors cursor-pointer ms-1"
                        title="حذف الشريحة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Description Textarea */}
                  <textarea
                    value={itemDescAr}
                    onChange={(e) => handleUpdateShowcaseField(idx, 'description', e.target.value)}
                    placeholder="شرح ومواصفات النظام..."
                    rows={4}
                    className="w-full text-xs sm:text-sm text-slate-700 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-3.5 py-2.5 min-h-[110px] outline-none resize-y leading-relaxed transition-all"
                  />

                  {/* Bottom Row: PDF File Upload & Button Text */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 flex-1 w-full">
                      <input
                        type="text"
                        value={item.pdfUrl || ''}
                        onChange={(e) => handleUpdateShowcaseField(idx, 'pdfUrl', e.target.value)}
                        placeholder="رابط ملف PDF"
                        dir="ltr"
                        className="flex-1 font-mono text-xs text-slate-800 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-3 py-2 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => triggerUpload('showcase', idx, 'pdf')}
                        className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>رفع PDF</span>
                      </button>
                      {item.pdfUrl && (
                        <a
                          href={item.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors shrink-0"
                          title="معاينة PDF"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <input
                      type="text"
                      value={itemBtnAr}
                      onChange={(e) => handleUpdateShowcaseField(idx, 'buttonText', e.target.value)}
                      placeholder="نص زر الكتالوج (فتح الكتالوج المعتمد PDF)"
                      className="w-full sm:w-48 text-xs font-bold text-slate-900 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-3 py-2 outline-none transition-all shrink-0"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* MODAL 1: ADD NEW ARCHITECTURE CATALOGUE (PDF)                */}
      {/* ============================================================ */}
      {isAddCardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black">إضافة كتالوج معماري جديد (PDF)</h3>
                  <p className="text-[11px] text-red-100">أدخل اسم الكتالوج والوصف وارفع صورة الغلاف وملف الـ PDF</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCardModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveNewCard} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Title */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1.5">
                  عنوان أو اسم الكتالوج *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  placeholder="مثال: كتالوج أنظمة WIEK الهندسية 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-bold text-sm outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1.5">
                  الوصف والمواصفات
                </label>
                <textarea
                  rows={4}
                  value={newCardDesc}
                  onChange={(e) => setNewCardDesc(e.target.value)}
                  placeholder="مواصفات وأنظمة معمارية فاخرة للأبواب والنوافذ والواجهات الزجاجية..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 text-xs sm:text-sm outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 min-h-[100px] resize-y leading-relaxed transition-all"
                />
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-800">
                  صورة غلاف الكتالوج
                </label>
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 relative">
                    <img
                      src={newCardImage}
                      alt="معاينة الغلاف"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/showcase/wiek_hidden_hinge-04.png';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-600 mb-2 font-medium">
                      صورة غلاف بدقة عالية (PNG, JPG, WebP)
                    </p>
                    <button
                      type="button"
                      disabled={isUploadingNewCardImage}
                      onClick={() => newCardImageInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingNewCardImage ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>جاري رفع الصورة...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>رفع صورة الغلاف</span>
                        </>
                      )}
                    </button>
                    <input
                      ref={newCardImageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadNewCardImage}
                    />
                  </div>
                </div>
              </div>

              {/* PDF File Upload */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-800">
                  ملف الكتالوج (PDF)
                </label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      disabled={isUploadingNewCardPdf}
                      onClick={() => newCardPdfInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingNewCardPdf ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>جاري رفع الـ PDF...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>رفع ملف PDF من جهازك</span>
                        </>
                      )}
                    </button>
                    <input
                      ref={newCardPdfInputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleUploadNewCardPdf}
                    />

                    {newCardPdfName && (
                      <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg truncate max-w-[180px]" title={newCardPdfName}>
                        ✓ {newCardPdfName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold">أو الرابط المباشر:</span>
                    <input
                      type="text"
                      value={newCardPdfUrl}
                      onChange={(e) => setNewCardPdfUrl(e.target.value)}
                      placeholder="/catalogs/example.pdf"
                      dir="ltr"
                      className="flex-1 font-mono text-xs text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1 outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Button Text */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  نص زر الكتالوج
                </label>
                <input
                  type="text"
                  value={newCardButtonText}
                  onChange={(e) => setNewCardButtonText(e.target.value)}
                  placeholder="فتح الكتالوج (PDF)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 outline-none focus:border-red-500 font-bold"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddCardModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={!newCardTitle.trim() || isUploadingNewCardImage || isUploadingNewCardPdf}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>حفظ وإضافة الكتالوج</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: ADD NEW ARCHITECTURE SHOWCASE SYSTEM                */}
      {/* ============================================================ */}
      {isAddShowcaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black">إضافة شريحة نظام معماري جديدة</h3>
                  <p className="text-[11px] text-red-100">أدخل اسم النظام ومواصفاته وصورته وملف الكتالوج</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddShowcaseModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveNewShowcase} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Title */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1.5">
                  اسم أو عنوان النظام المعماري *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newShowcaseTitle}
                  onChange={(e) => setNewShowcaseTitle(e.target.value)}
                  placeholder="مثال: نظام STAC الأندلسي العازل للصوت"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-bold text-sm outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1.5">
                  شرح ومواصفات النظام
                </label>
                <textarea
                  rows={4}
                  value={newShowcaseDesc}
                  onChange={(e) => setNewShowcaseDesc(e.target.value)}
                  placeholder="تفاصيل ومواصفات هندسية متطورة مصممة للمشاريع المودرن الفاخرة..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 text-xs sm:text-sm outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 min-h-[100px] resize-y leading-relaxed transition-all"
                />
              </div>

              {/* System Image Upload */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-800">
                  صورة النظام المعماري
                </label>
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 relative">
                    <img
                      src={newShowcaseImage}
                      alt="معاينة النظام"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/showcase/stac_window_handles-044.png';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-600 mb-2 font-medium">
                      صورة واضحة للنظام أو القطاع الهندسي
                    </p>
                    <button
                      type="button"
                      disabled={isUploadingNewShowcaseImage}
                      onClick={() => newShowcaseImageInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingNewShowcaseImage ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>جاري رفع الصورة...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>رفع صورة النظام</span>
                        </>
                      )}
                    </button>
                    <input
                      ref={newShowcaseImageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadNewShowcaseImage}
                    />
                  </div>
                </div>
              </div>

              {/* PDF File Upload */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-800">
                  ملف الكتالوج المعتمد (PDF)
                </label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      disabled={isUploadingNewShowcasePdf}
                      onClick={() => newShowcasePdfInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingNewShowcasePdf ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>جاري رفع الـ PDF...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>رفع ملف PDF من جهازك</span>
                        </>
                      )}
                    </button>
                    <input
                      ref={newShowcasePdfInputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleUploadNewShowcasePdf}
                    />

                    {newShowcasePdfName && (
                      <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg truncate max-w-[180px]" title={newShowcasePdfName}>
                        ✓ {newShowcasePdfName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold">أو الرابط المباشر:</span>
                    <input
                      type="text"
                      value={newShowcasePdfUrl}
                      onChange={(e) => setNewShowcasePdfUrl(e.target.value)}
                      placeholder="/catalogs/example.pdf"
                      dir="ltr"
                      className="flex-1 font-mono text-xs text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1 outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Button Text */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  نص زر التحميل
                </label>
                <input
                  type="text"
                  value={newShowcaseButtonText}
                  onChange={(e) => setNewShowcaseButtonText(e.target.value)}
                  placeholder="فتح الكتالوج المعتمد (PDF)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 outline-none focus:border-red-500 font-bold"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddShowcaseModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={!newShowcaseTitle.trim() || isUploadingNewShowcaseImage || isUploadingNewShowcasePdf}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>حفظ وإضافة الشريحة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
