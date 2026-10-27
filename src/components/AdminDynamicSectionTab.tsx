import React, { useState, useRef } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Film,
  Package,
  X,
  Check,
  Loader2,
  AlertTriangle,
  Globe,
  Layers
} from 'lucide-react';
import { ProductItem } from '../data/winhomeData';
import { saveLocalProducts, deleteProductFromCloud } from '../services/productService';
import { saveSharedCmsSection } from '../services/cmsService';
import {
  HomepageSectionConfig,
  saveHomepageSections
} from '../services/homepageSectionsService';
import { autoTranslateFullProduct } from '../services/translateService';

interface AdminDynamicSectionTabProps {
  section: HomepageSectionConfig;
  allSections: HomepageSectionConfig[];
  setAllSections: React.Dispatch<React.SetStateAction<HomepageSectionConfig[]>>;
  onSelectSectionKey: (key: string) => void;
  productList: ProductItem[];
  setProductList: React.Dispatch<React.SetStateAction<ProductItem[]>>;
  onUploadMedia: (file: File) => Promise<string>;
  onSaveFeedback: (msg: string) => void;
}

export const AdminDynamicSectionTab: React.FC<AdminDynamicSectionTabProps> = ({
  section,
  allSections,
  setAllSections,
  onSelectSectionKey,
  productList,
  setProductList,
  onUploadMedia,
  onSaveFeedback
}) => {
  const sectionProducts = productList.filter(
    (p) => p.division === section.key || p.category === section.key
  );

  const sectionIdx = allSections.findIndex((s) => s.id === section.id || s.key === section.key);

  const [replacingProductId, setReplacingProductId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [isTranslatingSection, setIsTranslatingSection] = useState(false);

  // Delete confirmation modals
  const [deleteTargetProd, setDeleteTargetProd] = useState<ProductItem | null>(null);
  const [isDeleteSectionModalOpen, setIsDeleteSectionModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal state for adding a new card to this section
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCardName, setNewCardName] = useState('');
  const [newCardDesc, setNewCardDesc] = useState('');
  const [newCardImage, setNewCardImage] = useState('');
  const [newCardIsVideo, setNewCardIsVideo] = useState(false);
  const [isUploadingNewMedia, setIsUploadingNewMedia] = useState(false);
  const [isSavingNewCard, setIsSavingNewCard] = useState(false);
  const newCardMediaInputRef = useRef<HTMLInputElement>(null);

  // Update section header fields (title / description)
  const handleSectionHeaderChange = (field: 'title' | 'description', value: string) => {
    const updatedSections = allSections.map((sec) => {
      if (sec.id !== section.id && sec.key !== section.key) return sec;
      const nextTranslations = { ...(sec.translations || {}) };
      const currentAr = { ...(nextTranslations.ar || {}) };
      if (field === 'title') {
        currentAr.title = value;
        currentAr.name = value;
      } else {
        currentAr.description = value;
      }
      nextTranslations.ar = currentAr;
      return {
        ...sec,
        [field]: value,
        translations: nextTranslations
      };
    });

    setAllSections(updatedSections);
    saveHomepageSections(updatedSections);
    void saveSharedCmsSection('homepageSections', updatedSections);
  };

  // Translate section header into all languages
  const handleTranslateSectionHeader = async () => {
    if (!section.title.trim() && !section.description.trim()) return;
    try {
      setIsTranslatingSection(true);
      const translations = await autoTranslateFullProduct({
        name: section.title.trim(),
        description: section.description.trim()
      });
      const formattedTranslations: Record<
        string,
        { name?: string; title?: string; description?: string }
      > = {};
      Object.entries(translations).forEach(([lang, val]) => {
        formattedTranslations[lang] = {
          name: val.name,
          title: val.name,
          description: val.description
        };
      });

      const updatedSections = allSections.map((sec) =>
        sec.id === section.id || sec.key === section.key
          ? { ...sec, translations: formattedTranslations }
          : sec
      );
      setAllSections(updatedSections);
      saveHomepageSections(updatedSections);
      void saveSharedCmsSection('homepageSections', updatedSections);
      onSaveFeedback('✓ تم حفظ وترجمة عنوان ووصف القسم لجميع اللغات!');
    } catch {
      onSaveFeedback('✓ تم حفظ عنوان ووصف القسم.');
    } finally {
      setIsTranslatingSection(false);
    }
  };

  // Reorder section on homepage
  const handleMoveSection = (direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? sectionIdx - 1 : sectionIdx + 1;
    if (targetIdx < 0 || targetIdx >= allSections.length) return;
    const updated = [...allSections];
    const temp = updated[sectionIdx];
    updated[sectionIdx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setAllSections(updated);
    saveHomepageSections(updated);
    void saveSharedCmsSection('homepageSections', updated);
    onSaveFeedback('✓ تم تعديل ترتيب القسم في الصفحة الرئيسية.');
  };

  // Confirm delete entire section
  const confirmDeleteSection = () => {
    const remainingSections = allSections.filter(
      (s) => s.id !== section.id && s.key !== section.key
    );
    setAllSections(remainingSections);
    saveHomepageSections(remainingSections);
    void saveSharedCmsSection('homepageSections', remainingSections);

    // Also remove products belonging exclusively to this section
    const remainingProducts = productList.filter(
      (p) => p.division !== section.key && p.category !== section.key
    );
    sectionProducts.forEach((p) => {
      void deleteProductFromCloud(p.id);
    });
    setProductList(remainingProducts);
    saveLocalProducts(remainingProducts);
    void saveSharedCmsSection('products', remainingProducts);

    setIsDeleteSectionModalOpen(false);
    onSaveFeedback(`✓ تم حذف قسم "${section.title || section.key}" بالكامل.`);
    if (remainingSections.length > 0) {
      onSelectSectionKey(remainingSections[0].key);
    } else {
      onSelectSectionKey('3d-carousel');
    }
  };

  const handleTriggerUpload = (prodId: string) => {
    setReplacingProductId(prodId);
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replacingProductId) return;

    try {
      setIsUploading(true);
      const url = await onUploadMedia(file);
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov)(\?|#|$)/i.test(url);

      const updated = productList.map((p) =>
        p.id === replacingProductId
          ? {
              ...p,
              image: url,
              fallbackImage: url,
              videoUrl: isVideo ? url : undefined,
              mediaType: isVideo ? ('video' as const) : ('image' as const)
            }
          : p
      );

      setProductList(updated);
      saveLocalProducts(updated);
      void saveSharedCmsSection('products', updated);
      onSaveFeedback('✓ تم تحديث الميديا ومباشرة على الموقع!');
    } catch (err: any) {
      alert(err.message || 'فشل في رفع الميديا');
    } finally {
      setIsUploading(false);
      setReplacingProductId(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleCardFieldChange = (
    prodId: string,
    field: 'name' | 'description',
    value: string
  ) => {
    const updated = productList.map((p) => {
      if (p.id !== prodId) return p;
      const copy: any = { ...p, [field]: value };
      if (!copy.translations) copy.translations = {};
      if (!copy.translations.ar) copy.translations.ar = {};
      if (field === 'name') {
        copy.translations.ar.name = value;
        copy.arabicName = value;
      } else if (field === 'description') {
        copy.translations.ar.description = value;
        copy.arabicDescription = value;
      }
      return copy;
    });

    setProductList(updated);
    saveLocalProducts(updated);
    void saveSharedCmsSection('products', updated);
  };

  // Auto-translate a single card into all 31 languages
  const handleTranslateCard = async (prod: ProductItem) => {
    const currentName = prod.translations?.ar?.name || prod.name || '';
    const currentDesc = prod.translations?.ar?.description || prod.description || '';
    if (!currentName.trim() && !currentDesc.trim()) return;

    try {
      setTranslatingId(prod.id);
      const fullTranslations = await autoTranslateFullProduct({
        name: currentName.trim(),
        description: currentDesc.trim()
      });

      const updated = productList.map((p) => {
        if (p.id !== prod.id) return p;
        return {
          ...p,
          name: fullTranslations?.en?.name || currentName,
          description: fullTranslations?.en?.description || currentDesc,
          arabicName: fullTranslations?.ar?.name || currentName,
          arabicDescription: fullTranslations?.ar?.description || currentDesc,
          kurdishName: fullTranslations?.ckb?.name || p.kurdishName,
          kurdishDescription: fullTranslations?.ckb?.description || p.kurdishDescription,
          translations: fullTranslations
        };
      });

      setProductList(updated);
      saveLocalProducts(updated);
      void saveSharedCmsSection('products', updated);
      onSaveFeedback('✓ تم ترجمة العنوان والوصف إلى جميع اللغات بنجاح!');
    } catch {
      onSaveFeedback('✓ تم حفظ التعديلات.');
    } finally {
      setTranslatingId(null);
    }
  };

  const handleMoveItem = (currentIdx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? currentIdx - 1 : currentIdx + 1;
    if (targetIdx < 0 || targetIdx >= sectionProducts.length) return;

    const prodA = sectionProducts[currentIdx];
    const prodB = sectionProducts[targetIdx];

    const idxA = productList.findIndex((p) => p.id === prodA.id);
    const idxB = productList.findIndex((p) => p.id === prodB.id);
    if (idxA === -1 || idxB === -1) return;

    const updated = [...productList];
    const temp = updated[idxA];
    updated[idxA] = updated[idxB];
    updated[idxB] = temp;

    setProductList(updated);
    saveLocalProducts(updated);
    void saveSharedCmsSection('products', updated);
    onSaveFeedback('✓ تم تعديل ترتيب البطاقة.');
  };

  const confirmDeleteCard = () => {
    if (!deleteTargetProd) return;
    const prod = deleteTargetProd;
    const prodName = prod.translations?.ar?.name || prod.name || 'البطاقة';
    const updated = productList.filter((p) => p.id !== prod.id);
    setProductList(updated);
    saveLocalProducts(updated);
    void saveSharedCmsSection('products', updated);
    void deleteProductFromCloud(prod.id);
    setDeleteTargetProd(null);
    onSaveFeedback(`✓ تم حذف "${prodName}" بنجاح.`);
  };

  const handleUploadNewCardMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingNewMedia(true);
      const url = await onUploadMedia(file);
      const isVid = file.type.startsWith('video/') || /\.(mp4|webm|mov)(\?|#|$)/i.test(url);
      setNewCardImage(url);
      setNewCardIsVideo(isVid);
      onSaveFeedback('✓ تم رفع الملف بنجاح');
    } catch (err: any) {
      alert(err.message || 'فشل في رفع الملف');
    } finally {
      setIsUploadingNewMedia(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveNewCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardImage.trim()) {
      alert('يرجى رفع صورة أو فيديو أولاً');
      return;
    }

    setIsSavingNewCard(true);
    try {
      const finalName = newCardName.trim();
      const finalDesc = newCardDesc.trim();

      let fullTranslations: Record<string, { name: string; description: string }> | undefined;
      if (finalName || finalDesc) {
        try {
          fullTranslations = await autoTranslateFullProduct({
            name: finalName,
            description: finalDesc
          });
        } catch (err) {
          console.warn('Auto translate new card warning:', err);
        }
      }

      const newCard: ProductItem = {
        id: `prod-${Date.now()}`,
        name: fullTranslations?.en?.name || finalName,
        category: section.key as any,
        division: section.key as any,
        image: newCardImage,
        fallbackImage: newCardImage,
        videoUrl: newCardIsVideo ? newCardImage : undefined,
        mediaType: newCardIsVideo ? 'video' : 'image',
        description: fullTranslations?.en?.description || finalDesc,
        arabicName: fullTranslations?.ar?.name || finalName,
        arabicDescription: fullTranslations?.ar?.description || finalDesc,
        kurdishName: fullTranslations?.ckb?.name,
        kurdishDescription: fullTranslations?.ckb?.description,
        features: [],
        translations: fullTranslations || {
          ar: {
            name: finalName,
            description: finalDesc
          }
        }
      };

      const updated = [newCard, ...productList];
      setProductList(updated);
      saveLocalProducts(updated);
      void saveSharedCmsSection('products', updated);
      onSaveFeedback('✓ تم إضافة البطاقة وترجمتها لجميع اللغات بنجاح!');

      setIsAddModalOpen(false);
      setNewCardName('');
      setNewCardDesc('');
      setNewCardImage('');
      setNewCardIsVideo(false);
    } finally {
      setIsSavingNewCard(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Hidden file input for replacing card media */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Section Header Settings Card (Editable Section Title & Description) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                إعدادات القسم الرئيسي: {section.title || section.key} ({sectionProducts.length} بطاقات)
              </h3>
              <p className="text-xs text-slate-500">
                عدّل اسم القسم والوصف التعريفي الذي يظهر أعلى البطاقات في الصفحة الرئيسية، أو أضف بطاقات وصور جديدة.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={sectionIdx <= 0}
              onClick={() => handleMoveSection('up')}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
              title="تحريك القسم للأعلى في الصفحة الرئيسية"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>تحريك القسم لأعلى</span>
            </button>

            <button
              type="button"
              disabled={sectionIdx === -1 || sectionIdx >= allSections.length - 1}
              onClick={() => handleMoveSection('down')}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
              title="تحريك القسم للأسفل في الصفحة الرئيسية"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>تحريك القسم لأسفل</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDeleteSectionModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 hover:border-rose-600 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف القسم بالكامل</span>
            </button>
          </div>
        </div>

        {/* Editable Section Title & Subtitle */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70">
          <div className="lg:col-span-4">
            <label className="block text-xs font-black text-slate-700 mb-1.5">
              عنوان القسم في الصفحة الرئيسية
            </label>
            <input
              type="text"
              value={section.translations?.ar?.title || section.title || ''}
              onChange={(e) => handleSectionHeaderChange('title', e.target.value)}
              placeholder="مثال: أنظمة النوافذ المعمارية"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-sm outline-none focus:border-red-500 transition-all"
            />
          </div>

          <div className="lg:col-span-6">
            <label className="block text-xs font-black text-slate-700 mb-1.5">
              وصف القسم (النص التعريفي أسفل عنوان القسم)
            </label>
            <input
              type="text"
              value={section.translations?.ar?.description || section.description || ''}
              onChange={(e) => handleSectionHeaderChange('description', e.target.value)}
              placeholder="مثال: تشكيلة مختارة من الأنظمة العصرية المصممة بأعلى معايير الأناقة..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs sm:text-sm outline-none focus:border-red-500 transition-all"
            />
          </div>

          <div className="lg:col-span-2">
            <button
              type="button"
              disabled={isTranslatingSection}
              onClick={handleTranslateSectionHeader}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              {isTranslatingSection ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Globe className="w-3.5 h-3.5" />
              )}
              <span>{isTranslatingSection ? 'جاري الترجمة…' : 'حفظ وترجمة لكل اللغات'}</span>
            </button>
          </div>
        </div>

        {/* Add Card Bar */}
        <div className="flex items-center justify-between pt-2">
          <h4 className="text-sm font-black text-slate-800">
            بطاقات وصور هذا القسم ({sectionProducts.length})
          </h4>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>إضافة بطاقة / صورة جديدة</span>
          </button>
        </div>

        {/* Cards Grid */}
        {sectionProducts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-bold text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <Package className="w-8 h-8 mx-auto text-slate-300" />
            <p>لا توجد بطاقات في هذا القسم حالياً. اضغط على "إضافة بطاقة / صورة جديدة" لإضافة أول بطاقة.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {sectionProducts.map((prod, idx) => {
              const isVideo =
                Boolean(prod.videoUrl) || /\.(mp4|webm|mov)(\?|#|$)/i.test(prod.image);
              const mediaSrc = prod.videoUrl || prod.image;
              const prodTitle = prod.translations?.ar?.name || prod.arabicName || prod.name || '';
              const prodDesc =
                prod.translations?.ar?.description || prod.arabicDescription || prod.description || '';

              return (
                <div
                  key={prod.id || idx}
                  className="bg-white rounded-2xl border-2 border-slate-200 hover:border-red-300 p-4 sm:p-5 shadow-xs hover:shadow-md flex flex-col justify-between gap-3.5 transition-all"
                >
                  {/* Top Bar: Slide Order & Move Buttons */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-white font-mono font-black text-xs shadow-2xs">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isVideo
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isVideo ? 'VIDEO' : 'PHOTO'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveItem(idx, 'up')}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-700 transition-colors cursor-pointer"
                        title="تحريك لأعلى"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === sectionProducts.length - 1}
                        onClick={() => handleMoveItem(idx, 'down')}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-700 transition-colors cursor-pointer"
                        title="تحريك لأسفل"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Media Preview */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-100 flex items-center justify-center">
                    {isVideo ? (
                      <video
                        src={mediaSrc}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={mediaSrc}
                        alt={prodTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg';
                        }}
                      />
                    )}
                    {isVideo && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                        <Film className="w-6 h-6 text-white drop-shadow-md" />
                      </div>
                    )}
                  </div>

                  {/* Card Title & Description Inputs */}
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        عنوان البطاقة / المنتج
                      </label>
                      <input
                        type="text"
                        value={prodTitle}
                        onChange={(e) => handleCardFieldChange(prod.id, 'name', e.target.value)}
                        placeholder="اكتب عنواناً جذاباً يصف الصورة..."
                        className="w-full font-bold text-xs text-slate-900 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-red-500 rounded-xl px-3 py-2 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        الوصف (يدعم عدة فقرات)
                      </label>
                      <textarea
                        rows={5}
                        value={prodDesc}
                        onChange={(e) =>
                          handleCardFieldChange(prod.id, 'description', e.target.value)
                        }
                        placeholder="اكتب وصفاً تفصيلياً جذاباً (يمكنك تقسيم النص إلى فقرات بسطر فارغ)..."
                        className="w-full text-xs sm:text-sm text-slate-700 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-red-500 rounded-xl px-3.5 py-2.5 min-h-[130px] outline-none resize-y leading-relaxed transition-all"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <button
                      type="button"
                      disabled={translatingId === prod.id}
                      onClick={() => handleTranslateCard(prod)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      {translatingId === prod.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Globe className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {translatingId === prod.id
                          ? 'جاري الترجمة لجميع اللغات…'
                          : 'حفظ وترجمة البطاقة لجميع اللغات'}
                      </span>
                    </button>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleTriggerUpload(prod.id)}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>
                          {isUploading && replacingProductId === prod.id
                            ? 'جاري الرفع…'
                            : 'استبدال الصورة / الفيديو'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTargetProd(prod)}
                        className="py-1.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 hover:border-rose-600 font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        title="Delete Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL: ADD NEW CARD TO THIS SECTION                          */}
      {/* ============================================================ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black">
                    إضافة بطاقة جديدة إلى: {section.title || section.key}
                  </h3>
                  <p className="text-[11px] text-red-100">
                    ارفع صورة أو فيديو، ويمكنك إضافة العنوان والوصف الآن أو لاحقاً
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewCard} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Image / Video Upload */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-800">
                  الصورة أو الفيديو *
                </label>
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  {newCardImage ? (
                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 shrink-0 relative">
                      {newCardIsVideo ? (
                        <video
                          src={newCardImage}
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={newCardImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="w-20 h-16 rounded-xl bg-slate-200/70 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                      <Upload className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5">
                    <button
                      type="button"
                      disabled={isUploadingNewMedia}
                      onClick={() => newCardMediaInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      {isUploadingNewMedia ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {isUploadingNewMedia
                          ? 'جاري الرفع…'
                          : newCardImage
                          ? 'تغيير الصورة / الفيديو'
                          : 'اختر صورة أو فيديو من جهازك'}
                      </span>
                    </button>
                    <input
                      ref={newCardMediaInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                      className="hidden"
                      onChange={handleUploadNewCardMedia}
                    />
                  </div>
                </div>
              </div>

              {/* Optional Title */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1.5">
                  عنوان البطاقة (اختياري — يُترجم تلقائياً لكل اللغات)
                </label>
                <input
                  type="text"
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  placeholder="اختياري — اتركه فارغاً أو اكتب عنوان البطاقة..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-bold text-sm outline-none focus:border-red-600 transition-all"
                />
              </div>

              {/* Optional Description */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1.5">
                  وصف البطاقة (اختياري — يدعم عدة فقرات ويُترجم تلقائياً)
                </label>
                <textarea
                  rows={5}
                  value={newCardDesc}
                  onChange={(e) => setNewCardDesc(e.target.value)}
                  placeholder="اختياري — اكتب وصفاً من عدة فقرات..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 text-xs sm:text-sm outline-none focus:border-red-600 min-h-[120px] resize-y leading-relaxed transition-all"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={!newCardImage.trim() || isUploadingNewMedia || isSavingNewCard}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  {isSavingNewCard ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  )}
                  <span>{isSavingNewCard ? 'جاري الحفظ والترجمة…' : 'حفظ وإضافة البطاقة'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: DELETE SINGLE CARD CONFIRMATION                       */}
      {/* ============================================================ */}
      {deleteTargetProd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">Delete Card?</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      هل أنت متأكد من حذف هذه البطاقة من القسم؟
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteTargetProd(null)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 truncate">
                {deleteTargetProd.translations?.ar?.name ||
                  deleteTargetProd.arabicName ||
                  deleteTargetProd.name ||
                  deleteTargetProd.id}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTargetProd(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteCard}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: DELETE ENTIRE SECTION CONFIRMATION                    */}
      {/* ============================================================ */}
      {isDeleteSectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">حذف القسم بالكامل؟</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      سيتم حذف هذا القسم وجميع البطاقات الموجودة بداخله ({sectionProducts.length}) من الصفحة الرئيسية.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDeleteSectionModalOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 truncate">
                {section.title || section.key}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteSectionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteSection}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Section</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
