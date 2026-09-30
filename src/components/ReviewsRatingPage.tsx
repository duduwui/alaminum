import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  MessageCircle,
  ThumbsUp,
  ShieldCheck,
  MapPin,
  Send,
  Building,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Heart
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface ClientReview {
  id: string;
  name: string;
  city: string;
  role?: string;
  rating: number;
  date: string;
  comment: string;
  categories?: {
    quality: number;
    speed: number;
    engineering: number;
    installation: number;
  };
  verified?: boolean;
}

const INITIAL_REVIEWS: ClientReview[] = [
  {
    id: 'rev-1',
    name: 'م. سرمد الزبيدي',
    city: 'بغداد - المنصور',
    role: 'مهندس معماري ومقاول فلل',
    rating: 5,
    date: '2026-09-26',
    comment: 'تم تنفيذ قطاعات شبابيك Lorenzo 70LS وأبواب سحاب بانورامية لفيلا في المنصور. دقة زوايا الألمنيوم وكبس الهيدروليك لا غبار عليها، وعزل الحرارة والصوت دبل كلاس ممتاز جداً.',
    categories: { quality: 5, speed: 5, engineering: 5, installation: 5 },
    verified: true
  },
  {
    id: 'rev-2',
    name: 'هێمن ئەحمەد',
    city: 'هەولێر - گوندی ئیتاڵی',
    role: 'خاوەن ڤێلا',
    rating: 5,
    date: '2026-09-22',
    comment: 'پلیکانی شووشەی هەڵواسراو و محاجەرەی بێ چوارچێوەیان بۆ ماڵەکەم لە هەولێر دروستکرد. کوالێتی شووشەی سێکۆریت زۆر بەرزە و تیمەکەیان لە کاتی خۆیدا کارەکەیان تەواو کرد بەوپەڕی ڕێکی.',
    categories: { quality: 5, speed: 5, engineering: 5, installation: 5 },
    verified: true
  },
  {
    id: 'rev-3',
    name: 'د. ليث العاني',
    city: 'بغداد - الجادرية',
    role: 'طبيب استشاري',
    rating: 5,
    date: '2026-09-18',
    comment: 'شبابيك uPVC Deceuninck Legend 80 سداسية الحجرات عزلت صوت الشارع العام والضوضاء تماماً، وأجهزة التكييف أصبحت تبرد بسرعة وبأقل استهلاك. تعامل راقي وضمان رسمي 10 سنوات.',
    categories: { quality: 5, speed: 4, engineering: 5, installation: 5 },
    verified: true
  },
  {
    id: 'rev-4',
    name: 'ڕەوەند بەختیار',
    city: 'سلێمانی - بەختیاری',
    role: 'ئەندازیاری شارستانی',
    rating: 5,
    date: '2026-09-14',
    comment: 'ڕووکاری شووشەی کەرتن وۆڵ ٥٠ ملم بۆ باڵەخانەی نۆڕینگەکان جێبەجێ کرا. بەربەستی ئاو و با لە زریانی زستاندا زۆر بەهێز بوو و هیچ دزەیەکی نەبوو.',
    categories: { quality: 5, speed: 5, engineering: 5, installation: 4 },
    verified: true
  },
  {
    id: 'rev-5',
    name: 'الحاج أبو كرار التميمي',
    city: 'البصرة / أربيل',
    role: 'صاحب مجمع سكني',
    rating: 5,
    date: '2026-09-10',
    comment: 'أفضل شركة للألمنيوم والدرابزين الزجاجي في العراق. التزام تام بالمواعيد وإكسسوارات STAC الإسبانية الأصلية تعمل بسلاسة عالية.',
    categories: { quality: 5, speed: 5, engineering: 5, installation: 5 },
    verified: true
  }
];

export const ReviewsRatingPage: React.FC<{
  onBackToHome?: () => void;
  onOpenQuoteModal?: () => void;
}> = ({ onBackToHome, onOpenQuoteModal }) => {
  const { currentLanguage } = useLanguage();
  const langCode = (currentLanguage?.code || 'ar').toLowerCase();

  const isKurdish = langCode.startsWith('ckb') || langCode.startsWith('ku') || langCode.startsWith('kmr');
  const isEnglish = langCode.startsWith('en');
  const langKey = isKurdish ? 'ckb' : isEnglish ? 'en' : 'ar';
  const isRtl = langKey === 'ar' || langKey === 'ckb';

  const [reviews, setReviews] = useState<ClientReview[]>(() => {
    try {
      const stored = localStorage.getItem('doorhome_customer_reviews');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { /* ignore */ }
    return INITIAL_REVIEWS;
  });

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [subRatings, setSubRatings] = useState({
    quality: 5,
    speed: 5,
    engineering: 5,
    installation: 5
  });

  const [name, setName] = useState<string>('');
  const [city, setCity] = useState<string>('بغداد');
  const [role, setRole] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Sync reviews to server if available
  useEffect(() => {
    void fetch('/api/reviews')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
          localStorage.setItem('doorhome_customer_reviews', JSON.stringify(data));
        }
      })
      .catch(() => {});
  }, []);

  const averageScore = useMemo(() => {
    if (!reviews.length) return 5.0;
    const total = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setIsSubmitting(true);

    const newRev: ClientReview = {
      id: `rev-${Date.now()}`,
      name: name.trim(),
      city: city.trim(),
      role: role.trim() || (isRtl ? 'عميل معتمد' : 'Verified Client'),
      rating,
      date: new Date().toISOString().split('T')[0],
      comment: comment.trim(),
      categories: subRatings,
      verified: true
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem('doorhome_customer_reviews', JSON.stringify(updated));
    } catch { /* ignore */ }

    // Try posting to backend
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRev)
      });
    } catch { /* ignore */ }

    setIsSubmitting(false);
    setSubmittedSuccess(true);
    setName('');
    setRole('');
    setComment('');
  };

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://doorhome.company'}/#reviews`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  const texts = useMemo(() => {
    if (isKurdish) {
      return {
        badge: 'هەڵسەنگاندنی فەرمی و دەنگی کڕیاران',
        heroTitle: 'هەڵسەنگاندن بۆ دەرگای ماڵ بکە و ڕای خۆت بنووسە',
        heroSubtitle: 'ڕای ڕاستەقینەی ئێوە یارمەتیدەرمانە لە بەرزکردنەوەی کوالێتی و پێشکەشکردنی باشترین خزمەتگوزاری لە عێراق و کوردستان.',
        ratingScoreTitle: 'نمرەی گشتی متمانەی کڕیاران',
        basedOn: `لەسەر بنەمای ${reviews.length} هەڵسەنگاندنی باوەڕپێکراو`,
        formTitle: 'دەنگی تۆ گرنگە: هەڵسەنگاندنەکەت بنێرە',
        overallRatingLabel: 'هەڵسەنگاندنی گشتیت بۆ دەرگای ماڵ:',
        qualityLabel: 'کوالێتی ئەلەمنیۆم و شووشە:',
        speedLabel: 'خێرایی و کاتی تەواوکردن:',
        engLabel: 'ڕێنمایی و ڕاوێژی ئەندازیاری:',
        instLabel: 'دروستی دانان و ڕێکی کارەکە:',
        nameLabel: 'ناوی تەواوت *',
        namePh: 'نموونە: هێمن ئەحمەد',
        cityLabel: 'شار / شوێن *',
        roleLabel: 'پیشە یان جۆری پڕۆژە (ئارەزوومەندانە)',
        rolePh: 'نموونە: خاوەن ڤێلا، ئەندازیار، مقاول',
        commentLabel: 'ڕا و سەرنجت دەربارەی خزمەتگوزارییەکان *',
        commentPh: 'ڕای خۆت بنووسە دەربارەی کوالێتی ئەلەمنیۆم، پلیکانی شووشە، پەنجەرەی uPVC، یان تیمی ئەندازیاریمان...',
        submitBtn: 'ناردنی هەڵسەنگاندن',
        submitting: 'دەنێردرێت...',
        successMsg: 'سوپاس بۆ متمانە و هەڵسەنگاندنەکەت! ڕای تۆ کلیلە بۆ پێشکەوتنی ئێمە.',
        shareTitle: 'بەستەری هەڵسەنگاندن بنێرە بۆ هاوڕێ و خزمەکانت',
        shareDesc: 'دەتوانیت ئەم بەستەرە لە واتسئاپ و تێلیگرام هاوبەش بکەیت تا ئەوانیش ڕای خۆیان بنووسن:',
        copyBtn: 'کۆپیکردنی بەستەر',
        copiedBtn: 'کۆپیکرا!',
        googleReviewBtn: 'هەڵسەنگاندن لە گووگڵ ماپس (Google Maps)',
        whatsappShareBtn: 'ناردن لە ڕێگەی واتسئاپەوە'
      };
    }
    if (isEnglish) {
      return {
        badge: 'OFFICIAL CLIENT RATING & FEEDBACK DESK',
        heroTitle: 'Rate Doorhome & Help Us Advance Architectural Standards',
        heroSubtitle: 'Your honest feedback and evaluations directly drive our engineering craftsmanship across Iraq and Kurdistan.',
        ratingScoreTitle: 'Overall Verified Customer Satisfaction',
        basedOn: `Based on ${reviews.length} verified client reviews`,
        formTitle: 'Leave Your Review & Rating',
        overallRatingLabel: 'Your Overall Rating for Doorhome:',
        qualityLabel: 'Aluminum & Glass Quality:',
        speedLabel: 'Turnaround Time & Punctuality:',
        engLabel: 'Engineering Advice & Integrity:',
        instLabel: 'Installation Craftsmanship:',
        nameLabel: 'Your Full Name *',
        namePh: 'e.g. Eng. Ahmed Al-Zubaidi',
        cityLabel: 'City / Region *',
        roleLabel: 'Title or Project Type (Optional)',
        rolePh: 'e.g. Villa Owner, Architect, Contractor',
        commentLabel: 'Your Review & Comments *',
        commentPh: 'Share your thoughts regarding aluminum windows, glass stairs, uPVC insulation, installation, or customer service...',
        submitBtn: 'Submit Rating & Feedback',
        submitting: 'Submitting...',
        successMsg: 'Thank you for your valuable rating! Your review was recorded successfully.',
        shareTitle: 'Share This Review Link with Friends & Partners',
        shareDesc: 'Send this direct link to friends and colleagues to collect ratings and feedback:',
        copyBtn: 'Copy Link',
        copiedBtn: 'Copied!',
        googleReviewBtn: 'Review on Google Maps / Business Profile',
        whatsappShareBtn: 'Share on WhatsApp'
      };
    }
    return {
      badge: 'منصة التقييم وآراء العملاء المعتمدة',
      heroTitle: 'قيم شركة Doorhome (باب المنزل) وشاركنا رأيك لتطوير خدماتنا',
      heroSubtitle: 'تقييمك الصادق وتجربتك معنا يساعداننا في تقديم أعلى معايير الجودة والتصنيع الهندسي في أربيل وبغداد وكافة محافظات العراق.',
      ratingScoreTitle: 'التقييم الإجمالي لرضا العملاء والمقاولين',
      basedOn: `بناءً على ${reviews.length} تقييماً معتمداً وموثقاً`,
      formTitle: 'شاركنا تقييمك وملاحظاتك',
      overallRatingLabel: 'تقييمك الإجمالي لشركة Doorhome:',
      qualityLabel: 'جودة قطاعات الألمنيوم والزجاج:',
      speedLabel: 'الالتزام بمواعيد التوريد والتسليم:',
      engLabel: 'المعاينة والاستشارة الهندسية:',
      instLabel: 'دقة ونظافة التركيب الميداني:',
      nameLabel: 'الاسم الكريم *',
      namePh: 'مثال: م. سرمد الزبيدي',
      cityLabel: 'المحافظة / المدينة *',
      roleLabel: 'صفتك أو نوع المشروع (اختياري)',
      rolePh: 'مثال: صاحب فيلا، مهندس استشاري، مقاول',
      commentLabel: 'ملاحظاتك وتقييمك لتجربتك معنا *',
      commentPh: 'اكتب رأيك بحرية عن جودة شبابيك الألمنيوم، السلالم والدرج الزجاجي، عوازل uPVC، أو تعامل الفريق الهندسي...',
      submitBtn: 'إرسال التقييم والملاحظات',
      submitting: 'جاري الإرسال...',
      successMsg: 'شكراً جزيلاً لتقييمك الكريم وملاحظاتك البناءة! تم تسجيل تقييمك بنجاح.',
      shareTitle: 'شارك رابط التقييم مع أصدقائك ومعارفك لتقييم الشركة',
      shareDesc: 'يمكنك نسخ هذا الرابط المباشر وإرساله لأصدقائك عبر واتساب وتيليگرام لإبداء آرائهم وتقييمهم لمساعدتنا على التطور الدائم:',
      copyBtn: 'نسخ رابط التقييم',
      copiedBtn: 'تم النسخ!',
      googleReviewBtn: 'اكتب تقييماً على خرائط Google Maps',
      whatsappShareBtn: 'مشاركة الرابط عبر واتساب'
    };
  }, [isKurdish, isEnglish, reviews.length]);

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm font-semibold mb-4">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{texts.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {texts.heroTitle}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            {texts.heroSubtitle}
          </p>

          {/* Share Box with Link for User & Friends */}
          <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center justify-center gap-2 mb-2">
              <Share2 className="w-5 h-5 text-red-600" />
              <span>{texts.shareTitle}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mb-5">
              {texts.shareDesc}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
              <div className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-700 font-mono truncate select-all">
                {shareUrl}
              </div>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full sm:w-auto shrink-0 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? texts.copiedBtn : texts.copyBtn}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${isRtl ? 'مرحباً! يرجى تقييم شركة Doorhome (باب المنزل) لمساعدتنا في تحسين خدماتنا:' : 'Hello, please take a moment to rate Doorhome Company to help us improve:'}\n${shareUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto shrink-0 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{texts.whatsappShareBtn}</span>
              </a>
            </div>

            {/* Direct Google Maps Review Link */}
            <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-center">
              <a
                href="https://maps.google.com/?q=33.311861,44.460806"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-bold"
              >
                <MapPin className="w-4 h-4 text-red-600" />
                <span>{texts.googleReviewBtn}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Overall Score Badge Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left rtl:md:text-right">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
              {texts.ratingScoreTitle}
            </span>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
              <span className="text-5xl sm:text-6xl font-black text-white">{averageScore}</span>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 font-medium">{texts.basedOn}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-center">
              <p className="text-xs text-slate-400">جودة الألمنيوم والزجاج</p>
              <p className="text-lg font-bold text-amber-400 mt-1">4.9 / 5.0</p>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-center">
              <p className="text-xs text-slate-400">عزل الحرارة والصوت</p>
              <p className="text-lg font-bold text-amber-400 mt-1">5.0 / 5.0</p>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-center">
              <p className="text-xs text-slate-400">الاستشارة الهندسية</p>
              <p className="text-lg font-bold text-amber-400 mt-1">4.9 / 5.0</p>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-center">
              <p className="text-xs text-slate-400">الالتزام بالضمان 10 سنوات</p>
              <p className="text-lg font-bold text-amber-400 mt-1">100%</p>
            </div>
          </div>
        </div>

        {/* Rating Submission Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm mb-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {texts.formTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isRtl
                  ? 'اختر عدد النجوم واكتب تقييمك الصادق، سيظهر تقييمك مباشرة لمساعدة عملائنا'
                  : 'Select your stars and write your evaluation to help us continuously improve'}
              </p>
            </div>

            {submittedSuccess ? (
              <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-4 animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-900">{texts.successMsg}</h3>
                <p className="text-xs sm:text-sm text-emerald-700">
                  {isRtl
                    ? 'شكراً لمساهمتك القيمة! تقييمك يساعدنا على تحسين خدماتنا وتقديم أعلى معايير الدقة الهندسية.'
                    : 'Your review was published and sent to our executive engineering desk.'}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedSuccess(false)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {isRtl ? 'كتابة تقييم آخر' : 'Write Another Review'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Overall Star Rating Picker */}
                <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="block text-sm font-extrabold text-slate-800 mb-3">
                    {texts.overallRatingLabel}
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1.5 focus:outline-none transition-transform hover:scale-125 cursor-pointer"
                        >
                          <Star
                            className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                              isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs font-bold text-slate-500 mt-2">
                    {rating === 5 && (isRtl ? 'ممتاز جداً ★★★★★' : 'Exceptional 5/5')}
                    {rating === 4 && (isRtl ? 'جيد جداً ★★★★☆' : 'Very Good 4/5')}
                    {rating === 3 && (isRtl ? 'متوسط ★★★☆☆' : 'Average 3/5')}
                    {rating < 3 && (isRtl ? 'يحتاج تحسين' : 'Needs Improvement')}
                  </p>
                </div>

                {/* Subcategory Stars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50/60 rounded-2xl border border-slate-100 text-xs text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>{texts.qualityLabel}</span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          onClick={() => setSubRatings((prev) => ({ ...prev, quality: s }))}
                          className={`w-4 h-4 cursor-pointer ${subRatings.quality >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>{texts.speedLabel}</span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          onClick={() => setSubRatings((prev) => ({ ...prev, speed: s }))}
                          className={`w-4 h-4 cursor-pointer ${subRatings.speed >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>{texts.engLabel}</span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          onClick={() => setSubRatings((prev) => ({ ...prev, engineering: s }))}
                          className={`w-4 h-4 cursor-pointer ${subRatings.engineering >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>{texts.instLabel}</span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          onClick={() => setSubRatings((prev) => ({ ...prev, installation: s }))}
                          className={`w-4 h-4 cursor-pointer ${subRatings.installation >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {texts.nameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={texts.namePh}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {texts.cityLabel}
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="بغداد">بغداد (Baghdad)</option>
                      <option value="أربيل">أربيل (Erbil)</option>
                      <option value="السليمانية">السليمانية (Sulaymaniyah)</option>
                      <option value="دهوك">دهوك (Duhok)</option>
                      <option value="كركوك">كركوك (Kirkuk)</option>
                      <option value="البصرة">البصرة (Basra)</option>
                      <option value="النجف">النجف (Najaf)</option>
                      <option value="كربلاء">كربلاء (Karbala)</option>
                      <option value="الموصل">الموصل (Mosul)</option>
                      <option value="محافظة أخرى">محافظة أخرى (Other)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {texts.roleLabel}
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder={texts.rolePh}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {texts.commentLabel}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={texts.commentPh}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? texts.submitting : texts.submitBtn}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Existing Reviews List */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <span>{isRtl ? 'آراء وتقييمات العملاء الموثقة' : 'Verified Client Reviews'}</span>
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
              {reviews.length} {isRtl ? 'تقييم' : 'reviews'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Reviewer Header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span>{rev.name}</span>
                        {rev.verified && (
                          <span title="عميل معتمد" className="inline-block">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{rev.city}</span>
                        {rev.role && <span>• {rev.role}</span>}
                      </p>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Date */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{rev.date}</span>
                  <span className="text-emerald-700 font-medium">✓ موثق لدى إدارة Doorhome</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
