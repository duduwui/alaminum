import React, { useState } from 'react';
import { Plus, X, Check, RefreshCw, CheckCircle2 } from 'lucide-react';
import { HomepageSectionConfig, getLocalizedSectionHeader, saveHomepageSections } from '../../services/homepageSectionsService';
import { saveSharedCmsSection } from '../../services/cmsService';
import { autoTranslateFullProduct } from '../../services/translateService';
import { ProductItem } from '../../data/winhomeData';
import { Admin3DCarouselTab } from '../Admin3DCarouselTab';
import { AdminAllProjectsTab } from '../AdminAllProjectsTab';
import { AdminArchCardsTab } from '../AdminArchCardsTab';
import { AdminDynamicSectionTab } from '../AdminDynamicSectionTab';
import { AdvancedTextarea } from './AdvancedTextarea';

interface AdminCmsTabProps {
  cmsSubTab: string;
  setCmsSubTab: (tab: string) => void;
  homepageSections: HomepageSectionConfig[];
  setHomepageSections: React.Dispatch<React.SetStateAction<HomepageSectionConfig[]>>;
  galleryImages: any[];
  persistGalleryUpdates: (images: any[]) => Promise<void>;
  archCards: any[];
  setArchCards: React.Dispatch<React.SetStateAction<any[]>>;
  productList: ProductItem[];
  setProductList: React.Dispatch<React.SetStateAction<ProductItem[]>>;
  sectionSlides?: ProductItem[];
  setSectionSlides?: React.Dispatch<React.SetStateAction<ProductItem[]>>;
  onUploadMedia: (file: File) => Promise<string>;
  cmsSaveFeedback: string;
  setCmsSaveFeedback: (msg: string) => void;
  currentLanguage: { code: string; name: string };
  t: (key: string) => string;
}

export const AdminCmsTab: React.FC<AdminCmsTabProps> = ({
  cmsSubTab,
  setCmsSubTab,
  homepageSections,
  setHomepageSections,
  galleryImages,
  persistGalleryUpdates,
  archCards,
  setArchCards,
  productList,
  setProductList,
  sectionSlides,
  setSectionSlides,
  onUploadMedia,
  cmsSaveFeedback,
  setCmsSaveFeedback,
  currentLanguage
}) => {
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionSubtitle, setNewSectionSubtitle] = useState('');
  const [newSectionIsProduct, setNewSectionIsProduct] = useState(true);
  const [isCreatingSection, setIsCreatingSection] = useState(false);

  const handleCreateSection = async () => {
    if (!newSectionTitle.trim()) return;
    setIsCreatingSection(true);
    try {
      const key = `sec-${Date.now()}`;
      let translations: Record<string, { name?: string; title?: string; description?: string }> = {
        [currentLanguage.code]: {
          name: newSectionTitle.trim(),
          title: newSectionTitle.trim(),
          description: newSectionSubtitle.trim()
        }
      };
      try {
        const translatedMap = await autoTranslateFullProduct({
          name: newSectionTitle.trim(),
          description: newSectionSubtitle.trim()
        });
        Object.entries(translatedMap).forEach(([code, data]) => {
          translations[code] = {
            name: data.name || newSectionTitle.trim(),
            title: data.name || newSectionTitle.trim(),
            description: data.description || newSectionSubtitle.trim()
          };
        });
      } catch {
        // keep current language fallback
      }
      const newSec: HomepageSectionConfig = {
        id: `sec-id-${Date.now()}`,
        key,
        title: translations.ar?.title || newSectionTitle.trim(),
        description: translations.ar?.description || newSectionSubtitle.trim(),
        isProductSection: newSectionIsProduct,
        translations
      };
      const updated = [...homepageSections, newSec];
      setHomepageSections(updated);
      saveHomepageSections(updated);
      await saveSharedCmsSection('homepageSections', updated);
      setIsAddSectionModalOpen(false);
      setCmsSubTab(`sec:${key}`);
      setCmsSaveFeedback(
        currentLanguage.code === 'ar'
          ? `تم إنشاء القسم "${newSec.title}" وترجمته لجميع اللغات بنجاح`
          : `Section "${newSectionTitle.trim()}" created & translated into all languages`
      );
      setTimeout(() => setCmsSaveFeedback(''), 4000);
    } finally {
      setIsCreatingSection(false);
    }
  };

  return (
    <main className="p-6 space-y-6 flex-1 overflow-y-auto bg-slate-50/60">
      {/* Sub-Navigation Pills for CMS - Sleek Text Pills */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center gap-2">
        {/* 1. 3D Project Showcase */}
        <button
          type="button"
          onClick={() => setCmsSubTab('3d-carousel')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            cmsSubTab === '3d-carousel'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <bdi>
            {currentLanguage.code === 'ar'
              ? 'معرض المشاريع 3D'
              : currentLanguage.code === 'ckb'
              ? 'پێشانگای پڕۆژەکان 3D'
              : currentLanguage.code === 'tr'
              ? '3D Proje Vitrini'
              : '3D Project Showcase'}
          </bdi>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              cmsSubTab === '3d-carousel' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            12
          </span>
        </button>

        {/* 2. All Projects Portfolio */}
        <button
          type="button"
          onClick={() => setCmsSubTab('all-projects')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            cmsSubTab === 'all-projects'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <span>
            {currentLanguage.code === 'ar'
              ? 'أرشيف كل المشاريع'
              : currentLanguage.code === 'ckb'
              ? 'ئەرشیفی هەموو پڕۆژەکان'
              : currentLanguage.code === 'tr'
              ? 'Tüm Projeler Arşivi'
              : 'All Projects Portfolio'}
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              cmsSubTab === 'all-projects' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {galleryImages.length}
          </span>
        </button>

        {/* 3. Architecture Catalogues & Systems Showcase */}
        <button
          type="button"
          onClick={() => setCmsSubTab('arch-cards')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            cmsSubTab === 'arch-cards'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <span>
            {currentLanguage.code === 'ar'
              ? 'الكتالوجات والأنظمة المعمارية'
              : currentLanguage.code === 'ckb'
              ? 'کەتەلۆگ و سیستەمە تەلارسازییەکان'
              : currentLanguage.code === 'tr'
              ? 'Mimari Kataloglar ve Sistemler'
              : 'Architecture Catalogues & Systems'}
          </span>
        </button>

        {/* Dynamic Homepage Sections */}
        {homepageSections.map((sec) => {
          const tabId = `sec:${sec.key}`;
          const isActive = cmsSubTab === tabId;
          const header = getLocalizedSectionHeader(sec, currentLanguage.code);
          const slidesSource = sectionSlides || [];
          const count = slidesSource.filter((p) => p.division === sec.key || p.category === sec.key).length;
          const isProdSec = sec.isProductSection !== false;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setCmsSubTab(tabId)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>{header.title || sec.title}</span>
              {!isProdSec && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider ${
                    isActive ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {currentLanguage.code === 'ar' ? 'استعراض' : 'Showcase'}
                </span>
              )}
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        {/* + Add New Homepage Section Button */}
        <button
          type="button"
          onClick={() => {
            setNewSectionTitle('');
            setNewSectionSubtitle('');
            setNewSectionIsProduct(true);
            setIsAddSectionModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>
            {currentLanguage.code === 'ar'
              ? 'إضافة قسم جديد للموقع'
              : currentLanguage.code === 'ckb'
              ? 'زیادکردنی بەشی نوێ'
              : 'Add New Section'}
          </span>
        </button>
      </div>

      {/* Add New Homepage Section Modal */}
      {isAddSectionModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-base font-black text-slate-900">
                  {currentLanguage.code === 'ar'
                    ? 'إنشاء قسم جديد في الصفحة الرئيسية'
                    : currentLanguage.code === 'ckb'
                    ? 'دروستکردنی بەشی نوێ لە پەڕەی سەرەکی'
                    : 'Create New Homepage Section'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentLanguage.code === 'ar'
                    ? 'أدخل عنوان ووصف القسم وحدد ما إذا كان قسم منتجات رسمي أو للعرض فقط'
                    : 'Enter section details and choose whether it serves as a product category'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSectionModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Section Purpose & Type Selector */}
              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-2">
                  {currentLanguage.code === 'ar' ? 'نوع القسم والغرض منه *' : 'Section Purpose & Type *'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setNewSectionIsProduct(true)}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col gap-1 ${
                      newSectionIsProduct
                        ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        {currentLanguage.code === 'ar' ? 'قسم منتجات وكتالوج' : 'Product Category'}
                      </span>
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-black ${
                          newSectionIsProduct ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {newSectionIsProduct && '✓'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {currentLanguage.code === 'ar'
                        ? 'يظهر كتصنيف مستقل عند إضافة المنتجات في الكتالوج وفلاتر الموقع'
                        : 'Creates a product category in catalog & Add Product dropdown'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewSectionIsProduct(false)}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col gap-1 ${
                      !newSectionIsProduct
                        ? 'border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        {currentLanguage.code === 'ar' ? 'قسم استعراض ووسائط عام' : 'Showcase / Media Only'}
                      </span>
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-black ${
                          !newSectionIsProduct ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {!newSectionIsProduct && '✓'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {currentLanguage.code === 'ar'
                        ? 'للعرض بالصفحة الرئيسية فقط دون إضافته لقوائم وتصنيفات المنتجات'
                        : 'Homepage showcase only; does not pollute product category lists'}
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-1.5">
                  {currentLanguage.code === 'ar' ? 'اسم / عنوان القسم *' : 'Section Title *'}
                </label>
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder={
                    currentLanguage.code === 'ar'
                      ? 'مثال: الواجهات الزجاجية والستائر الحائطية'
                      : 'e.g. Glass Facades & Curtain Walls'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-1.5">
                  {currentLanguage.code === 'ar' ? 'وصف القسم (تحت العنوان)' : 'Section Description / Subtitle'}
                </label>
                <textarea
                  rows={3}
                  value={newSectionSubtitle}
                  onChange={(e) => setNewSectionSubtitle(e.target.value)}
                  placeholder={
                    currentLanguage.code === 'ar'
                      ? 'أدخل وصفاً مختصراً يظهر تحت عنوان القسم في الصفحة الرئيسية...'
                      : 'Enter a subtitle or description displayed under the section title...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-500 resize-y"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isCreatingSection}
                onClick={() => setIsAddSectionModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-all cursor-pointer"
              >
                {currentLanguage.code === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={isCreatingSection || !newSectionTitle.trim()}
                onClick={handleCreateSection}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                {isCreatingSection ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{currentLanguage.code === 'ar' ? 'جاري الإنشاء والترجمة...' : 'Creating...'}</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{currentLanguage.code === 'ar' ? 'إنشاء وتطبيق فوراً' : 'Create Section'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CMS Feedback Banner */}
      {cmsSaveFeedback && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-black">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{cmsSaveFeedback}</span>
          </div>
          <button type="button" onClick={() => setCmsSaveFeedback('')} className="text-emerald-600 text-xs font-bold">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: 3D INTERACTIVE CAROUSEL (12 SLOTS) */}
      {cmsSubTab === '3d-carousel' && (
        <Admin3DCarouselTab
          galleryImages={galleryImages}
          onUpdateGallery={persistGalleryUpdates}
          onUploadMedia={onUploadMedia}
          onSaveFeedback={(msg) => {
            setCmsSaveFeedback(msg);
            setTimeout(() => setCmsSaveFeedback(''), 4000);
          }}
        />
      )}

      {/* TAB 2: ALL PROJECTS ARCHIVE & PORTFOLIO */}
      {cmsSubTab === 'all-projects' && (
        <AdminAllProjectsTab
          galleryImages={galleryImages}
          onUpdateGallery={persistGalleryUpdates}
          onUploadMedia={onUploadMedia}
          onSaveFeedback={(msg) => {
            setCmsSaveFeedback(msg);
            setTimeout(() => setCmsSaveFeedback(''), 4000);
          }}
          AdvancedTextarea={AdvancedTextarea}
        />
      )}

      {/* TAB 3: ARCHITECTURE CARDS & CATALOGUES */}
      {cmsSubTab === 'arch-cards' && (
        <AdminArchCardsTab
          archCards={archCards}
          onUpdateArchCards={setArchCards}
          onUploadMedia={onUploadMedia}
          onSaveFeedback={(msg) => {
            setCmsSaveFeedback(msg);
            setTimeout(() => setCmsSaveFeedback(''), 4000);
          }}
        />
      )}

      {/* TAB 4+: DYNAMIC HOMEPAGE PRODUCT SECTIONS */}
      {cmsSubTab.startsWith('sec:') && (() => {
        const secKey = cmsSubTab.replace('sec:', '');
        const activeSec = homepageSections.find((s) => s.key === secKey) || homepageSections[0];
        if (!activeSec) return null;
        return (
          <AdminDynamicSectionTab
            section={activeSec}
            allSections={homepageSections}
            setAllSections={setHomepageSections}
            onSelectSectionKey={(nextKey) => {
              if (nextKey) {
                setCmsSubTab(`sec:${nextKey}`);
              }
            }}
            productList={sectionSlides || []}
            setProductList={(val) => {
              if (setSectionSlides) {
                setSectionSlides(val);
              }
            }}
            onUploadMedia={onUploadMedia}
            onSaveFeedback={(msg) => {
              setCmsSaveFeedback(msg);
              setTimeout(() => setCmsSaveFeedback(''), 4000);
            }}
          />
        );
      })()}
    </main>
  );
};
