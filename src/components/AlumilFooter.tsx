import React from 'react';
import { DOORHOME_CONTACT } from '../data/winhomeData';
import { useLanguage } from '../context/LanguageContext';
import {
  Phone,
  Mail,
  ArrowUp,
  Clock
} from 'lucide-react';

interface AlumilFooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenQuote: () => void;
}

export const AlumilFooter: React.FC<AlumilFooterProps> = ({ onNavigate, onOpenQuote }) => {
  const { currentLanguage, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const rawPhone = (DOORHOME_CONTACT.phone || DOORHOME_CONTACT.hotlineRaw || '+9647504440402').replace(/\s+/g, '');
  const displayPhone = DOORHOME_CONTACT.phone || DOORHOME_CONTACT.hotline || '+964 750 444 0402';

  return (
    <footer className="bg-[#3E4346] text-white text-xs relative border-t border-slate-700">
      {/* 4-Column Personal Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-8 max-w-3xl border-l-2 border-red-500 pl-4">
          <p className="text-sm font-bold text-white">{t('brand_name_full') || 'Doorhome Company'}</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            {t('footer_intro')}
          </p>
          <nav aria-label={t('footer_col_company')} className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold">
            <a href="/products" className="hover:text-red-300">{t('footer_col_products')}</a>
            <a href="/projects" className="hover:text-red-300">{t('footer_projects')}</a>
            <a href="/contact" className="hover:text-red-300">{t('footer_col_contact')}</a>
          </nav>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-slate-600 pb-2">
              {t('footer_col_products')}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavigate('aluminum')} className="hover:text-red-400 transition-colors">
                  {t('footer_windows_doors')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('upvc')} className="hover:text-red-400 transition-colors">
                  {t('footer_entrance_doors')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-red-400 transition-colors">
                  {t('footer_facades')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('accessories')} className="hover:text-red-400 transition-colors">
                  {t('footer_partitions')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('typology')} className="hover:text-red-400 transition-colors">
                  {t('footer_outdoor')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-slate-600 pb-2">
              {t('footer_col_support')}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-red-400 transition-colors">
                  {t('footer_network')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('typology')} className="hover:text-red-400 transition-colors">
                  {t('footer_selection_guide')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-red-400 transition-colors">
                  {t('footer_consultation')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-red-400 transition-colors">
                  {t('footer_faqs')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-slate-600 pb-2">
              {t('footer_col_company')}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-red-400 transition-colors">
                  {t('footer_about_us')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-red-400 transition-colors">
                  {t('footer_contact')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('projects')} className="hover:text-red-400 transition-colors">
                  {t('footer_projects')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('articles')} className="hover:text-red-400 transition-colors">
                  {isArabic ? 'المقالات والدليل الهندسي (30 مقال)' : isKurdish ? 'وتار و ڕێبەری ئەندازیاری' : 'Articles & Guides (30)'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reviews')} className="hover:text-amber-300 transition-colors text-amber-400 font-bold flex items-center gap-1">
                  <span>★</span>
                  <span>{isArabic ? 'تقييم الشركة وآراء العملاء' : isKurdish ? 'هەڵسەنگاندنی کڕیاران' : 'Rate Us & Reviews'}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-red-400 transition-colors">
                  {t('footer_quality')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-slate-600 pb-2">
              {t('footer_col_contact')}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <a href={`tel:${rawPhone}`} className="hover:text-red-400 transition-colors">
                  {displayPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-400 shrink-0" />
                <a href={`mailto:${DOORHOME_CONTACT.email || 'info@doorhome.co'}`} className="hover:text-red-400 transition-colors">
                  {DOORHOME_CONTACT.email || 'info@doorhome.co'}
                </a>
              </div>

              {/* Working Hours prominently displayed */}
              <div className="flex items-start gap-2 pt-2.5 border-t border-slate-700 mt-2">
                <Clock className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-black text-white text-xs">
                    {t('footer_working_hours_time')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {t('footer_working_hours_days')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Logo & All 4 Social Icons */}
        <div className="mt-14 pt-8 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={DOORHOME_CONTACT.logo}
              alt="Doorhome"
              className="h-10 w-auto object-contain brightness-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DOORHOME_CONTACT.logoFallback;
              }}
            />
            {/* All 4 Social Links (Instagram, TikTok, WhatsApp, Facebook) */}
            <div className="flex items-center gap-2.5 pl-4 border-l border-slate-700">
              <a
                href="https://www.instagram.com/door.home3"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center transition-all shadow-md hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                title="Instagram @door.home3"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@door.home0?_r=1&_t=ZS-98yzfkS48ov"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center transition-all shadow-md hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                title="TikTok @door.home0"
                aria-label="TikTok"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.02 3.32-1.45 3.48-3.26.06-1.31.03-2.63.03-3.95V0h-.22z" />
                </svg>
              </a>
              <a
                href="https://wa.me/9647507388748"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-[#25D366] text-white flex items-center justify-center transition-all shadow-md hover:-translate-y-0.5 hover:bg-[#20ba5a] hover:shadow-lg cursor-pointer"
                title="WhatsApp +964 750 738 8748"
                aria-label="WhatsApp"
              >
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.585 1.961.934 2.8.934 3.182 0 5.768-2.587 5.768-5.766.001-3.187-2.575-5.821-5.772-5.821zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.073-2.12-.518-1.503-.622-2.464-2.138-2.538-2.238-.075-.099-.607-.807-.607-1.539s.385-1.09.522-1.236c.137-.145.3-.182.4-.182s.2.001.288.006c.094.004.22-.036.344.262.129.311.442 1.077.481 1.156.039.079.065.172.013.276-.052.104-.078.169-.156.259-.078.091-.164.203-.234.272-.078.077-.16.16-.069.316.091.156.404.667.868 1.079.596.53 1.098.694 1.254.772.156.078.247.069.339-.036.091-.104.391-.455.495-.611.104-.156.208-.13.349-.078.141.052.898.423 1.052.501.154.078.257.117.295.182.039.065.039.377-.105.782z" />
                  <path d="M12.004 2c-5.518 0-9.995 4.477-9.995 9.996 0 1.763.459 3.489 1.332 5.006l-1.417 5.176 5.305-1.392c1.47.802 3.131 1.226 4.775 1.226 5.519 0 9.996-4.477 9.996-9.996 0-5.519-4.477-9.996-9.996-9.996zm0 18.232c-1.528 0-3.027-.41-4.336-1.186l-.311-.185-3.224.846.86-3.142-.203-.323c-.854-1.358-1.306-2.936-1.306-4.551 0-4.542 3.696-8.238 8.239-8.238 4.543 0 8.239 3.696 8.239 8.238 0 4.542-3.696 8.238-8.239 8.238z" />
                </svg>
              </a>
              <a
                href="https://facebook.com/profile.php?id=61590704835636"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-[#1877F2] text-white flex items-center justify-center transition-all shadow-md hover:-translate-y-0.5 hover:bg-[#1464d8] hover:shadow-lg cursor-pointer"
                title="Facebook Doorhome Company"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} {t('footer_rights')}
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-slate-700 hover:bg-red-600 hover:text-white text-white transition-colors cursor-pointer"
            title={t('footer_back_to_top')}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
