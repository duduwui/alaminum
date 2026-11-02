import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Check, FolderPlus, Layers, AlertCircle } from 'lucide-react';
import { ProductItem } from '../../data/winhomeData';

export interface AdminCategoryItem {
  id: string;
  key: string;
  nameAr: string;
  nameCkb: string;
  nameEn: string;
}

export const DEFAULT_ADMIN_CATEGORIES: AdminCategoryItem[] = [
  { id: 'cat-doors', key: 'doors', nameAr: 'الأبواب والمداخل', nameCkb: 'دەرگاکان', nameEn: 'Doors & Entrances' },
  { id: 'cat-windows', key: 'windows', nameAr: 'أنظمة النوافذ والشبابيك', nameCkb: 'پەنجەرەکان', nameEn: 'Windows Systems' },
  { id: 'cat-shorfa', key: 'shorfa', nameAr: 'حواجز الشرفات والبلكونات والتراسات', nameCkb: 'شرفە و باڵکۆنەکان', nameEn: 'Glass Balustrades & Balconies' },
  { id: 'cat-stairs', key: 'stairs', nameAr: 'حواجز السلالم', nameCkb: 'قادرمە و دەربزینەکان', nameEn: 'Stairs & Railings' },
  { id: 'cat-accessories', key: 'accessories', nameAr: 'الملحقات والإكسسوارات', nameCkb: 'اکسسوارات و پێداویستییەکان', nameEn: 'Accessories & Hardware' },
];

interface AdminCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: AdminCategoryItem[];
  onSaveCategories: (updated: AdminCategoryItem[]) => void;
  productList: ProductItem[];
  currentLanguage: { code: string; name: string };
  t: (key: string) => string;
}

export const AdminCategoriesModal: React.FC<AdminCategoriesModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSaveCategories,
  productList,
  currentLanguage,
}) => {
  const isAr = currentLanguage.code === 'ar';
  const isCkb = currentLanguage.code === 'ckb';

  // Add category state
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newNameAr, setNewNameAr] = useState('');
  const [newNameCkb, setNewNameCkb] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Edit category state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameAr, setEditNameAr] = useState('');
  const [editNameCkb, setEditNameCkb] = useState('');
  const [editNameEn, setEditNameEn] = useState('');

  if (!isOpen) return null;

  // Count products per category
  const getProductCount = (catKey: string) => {
    return productList.filter((p) => {
      const k = (p.division || p.category || '').toLowerCase();
      if (catKey === 'shorfa') return k === 'shorfa' || k === 'balconies' || k.includes('1793119430295');
      if (catKey === 'stairs') return k === 'stairs' || k === 'stair' || k.includes('1793119387374');
      return k === catKey.toLowerCase();
    }).length;
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setNewKey('');
    setNewNameAr('');
    setNewNameCkb('');
    setNewNameEn('');
    setErrorMsg('');
  };

  const handleSaveNew = () => {
    const slug = (newKey.trim() || newNameEn.trim()).toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
    if (!slug) {
      setErrorMsg(isAr ? 'يرجى إدخال المعرف البرمجي أو الاسم بالإنجليزية' : 'Please provide category key or English name');
      return;
    }
    if (categories.some((c) => c.key.toLowerCase() === slug)) {
      setErrorMsg(isAr ? 'هذا المعرف مستخدم مسبقاً' : 'This category key already exists');
      return;
    }
    if (!newNameAr.trim() && !newNameEn.trim()) {
      setErrorMsg(isAr ? 'يرجى إدخال اسم القسم' : 'Please provide at least one category name');
      return;
    }

    const newItem: AdminCategoryItem = {
      id: `cat-${Date.now()}`,
      key: slug,
      nameAr: newNameAr.trim() || newNameEn.trim(),
      nameCkb: newNameCkb.trim() || newNameAr.trim() || newNameEn.trim(),
      nameEn: newNameEn.trim() || newNameAr.trim(),
    };

    const updated = [...categories, newItem];
    onSaveCategories(updated);
    setIsAdding(false);
    setErrorMsg('');
  };

  const handleStartEdit = (cat: AdminCategoryItem) => {
    setEditingId(cat.id);
    setEditNameAr(cat.nameAr);
    setEditNameCkb(cat.nameCkb);
    setEditNameEn(cat.nameEn);
  };

  const handleSaveEdit = (catId: string) => {
    const updated = categories.map((c) => {
      if (c.id === catId) {
        return {
          ...c,
          nameAr: editNameAr.trim() || c.nameAr,
          nameCkb: editNameCkb.trim() || c.nameCkb,
          nameEn: editNameEn.trim() || c.nameEn,
        };
      }
      return c;
    });
    onSaveCategories(updated);
    setEditingId(null);
  };

  const handleDeleteCategory = (cat: AdminCategoryItem) => {
    const count = getProductCount(cat.key);
    const confirmPrompt = isAr
      ? `هل أنت متأكد من حذف قسم "${cat.nameAr}"؟ ${count > 0 ? `(يحتوي على ${count} منتج)` : ''}`
      : `Are you sure you want to delete "${cat.nameEn}"? ${count > 0 ? `(${count} products inside)` : ''}`;
    
    if (window.confirm(confirmPrompt)) {
      const updated = categories.filter((c) => c.id !== cat.id);
      onSaveCategories(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-2xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {isAr ? 'إدارة أقسام وتصنيفات المنتجات' : isCkb ? 'بەڕێوەبردنی بەش و پۆلەکانی بەرهەم' : 'Manage Product Categories'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isAr ? 'تعديل أسماء الأقسام باللغات الثلاث أو إضافة أقسام جديدة' : 'Edit multilingual category names or create new ones'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/60 text-slate-600 hover:text-slate-900 flex items-center justify-center font-bold cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Categories List */}
          <div className="space-y-3">
            {categories.map((cat) => {
              const count = getProductCount(cat.key);
              const isEditing = editingId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-black font-mono">
                        {cat.key}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-extrabold">
                        {count} {isAr ? 'منتج' : isCkb ? 'بەرهەم' : 'items'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {isEditing ? (
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(cat.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isAr ? 'حفظ' : 'Save'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(cat)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          title={isAr ? 'تعديل الأسماء' : 'Edit Names'}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}

                      {!['doors', 'windows', 'shorfa', 'stairs', 'accessories'].includes(cat.key) && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title={isAr ? 'حذف القسم' : 'Delete Category'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                          {isAr ? 'الاسم بالعربية' : 'Arabic Name'}
                        </label>
                        <input
                          type="text"
                          value={editNameAr}
                          onChange={(e) => setEditNameAr(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                          {isAr ? 'الاسم بالكردية' : 'Kurdish Name'}
                        </label>
                        <input
                          type="text"
                          value={editNameCkb}
                          onChange={(e) => setEditNameCkb(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                          {isAr ? 'الاسم بالإنجليزية' : 'English Name'}
                        </label>
                        <input
                          type="text"
                          value={editNameEn}
                          onChange={(e) => setEditNameEn(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">العربية:</span>
                        <span className="font-extrabold text-slate-800">{cat.nameAr}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">کوردی:</span>
                        <span className="font-extrabold text-slate-800">{cat.nameCkb}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">English:</span>
                        <span className="font-extrabold text-slate-800">{cat.nameEn}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add New Category Panel */}
          {isAdding ? (
            <div className="p-4 rounded-2xl border-2 border-dashed border-red-200 bg-red-50/40 space-y-3.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-red-900 flex items-center gap-1.5">
                  <FolderPlus className="w-4 h-4 text-red-600" />
                  <span>{isAr ? 'إضافة قسم جديد' : 'Add New Category'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-600 uppercase block mb-1">
                    {isAr ? 'المعرف الإنجليزي (Slug / Key) *' : 'Category Key *'}
                  </label>
                  <input
                    type="text"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="e.g. facades, pergolas"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-600 uppercase block mb-1">
                    {isAr ? 'الاسم بالإنجليزية (English)' : 'English Title'}
                  </label>
                  <input
                    type="text"
                    value={newNameEn}
                    onChange={(e) => setNewNameEn(e.target.value)}
                    placeholder="e.g. Glass Facades"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-600 uppercase block mb-1">
                    {isAr ? 'الاسم بالعربية (Arabic) *' : 'Arabic Title *'}
                  </label>
                  <input
                    type="text"
                    value={newNameAr}
                    onChange={(e) => setNewNameAr(e.target.value)}
                    placeholder="مثال: الواجهات الزجاجية"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-600 uppercase block mb-1">
                    {isAr ? 'الاسم بالكردية (Kurdish)' : 'Kurdish Title'}
                  </label>
                  <input
                    type="text"
                    value={newNameCkb}
                    onChange={(e) => setNewNameCkb(e.target.value)}
                    placeholder="نموونە: ڕووکارە شووشەییەکان"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleSaveNew}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isAr ? 'إضافة وتطبيق القسم' : 'Add Category'}</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleStartAdd}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-red-400 bg-slate-50/60 hover:bg-red-50/20 text-slate-600 hover:text-red-700 text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة قسم أو تصنيف جديد' : 'Add New Category'}</span>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all cursor-pointer shadow-2xs"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
