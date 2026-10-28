import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { ProductItem } from '../../data/winhomeData';
import { AdvancedTextarea } from './AdvancedTextarea';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: ProductItem | null;
  allCategoryOptions: Array<{ key: string; label: string }>;
  onSave: (data: {
    id?: string;
    name: string;
    description: string;
    category: string;
    image: string;
  }) => Promise<void>;
  onUploadMedia: (file: File) => Promise<string>;
  currentLanguage: { code: string; name: string };
  t: (key: string) => string;
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  isOpen,
  onClose,
  editingProduct,
  allCategoryOptions,
  onSave,
  onUploadMedia,
  currentLanguage,
  t
}) => {
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState(allCategoryOptions[0]?.key || 'windows');
  const [formImage, setFormImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingProduct) {
      setFormName(editingProduct.translations?.ar?.name || editingProduct.name || '');
      setFormDescription(
        editingProduct.translations?.ar?.description ||
          editingProduct.arabicDescription ||
          editingProduct.description ||
          ''
      );
      const cat = editingProduct.division || editingProduct.category || '';
      setFormCategory(
        allCategoryOptions.some((opt) => opt.key === cat)
          ? cat
          : allCategoryOptions[0]?.key || ''
      );
      setFormImage(editingProduct.image || editingProduct.fallbackImage || '');
      setError('');
    } else {
      setFormName('');
      setFormDescription('');
      setFormCategory(allCategoryOptions[0]?.key || '');
      setFormImage('');
      setError('');
    }
  }, [editingProduct, allCategoryOptions, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError('');
      const url = await onUploadMedia(file);
      setFormImage(url);
    } catch (err: any) {
      setError(err?.message || 'Failed to upload media');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCategory) {
      setError('Please select a homepage section');
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      await onSave({
        id: editingProduct?.id,
        name: formName.trim(),
        description: formDescription.trim(),
        category: formCategory,
        image: formImage.trim()
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            {editingProduct ? t('admin_modal_edit_product') : t('admin_modal_create_product')}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/60 text-slate-600 hover:text-slate-900 flex items-center justify-center font-bold cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-bold text-slate-700"
        >
          {/* Product Basic Info */}
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-slate-900 uppercase text-[10px]">
                {t('admin_form_name')} (Optional)
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Optional — leave blank if adding title later..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-extrabold text-sm"
              />
            </div>

            <div>
              <AdvancedTextarea
                value={formDescription}
                onChange={setFormDescription}
                placeholder="Describe this product (specifications, thermal rating, glass types...)"
                label={t('admin_form_desc') || 'Product Description'}
                rows={5}
                minHeight="140px"
              />
            </div>

            <div>
              <label className="mb-1 block text-slate-900 uppercase text-[10px] font-black">
                {currentLanguage.code === 'ar'
                  ? 'قسم العرض في الموقع (Homepage Section)'
                  : currentLanguage.code === 'ckb'
                  ? 'بەشی پەخش لە ماڵپەڕ'
                  : 'Website Public Section'}
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 font-bold text-slate-900 cursor-pointer focus:ring-2 focus:ring-red-400 focus:bg-white"
              >
                {allCategoryOptions.length === 0 && <option value="">No sections available</option>}
                {allCategoryOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-slate-500 font-normal">
                {currentLanguage.code === 'ar'
                  ? 'حدد القسم العام الذي سيظهر فيه هذا المنتج على الصفحة الرئيسية للموقع'
                  : currentLanguage.code === 'ckb'
                  ? 'دیاری بکە ئەم بەرهەمە لە کام بەشی پەڕەی سەرەکی ماڵپەڕ نیشان بدرێت'
                  : 'Select which public homepage section will display this product on the website.'}
              </p>
            </div>
          </div>

          {/* Product Image / Video */}
          <div className="space-y-2">
            <label className="block text-slate-900 uppercase text-[10px]">
              {t('admin_form_image')}
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all shrink-0"
              >
                <Upload className="w-4 h-4" />
                <span>{isUploading ? t('admin_uploading') : t('admin_form_upload')}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {formImage && (
              <div className="flex items-center gap-3 p-2 bg-slate-100 rounded-xl border border-slate-200 mt-2">
                {/\.(mp4|webm|mov)(\?|#|$)/i.test(formImage) ? (
                  <video
                    src={formImage}
                    muted
                    autoPlay
                    loop
                    playsInline
                    className="w-12 h-12 rounded-lg object-cover bg-black"
                  />
                ) : (
                  <img
                    src={formImage}
                    alt="Product preview"
                    className="w-12 h-12 rounded-lg object-contain bg-white p-1"
                  />
                )}
                <span className="text-[11px] font-bold text-slate-900">{t('admin_image_ready')}</span>
              </div>
            )}
          </div>

          {error && (
            <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {t('admin_form_cancel')}
            </button>

            <button
              type="submit"
              disabled={isUploading || isSaving}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{t('admin_form_save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
