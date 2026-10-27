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
  CheckSquare,
  Square
} from 'lucide-react';
import { GalleryMediaItem } from '../services/galleryContentService';

interface AdminAllProjectsTabProps {
  galleryImages: GalleryMediaItem[];
  onUpdateGallery: (updated: GalleryMediaItem[]) => Promise<void>;
  onUploadMedia: (file: File) => Promise<string>;
  onSaveFeedback: (msg: string) => void;
  AdvancedTextarea: React.ComponentType<{
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    rows?: number;
    minHeight?: string;
    onBlur?: () => void;
  }>;
}

const CATEGORIES = [
  { key: 'all', label: 'All Projects' },
  { key: 'villa', label: 'Villas & Residences' },
  { key: 'commercial', label: 'Commercial & Towers' },
  { key: 'doors', label: 'Doors & Sliders' },
  { key: 'windows', label: 'Windows & Facades' },
  { key: 'facade', label: 'Curtain Walls & Facades' },
  { key: 'railings', label: 'Railings & Balustrades' }
];

export const AdminAllProjectsTab: React.FC<AdminAllProjectsTabProps> = ({
  galleryImages,
  onUpdateGallery,
  onUploadMedia,
  onSaveFeedback,
  AdvancedTextarea
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Multi-select state (stores global indices in galleryImages)
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  // Delete confirmation popup modal state
  const [deleteModalTargets, setDeleteModalTargets] = useState<number[] | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // New Project Form State
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('villa');
  const [newSystem, setNewSystem] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const addFileInputRef = useRef<HTMLInputElement>(null);

  // Replace Single Project Media
  const [replacingIdx, setReplacingIdx] = useState<number | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  const filteredEntries = useMemo(() => {
    return galleryImages
      .map((item, globalIdx) => ({ item, globalIdx }))
      .filter(({ item }) => {
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = (item.title || '').toLowerCase().includes(q);
          const matchesDesc = (item.description || '').toLowerCase().includes(q);
          const matchesSys = (item.system || '').toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesSys) return false;
        }
        return true;
      });
  }, [galleryImages, selectedCategory, searchQuery]);

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
          category: newCategory,
          location: '',
          system: newSystem.trim() || 'Doorhome Certified European Systems'
        });
      }

      const updated = [...newEntries, ...galleryImages];
      await onUpdateGallery(updated);
      setSelectedIndices([]);
      setNewTitle('');
      setNewDescription('');
      setNewSystem('');
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
      onSaveFeedback(`✓ Replaced media for "${updated[replacingIdx].title}"!`);
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setReplacingIdx(null);
      if (e.target) e.target.value = '';
    }
  };

  // Open delete popup for a single item
  const requestSingleDelete = (globalIdx: number) => {
    setDeleteModalTargets([globalIdx]);
  };

  // Open delete popup for all selected items
  const requestBulkDelete = () => {
    if (selectedIndices.length === 0) return;
    setDeleteModalTargets([...selectedIndices]);
  };

  // Confirm delete from popup modal
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
          ? '✓ Deleted project from archive.'
          : `✓ Deleted ${deletedCount} projects from archive.`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCardFieldChange = (globalIdx: number, field: keyof GalleryMediaItem, value: string) => {
    const updated = [...galleryImages];
    updated[globalIdx] = {
      ...updated[globalIdx],
      [field]: value
    };
    void onUpdateGallery(updated);
  };

  return (
    <div className="space-y-6 relative pb-16">
      {/* Hidden file input for single item replace */}
      <input
        ref={replaceFileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
        className="hidden"
        onChange={handleReplaceFileChange}
      />

      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <h3 className="text-lg font-black text-slate-900">
                All Projects Archive ({galleryImages.length})
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Complete engineering photo & video portfolio. Select individual or multiple projects to delete in bulk, or manage project titles and descriptions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {selectedIndices.length > 0 && (
              <button
                type="button"
                onClick={requestBulkDelete}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Selected ({selectedIndices.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAddFormOpen(!isAddFormOpen)}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{isAddFormOpen ? 'Close Form' : 'Upload New Project'}</span>
            </button>
          </div>
        </div>

        {/* New Project Upload Drawer */}
        {isAddFormOpen && (
          <div className="p-5 rounded-2xl border-2 border-red-200 bg-red-50/30 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-600" />
                Upload New Project Media (Multiple Files Supported)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Modern Erbil Dream City Villa"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white outline-none focus:border-red-500"
                >
                  <option value="villa">Villas & Residences</option>
                  <option value="commercial">Commercial & Towers</option>
                  <option value="doors">Doors & Sliders</option>
                  <option value="windows">Windows & Facades</option>
                  <option value="facade">Curtain Walls & Facades</option>
                  <option value="railings">Railings & Balustrades</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">System / Brand</label>
                <input
                  type="text"
                  value={newSystem}
                  onChange={(e) => setNewSystem(e.target.value)}
                  placeholder="e.g. WIEK Hidden Hinge / Lorenzoline 70LS"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <AdvancedTextarea
                value={newDescription}
                onChange={setNewDescription}
                label="Project Description (Press Tab to indent, blank lines supported)"
                placeholder="Architectural specifications, glass type, profile dimensions..."
                rows={4}
                minHeight="100px"
              />
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
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'Uploading files…' : 'Select Files (Images or MP4 Videos)'}</span>
              </button>
              <input
                ref={addFileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                className="hidden"
                onChange={handleCreateProjects}
              />
              <span className="text-xs text-slate-500 font-medium">You can select multiple files at once.</span>
            </div>
          </div>
        )}

        {/* Filters, Bulk Select Controls, and Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Select All / Deselect All Button */}
            <button
              type="button"
              onClick={toggleSelectAllFiltered}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border transition-all cursor-pointer ${
                allFilteredSelected
                  ? 'bg-red-50 border-red-300 text-red-700'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
            >
              {allFilteredSelected ? (
                <CheckSquare className="w-3.5 h-3.5 text-red-600" />
              ) : (
                <Square className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span>
                {allFilteredSelected
                  ? `Deselect All (${filteredEntries.length})`
                  : `Select All (${filteredEntries.length})`}
              </span>
            </button>

            {selectedIndices.length > 0 && (
              <button
                type="button"
                onClick={clearSelection}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                Clear ({selectedIndices.length})
              </button>
            )}

            {/* Search Input */}
            <div className="relative min-w-[220px] flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by title or system…"
                className="w-full border border-slate-200 rounded-xl ps-9 pe-3 py-2 text-xs text-slate-800 outline-none focus:border-red-400 bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
          {filteredEntries.map(({ item, globalIdx }) => {
            const isVideo = item.mediaType === 'video' || /\.(mp4|webm|mov)(\?|#|$)/i.test(item.src);
            const isIn3DCarousel = globalIdx >= 0 && globalIdx < 12;
            const isSelected = selectedIndices.includes(globalIdx);

            return (
              <div
                key={`${item.id}-${globalIdx}`}
                className={`bg-white rounded-2xl border-2 p-3.5 shadow-xs flex flex-col justify-between gap-3 transition-all ${
                  isSelected
                    ? 'border-red-600 ring-2 ring-red-500/20 bg-red-50/10'
                    : isIn3DCarousel
                    ? 'border-red-300 ring-1 ring-red-200/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Card Header: Checkbox & Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleSelectOne(globalIdx)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-red-600 border-red-600 text-white shadow-2xs'
                          : 'bg-white border-slate-300 hover:border-red-400 text-transparent'
                      }`}
                      title={isSelected ? 'Deselect project' : 'Select project for bulk delete'}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    {isIn3DCarousel ? (
                      <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-mono font-black text-[10px] shadow-2xs">
                        3D SLOT #{String(globalIdx + 1).padStart(2, '0')}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono font-bold text-[10px]">
                        #{String(globalIdx + 1).padStart(2, '0')}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        isVideo ? 'bg-purple-50 text-purple-700' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {isVideo ? 'VIDEO' : 'PHOTO'}
                    </span>
                  </div>

                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {item.category || 'villa'}
                  </span>
                </div>

                {/* Media Preview */}
                <div
                  onClick={() => toggleSelectOne(globalIdx)}
                  className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-100 flex items-center justify-center cursor-pointer group"
                >
                  {isVideo ? (
                    <video
                      src={item.src}
                      muted
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg';
                      }}
                    />
                  )}
                  {isVideo && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                      <Film className="w-5 h-5 text-white drop-shadow-md" />
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-2 end-2 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black shadow-sm">
                      Selected
                    </div>
                  )}
                </div>

                {/* Form Fields */}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleCardFieldChange(globalIdx, 'title', e.target.value)}
                    placeholder="Project Title"
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 outline-none focus:border-red-400 bg-slate-50/50"
                  />

                  <AdvancedTextarea
                    value={item.description}
                    onChange={(val) => handleCardFieldChange(globalIdx, 'description', val)}
                    placeholder="Project details..."
                    rows={4}
                    minHeight="110px"
                  />
                </div>

                {/* Project Action Controls */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleTriggerReplace(globalIdx)}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Replace Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => requestSingleDelete(globalIdx)}
                    className="py-1.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 hover:border-rose-600 font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bulk Action Bar when items are selected */}
      {selectedIndices.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-black flex items-center justify-center">
              {selectedIndices.length}
            </span>
            <span className="text-xs font-bold">
              {selectedIndices.length === 1 ? '1 project selected' : `${selectedIndices.length} projects selected`}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          <button
            type="button"
            onClick={clearSelection}
            className="text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Deselect All
          </button>

          <button
            type="button"
            onClick={requestBulkDelete}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete ({selectedIndices.length})</span>
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
                        ? 'Delete Project?'
                        : `Delete ${deleteModalTargets.length} Selected Projects?`}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      This action will permanently remove the selected item(s) from the portfolio.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteModalTargets(null)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {deleteModalTargets.length === 1 ? (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 truncate">
                  {galleryImages[deleteModalTargets[0]]?.title || `Project #${deleteModalTargets[0] + 1}`}
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 max-h-36 overflow-y-auto space-y-1.5">
                  {deleteModalTargets.slice(0, 8).map((idx) => (
                    <div key={idx} className="text-xs font-semibold text-slate-700 truncate flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="truncate">{galleryImages[idx]?.title || `Project #${idx + 1}`}</span>
                    </div>
                  ))}
                  {deleteModalTargets.length > 8 && (
                    <div className="text-[11px] font-bold text-slate-400 pt-1">
                      + {deleteModalTargets.length - 8} more project(s)
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteModalTargets(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDeleteTargets}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>
                    {isDeleting
                      ? 'Deleting…'
                      : deleteModalTargets.length === 1
                      ? 'Delete'
                      : `Delete (${deleteModalTargets.length})`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
