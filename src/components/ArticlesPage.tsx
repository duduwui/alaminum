import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  Calendar,
  User,
  ArrowRight,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MessageCircle,
  Star,
  ExternalLink,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ARCHITECTURAL_ARTICLES, ArchitecturalArticle } from '../data/articlesData';

interface ArticlesPageProps {
  initialSlug?: string | null;
  onNavigateToReviews?: () => void;
  onOpenQuoteModal?: () => void;
  onBackToHome?: () => void;
}

export const ArticlesPage: React.FC<ArticlesPageProps> = ({
  initialSlug,
  onNavigateToReviews,
  onOpenQuoteModal,
  onBackToHome
}) => {
  const { currentLanguage } = useLanguage();
  const langCode = (currentLanguage?.code || 'ar').toLowerCase();

  const isKurdish = langCode.startsWith('ckb') || langCode.startsWith('ku') || langCode.startsWith('kmr');
  const isEnglish = langCode.startsWith('en');
  const langKey: 'ar' | 'ckb' | 'en' = isKurdish ? 'ckb' : isEnglish ? 'en' : 'ar';
  const isRtl = langKey === 'ar' || langKey === 'ckb';

  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (initialSlug) {
      setSelectedSlug(initialSlug);
    }
  }, [initialSlug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedSlug]);

  const categories = useMemo(() => {
    if (isKurdish) {
      return [
        { id: 'all', label: 'هەموو وتارەکان' },
        { id: 'windows', label: 'پەنجەرەی ئەلەمنیۆم' },
        { id: 'doors', label: 'دەرگای پانۆراما و پیڤۆت' },
        { id: 'glass', label: 'پلیکانی شووشە و ڕووکار' },
        { id: 'railings', label: 'محاجەرە و پارێزبەند' },
        { id: 'upvc', label: 'سیستەمی uPVC' },
        { id: 'hardware', label: 'ئێکسسوارات و قوفڵ' },
        { id: 'guide', label: 'ڕێبەری کڕین و نرخ' }
      ];
    }
    if (isEnglish) {
      return [
        { id: 'all', label: 'All Articles' },
        { id: 'windows', label: 'Aluminum Windows' },
        { id: 'doors', label: 'Doors & Entrances' },
        { id: 'glass', label: 'Glass Stairs & Facades' },
        { id: 'railings', label: 'Railings & Balustrades' },
        { id: 'upvc', label: 'uPVC Systems' },
        { id: 'hardware', label: 'Hardware & Security' },
        { id: 'guide', label: 'Cost & Buying Guides' }
      ];
    }
    return [
      { id: 'all', label: 'جميع المقالات الهندسية' },
      { id: 'windows', label: 'شبابيك ألمنيوم' },
      { id: 'doors', label: 'أبواب سحاب ومداخل' },
      { id: 'glass', label: 'درج زجاجي وواجهات' },
      { id: 'railings', label: 'درابزين وحواجز' },
      { id: 'upvc', label: 'نوافذ uPVC' },
      { id: 'hardware', label: 'إكسسوارات وأقفال' },
      { id: 'guide', label: 'دليل الأسعار والمواصفات' }
    ];
  }, [isKurdish, isEnglish]);

  const filteredArticles = useMemo(() => {
    return ARCHITECTURAL_ARTICLES.filter((article) => {
      const matchCat = selectedCategory === 'all' || article.category === selectedCategory;
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const titleText = (article.title[langKey] || article.title.ar).toLowerCase();
      const summaryText = (article.summary[langKey] || article.summary.ar).toLowerCase();
      const tagMatch = article.tags.some((t) => t.toLowerCase().includes(q));

      return titleText.includes(q) || summaryText.includes(q) || tagMatch;
    });
  }, [selectedCategory, searchQuery, langKey]);

  const activeArticle = useMemo(() => {
    if (!selectedSlug) return null;
    return ARCHITECTURAL_ARTICLES.find((a) => a.slug === selectedSlug || a.id === selectedSlug) || null;
  }, [selectedSlug]);

  const handleCopyLink = (slug?: string) => {
    const targetSlug = slug || selectedSlug;
    const url = targetSlug
      ? `${window.location.origin}/#article-${targetSlug}`
      : `${window.location.origin}/#articles`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  const texts = useMemo(() => {
    if (isKurdish) {
      return {
        badge: 'ئەرشیفی وتارە ئەندازیارییەکان',
        title: 'ڕێبەری ئەندازیاری دەرگای ماڵ: ٣٠ وتاری زانستی',
        subtitle: 'تەواوی زانیارییەکان دەربارەی کوالێتی ئەلەمنیۆم، پلیکانی شووشە، عەزلی گەرمی و دەنگ، و نرخەکان لە عێراق.',
        searchPh: 'گەڕان لە وتارەکان (نموونە: پلیکانە، نرخ، uPVC، عەزل)...',
        readMore: 'خوێندنەوەی تەواوی وتار',
        allArticles: 'گەڕانەوە بۆ لیستی وتارەکان',
        share: 'هاوبەشکردن',
        copied: 'بەستەرەکە کۆپیکرا!',
        rateBiz: 'هەڵسەنگاندن بۆ دەرگای ماڵ بنێرە',
        requestQuote: 'داواکردنی عەرزی نرخی بێبەرامبەر',
        whatsapp: 'پەیوەندی لەگەڵ ئەندازیار',
        keySpecs: 'تایبەتمەندییە سەرەکییەکان',
        related: 'وتارە پەیوەندیدارەکان'
      };
    }
    if (isEnglish) {
      return {
        badge: 'ARCHITECTURAL KNOWLEDGE HUB',
        title: 'Doorhome Architectural Guides: 30 Master Articles',
        subtitle: 'In-depth engineering analyses on thermal-break aluminum, glass stairs, acoustic uPVC, and fenestration costs in Iraq.',
        searchPh: 'Search 30 articles (e.g., thermal break, glass stairs, price, uPVC)...',
        readMore: 'Read Full Article',
        allArticles: 'Back to All Articles',
        share: 'Share',
        copied: 'Link Copied!',
        rateBiz: 'Rate Our Business & Review',
        requestQuote: 'Request Free Quote',
        whatsapp: 'Chat on WhatsApp',
        keySpecs: 'Key Technical Specifications',
        related: 'Related Articles'
      };
    }
    return {
      badge: 'المرجع الهندسي والمعماري الشامل',
      title: 'دليل Doorhome الهندسي: 30 مقالاً يغطي كافة الأنظمة المعمارية',
      subtitle: 'أكبر مكتبة معرفية متخصصة في شبابيك وأبواب الألمنيوم الحراري، السلالم الزجاجية المعلقة، نوافذ uPVC، والأسعار في العراق.',
      searchPh: 'ابحث في 30 مقالاً (مثال: درج زجاجي، أسعار، عزل حراري، سحاب، uPVC)...',
      readMore: 'قراءة المقال بالكامل',
      allArticles: 'العودة لجميع المقالات',
      share: 'مشاركة المقال',
      copied: 'تم نسخ الرابط!',
      rateBiz: 'قيم خدماتنا واكتب رأيك',
      requestQuote: 'طلب استشارة وعرض سعر',
      whatsapp: 'تحدث مع المهندس عبر واتساب',
      keySpecs: 'أبرز المواصفات الهندسية',
      related: 'مقالات ذات صلة'
    };
  }, [isKurdish, isEnglish]);

  // SINGLE ARTICLE DETAIL READER VIEW
  if (activeArticle) {
    const articleTitle = activeArticle.title[langKey] || activeArticle.title.ar;
    const articleSummary = activeArticle.summary[langKey] || activeArticle.summary.ar;
    const sections = isEnglish ? activeArticle.sections.en : activeArticle.sections.ar;
    const categoryLabel = activeArticle.categoryLabel[langKey] || activeArticle.categoryLabel.ar;

    const relatedArticles = ARCHITECTURAL_ARTICLES.filter(
      (a) => a.id !== activeArticle.id && a.category === activeArticle.category
    ).slice(0, 3);

    return (
      <div className="w-full min-h-screen bg-slate-50 text-slate-800 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Navigation Button */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <button
              type="button"
              onClick={() => setSelectedSlug(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              <span>{texts.allArticles}</span>
            </button>

            {onNavigateToReviews && (
              <button
                type="button"
                onClick={onNavigateToReviews}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{texts.rateBiz}</span>
              </button>
            )}
          </div>

          {/* Article Header Card */}
          <article className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
            {/* Category & Reading Time */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 mb-4">
              <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 font-bold border border-red-200">
                {categoryLabel}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {activeArticle.readingTime}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {activeArticle.date}
              </span>
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <User className="w-3.5 h-3.5" />
                {activeArticle.author}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-6">
              {articleTitle}
            </h1>

            {/* Featured Image */}
            <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden mb-8 border border-slate-200">
              <img
                src={activeArticle.image}
                alt={articleTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = './assets/doorhome/03-2.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <p className="text-white text-xs sm:text-sm font-semibold max-w-2xl drop-shadow-md">
                  {articleSummary}
                </p>
              </div>
            </div>

            {/* Key Technical Specs Box if available */}
            {activeArticle.keySpecs && activeArticle.keySpecs.length > 0 && (
              <div className="mb-8 p-5 rounded-2xl bg-slate-900 text-white shadow-md">
                <div className="flex items-center gap-2 mb-3 text-red-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-red-500" />
                  <span>{texts.keySpecs}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {activeArticle.keySpecs.map((spec, idx) => (
                    <div key={idx} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                      <p className="text-[11px] text-slate-400 font-medium">{spec.label}</p>
                      <p className="text-sm font-bold text-white mt-0.5">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Article Body Content */}
            <div className="space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
              {sections.map((sec, idx) => (
                <section key={idx} className="space-y-3">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 border-r-4 rtl:border-r-4 ltr:border-l-4 border-red-600 px-3">
                    {sec.heading}
                  </h2>
                  <p className="whitespace-pre-line text-slate-700 leading-relaxed font-normal">
                    {sec.body}
                  </p>
                </section>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400" />
              {activeArticle.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Share and Action Bar */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{texts.share}:</span>
                <button
                  type="button"
                  onClick={() => handleCopyLink(activeArticle.slug)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? texts.copied : texts.share}</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${articleTitle}\n${window.location.origin}/#article-${activeArticle.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/9647517945498?text=${encodeURIComponent(`مرحباً Doorhome، لدي استفسار حول مقال: ${articleTitle}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{texts.whatsapp}</span>
                </a>

                {onOpenQuoteModal && (
                  <button
                    type="button"
                    onClick={onOpenQuoteModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{texts.requestQuote}</span>
                  </button>
                )}
              </div>
            </div>
          </article>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-red-600" />
                <span>{texts.related}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => {
                  const relTitle = rel.title[langKey] || rel.title.ar;
                  return (
                    <div
                      key={rel.id}
                      onClick={() => setSelectedSlug(rel.slug)}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between p-4"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                          {rel.categoryLabel[langKey] || rel.categoryLabel.ar}
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2">
                          {relTitle}
                        </h4>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                        <span>{rel.readingTime}</span>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-red-600 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ARTICLES DIRECTORY / HUB VIEW
  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold mb-4">
            <BookOpen className="w-4 h-4 text-red-600" />
            <span>{texts.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {texts.title}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            {texts.subtitle}
          </p>

          {/* Quick CTA to review link */}
          {onNavigateToReviews && (
            <div className="mt-6 inline-flex items-center gap-3">
              <button
                type="button"
                onClick={onNavigateToReviews}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Star className="w-4 h-4 fill-white" />
                <span>{texts.rateBiz}</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopyLink()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? texts.copied : texts.share}</span>
              </button>
            </div>
          )}

          {/* Search Box */}
          <div className="mt-8 relative max-w-xl mx-auto">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={texts.searchPh}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-2xl text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 px-2 py-1 text-xs text-slate-400 hover:text-slate-700 bg-slate-100 rounded-md"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Categories Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 30 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => {
            const articleTitle = article.title[langKey] || article.title.ar;
            const articleSummary = article.summary[langKey] || article.summary.ar;
            const catLabel = article.categoryLabel[langKey] || article.categoryLabel.ar;

            return (
              <div
                key={article.id}
                onClick={() => setSelectedSlug(article.slug)}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-red-300/80 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Article Thumbnail */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={article.image}
                      alt={articleTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = './assets/doorhome/03-2.jpg';
                      }}
                    />
                    <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 px-3 py-1 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold rounded-full">
                      {catLabel}
                    </div>
                    <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 px-2.5 py-0.5 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold rounded-md">
                      #{index + 1}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readingTime}
                      </span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                      {articleTitle}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed">
                      {articleSummary}
                    </p>
                  </div>
                </div>

                {/* Footer Card */}
                <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-100 text-xs font-bold text-red-600">
                  <span>{texts.readMore}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="max-w-xl">
            <span className="text-red-400 text-xs font-bold uppercase tracking-wider">
              Doorhome Architectural Network
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-1">
              {isRtl
                ? 'هل تريد إرسال هذه المقالات والمعلومات الهندسية لأصدقائك أو تقييم خدماتنا؟'
                : 'Share these engineering guides with friends or leave your client review'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              {isRtl
                ? 'رأيك يهمنا لمواصلة تطوير معايير تصنيع وتركيب الألمنيوم والواجهات والدرج الزجاجي في العراق.'
                : 'Your feedback enables continuous engineering improvements across Iraqi architectural projects.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onNavigateToReviews && (
              <button
                type="button"
                onClick={onNavigateToReviews}
                className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Star className="w-4 h-4 fill-white" />
                <span>{texts.rateBiz}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleCopyLink()}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all cursor-pointer flex items-center gap-2"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? texts.copied : texts.share}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
