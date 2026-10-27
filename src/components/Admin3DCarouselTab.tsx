import React, { useState } from 'react';
import {
  Upload,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Film,
  Image as ImageIcon
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

  const handleSlotMove = async (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= 12 || targetIndex >= galleryImages.length) return;

    const updated = [...galleryImages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    await onUpdateGallery(updated);
    onSaveFeedback(`✓ Moved 3D Carousel Card #${index + 1} to position #${targetIndex + 1}`);
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
      onSaveFeedback(`✓ Updated media for 3D Carousel Card #${replacingSlotIdx + 1}`);
    } catch (err: any) {
      alert(err.message || 'Media upload failed');
    } finally {
      setIsUploading(false);
      setReplacingSlotIdx(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleSlotFieldChange = (slotIndex: number, field: 'title' | 'description', value: string) => {
    const updated = [...galleryImages];
    updated[slotIndex] = {
      ...updated[slotIndex],
      [field]: value
    };
    void onUpdateGallery(updated);
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
              These 12 cards correspond directly to the 12 slides rendered in the interactive WebGL 3D carousel on the public homepage.
              Each card has its image/video, title, and description. Use <strong>Upload / Replace</strong> to change media, and the arrow buttons to re-order their sequence.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3.5 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200 font-extrabold text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>12 Active 3D Slides</span>
            </span>
          </div>
        </div>

        {/* 12 Slots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-2">
          {slots12.map((slot, idx) => {
            const isVideo = slot.mediaType === 'video' || /\.(mp4|webm|mov)(\?|#|$)/i.test(slot.src);
            return (
              <div
                key={slot.id || idx}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-4 shadow-xs flex flex-col justify-between gap-3.5 transition-all relative group"
              >
                {/* Slot Number & Controls */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-white font-mono font-black text-xs shadow-2xs">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isVideo ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {isVideo ? 'VIDEO' : 'IMAGE'}
                    </span>
                  </div>

                  {/* Reorder Left / Right */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleSlotMove(idx, 'left')}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-700 transition-colors cursor-pointer"
                      title="Move Left (Earlier in Carousel)"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === slots12.length - 1}
                      onClick={() => handleSlotMove(idx, 'right')}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-700 transition-colors cursor-pointer"
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

                {/* Slot Details: Title & Description */}
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={slot.title}
                      onChange={(e) => handleSlotFieldChange(idx, 'title', e.target.value)}
                      placeholder="e.g. Minimalist Villa Fenestration"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-red-500 bg-slate-50/60 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      Description
                    </label>
                    <textarea
                      value={slot.description || ''}
                      onChange={(e) => handleSlotFieldChange(idx, 'description', e.target.value)}
                      placeholder="Detailed project description..."
                      rows={3}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-red-500 bg-slate-50/60 focus:bg-white resize-y transition-all leading-relaxed"
                    />
                  </div>
                </div>

                {/* Action: Upload / Replace Media Button */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleTriggerUpload(idx)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading && replacingSlotIdx === idx ? 'Uploading…' : 'Upload / Replace Media'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
