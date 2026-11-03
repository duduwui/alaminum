import React, { useState, useMemo, useRef } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  Check,
  Search,
  Film,
  Sparkles,
  X,
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';
import { GalleryMediaItem } from '../services/galleryContentService';
import { scrubProhibitedText } from '../utils/localizedContent';

interface AdminAllProjectsTabProps {
  galleryImages: GalleryMediaItem[];
  onUpdateGallery: (updated: GalleryMediaItem[]) => Promise<void>;
  onUploadMedia: (file: File) => Promise<string>;
  onSaveFeedback: (msg: string) => void;
  AdvancedTextarea?: any;
}

export const AdminAllProjectsTab: React.FC<AdminAllProjectsTabProps> = ({
  galleryImages,
  onUpdateGallery,
  onUploadMedia,
  onSaveFeedback
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Multi-select state
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  // Delete confirmation popup modal state
  const [deleteModalTargets, setDeleteModalTargets] = useState<number[] | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // New Project Form State
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const addFileInputRef = useRef<HTMLInputElement>(null);

  // Replace Single Project Media
  const [replacingIdx, setReplacingIdx] = useState<number | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Filter entries purely by search query (no categories)
  const filteredEntries = useMemo(() => {
    return galleryImages
      .map((item, globalIdx) => ({ item, globalIdx }))
      .filter(({ item }) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = (item.title || '').toLowerCase().includes(q);
          const matchesDesc = (item.description || '').toLowerCase().includes(q);
          const matchesSys = (item.system || '').toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesSys) return false;
        }
        return true;
      });
  }, [galleryImages, searchQuery]);

  const filteredGlobalIndices = useMemo(
    () => filteredEntries.map((entry) => entry.globalIdx),
    [filteredEntries]
  );

  const allFilteredSelected =
    filteredGlobalIndices.length > 0 &&
    filteredGlobalIndices.every((idx) => selectedIndices.includes(idx));

  const toggleSelectOne = (globalIdx: number) => {
    setSelectedIndices((prev) =>
      prev.includes(globalIdx) ? prev.filter((i) => i !== globalIdx) : [...prev, globalIdx]
    );
  };

  const toggleSelectAllFiltered = () => {
    if (allFilteredSelected) {
      setSelectedIndices((prev) => prev.filter((idx) => !filteredGlobalIndices.includes(idx)));
    } else {
      setSelectedIndices((prev) => Array.from(new Set([...prev, ...filteredGlobalIndices])));
    }
  };

  const clearSelection = () => {
    setSelectedIndices([]);
  };

  const handleCreateProjects = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      setIsUploading(true);
      setUploadError('');
      const newEntries: GalleryMediaItem[] = [];

      for (const file of files) {
        const url = await onUploadMedia(file);
        const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov)(\?|#|$)/i.test(url);

        newEntries.push({
          id: `proj-${crypto.randomUUID()}`,
          title: newTitle.trim(),
          description: newDescription.trim(),
          src: url,
          mediaType: isVideo ? 'video' : 'image',
          category: 'doors',
          location: '',
          system: 'Doorhome Certified European Systems'
        });
      }

      const updated = [...newEntries, ...galleryImages];
      await onUpdateGallery(updated);
      setSelectedIndices([]);
      setNewTitle('');
      setNewDescription('');
      setIsAddFormOpen(false);
      onSaveFeedback(`✓ Added ${newEntries.length} new project file(s) to portfolio!`);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleTriggerReplace = (globalIdx: number) => {
    setReplacingIdx(globalIdx);
    replaceFileInputRef.current?.click();
  };

  const handleReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replacingIdx === null) return;

    try {
      const url = await onUploadMedia(file);
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov)(\?|#|$)/i.test(url);

      const updated = [...galleryImages];
      updated[replacingIdx] = {
        ...updated[replacingIdx],
        src: url,
        mediaType: isVideo ? 'video' : 'image'
      };

      await onUpdateGallery(updated);
      onSaveFeedback(`✓ Media updated successfully!`);
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setReplacingIdx(null);
      if (e.target) e.target.value = '';
    }
  };

  const requestSingleDelete = (globalIdx: number) => {
    setDeleteModalTargets([globalIdx]);
  };

  const requestBulkDelete = () => {
    if (selectedIndices.length === 0) return;
    setDeleteModalTargets([...selectedIndices]);
  };

  const confirmDeleteTargets = async () => {
    if (!deleteModalTargets || deleteModalTargets.length === 0) return;
    try {
      setIsDeleting(true);
      const toRemoveSet = new Set(deleteModalTargets);
      const updated = galleryImages.filter((_, idx) => !toRemoveSet.has(idx));
      await onUpdateGallery(updated);
      setSelectedIndices((prev) => prev.filter((idx) => !toRemoveSet.has(idx)));
      const deletedCount = deleteModalTargets.length;
      setDeleteModalTargets(null);
      onSaveFeedback(
        deletedCount === 1
          ? '✓ Project removed from portfolio.'
          : `✓ Successfully removed ${deletedCount} projects from portfolio.`
      );
    } catch (err: any) {
      alert('Delete failed: ' + (err.message || 'Server error'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCardFieldChange = (
    globalIdx: number,
    field: 'title' | 'description',
    value: string
  ) => {
    const updated = [...galleryImages];
    const current = updated[globalIdx];
    const trans = current.translations || {};
    const arTrans = trans.ar || {};
    updated[globalIdx] = {
      ...current,
      [field]: value,
      translations: {
        ...trans,
        ar: {
          ...arTrans,
          [field]: value
        }
      }
    };
    onUpdateGallery(updated);
  };

  return (
    <div className="space-y-5">
      {/* Hidden input for media replacement */}
      <input
        ref={replaceFileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
        className="hidden"
        onChange={handleReplaceFileChange}
      />

      {/* Top Header & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                أرشيف كل المشاريع (All Projects Portfolio)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-black">
                {galleryImages.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              إدارة جميع صور وفيديوهات المشاريع المنفذة • أول 12 مشروع تظهر تلقائياً في السلايدر 3D بالرئيسية
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddFormOpen(!isAddFormOpen)}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{isAddFormOpen ? 'إلغاء (Cancel)' : 'إضافة مشاريع جديدة'}</span>
            </button>
          </div>
        </div>

        {/* Upload Form Box */}
        {isAddFormOpen && (
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
              <Sparkles className="w-4 h-4 text-red-600" />
              <h4 className="text-xs font-black uppercase text-slate-800">
                رفع صور أو فيديوهات للمشاريع (Upload Projects)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  عنوان المشروع (Project Title - اختياري)
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: فيلا خاصة في بغداد..."
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-white outline-none focus:border-red-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  تفاصيل المشروع (Description - اختياري)
                </label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="مواصفات الزجاج والأنظمة..."
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-white outline-none focus:border-red-500"
                />
              </div>
            </div>

            {uploadError && (
              <p className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                {uploadError}
              </p>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => addFileInputRef.current?.click()}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'جاري الرفع…' : 'اختيار الملفات (صور أو فيديوهات MP4)'}</span>
              </button>
              <input
                ref={addFileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                className="hidden"
                onChange={handleCreateProjects}
              />
              <span className="text-xs text-slate-500 font-medium">يمكنك تحديد عدة صور أو فيديوهات دفعة واحدة.</span>
            </div>
          </div>
        )}

        {/* Search Bar & Select All Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث في عنوان أو تفاصيل المشروع..."
              className="w-full border border-slate-200 rounded-xl ps-10 pe-3 py-2 text-xs text-slate-900 outline-none focus:border-red-500 bg-slate-50/70 font-medium shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={toggleSelectAllFiltered}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                allFilteredSelected
                  ? 'bg-red-50 border-red-300 text-red-700'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
            >
              <span>{allFilteredSelected ? 'إلغاء تحديد الكل' : 'تحديد الكل'}</span>
            </button>

            {selectedIndices.length > 0 && (
              <button
                type="button"
                onClick={clearSelection}
                className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                إلغاء ({selectedIndices.length})
              </button>
            )}
          </div>
        </div>

        {/* Sleek Project Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-1">
          {filteredEntries.map(({ item, globalIdx }) => {
            const isVideo = item.mediaType === 'video' || /\.(mp4|webm|mov)(\?|#|$)/i.test(item.src);
            const isIn3DCarousel = globalIdx >= 0 && globalIdx < 12;
            const isSelected = selectedIndices.includes(globalIdx);

            return (
              <div
                key={`${item.id}-${globalIdx}`}
                className={`group relative bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-md ${
                  isSelected
                    ? 'border-red-600 ring-2 ring-red-500/30 bg-red-50/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Media Hero Thumbnail */}
                <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer">
                  {isVideo ? (
                    <>
                      <video
                        src={item.src}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-lg group-hover:bg-red-600 group-hover:scale-110 transition-all">
                          <Film className="w-4 h-4" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <img
                      src={item.src}
                      alt={item.title || 'Project'}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg';
                      }}
                    />
                  )}

                  {/* Top Overlay Badges */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-1.5 pointer-events-auto">
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(globalIdx)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer backdrop-blur-md ${
                          isSelected
                            ? 'bg-red-600 border-red-600 text-white shadow-sm'
                            : 'bg-black/50 border-white/20 text-transparent hover:border-white'
                        }`}
                        title={isSelected ? 'Deselect' : 'Select'}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>

                      {isIn3DCarousel ? (
                        <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-mono font-bold text-[10px] shadow-sm">
                          3D #{String(globalIdx + 1).padStart(2, '0')}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-slate-200 font-mono text-[10px]">
                          #{String(globalIdx + 1).padStart(2, '0')}
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md ${
                        isVideo
                          ? 'bg-purple-600/90 text-white shadow-xs'
                          : 'bg-black/60 text-slate-200'
                      }`}
                    >
                      {isVideo ? 'VIDEO' : 'PHOTO'}
                    </span>
                  </div>
                </div>

                {/* Card Body: Title & Clean 2-Line Description */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={scrubProhibitedText(item.translations?.ar?.title || item.title || '')}
                      onChange={(e) => handleCardFieldChange(globalIdx, 'title', e.target.value)}
                      placeholder="عنوان المشروع (Project Title)..."
                      className="w-full text-xs font-black text-slate-900 placeholder:text-slate-400 bg-transparent hover:bg-slate-50 focus:bg-white border border-transparent hover:border-slate-200 focus:border-red-400 rounded-lg px-2 py-1 outline-none transition-all"
                    />

                    <textarea
                      value={scrubProhibitedText(item.translations?.ar?.description || item.description || '')}
                      onChange={(e) => handleCardFieldChange(globalIdx, 'description', e.target.value)}
                      placeholder="وصف وتفاصيل المشروع..."
                      rows={2}
                      className="w-full text-[11px] text-slate-600 placeholder:text-slate-400 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/70 focus:border-red-400 rounded-xl p-2 outline-none transition-all resize-none leading-relaxed"
                    />
                  </div>

                  {/* Sleek Action Footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleTriggerReplace(globalIdx)}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>استبدال الملف</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => requestSingleDelete(globalIdx)}
                      className="text-[11px] font-bold text-slate-400 hover:text-rose-600 flex items-center gap-1 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="حذف المشروع"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIndices.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-black flex items-center justify-center">
              {selectedIndices.length}
            </span>
            <span className="text-xs font-bold">
              {selectedIndices.length === 1 ? 'مشروع واحد محدد' : `${selectedIndices.length} مشاريع محددة`}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          <button
            type="button"
            onClick={clearSelection}
            className="text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            إلغاء التحديد
          </button>

          <button
            type="button"
            onClick={requestBulkDelete}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>حذف المحدد ({selectedIndices.length})</span>
          </button>
        </div>
      )}

      {/* Custom Delete Confirmation Popup Modal */}
      {deleteModalTargets && deleteModalTargets.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">
                      {deleteModalTargets.length === 1
                        ? 'هل أنت متأكد من حذف هذا المشروع؟'
                        : `هل أنت متأكد من حذف ${deleteModalTargets.length} مشاريع؟`}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      سيتم إزالة العناصر المحددة نهائياً من معرض المشاريع.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteModalTargets(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteModalTargets(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDeleteTargets}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isDeleting ? 'جاري الحذف…' : 'تأكيد الحذف'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
