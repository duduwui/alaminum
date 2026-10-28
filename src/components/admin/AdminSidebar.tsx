import React from 'react';
import { Package, Users, ImageIcon, Globe, ExternalLink } from 'lucide-react';
import { DOORHOME_CONTACT } from '../../data/winhomeData';

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (s: any) => void;
  productsCount: number;
  cmsCount: number;
  logosCount: number;
  currentLanguage: { code: string; name: string };
  setLanguage: (code: string) => void;
  onBackToHome: () => void;
  t: (key: string) => string;
  supportedLanguages: any[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  setActiveSection,
  productsCount,
  cmsCount,
  logosCount,
  currentLanguage,
  setLanguage,
  onBackToHome,
  t,
  supportedLanguages
}) => {
  return (
    <>
      {/* DESKTOP LEFT SIDEBAR */}
      <aside className="w-64 bg-red-600 text-white border-r border-red-700 shrink-0 flex flex-col justify-between hidden md:flex h-full overflow-y-auto z-30 shadow-md select-none">
        <div>
          {/* Logo & Brand Header */}
          <div className="p-5 border-b border-red-500/60 flex items-center gap-3">
            <div className="h-10 w-10 bg-white rounded-xl p-1 flex items-center justify-center shrink-0 shadow-sm">
              <img
                src={DOORHOME_CONTACT.logo}
                alt="Doorhome Logo"
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DOORHOME_CONTACT.logoFallback;
                }}
              />
            </div>
            <div>
              <h1 className="text-sm font-black text-white leading-tight tracking-wide">
                Doorhome Console
              </h1>
              <span className="text-[10px] text-red-100 font-medium">
                {currentLanguage.code === 'ar'
                  ? 'لوحة الإدارة الهندسية'
                  : currentLanguage.code === 'ckb'
                  ? 'پەنێڵی بەڕێوەبردن'
                  : 'Architecture & Catalog'}
              </span>
            </div>
          </div>

          {/* Nav Section Links */}
          <div className="p-4 space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-red-200 block px-3 mb-2">
                {currentLanguage.code === 'ar' ? 'القائمة الرئيسية' : currentLanguage.code === 'ckb' ? 'مێنۆی سەرەکی' : 'Main Menu'}
              </span>
              <nav className="space-y-1.5">
                {/* PRODUCTS CATALOG TAB */}
                <button
                  type="button"
                  onClick={() => setActiveSection('products')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    activeSection === 'products'
                      ? 'bg-white text-red-700 font-extrabold shadow-md border border-white'
                      : 'text-white/90 hover:text-white hover:bg-white/15 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package className={`w-4 h-4 ${activeSection === 'products' ? 'text-red-600' : 'text-white'}`} />
                    <span>
                      {currentLanguage.code === 'ar'
                        ? 'قائمة المنتجات والكتالوج'
                        : currentLanguage.code === 'ckb'
                        ? 'لیستی بەرهەمەکان'
                        : 'Products Catalog'}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                      activeSection === 'products'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-red-700/80 text-white border border-red-400/40'
                    }`}
                  >
                    {productsCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection('users')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    activeSection === 'users'
                      ? 'bg-white text-red-700 font-extrabold shadow-md border border-white'
                      : 'text-white/90 hover:text-white hover:bg-white/15 font-bold'
                  }`}
                >
                  <Users className={`w-4 h-4 ${activeSection === 'users' ? 'text-red-600' : 'text-white'}`} />
                  <span>{t('admin_tab_users')}</span>
                </button>
              </nav>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-red-200 block px-3 mb-2">
                {currentLanguage.code === 'ar' ? 'المحتوى والهوية' : currentLanguage.code === 'ckb' ? 'ناوەڕۆک و براند' : 'Content & Branding'}
              </span>
              <nav className="space-y-1.5">
                {/* CMS & GALLERY TAB */}
                <button
                  type="button"
                  onClick={() => setActiveSection('cms')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    activeSection === 'cms'
                      ? 'bg-white text-red-700 font-extrabold shadow-md border border-white'
                      : 'text-white/90 hover:text-white hover:bg-white/15 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ImageIcon className={`w-4 h-4 ${activeSection === 'cms' ? 'text-red-600' : 'text-white'}`} />
                    <span>
                      {currentLanguage.code === 'ar'
                        ? 'معرض المشاريع والوسائط'
                        : currentLanguage.code === 'ckb'
                        ? 'پڕۆژەکان و کارۆسێل'
                        : 'CMS & Gallery'}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                      activeSection === 'cms'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-red-700/80 text-white border border-red-400/40'
                    }`}
                  >
                    {cmsCount}
                  </span>
                </button>

                {/* PARTNER BRANDS & FLAGS TAB */}
                <button
                  type="button"
                  onClick={() => setActiveSection('logos')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    activeSection === 'logos'
                      ? 'bg-white text-red-700 font-extrabold shadow-md border border-white'
                      : 'text-white/90 hover:text-white hover:bg-white/15 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Globe className={`w-4 h-4 ${activeSection === 'logos' ? 'text-red-600' : 'text-white'}`} />
                    <span>
                      {currentLanguage.code === 'ar'
                        ? 'العلامات والشركاء'
                        : currentLanguage.code === 'ckb'
                        ? 'لۆگۆی هاوبەشەکان'
                        : 'Partner Brands & Flags'}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                      activeSection === 'logos'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-red-700/80 text-white border border-red-400/40'
                    }`}
                  >
                    {logosCount}
                  </span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Sidebar Action */}
        <div className="p-4 border-t border-red-500/60">
          <button
            type="button"
            onClick={() => {
              window.location.hash = '';
              onBackToHome();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white text-white hover:text-red-700 font-extrabold text-xs transition-all flex items-center justify-center gap-2 border border-white/30 cursor-pointer shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{currentLanguage.code === 'ar' ? 'العودة للموقع الرئيسي' : currentLanguage.code === 'ckb' ? 'گەڕانەوە بۆ ماڵپەڕ' : 'Back to Website'} ↗</span>
          </button>
        </div>
      </aside>

      {/* MOBILE TOP TAB BAR */}
      <div className="md:hidden bg-red-600 text-white border-b border-red-700 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 z-10">
        <button
          type="button"
          onClick={() => setActiveSection('products')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
            activeSection === 'products' ? 'bg-white text-red-700 shadow-sm' : 'text-white/90 hover:bg-white/10'
          }`}
        >
          {currentLanguage.code === 'ar' ? 'المنتجات والكتالوج' : 'Products'} ({productsCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('users')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
            activeSection === 'users' ? 'bg-white text-red-700 shadow-sm' : 'text-white/90 hover:bg-white/10'
          }`}
        >
          {t('admin_tab_users')}
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('cms')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
            activeSection === 'cms' ? 'bg-white text-red-700 shadow-sm' : 'text-white/90 hover:bg-white/10'
          }`}
        >
          {currentLanguage.code === 'ar' ? 'معرض المشاريع (CMS)' : 'CMS & Gallery'} ({cmsCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('logos')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
            activeSection === 'logos' ? 'bg-white text-red-700 shadow-sm' : 'text-white/90 hover:bg-white/10'
          }`}
        >
          {currentLanguage.code === 'ar' ? 'العلامات والشركاء' : 'Partner Brands'} ({logosCount})
        </button>
      </div>
    </>
  );
};
