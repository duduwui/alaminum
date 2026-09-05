import React from 'react';
import LogoLoop, { LogoItem } from './LogoLoop';
import { PARTNER_LOGOS } from '../data/winhomeData';
import { Award } from 'lucide-react';

export const PartnerLogos: React.FC = () => {
  const formattedLogos: LogoItem[] = PARTNER_LOGOS.map((item) => ({
    src: item.src,
    alt: item.alt,
    title: `${item.title} (${item.country})`,
    ariaLabel: item.title,
  }));

  return (
    <section className="py-14 sm:py-16 bg-[#1B4EF5] text-white overflow-hidden relative">
      {/* Background subtle glow accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center relative z-10">
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Authorized European Partners & System Houses
        </h3>
      </div>

      {/* LogoLoop Component - Floating Pristine White Pill Cards */}
      <div className="relative py-4 bg-transparent border-0">
        <LogoLoop
          logos={formattedLogos}
          speed={50}
          direction="left"
          logoHeight={64}
          gap={28}
          hoverSpeed={0}
          scaleOnHover={false}
          fadeOut={true}
          fadeOutColor="#1B4EF5"
          ariaLabel="Winhome Strategic European Partners"
          renderItem={(item: any) => (
            <div className="bg-white/95 hover:bg-white px-6 py-3 rounded-2xl shadow-lg shadow-blue-900/20 border border-white/40 flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer min-w-[140px] h-[60px]">
              <img
                src={item.src}
                alt={item.alt || item.title}
                title={item.title}
                className="max-h-9 max-w-[120px] w-auto object-contain pointer-events-none"
              />
            </div>
          )}
        />
      </div>
    </section>
  );
};

