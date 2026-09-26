import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Edit, FolderPlus, Loader2, Trash2, Upload, X } from 'lucide-react';
import { ProductCategoryDivision } from '../data/productNavigationData';
import { addCategoryDivision, deleteCategoryDivision, loadProductDivisions, subscribeToDivisions, updateCategoryDivision } from '../services/productNavigationService';
import { autoResolveCategoryTranslations } from '../services/translateService';

const fallbackImage = './assets/doorhome/03-2.jpg';

const compressImageFile = (file: File): Promise<string> => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const source = (event.target?.result as string) || '';
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, 1000 / image.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext('2d');
      if (!context) return resolve(source);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    image.onerror = () => resolve(source);
    image.src = source;
  };
  reader.onerror = () => resolve('');
  reader.readAsDataURL(file);
});

export const AdminCategoriesTab: React.FC = () => {
  const [divisions, setDivisions] = useState<ProductCategoryDivision[]>(loadProductDivisions);
  const [editingCategory, setEditingCategory] = useState<ProductCategoryDivision | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState(fallbackImage);
  const [notification, setNotification] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => subscribeToDivisions(setDivisions), []);

  const openCreate = () => {
    setEditingCategory(null);
    setName('');
    setImage(fallbackImage);
    setIsModalOpen(true);
  };

  const openEdit = (category: ProductCategoryDivision) => {
    setEditingCategory(category);
    setName(category.title);
    setImage(category.featuredImage || fallbackImage);
    setIsModalOpen(true);
  };

  const saveCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    setIsSaving(true);
    try {
      if (editingCategory && trimmedName === editingCategory.title) {
        // An image-only edit preserves existing translations, routing and linked models.
        updateCategoryDivision(editingCategory.id, { featuredImage: image });
      } else {
        const translated = await autoResolveCategoryTranslations(trimmedName);
        if (editingCategory) {
          updateCategoryDivision(editingCategory.id, {
            ...translated,
            featuredImage: image,
            featuredTitle: translated.title,
            featuredSubtitle: translated.kurdishTitle
          });
        } else {
          addCategoryDivision({
            ...translated,
            featuredImage: image,
            featuredTitle: translated.title,
            featuredSubtitle: translated.kurdishTitle
          });
        }
      }
      setNotification(editingCategory ? 'Category updated.' : 'Category created.');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save category:', error);
      setNotification('Could not save the category. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const removeCategory = (category: ProductCategoryDivision) => {
    const modelCount = category.subCategories.reduce((count, subCategory) => count + subCategory.items.length, 0);
    const warning = modelCount
      ? `Delete “${category.title}” and its ${modelCount} linked model${modelCount === 1 ? '' : 's'}?`
      : `Delete “${category.title}”?`;
    if (!window.confirm(warning)) return;
    deleteCategoryDivision(category.id);
    setNotification('Category deleted.');
  };

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const uploaded = await compressImageFile(file);
      if (uploaded) setImage(uploaded);
    } catch (error) {
      console.error('Failed to upload category image:', error);
      setNotification('Could not upload the image. Please try again.');
    }
    event.target.value = '';
  };

  return (
    <main className="p-6 space-y-5 flex-1 overflow-y-auto">
      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-bold"><CheckCircle2 className="w-4 h-4" />{notification}</span>
          <button type="button" onClick={() => setNotification('')} aria-label="Dismiss notification"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">Categories</h2>
          <p className="text-sm text-slate-500">{divisions.length} {divisions.length === 1 ? 'category' : 'categories'}</p>
        </div>
        <button type="button" onClick={openCreate} className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2">
          <FolderPlus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
        {divisions.length === 0 && <p className="p-6 text-sm text-slate-500">No categories yet. Add your first category.</p>}
        {divisions.map((category) => (
          <div key={category.id} className="p-4 flex items-center gap-4">
            <img
              src={category.featuredImage || fallbackImage}
              alt=""
              className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
              onError={(event) => { event.currentTarget.src = fallbackImage; }}
            />
            <span className="flex-1 min-w-0 text-sm font-bold text-slate-900 truncate">{category.title}</span>
            <button type="button" onClick={() => openEdit(category)} className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5" aria-label={`Edit ${category.title}`}>
              <Edit className="w-3.5 h-3.5" /> Edit
            </button>
            <button type="button" onClick={() => removeCategory(category)} className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700" aria-label={`Delete ${category.title}`}>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">{editingCategory ? 'Edit Category' : 'Create New Category'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} aria-label="Close" className="p-2 rounded-full bg-slate-200 text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={saveCategory} className="p-6 space-y-5">
              <div>
                <label htmlFor="category-name" className="block mb-2 text-xs font-black uppercase text-slate-700">Category Name *</label>
                <input id="category-name" type="text" required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Windows Systems" className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 outline-none focus:border-red-600" />
              </div>
              <div>
                <span className="block mb-2 text-xs font-black uppercase text-slate-700">Category Image</span>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={uploadImage} className="hidden" />
                <div className="flex items-center gap-3">
                  <img src={image} alt="Category preview" className="w-16 h-16 rounded-xl object-cover border border-slate-200" onError={(event) => { event.currentTarget.src = fallbackImage; }} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold flex items-center gap-2"><Upload className="w-4 h-4" />Upload Image</button>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" disabled={isSaving} onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm flex items-center gap-2 disabled:opacity-50">
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}{editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
