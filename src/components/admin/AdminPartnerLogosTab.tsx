import React, { useState, useRef } from 'react';
import { Plus, Trash2, Upload, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { saveSharedCmsSection } from '../../services/cmsService';
import { PartnerBrand, isImageFlag } from '../PartnerLogos';

interface AdminPartnerLogosTabProps {
  partnerLogos: PartnerBrand[];
  setPartnerLogos: React.Dispatch<React.SetStateAction<PartnerBrand[]>>;
  onUploadMedia: (file: File) => Promise<string>;
  onSaveFeedback: (msg: string) => void;
  currentLanguage: { code: string; name: string };
}

export const AdminPartnerLogosTab: React.FC<AdminPartnerLogosTabProps> = ({
  partnerLogos,
  setPartnerLogos,
  onUploadMedia,
  onSaveFeedback,
  currentLanguage
}) => {
  const [newLogo, setNewLogo] = useState<PartnerBrand>({
    id: '',
    name: '',
    src: '',
    alt: '',
    country: '',
    flag: ''
  });
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFlag, setIsUploadingFlag] = useState(false);
  const [uploadingFlagCardIdx, setUploadingFlagCardIdx] = useState<number | null>(null);
  const [logosSaving, setLogosSaving] = useState(false);

  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const flagFileInputRef = useRef<HTMLInputElement>(null);
  const cardFlagFileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingLogo(true);
      const url = await onUploadMedia(file);
      setNewLogo((prev) => ({ ...prev, src: url }));
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setIsUploadingLogo(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleFlagUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingFlag(true);
      const url = await onUploadMedia(file);
      setNewLogo((prev) => ({ ...prev, flag: url }));
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setIsUploadingFlag(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleCardFlagUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || uploadingFlagCardIdx === null) return;
    try {
      const url = await onUploadMedia(file);
      const updated = [...partnerLogos];
      updated[uploadingFlagCardIdx] = {
        ...updated[uploadingFlagCardIdx],
        flag: url
      };
      setPartnerLogos(updated);
      try {
        localStorage.setItem('winhome_cms_partner_logos', JSON.stringify(updated));
        window.dispatchEvent(new Event('cms_partner_logos_updated'));
      } catch {}
      void saveSharedCmsSection('partnerLogos', updated).catch(() => {});
      onSaveFeedback('✓ Flag image uploaded and saved!');
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploadingFlagCardIdx(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleAddBrand = () => {
    if (!newLogo.name.trim() || !newLogo.src.trim()) {
      alert('Please provide brand name and image URL/file.');
      return;
    }
    const logo: PartnerBrand = {
      id: `logo-${Date.now()}`,
      name: newLogo.name.trim(),
      src: newLogo.src.trim(),
      alt: newLogo.alt || newLogo.name.trim(),
      country: newLogo.country?.trim() || undefined,
      flag: newLogo.flag?.trim() || undefined
    };
    const updated = [...partnerLogos, logo];
    setPartnerLogos(updated);
    setNewLogo({ id: '', name: '', src: '', alt: '', country: '', flag: '' });
    try {
      localStorage.setItem('winhome_cms_partner_logos', JSON.stringify(updated));
      window.dispatchEvent(new Event('cms_partner_logos_updated'));
    } catch {}
    void saveSharedCmsSection('partnerLogos', updated).catch(() => {});
  };

  const handleSaveAll = async () => {
    setLogosSaving(true);
    try {
      await saveSharedCmsSection('partnerLogos', partnerLogos);
      localStorage.setItem('winhome_cms_partner_logos', JSON.stringify(partnerLogos));
      window.dispatchEvent(new Event('cms_partner_logos_updated'));
      onSaveFeedback('✓ Partner logos and flags saved to website!');
    } catch (e: any) {
      onSaveFeedback('Failed to save: ' + (e?.message || 'Network error'));
    } finally {
      setLogosSaving(false);
    }
  };

  return (
    <main className="p-6 space-y-6 flex-1 overflow-y-auto">
      <input
        ref={logoFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleLogoUpload}
        className="hidden"
      />
      <input
        ref={flagFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleFlagUpload}
        className="hidden"
      />
      <input
        ref={cardFlagFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleCardFlagUpload}
        className="hidden"
      />

      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div>
          <h3 className="text-base font-black text-slate-900">
            {currentLanguage.code === 'ar' ? 'إضافة علامة تجارية أو شريك جديد' : 'Add New Partner Brand'}
          </h3>
          <p className="text-xs text-slate-500">
            {currentLanguage.code === 'ar'
              ? 'أدخل اسم الشريك أو المورد مع رفع اللوجو وعلم الدولة ليظهر في شريط الشركاء في الموقع.'
              : 'Add partner logo, brand name, country and country flag to showcase in the website partner loop.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-black text-slate-700 mb-1">Brand Name *</label>
            <input
              type="text"
              value={newLogo.name}
              onChange={(e) => setNewLogo({ ...newLogo, name: e.target.value })}
              placeholder="e.g. Alumil, Winkhaus, Saint-Gobain"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-700 mb-1">Logo Image *</label>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newLogo.src}
                onChange={(e) => setNewLogo({ ...newLogo, src: e.target.value })}
                placeholder="Image URL or upload"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-mono"
              />
              <button
                type="button"
                onClick={() => logoFileInputRef.current?.click()}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 shrink-0 cursor-pointer flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploadingLogo ? '...' : 'Upload'}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-700 mb-1">Country (Optional)</label>
            <input
              type="text"
              value={newLogo.country || ''}
              onChange={(e) => setNewLogo({ ...newLogo, country: e.target.value })}
              placeholder="e.g. Greece, Germany, Italy"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-700 mb-1">Country Flag (Optional)</label>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newLogo.flag || ''}
                onChange={(e) => setNewLogo({ ...newLogo, flag: e.target.value })}
                placeholder="Emoji or Image URL"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-bold"
              />
              <button
                type="button"
                onClick={() => flagFileInputRef.current?.click()}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 shrink-0 cursor-pointer flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploadingFlag ? '...' : 'Upload'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleAddBrand}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-red-600/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Brand to List</span>
          </button>
        </div>
      </div>

      {/* Active Partner Logos Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            Configured Brands ({partnerLogos.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Changes save automatically and update the website in real-time.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {partnerLogos.map((logo, idx) => (
            <div
              key={logo.id || idx}
              className="bg-white rounded-2xl border border-slate-200 hover:border-red-300 p-4 shadow-xs flex flex-col justify-between gap-3 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="shrink-0 flex flex-col items-center gap-1.5">
                  <div className="w-20 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1.5 shadow-2xs">
                    <img
                      src={logo.src}
                      alt={logo.alt || logo.name}
                      className="max-h-10 max-w-[70px] object-contain"
                      onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        t.style.display = 'none';
                      }}
                    />
                  </div>
                  {logo.flag && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-extrabold shadow-2xs">
                      {isImageFlag(logo.flag) ? (
                        <img src={logo.flag} alt="" className="w-4 h-3 object-cover rounded-2xs inline-block" />
                      ) : (
                        <span>{logo.flag}</span>
                      )}
                      {logo.country && <span className="truncate max-w-[65px]">{logo.country}</span>}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="font-extrabold text-sm text-slate-900 truncate">{logo.name}</div>
                  <input
                    type="text"
                    value={logo.country || ''}
                    placeholder="Country (e.g. Italy)"
                    onChange={(e) => {
                      const updated = [...partnerLogos];
                      updated[idx] = { ...updated[idx], country: e.target.value };
                      setPartnerLogos(updated);
                    }}
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 outline-none focus:border-red-400 bg-white"
                  />
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={logo.flag || ''}
                      placeholder="Flag (emoji or URL)"
                      onChange={(e) => {
                        const updated = [...partnerLogos];
                        updated[idx] = { ...updated[idx], flag: e.target.value };
                        setPartnerLogos(updated);
                      }}
                      className="flex-1 min-w-0 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 outline-none focus:border-red-400 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setUploadingFlagCardIdx(idx);
                        cardFlagFileInputRef.current?.click();
                      }}
                      className="shrink-0 px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                      title="Upload Flag Image for this brand"
                    >
                      <Upload className="w-3 h-3 text-red-600" />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => {
                      if (idx === 0) return;
                      const updated = [...partnerLogos];
                      const temp = updated[idx - 1];
                      updated[idx - 1] = updated[idx];
                      updated[idx] = temp;
                      setPartnerLogos(updated);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 cursor-pointer transition-colors"
                    title="Move Left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === partnerLogos.length - 1}
                    onClick={() => {
                      if (idx === partnerLogos.length - 1) return;
                      const updated = [...partnerLogos];
                      const temp = updated[idx + 1];
                      updated[idx + 1] = updated[idx];
                      updated[idx] = temp;
                      setPartnerLogos(updated);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 cursor-pointer transition-colors"
                    title="Move Right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const updated = partnerLogos.filter((_, i) => i !== idx);
                    setPartnerLogos(updated);
                    try {
                      localStorage.setItem('winhome_cms_partner_logos', JSON.stringify(updated));
                      window.dispatchEvent(new Event('cms_partner_logos_updated'));
                    } catch {}
                    void saveSharedCmsSection('partnerLogos', updated).catch(() => {});
                  }}
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                  title="Remove Logo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 pb-8">
        <button
          type="button"
          disabled={logosSaving}
          onClick={handleSaveAll}
          className="px-7 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-md shadow-red-600/20 transition-all cursor-pointer flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{logosSaving ? 'Saving to Website...' : 'Save Partner Logos to Website'}</span>
        </button>
      </div>
    </main>
  );
};
