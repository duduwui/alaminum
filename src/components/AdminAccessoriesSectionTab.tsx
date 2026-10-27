import React, { useState, useRef } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Film,
  Sparkles,
  Package,
  Layers,
  X,
  Check,
  Loader2
} from 'lucide-react';
import { ProductItem } from '../data/winhomeData';
import { saveLocalProducts, deleteProductFromCloud } from '../services/productService';
import { saveSharedCmsSection } from '../services/cmsService';

interface AdminAccessoriesSectionTabProps {
  productList: ProductItem[];
  setProductList: React.Dispatch<React.SetStateAction<ProductItem[]>>;
  onUploadMedia: (file: File) => Promise<string>;
  onSaveFeedback: (msg: string) => void;
  onOpenNewProductModal: (defaultCategory: string) => void;
}

export const AdminAccessoriesSectionTab: React.FC<AdminAccessoriesSectionTabProps> = ({
  productList,
  setProductList,
  onUploadMedia,
  onSaveFeedback,
  onOpenNewProductModal
}) => {
  const accessoryProducts = productList.filter(
    (p) => p.division === 'accessories' || p.category === 'accessories'
  );

  const [replacingProductId, setReplacingProductId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
              videoUrl: isVideo ? url : p.videoUrl
            }
          : p
      );

      setProductList(updated);
      saveLocalProducts(updated);
      void saveSharedCmsSection('products', updated);
      onSaveFeedback('✓ تم تحديث صورة الإكسسوار ومباشرة على الموقع!');
    } catch (err: any) {
      alert(err.message || 'فشل في رفع الميديا');
    } finally {
      setIsUploading(false);
      setReplacingProductId(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleFieldChange = (
    prodId: string,
    field: 'name' | 'description' | 'brand' | 'subCategory',
    value: string
  ) => {
    const updated = productList.map((p) => {
      if (p.id !== prodId) return p;
      const copy: any = { ...p, [field]: value };
      if (!copy.translations) copy.translations = {};
      if (!copy.translations.ar) copy.translations.ar = {};
      if (field === 'name') {
        copy.translations.ar.name = value;
      } else if (field === 'description') {
        copy.translations.ar.description = value;
      }
      return copy;
    });

    setProductList(updated);
    saveLocalProducts(updated);
    void saveSharedCmsSection('products', updated);
  };

  const handleMoveItem = (currentIdx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? currentIdx - 1 : currentIdx + 1;
    if (targetIdx < 0 || targetIdx >= accessoryProducts.length) return;

    const prodA = accessoryProducts[currentIdx];
    const prodB = accessoryProducts[targetIdx];

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
    onSaveFeedback(`✓ تم تعديل ترتيب الشريحة`);
  };

  const handleDeleteItem = (prod: ProductItem) => {
    const prodName = prod.translations?.ar?.name || prod.name;
    if (!confirm(`هل أنت متأكد من حذف "${prodName}" من قسم الإكسسوارات؟`)) return;
    const updated = productList.filter((p) => p.id !== prod.id);
    setProductList(updated);
    saveLocalProducts(updated);
    void saveSharedCmsSection('products', updated);
    void deleteProductFromCloud(prod.id);
    onSaveFeedback(`✓ تم حذف "${prodName}" بنجاح.`);
  };

  // Modal state for adding a new accessory
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccDesc, setNewAccDesc] = useState('');
  const [newAccImage, setNewAccImage] = useState('/products-assets/photo_60_2026-09-26_07-36-01.jpg');
  const [isUploadingNewImage, setIsUploadingNewImage] = useState(false);
  const newAccImageInputRef = useRef<HTMLInputElement>(null);

  const handleUploadNewAccImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingNewImage(true);
      const url = await onUploadMedia(file);
      setNewAccImage(url);
      onSaveFeedback('✓ تم رفع صورة الإكسسوار بنجاح');
    } catch (err: any) {
      alert(err.message || 'فشل في رفع الصورة');
    } finally {
      setIsUploadingNewImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveNewAccessory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName.trim()) {
      alert('يرجى كتابة اسم أو نوع الإكسسوار أولاً');
      return;
    }

    const finalName = newAccName.trim();
    const finalDesc = newAccDesc.trim() || 'مقبض وإكسسوار هندسي مريح مصنوع من سبائك الألمنيوم عالية المتانة للمشاريع المعمارية الراقية.';

    const newAcc: ProductItem = {
      id: `acc-${Date.now()}`,
      name: finalName,
      category: 'accessories',
      division: 'accessories',
      subCategory: 'أنظمة مقابض ومفصلات',
      brand: 'STAC Spain',
      image: newAccImage || '/products-assets/photo_60_2026-09-26_07-36-01.jpg',
      fallbackImage: '/products-assets/photo_60_2026-09-26_07-36-01.jpg',
      description: finalDesc,
      features: ['تصميم مريح عصري', 'مقاوم للتآكل والعوامل الجوية', 'متوافق مع المقاييس الأوروبية'],
      translations: {
        ar: {
          name: finalName,
          description: finalDesc,
          subCategory: 'أنظمة مقابض ومفصلات'
        }
      }
    };

    const updated = [newAcc, ...productList];
    setProductList(updated);
    saveLocalProducts(updated);
    void saveSharedCmsSection('products', updated);
    onSaveFeedback(`✓ تم إضافة "${finalName}" بنجاح!`);

    setIsAddModalOpen(false);
    setNewAccName('');
    setNewAccDesc('');
    setNewAccImage('/assets/showcase/stac_window_handles-044.png');
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <h3 className="text-lg font-black text-slate-900">
                ميديا وبطاقات قسم الإكسسوارات والمقابض الأوروبية ({accessoryProducts.length})
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              إدارة بطاقات وصور قسم الإكسسوارات والمقابض المعروضة في الصفحة الرئيسية. يمكنك تعديل الصور والعناوين والوصف، وإضافة أو حذف أي إكسسوار بسهولة.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إضافة إكسسوار جديد</span>
            </button>
          </div>
        </div>

        {/* Accessories Cards Grid */}
        {accessoryProducts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-bold text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <Package className="w-8 h-8 mx-auto text-slate-300" />
            <p>لا توجد بطاقات إكسسوارات حالياً. اضغط على "إضافة إكسسوار جديد".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {accessoryProducts.map((prod, idx) => {
              const isVideo = Boolean(prod.videoUrl) || /\.(mp4|webm|mov)(\?|#|$)/i.test(prod.image);
              const mediaSrc = prod.videoUrl || prod.image;
              const prodTitle = prod.translations?.ar?.name || prod.name;
              const prodDesc = prod.translations?.ar?.description || prod.description;

              return (
                <div
                  key={prod.id || idx}
                  className="bg-white rounded-2xl border-2 border-slate-100 hover:border-red-300 p-4 sm:p-5 shadow-xs hover:shadow-md flex flex-col justify-between gap-3.5 transition-all"
                >
                  {/* Top Bar: Order & Move Buttons */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-mono font-black text-xs shadow-xs">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[150px]">
                        {prodTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveItem(idx, 'up')}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-red-50 disabled:opacity-20 text-slate-600 hover:text-red-600 border border-slate-200 transition-colors cursor-pointer"
                        title="تحريك لأعلى"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === accessoryProducts.length - 1}
                        onClick={() => handleMoveItem(idx, 'down')}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-red-50 disabled:opacity-20 text-slate-600 hover:text-red-600 border border-slate-200 transition-colors cursor-pointer"
                        title="تحريك لأسفل"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(prod)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 transition-colors cursor-pointer ms-1"
                        title="حذف الإكسسوار"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Media Preview Stage */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-2 group">
                    {isVideo ? (
                      <video
                        src={mediaSrc}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <img
                        src={mediaSrc}
                        alt={prodTitle}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/products-assets/photo_60_2026-09-26_07-36-01.jpg';
                        }}
                      />
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                      <button
                        type="button"
                        onClick={() => handleTriggerUpload(prod.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>استبدال الصورة</span>
                      </button>
                    </div>
                  </div>

                  {/* Direct upload button */}
                  <button
                    type="button"
                    onClick={() => handleTriggerUpload(prod.id)}
                    className="w-full py-2 px-3 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold text-xs border border-red-200 hover:border-red-600 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {isUploading && replacingProductId === prod.id
                        ? 'جاري الرفع…'
                        : 'رفع / تغيير صورة الإكسسوار'}
                    </span>
                  </button>

                  {/* Form Details (Arabic Only: Name & Description only) */}
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        اسم الإكسسوار أو المقبض *
                      </label>
                      <input
                        type="text"
                        value={prodTitle}
                        onChange={(e) => handleFieldChange(prod.id, 'name', e.target.value)}
                        placeholder="مثال: مقبض STAC المينيماليست"
                        className="w-full font-bold text-xs text-slate-900 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-3 py-2 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        الوصف والمواصفات
                      </label>
                      <textarea
                        rows={4}
                        value={prodDesc}
                        onChange={(e) => handleFieldChange(prod.id, 'description', e.target.value)}
                        placeholder="مواصفات وتفاصيل الإكسسوار..."
                        className="w-full text-xs sm:text-sm text-slate-700 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-3.5 py-2.5 min-h-[110px] outline-none resize-y leading-relaxed transition-all"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL: ADD NEW ACCESSORY / HARDWARE                          */}
      {/* ============================================================ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black">إضافة إكسسوار أو مقبض جديد</h3>
                  <p className="text-[11px] text-red-100">أدخل اسم ومواصفات الإكسسوار وارفع صورته</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveNewAccessory} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Title */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1.5">
                  اسم الإكسسوار أو المقبض *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  placeholder="مثال: مقبض STAC المينيماليست الفاخر"
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
                  value={newAccDesc}
                  onChange={(e) => setNewAccDesc(e.target.value)}
                  placeholder="مقبض وإكسسوار هندسي مريح مصنوع من سبائك الألمنيوم عالية المتانة..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 text-xs sm:text-sm outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 min-h-[100px] resize-y leading-relaxed transition-all"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-800">
                  صورة الإكسسوار
                </label>
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 relative">
                    <img
                      src={newAccImage}
                      alt="معاينة الإكسسوار"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/showcase/stac_window_handles-044.png';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-600 mb-2 font-medium">
                      صورة واضحة للإكسسوار بخلفية نظيفة
                    </p>
                    <button
                      type="button"
                      disabled={isUploadingNewImage}
                      onClick={() => newAccImageInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingNewImage ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>جاري رفع الصورة...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>رفع صورة الإكسسوار</span>
                        </>
                      )}
                    </button>
                    <input
                      ref={newAccImageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadNewAccImage}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
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
                  disabled={!newAccName.trim() || isUploadingNewImage}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>حفظ وإضافة الإكسسوار</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
