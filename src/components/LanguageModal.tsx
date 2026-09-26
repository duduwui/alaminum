import React, { useState, useMemo } from 'react';
import { useLanguage, REGIONS, Language } from '../context/LanguageContext';
import { X, Search, Check, Globe, MapPin } from 'lucide-react';
import { getRegionLabel, getLanguageDisplayName } from '../data/commonTranslations';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { currentLanguage, setLanguage, supportedLanguages, t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const searchQuery = '';

  const filteredLanguages = useMemo(() => {
    let list = supportedLanguages;

    // Filter by Region
    if (selectedRegion !== 'all') {
      list = list.filter((l) => l.region === selectedRegion);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.nativeName.toLowerCase().includes(q) ||
          l.country.toLowerCase().includes(q) ||
          l.code.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedRegion, searchQuery, supportedLanguages]);

  if (!isOpen) return null;

  const handleSelect = (code: string) => {
    setLanguage(code);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 notranslate"
      translate="no"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] text-left animate-in zoom-in-95 duration-200 notranslate"
        translate="no"
        onClick={(e) => e.stopPropagation()}
        dir="ltr"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50 notranslate" translate="no">
          <div className="text-left notranslate" translate="no">
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight notranslate" translate="no">
              {t('language_label')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer notranslate"
            aria-label={t('ui_close')}
            translate="no"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location Region Tabs (Alumil style) */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-slate-100 bg-white notranslate" translate="no">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 notranslate" translate="no">
            {REGIONS.map((r) => {
              const isActive = selectedRegion === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRegion(r.id)}
                  translate="no"
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer notranslate ${
                    isActive
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {getRegionLabel(currentLanguage.code, r.id)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-left notranslate" dir="ltr" translate="no">
          {filteredLanguages.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm notranslate" translate="no">
              No matching country or language found for "{searchQuery}"
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 notranslate" translate="no">
              {filteredLanguages.map((lang) => {
                const isSelected = currentLanguage.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    translate="no"
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer group notranslate ${
                      isSelected
                        ? 'bg-red-50/90 border-red-600 text-red-950 shadow-xs ring-1 ring-red-600'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 text-left notranslate" translate="no">
                      {lang.flagImage ? (
                        <img
                          src={lang.flagImage}
                          alt={lang.name}
                          className="w-7 h-5 object-cover rounded shadow-xs shrink-0 border border-slate-200"
                        />
                      ) : (
                        <span className="text-2xl shrink-0 leading-none">{lang.flag}</span>
                      )}
                      <div className="truncate text-left notranslate" translate="no">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 truncate notranslate" translate="no">
                          {lang.nativeName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5 notranslate" translate="no">
                          {getLanguageDisplayName(currentLanguage.code, lang.code, lang.nativeName)}
                        </div>
                      </div>
                    </div>

                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 ml-2 notranslate" translate="no">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <span className="text-xs text-transparent group-hover:text-red-600 font-bold shrink-0 ml-2 notranslate" translate="no">
                        →
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 text-left notranslate" dir="ltr" translate="no">
          <div className="flex items-center gap-2 notranslate" translate="no">
            <MapPin className="w-4 h-4 text-red-600" />
            <span className="flex items-center gap-1.5 notranslate" translate="no">
              <span>{t('language_label')}:</span>
              {currentLanguage.flagImage ? (
                <img
                  src={currentLanguage.flagImage}
                  alt=""
                  className="w-5 h-3.5 object-cover rounded shadow-xs inline-block border border-slate-200"
                />
              ) : (
                <span>{currentLanguage.flag}</span>
              )}
              <strong className="text-slate-900 notranslate" translate="no">{currentLanguage.nativeName}</strong>
              <span className="notranslate" translate="no">({getLanguageDisplayName(currentLanguage.code, currentLanguage.code, currentLanguage.nativeName)})</span>
            </span>
          </div>
          <button
            onClick={onClose}
            translate="no"
            className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer notranslate"
          >
            {t('ui_close')}
          </button>
        </div>
      </div>
    </div>
  );
};
