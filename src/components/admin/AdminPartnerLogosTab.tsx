import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Upload,
  ChevronLeft,
  ChevronRight,
  Save,
  Building2,
  BookOpen,
  FileText,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  X,
  Check,
  Loader2
} from 'lucide-react';
import { saveSharedCmsSection, loadSharedCmsSection } from '../../services/cmsService';
import { PartnerBrand, isImageFlag } from '../PartnerLogos';
import {
  ArchitectureCatalogueCard,
  loadArchitectureCards,
  saveArchitectureCards
} from '../../services/architectureCardsService';
import { scrubProhibitedText } from '../../utils/localizedContent';

interface AdminPartnerLogosTabProps {
  partnerLogos: PartnerBrand[];
  setPartnerLogos: React.Dispatch<React.SetStateAction<PartnerBrand[]>>;
  archCards?: ArchitectureCatalogueCard[];
  setArchCards?: React.Dispatch<React.SetStateAction<ArchitectureCatalogueCard[]>>;
  onUploadMedia: (file: File) => Promise<string>;
  onSaveFeedback: (msg: string) => void;
  currentLanguage: { code: string; name: string };
}

export const AdminPartnerLogosTab: React.FC<AdminPartnerLogosTabProps> = ({
  partnerLogos,
  setPartnerLogos,
  archCards,
  setArchCards,
  onUploadMedia,
  onSaveFeedback,
  currentLanguage
}) => {
  // Top-level switch tab: Partner Logos vs Architectural Catalogues
  const [activeSubTab, setActiveSubTab] = useState<'logos' | 'catalogs'>('logos');

  // =========================================================================
  // SUB-TAB 1: PARTNER LOGOS STATE & HANDLERS
  // =========================================================================
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

  // =========================================================================
  // SUB-TAB 2: ARCHITECTURAL CATALOGUES (PDF) STATE & HANDLERS
  // =========================================================================
  const [cards, setCards] = useState<ArchitectureCatalogueCard[]>(() => {
    if (archCards && archCards.length > 0) return archCards;
    return loadArchitectureCards();
  });

  useEffect(() => {
    if (archCards && archCards.length > 0) {
      setCards(archCards);
    }
  }, [archCards]);

  useEffect(() => {
    void (async () => {
      try {
        const remoteCards = await loadSharedCmsSection<ArchitectureCatalogueCard[]>('archCards');
        if (remoteCards && Array.isArray(remoteCards) && remoteCards.length > 0) {
          setCards(remoteCards);
          saveArchitectureCards(remoteCards);
          if (setArchCards) setArchCards(remoteCards);
        }
      } catch {}
    })();
  }, []);

  const persistCards = (updated: ArchitectureCatalogueCard[]) => {
    setCards(updated);
    saveArchitectureCards(updated);
    try {
      localStorage.setItem('winhome_cms_arch_cards', JSON.stringify(updated));
      window.dispatchEvent(new Event('cms_arch_cards_updated'));
    } catch {}
    void saveSharedCmsSection('archCards', updated);
    if (setArchCards) {
      setArchCards(updated);
    }
  };

  const handleUpdateCardField = (
    index: number,
    field: 'title' | 'desc' | 'buttonText' | 'pdfUrl' | 'image',
    value: string
  ) => {
    const updated = [...cards];
    const current = { ...updated[index] };

    if (field === 'title') {
      current.title = value;
      current.translations = {
        ...current.translations,
        ar: { ...(current.translations?.ar || {}), title: value },
        en: { ...(current.translations?.en || {}), title: value },
        ckb: { ...(current.translations?.ckb || {}), title: value }
      };
    } else if (field === 'desc') {
      current.desc = value;
      current.translations = {
        ...current.translations,
        ar: { ...(current.translations?.ar || {}), desc: value },
        en: { ...(current.translations?.en || {}), desc: value },
        ckb: { ...(current.translations?.ckb || {}), desc: value }
      };
    } else if (field === 'buttonText') {
      current.buttonText = value;
      current.translations = {
        ...current.translations,
        ar: { ...(current.translations?.ar || {}), buttonText: value },
        en: { ...(current.translations?.en || {}), buttonText: value },
        ckb: { ...(current.translations?.ckb || {}), buttonText: value }
      };
    } else {
      (current as any)[field] = value;
    }

    updated[index] = current;
    persistCards(updated);
  };

  // Add Catalogue Modal State
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDesc, setNewCardDesc] = useState('');
  const [newCardImage, setNewCardImage] = useState('/assets/showcase/wiek_hidden_hinge-04.png');
  const [newCardPdfUrl, setNewCardPdfUrl] = useState('');
  const [newCardPdfName, setNewCardPdfName] = useState('');
  const [newCardButtonText, setNewCardButtonText] = useState('فتح الكتالوج (PDF)');
  const [isUploadingNewCardImage, setIsUploadingNewCardImage] = useState(false);
  const [isUploadingNewCardPdf, setIsUploadingNewCardPdf] = useState(false);
  const newCardImageInputRef = useRef<HTMLInputElement>(null);
  const newCardPdfInputRef = useRef<HTMLInputElement>(null);

  const handleUploadNewCardImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingNewCardImage(true);
      const url = await onUploadMedia(file);
      setNewCardImage(url);
      onSaveFeedback('✓ تم رفع صورة الغلاف بنجاح');
    } catch (err: any) {
      alert(err.message || 'فشل في رفع الصورة');
    } finally {
      setIsUploadingNewCardImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleUploadNewCardPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingNewCardPdf(true);
      const url = await onUploadMedia(file);
      setNewCardPdfUrl(url);
      setNewCardPdfName(file.name);
      onSaveFeedback(`✓ تم رفع ملف الـ PDF: ${file.name}`);
    } catch (err: any) {
      alert(err.message || 'فشل في رفع ملف الـ PDF');
    } finally {
      setIsUploadingNewCardPdf(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveNewCard = (e: React.FormEvent) => {
    e.preventDefault();

    const finalTitle = newCardTitle.trim();
    const finalDesc = newCardDesc.trim();
    const finalButton = newCardButtonText.trim() || 'فتح الكتالوج (PDF)';

    const newCard: ArchitectureCatalogueCard = {
      id: `cat-${Date.now()}`,
      brand: finalTitle,
      company: 'كتالوج شريك معتمد',
      logo: '',
      image: newCardImage || '/assets/showcase/wiek_hidden_hinge-04.png',
      title: finalTitle,
      desc: finalDesc,
      pdfUrl: newCardPdfUrl.trim() || '/catalogs/wiek-general-catalog-2026.pdf',
      fileName: newCardPdfName || undefined,
      buttonText: finalButton,
      translations: {
        ar: { title: finalTitle, desc: finalDesc, buttonText: finalButton },
        en: { title: finalTitle, desc: finalDesc, buttonText: finalButton },
        ckb: { title: finalTitle, desc: finalDesc, buttonText: finalButton }
      }
    };

    const updated = [...cards, newCard];
    persistCards(updated);
    onSaveFeedback(`✓ تم إنشاء وإضافة كتالوج "${finalTitle}" بنجاح!`);

    setIsAddCardModalOpen(false);
    setNewCardTitle('');
    setNewCardDesc('');
    setNewCardImage('/assets/showcase/wiek_hidden_hinge-04.png');
    setNewCardPdfUrl('');
    setNewCardPdfName('');
    setNewCardButtonText('فتح الكتالوج (PDF)');
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= cards.length) return;
    const updated = [...cards];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    persistCards(updated);
    onSaveFeedback(`✓ تم تعديل ترتيب الكتالوجات`);
  };

  const handleDeleteCard = (index: number) => {
    if (cards.length <= 1) {
      alert('يجب أن تحتوي الصفحة على كتالوج واحد على الأقل.');
      return;
    }
    const cardTitle = cards[index]?.translations?.ar?.title || cards[index]?.title || `كتالوج #${index + 1}`;
    if (!confirm(`حذف كتالوج "${cardTitle}"؟`)) return;
    const updated = cards.filter((_, i) => i !== index);
    persistCards(updated);
    onSaveFeedback('✓ تم حذف الكتالوج.');
  };

  // Dedicated Card Upload Controller
  const [activeCardUpload, setActiveCardUpload] = useState<{
    index: number;
    field: 'image' | 'pdf';
  } | null>(null);
  const [isUploadingCardMedia, setIsUploadingCardMedia] = useState(false);
  const cardImageUploadRef = useRef<HTMLInputElement>(null);
  const cardPdfUploadRef = useRef<HTMLInputElement>(null);

  const triggerCardMediaUpload = (index: number, field: 'image' | 'pdf') => {
    setActiveCardUpload({ index, field });
    if (field === 'image') {
      cardImageUploadRef.current?.click();
    } else {
      cardPdfUploadRef.current?.click();
    }
  };

  const handleCardMediaUploaded = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeCardUpload) return;
    try {
      setIsUploadingCardMedia(true);
      const url = await onUploadMedia(file);
      const { index, field } = activeCardUpload;
      const updated = [...cards];
      if (field === 'image') {
        updated[index] = { ...updated[index], image: url };
        onSaveFeedback('✓ تم تحديث صورة غلاف الكتالوج');
      } else {
        updated[index] = { ...updated[index], pdfUrl: url, fileName: file.name };
        onSaveFeedback(`✓ تم رفع ملف الكتالوج PDF: ${file.name}`);
      }
      persistCards(updated);
    } catch (err: any) {
      alert(err.message || 'فشل في رفع الملف');
    } finally {
      setIsUploadingCardMedia(false);
      setActiveCardUpload(null);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <main className="p-6 space-y-6 flex-1 overflow-y-auto">
      {/* Hidden file upload inputs for partner logos */}
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

      {/* Hidden file upload inputs for catalog cards */}
      <input
        ref={cardImageUploadRef}
        type="file"
        accept="image/*"
        onChange={handleCardMediaUploaded}
        className="hidden"
      />
      <input
        ref={cardPdfUploadRef}
        type="file"
        accept="application/pdf"
        onChange={handleCardMediaUploaded}
        className="hidden"
      />

      {/* SWITCH SUB-TAB SELECTOR (Logos & Brands vs PDF Catalogues) */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Tab 1: Partner Logos */}
          <button
            type="button"
            onClick={() => setActiveSubTab('logos')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'logos'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>
              {currentLanguage.code === 'ar'
                ? 'شعارات الشركاء والعلامات'
                : currentLanguage.code === 'ckb'
                ? 'لۆگۆی هاوبەشەکان'
                : 'Partner Brands & Logos'}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeSubTab === 'logos' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {partnerLogos.length}
            </span>
          </button>

          {/* Tab 2: PDF Architectural Catalogues */}
          <button
            type="button"
            onClick={() => setActiveSubTab('catalogs')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'catalogs'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>
              {currentLanguage.code === 'ar'
                ? 'الكتالوجات الهندسية (PDF)'
                : currentLanguage.code === 'ckb'
                ? 'کەتەلۆگە ئەندازیارییەکان (PDF)'
                : 'Architectural Catalogues (PDF)'}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeSubTab === 'catalogs' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {cards.length}
            </span>
          </button>
        </div>

        {activeSubTab === 'catalogs' && (
          <button
            type="button"
            onClick={() => setIsAddCardModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>
              {currentLanguage.code === 'ar' ? 'إضافة كتالوج جديد' : 'Add New Catalogue'}
            </span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* VIEW A: PARTNER LOGOS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeSubTab === 'logos' && (
        <div className="space-y-6">
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
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{currentLanguage.code === 'ar' ? 'إضافة الشريك للقائمة' : 'Add Brand to List'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {currentLanguage.code === 'ar' ? 'الشركاء والعلامات التجارية الحالية' : 'Current Partner Brands & Flags'}
                </h3>
                <p className="text-xs text-slate-500">
                  {currentLanguage.code === 'ar'
                    ? 'يمكنك تعديل أسماء الدول، ورفع صور الأعلام الحقيقية أو إدخال الإيموجي مباشرة.'
                    : 'Edit country labels, upload custom SVG/PNG flags, or enter flag emojis directly.'}
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {partnerLogos.length} {currentLanguage.code === 'ar' ? 'شركاء معتمدين' : 'Brands'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {partnerLogos.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between gap-3 group relative shadow-2xs"
                >
                  <div className="h-16 flex items-center justify-center p-2 bg-white rounded-lg border border-slate-100 shadow-2xs">
                    <img
                      src={item.src}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Brand Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const updated = [...partnerLogos];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setPartnerLogos(updated);
                        }}
                        className="w-full text-xs font-black text-slate-800 bg-transparent border-b border-dashed border-slate-300 focus:border-red-500 focus:outline-none py-0.5"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Country</label>
                        <input
                          type="text"
                          value={item.country || ''}
                          placeholder="e.g. Germany"
                          onChange={(e) => {
                            const updated = [...partnerLogos];
                            updated[idx] = { ...updated[idx], country: e.target.value };
                            setPartnerLogos(updated);
                          }}
                          className="w-full text-xs font-medium text-slate-700 bg-transparent border-b border-dashed border-slate-300 focus:border-red-500 focus:outline-none py-0.5"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-0.5">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Flag</label>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadingFlagCardIdx(idx);
                              cardFlagFileInputRef.current?.click();
                            }}
                            className="text-[9px] font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5 cursor-pointer"
                            title="Upload Flag File (SVG/PNG)"
                          >
                            <Upload className="w-2.5 h-2.5" />
                            <span>Upload</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={item.flag || ''}
                            placeholder="🇩🇪 or URL"
                            onChange={(e) => {
                              const updated = [...partnerLogos];
                              updated[idx] = { ...updated[idx], flag: e.target.value };
                              setPartnerLogos(updated);
                            }}
                            className="w-full text-xs font-bold text-slate-700 bg-transparent border-b border-dashed border-slate-300 focus:border-red-500 focus:outline-none py-0.5"
                          />
                          {item.flag && (
                            <div className="shrink-0 flex items-center justify-center">
                              {isImageFlag(item.flag) ? (
                                <img
                                  src={item.flag}
                                  alt=""
                                  className="w-5 h-3.5 object-cover rounded shadow-2xs border border-slate-200"
                                />
                              ) : (
                                <span className="text-sm leading-none">{item.flag}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW B: ARCHITECTURAL CATALOGUES (PDF) MANAGEMENT */}
      {/* ========================================================================= */}
      {activeSubTab === 'catalogs' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>
                  {currentLanguage.code === 'ar'
                    ? 'الكتالوجات الهندسية والأنظمة المعمارية المعتمدة (PDF)'
                    : 'Certified Architectural Catalogues (PDF)'}
                </span>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                  {cards.length}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {currentLanguage.code === 'ar'
                  ? 'هذه البطاقات تظهر في قسم الكتالوجات بالصفحة الرئيسية. يمكنك تعديل العناوين، رفع صور الأغلفة، واستبدال ملفات الـ PDF.'
                  : 'These cards appear in the Architectural Catalogues section on the homepage. Edit titles, replace cover images, or upload new PDF catalogs.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddCardModalOpen(true)}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{currentLanguage.code === 'ar' ? 'إضافة كتالوج' : 'Add Catalogue'}</span>
            </button>
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {cards.map((card, idx) => {
              const cardTitleAr = scrubProhibitedText(card.translations?.ar?.title || card.title || '');
              const cardDescAr = scrubProhibitedText(card.translations?.ar?.desc || card.desc || '');
              const cardBtnAr = card.translations?.ar?.buttonText || card.buttonText || 'فتح الكتالوج (PDF)';

              return (
                <div
                  key={card.id || idx}
                  className="bg-white rounded-2xl border-2 border-slate-100 hover:border-red-300 p-4 sm:p-5 transition-all shadow-2xs hover:shadow-md flex flex-col md:flex-row gap-5 items-stretch"
                >
                  {/* Image Stage + Upload Button */}
                  <div className="w-full md:w-56 shrink-0 flex flex-col justify-between gap-2.5">
                    <div className="relative aspect-video md:aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-3 group">
                      {card.image ? (
                        <img
                          src={card.image}
                          alt={cardTitleAr}
                          className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-slate-400 flex flex-col items-center gap-1">
                          <BookOpen className="w-8 h-8 opacity-40" />
                          <span className="text-[10px] font-bold">بدون صورة غلاف</span>
                        </div>
                      )}

                      {/* Brand Label Overlay */}
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-black text-white shadow-sm">
                        {card.brand || `بطاقة #${idx + 1}`}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isUploadingCardMedia}
                      onClick={() => triggerCardMediaUpload(idx, 'image')}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 font-bold text-xs border border-slate-200 hover:border-red-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingCardMedia ? 'جاري الرفع...' : 'تغيير صورة الغلاف'}</span>
                    </button>
                  </div>

                  {/* Form & PDF Attachment Control */}
                  <div className="flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      {/* Card Title */}
                      <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                          عنوان الكتالوج / النظام المعماري
                        </label>
                        <input
                          type="text"
                          value={cardTitleAr}
                          onChange={(e) => handleUpdateCardField(idx, 'title', e.target.value)}
                          placeholder="مثال: كتالوج معماري جديد - أنظمة الأبواب"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-slate-900 font-black text-sm outline-none transition-all"
                        />
                      </div>

                      {/* Card Description */}
                      <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                          الوصف الفني / التفاصيل
                        </label>
                        <textarea
                          rows={2}
                          value={cardDescAr}
                          onChange={(e) => handleUpdateCardField(idx, 'desc', e.target.value)}
                          placeholder="مواصفات وأنظمة معمارية فاخرة للأبواب والنوافذ والواجهات الزجاجية."
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-slate-800 font-medium text-xs outline-none transition-all resize-none"
                        />
                      </div>

                      {/* Button Text */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                            نص زر التحميل
                          </label>
                          <input
                            type="text"
                            value={cardBtnAr}
                            onChange={(e) => handleUpdateCardField(idx, 'buttonText', e.target.value)}
                            placeholder="فتح الكتالوج (PDF)"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-red-500 text-slate-900 font-bold text-xs outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                            اسم الملف أو الملاحظة
                          </label>
                          <input
                            type="text"
                            value={card.fileName || ''}
                            onChange={(e) => {
                              const updated = [...cards];
                              updated[idx] = { ...updated[idx], fileName: e.target.value };
                              persistCards(updated);
                            }}
                            placeholder="مثال: wiek-systems-2026.pdf"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-red-500 text-slate-900 font-medium text-xs outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* PDF URL bar & Actions */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      {/* PDF Upload / Direct Link */}
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 relative">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
                          <input
                            type="text"
                            value={card.pdfUrl || ''}
                            onChange={(e) => handleUpdateCardField(idx, 'pdfUrl', e.target.value)}
                            placeholder="/catalogs/my-catalog.pdf أو رابط مباشر"
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-red-500 text-slate-800 font-mono text-xs outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          disabled={isUploadingCardMedia}
                          onClick={() => triggerCardMediaUpload(idx, 'pdf')}
                          className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                          title="رفع ملف PDF من جهازك"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>رفع PDF</span>
                        </button>

                        {card.pdfUrl && (
                          <a
                            href={card.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
                            title="معاينة ملف الـ PDF"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      {/* Reorder and Delete controls */}
                      <div className="flex items-center justify-end gap-1.5 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveCard(idx, 'up')}
                          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                          title="تحريك لأعلى"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === cards.length - 1}
                          onClick={() => handleMoveCard(idx, 'down')}
                          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                          title="تحريك لأسفل"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCard(idx)}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="حذف هذا الكتالوج"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE NEW CATALOGUE CARD */}
      {/* ========================================================================= */}
      {isAddCardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            dir="rtl"
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">إضافة كتالوج معماري جديد (PDF)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCardModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewCard} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  عنوان الكتالوج / النظام المعماري *
                </label>
                <input
                  type="text"
                  required
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  placeholder="مثال: كتالوج أنظمة WIEK المعمارية الفاخرة"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-red-500 text-slate-900 font-bold text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  الوصف الفني المختصر
                </label>
                <textarea
                  rows={2}
                  value={newCardDesc}
                  onChange={(e) => setNewCardDesc(e.target.value)}
                  placeholder="مواصفات وأنظمة معمارية فاخرة للأبواب والنوافذ والواجهات الزجاجية."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-red-500 text-slate-800 font-medium text-xs outline-none resize-none"
                />
              </div>

              {/* Cover Image Upload & URL */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  صورة الغلاف (Logo / Cover) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={newCardImage}
                    onChange={(e) => setNewCardImage(e.target.value)}
                    placeholder="رابط الصورة أو رفع ملف"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-mono outline-none"
                  />
                  <input
                    ref={newCardImageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadNewCardImage}
                  />
                  <button
                    type="button"
                    disabled={isUploadingNewCardImage}
                    onClick={() => newCardImageInputRef.current?.click()}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 shrink-0 cursor-pointer flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingNewCardImage ? '...' : 'رفع'}</span>
                  </button>
                </div>
              </div>

              {/* PDF Upload & URL */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  ملف الكتالوج (PDF) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={newCardPdfUrl}
                    onChange={(e) => setNewCardPdfUrl(e.target.value)}
                    placeholder="رابط ملف PDF أو رفع ملف"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-mono outline-none"
                  />
                  <input
                    ref={newCardPdfInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleUploadNewCardPdf}
                  />
                  <button
                    type="button"
                    disabled={isUploadingNewCardPdf}
                    onClick={() => newCardPdfInputRef.current?.click()}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1 border border-red-200"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingNewCardPdf ? '...' : 'رفع PDF'}</span>
                  </button>
                </div>
                {newCardPdfName && (
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">
                    الملف المحدد: {newCardPdfName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  نص الزر (اختياري)
                </label>
                <input
                  type="text"
                  value={newCardButtonText}
                  onChange={(e) => setNewCardButtonText(e.target.value)}
                  placeholder="فتح الكتالوج (PDF)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCardModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md shadow-red-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>إضافة الكتالوج</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
