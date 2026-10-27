import React, { useState } from 'react';
import {
  Upload,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Check,
  RotateCcw,
  Eye,
  Film,
  Image as ImageIcon,
  Layers,
  ChevronDown
} from 'lucide-react';
import { GalleryMediaItem } from '../services/galleryContentService';

interface Admin3DCarouselTabProps {
  galleryImages: GalleryMediaItem[];
  onUpdateGallery: (updated: GalleryMediaItem[]) => Promise<void>;
  onUploadMedia: (file: File) => Promise<string>;
  onSaveFeedback: (msg: string) => void;
}

export const Admin3DCarouselTab: React.FC<Admin3DCarouselTabProps> = ({
  galleryImages,
  onUpdateGallery,
  onUploadMedia,
  onSaveFeedback
}) => {
  const [replacingSlotIdx, setReplacingSlotIdx] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Exactly 12 slots for the homepage 3D WebGL Liquid Lens Carousel
  const slots12 = galleryImages.slice(0, 12);
  const libraryPool = galleryImages.slice(12);

  const handleSlotMove = async (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= 12 || targetIndex >= galleryImages.length) return;

    const updated = [...galleryImages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    await onUpdateGallery(updated);
    onSaveFeedback(`✓ Swapped 3D Carousel Slot #${index + 1} with Slot #${targetIndex + 1}`);
  };

  const handleTriggerUpload = (slotIndex: number) => {
    setReplacingSlotIdx(slotIndex);
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replacingSlotIdx === null) return;

    try {
      setIsUploading(true);
      const url = await onUploadMedia(file);
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov)(\?|#|$)/i.test(url);

      const updated = [...galleryImages];
      updated[replacingSlotIdx] = {
        ...updated[replacingSlotIdx],
        src: url,
        mediaType: isVideo ? 'video' : 'image'
      };

      await onUpdateGallery(updated);
      onSaveFeedback(`✓ Replaced media for 3D Carousel Slot #${replacingSlotIdx + 1}`);
    } catch (err: any) {
      alert(err.message || 'Media upload failed');
    } finally {
      setIsUploading(false);
      setReplacingSlotIdx(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleSlotFieldChange = (slotIndex: number, field: 'title' | 'description' | 'system', value: string) => {
    const updated = [...galleryImages];
    updated[slotIndex] = {
      ...updated[slotIndex],
      [field]: value
    };
    void onUpdateGallery(updated);
  };

  const handleSwapWithLibraryItem = async (slotIndex: number, libraryItemId: string) => {
    if (!libraryItemId) return;
    const libraryIndex = galleryImages.findIndex((item) => item.id === libraryItemId);
    if (libraryIndex === -1) return;

    const updated = [...galleryImages];
    const temp = updated[slotIndex];
    updated[slotIndex] = updated[libraryIndex];
    updated[libraryIndex] = temp;

    await onUpdateGallery(updated);
    onSaveFeedback(`✓ Assigned "${updated[slotIndex].title}" to 3D Carousel Slot #${slotIndex + 1}`);
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input for slot media replacement */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Header & Explainer Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <h3 className="text-lg font-black text-slate-900">
                Homepage 3D Liquid Lens Carousel (12 Dedicated Slots)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              These 12 slots correspond directly to the 12 slides rendered in the interactive WebGL 3D carousel on the homepage.
              Use <strong>Replace</strong> to update photos or MP4 videos, re-order positions with arrows, or swap any slot with a project from your archive.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3.5 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200 font-extrabold text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>12 Active 3D Slots</span>
            </span>
          </div>
        </div>

        {/* 12 Slots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
          {slots12.map((slot, idx) => {
            const isVideo = slot.mediaType === 'video' || /\.(mp4|webm|mov)(\?|#|$)/i.test(slot.src);
            return (
              <div
                key={slot.id || idx}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-red-400 p-3.5 shadow-xs flex flex-col justify-between gap-3 transition-all relative group"
              >
                {/* Slot Number & Controls */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono font-black text-[11px] shadow-2xs">
                      SLOT #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      isVideo ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {isVideo ? 'VIDEO' : 'PHOTO'}
                    </span>
                  </div>

                  {/* Reorder Left / Right */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleSlotMove(idx, 'left')}
                      className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-700 transition-colors cursor-pointer"
                      title="Move Left (Earlier in Carousel)"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === slots12.length - 1}
                      onClick={() => handleSlotMove(idx, 'right')}
                      className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-700 transition-colors cursor-pointer"
                      title="Move Right (Later in Carousel)"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Media Stage */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-100 flex items-center justify-center">
                  {isVideo ? (
                    <video
                      src={slot.src}
                      muted
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={slot.src}
                      alt={slot.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg';
                      }}
                    />
                  )}
                  {isVideo && (
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
                      <Film className="w-6 h-6 text-white drop-shadow-md" />
                    </div>
                  )}
                </div>

                {/* Slot Details Inputs */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-0.5">
                      Slide Title
                    </label>
                    <input
                      type="text"
                      value={slot.title}
                      onChange={(e) => handleSlotFieldChange(idx, 'title', e.target.value)}
                      placeholder="Title on 3D Carousel"
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 outline-none focus:border-red-400 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-0.5">
                      Subtitle / Architectural System
                    </label>
                    <input
                      type="text"
                      value={slot.system || ''}
                      onChange={(e) => handleSlotFieldChange(idx, 'system', e.target.value)}
                      placeholder="e.g. WIEK Hidden Hinge System"
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-red-400 bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Actions: Replace Media & Swap with Library Project */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleTriggerUpload(idx)}
                    className="w-full py-1.5 px-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading && replacingSlotIdx === idx ? 'Uploading…' : 'Upload / Replace File'}</span>
                  </button>

                  {/* Swap with Project from Library */}
                  {libraryPool.length > 0 && (
                    <div className="relative">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            void handleSwapWithLibraryItem(idx, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        defaultValue=""
                        className="w-full border border-slate-200 rounded-xl px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-white hover:border-slate-300 outline-none cursor-pointer appearance-none truncate pe-6"
                      >
                        <option value="" disabled>Swap with project from library…</option>
                        {libraryPool.map((libItem) => (
                          <option key={libItem.id} value={libItem.id}>
                            {libItem.title || libItem.id} ({libItem.category || 'project'})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3 h-3 text-slate-400 absolute end-2 top-2 pointer-events-none" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
