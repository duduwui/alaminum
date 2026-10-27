import React, { useState, useRef } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
  Film,
  Sparkles,
  ExternalLink,
  Layers,
  X,
  AlertTriangle
} from 'lucide-react';
import { ProductItem } from '../data/winhomeData';
import { saveLocalProducts, deleteProductFromCloud } from '../services/productService';
import { saveSharedCmsSection } from '../services/cmsService';

interface AdminDoorsSectionTabProps {
  productList: ProductItem[];
  setProductList: React.Dispatch<React.SetStateAction<ProductItem[]>>;
  onUploadMedia: (file: File) => Promise<string>;
  onSaveFeedback: (msg: string) => void;
  onOpenNewProductModal: (defaultCategory: string) => void;
}

export const AdminDoorsSectionTab: React.FC<AdminDoorsSectionTabProps> = ({
  productList,
  setProductList,
  onUploadMedia,
  onSaveFeedback,
  onOpenNewProductModal
}) => {
  const doorProducts = productList.filter(
    (p) => p.division === 'doors' || p.category === 'doors'
  );

  const [replacingProductId, setReplacingProductId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTargetProd, setDeleteTargetProd] = useState<ProductItem | null>(null);
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
              videoUrl: isVideo ? url : p.videoUrl
            }
          : p
      );

      setProductList(updated);
      saveLocalProducts(updated);
      onSaveFeedback('✓ Doors section media updated and live on homepage!');
    } catch (err: any) {
      alert(err.message || 'Media upload failed');
    } finally {
      setIsUploading(false);
      setReplacingProductId(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleFieldChange = (prodId: string, field: 'name' | 'description' | 'series' | 'subCategory', value: string) => {
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

  const handleMoveItem = (currentIdx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? currentIdx - 1 : currentIdx + 1;
    if (targetIdx < 0 || targetIdx >= doorProducts.length) return;

    const prodA = doorProducts[currentIdx];
    const prodB = doorProducts[targetIdx];

    const idxA = productList.findIndex((p) => p.id === prodA.id);
    const idxB = productList.findIndex((p) => p.id === prodB.id);
    if (idxA === -1 || idxB === -1) return;

    const updated = [...productList];
    const temp = updated[idxA];
    updated[idxA] = updated[idxB];
    updated[idxB] = temp;

    setProductList(updated);
    saveLocalProducts(updated);
    onSaveFeedback(`✓ Moved "${prodA.name}" slide order.`);
  };

  const handleDeleteItem = (prod: ProductItem) => {
    setDeleteTargetProd(prod);
  };

  const confirmDeleteDoor = () => {
    if (!deleteTargetProd) return;
    const prod = deleteTargetProd;
    const updated = productList.filter((p) => p.id !== prod.id);
    setProductList(updated);
    saveLocalProducts(updated);
    void saveSharedCmsSection('products', updated);
    void deleteProductFromCloud(prod.id);
    setDeleteTargetProd(null);
    onSaveFeedback(`✓ Removed "${prod.name}" from Doors section.`);
  };

  return (
    <div className="space-y-6">
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
                Doors Section Media & Featured Systems ({doorProducts.length})
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              These door systems rotate automatically every 4.5 seconds in the dedicated <strong>Doors Section</strong> on the homepage.
              Upload high-definition photos or MP4 video clips, edit model details, or change the slide sequence.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onOpenNewProductModal('doors')}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Door Model</span>
            </button>
          </div>
        </div>

        {/* Doors Cards Grid */}
        {doorProducts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-bold text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            No door models configured yet. Click "Add Door Model" above.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {doorProducts.map((prod, idx) => {
              const isVideo = Boolean(prod.videoUrl) || /\.(mp4|webm|mov)(\?|#|$)/i.test(prod.image);
              const mediaSrc = prod.videoUrl || prod.image;

              return (
                <div
                  key={prod.id || idx}
                  className="bg-white rounded-2xl border-2 border-slate-200 hover:border-red-300 p-4 shadow-xs flex flex-col justify-between gap-3.5 transition-all"
                >
                  {/* Top Bar: Slide Order & Move Buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono font-black text-[11px] shadow-2xs">
                        SLIDE #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        isVideo ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {isVideo ? 'VIDEO' : 'PHOTO'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveItem(idx, 'up')}
                        className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-700 transition-colors cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === doorProducts.length - 1}
                        onClick={() => handleMoveItem(idx, 'down')}
                        className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-700 transition-colors cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Media Preview Stage */}
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
                        alt={prod.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg';
                        }}
                      />
                    )}
                    {isVideo && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                        <Film className="w-6 h-6 text-white drop-shadow-md" />
                      </div>
                    )}
                  </div>

                  {/* Door Details Form */}
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-0.5">
                        Door Model Name
                      </label>
                      <input
                        type="text"
                        value={prod.name}
                        onChange={(e) => handleFieldChange(prod.id, 'name', e.target.value)}
                        placeholder="e.g. Lorenzoline 70LS Lift & Slide"
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 outline-none focus:border-red-400 bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-0.5">
                        Series / Sub-Category
                      </label>
                      <input
                        type="text"
                        value={prod.subCategory || (prod as any).series || ''}
                        onChange={(e) => handleFieldChange(prod.id, 'subCategory', e.target.value)}
                        placeholder="e.g. Monumental Panoramic Patio Door"
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-red-400 bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-0.5">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        value={prod.description}
                        onChange={(e) => handleFieldChange(prod.id, 'description', e.target.value)}
                        placeholder="Door specifications and architectural details..."
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 outline-none focus:border-red-400 bg-slate-50/50 min-h-[110px] resize-y leading-relaxed transition-all"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleTriggerUpload(prod.id)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading && replacingProductId === prod.id ? 'Uploading…' : 'Upload / Replace Media'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteItem(prod)}
                      className="py-1.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 hover:border-rose-600 font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Delete Door"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
                    <h4 className="text-base font-black text-slate-900">Delete Door System?</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Are you sure you want to remove this door model from the Doors section?
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
                {deleteTargetProd.name}
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
                  onClick={confirmDeleteDoor}
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
    </div>
  );
};
