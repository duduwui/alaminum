import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Custom Branded SVG Icons
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.585 1.961.934 2.8.934 3.182 0 5.768-2.587 5.768-5.766.001-3.187-2.575-5.821-5.772-5.821zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.073-2.12-.518-1.503-.622-2.464-2.138-2.538-2.238-.075-.099-.607-.807-.607-1.539s.385-1.09.522-1.236c.137-.145.3-.182.4-.182s.2.001.288.006c.094.004.22-.036.344.262.129.311.442 1.077.481 1.156.039.079.065.172.013.276-.052.104-.078.169-.156.259-.078.091-.164.203-.234.272-.078.077-.16.16-.069.316.091.156.404.667.868 1.079.596.53 1.098.694 1.254.772.156.078.247.069.339-.036.091-.104.391-.455.495-.611.104-.156.208-.13.349-.078.141.052.898.423 1.052.501.154.078.257.117.295.182.039.065.039.377-.105.782z" />
    <path d="M12.004 2c-5.518 0-9.995 4.477-9.995 9.996 0 1.763.459 3.489 1.332 5.006l-1.417 5.176 5.305-1.392c1.47.802 3.131 1.226 4.775 1.226 5.519 0 9.996-4.477 9.996-9.996 0-5.519-4.477-9.996-9.996-9.996zm0 18.232c-1.528 0-3.027-.41-4.336-1.186l-.311-.185-3.224.846.86-3.142-.203-.323c-.854-1.358-1.306-2.936-1.306-4.551 0-4.542 3.696-8.238 8.239-8.238 4.543 0 8.239 3.696 8.239 8.238 0 4.542-3.696 8.238-8.239 8.238z" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.02 3.32-1.45 3.48-3.26.06-1.31.03-2.63.03-3.95V0h-.22z" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

interface FloatingContactBadgeProps {
  onClick?: () => void;
}

export const FloatingContactBadge: React.FC<FloatingContactBadgeProps> = ({ onClick }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const whatsappUrl = 'https://wa.me/9647507388748';
  const instagramUrl = 'https://www.instagram.com/door.home3';
  const tiktokUrl = 'https://www.tiktok.com/@door.home0?_r=1&_t=ZS-98yzfkS48ov';
  const facebookUrl = 'https://facebook.com/profile.php?id=61590704835636';

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // 4 icons in a diamond: top, left, right, bottom-left (Facebook)
  // Layout: Instagram top, WhatsApp left, TikTok right, Facebook bottom-left area
  // Using a square pattern: top-center, left, right, and one more

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-8 z-40 w-14 h-14 flex items-center justify-center pointer-events-auto select-none"
    >
      {/* TOP-LEFT: Instagram */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setIsOpen(false)}
        style={{
          transform: isOpen ? 'translate(-38px, -92px) scale(1)' : 'translate(0px, 0px) scale(0.3)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'all 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transitionDelay: isOpen ? '0.04s' : '0s'
        }}
        className="absolute w-11 h-11 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center shadow-xl border-2 border-white hover:scale-110 active:scale-95 cursor-pointer z-40"
        title="Instagram (@door.home3)"
        aria-label="Instagram"
      >
        <InstagramIcon className="w-5 h-5 fill-white" />
      </a>

      {/* TOP-RIGHT: TikTok */}
      <a
        href={tiktokUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setIsOpen(false)}
        style={{
          transform: isOpen ? 'translate(38px, -92px) scale(1)' : 'translate(0px, 0px) scale(0.3)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'all 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transitionDelay: isOpen ? '0.04s' : '0s'
        }}
        className="absolute w-11 h-11 rounded-full bg-black hover:bg-neutral-900 text-white flex items-center justify-center shadow-xl border-2 border-white hover:scale-110 active:scale-95 cursor-pointer z-40"
        title="TikTok (@door.home0)"
        aria-label="TikTok"
      >
        <TikTokIcon className="w-5 h-5 fill-white" />
      </a>

      {/* BOTTOM-LEFT: WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setIsOpen(false)}
        style={{
          transform: isOpen ? 'translate(-38px, -44px) scale(1)' : 'translate(0px, 0px) scale(0.3)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transitionDelay: isOpen ? '0.08s' : '0s'
        }}
        className="absolute w-11 h-11 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-xl border-2 border-white hover:scale-110 active:scale-95 cursor-pointer z-40"
        title="WhatsApp (+964 750 738 8748)"
        aria-label="WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7 fill-white" />
      </a>

      {/* BOTTOM-RIGHT: Facebook */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setIsOpen(false)}
        style={{
          transform: isOpen ? 'translate(38px, -44px) scale(1)' : 'translate(0px, 0px) scale(0.3)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transitionDelay: isOpen ? '0.08s' : '0s'
        }}
        className="absolute w-11 h-11 rounded-full bg-[#1877F2] hover:bg-[#1464d8] text-white flex items-center justify-center shadow-xl border-2 border-white hover:scale-110 active:scale-95 cursor-pointer z-40"
        title="Facebook (Doorhome Company)"
        aria-label="Facebook"
      >
        <FacebookIcon className="w-5 h-5 fill-white" />
      </a>

      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('ui_contact_social')}
        className={`relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-white z-50 ${
          isOpen
            ? 'bg-slate-900 text-white rotate-90 shadow-slate-900/40'
            : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/40'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 stroke-[2.5]" />
        ) : (
          <MessageCircle className="w-6 h-6 stroke-[2.2]" />
        )}
      </button>
    </div>
  );
};

export default FloatingContactBadge;
