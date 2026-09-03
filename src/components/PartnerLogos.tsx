import React from 'react';
import LogoLoop, { LogoItem } from './LogoLoop';
import { PARTNER_LOGOS } from '../data/winhomeData';

export const PartnerLogos: React.FC = () => {
  const formattedLogos: LogoItem[] = PARTNER_LOGOS.map((item) => ({
    src: item.src,
    alt: item.alt,
    title: `${item.title} (${item.country})`,
    ariaLabel: item.title,
  }));

  return (
    <section className="py-14 bg-white border-b border-slate-200 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2.5">
          <span>Global Manufacturing Standards</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Authorized European Partners & System Houses
        </h3>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mt-2 leading-relaxed">
          Certified regional distribution and technical fabrication of world-class Belgian, German, Italian, and Turkish fenestration systems.
        </p>
      </div>

      {/* LogoLoop Component with clean light background */}
      <div className="relative py-4 bg-slate-50 border-y border-slate-200">
        <LogoLoop
          logos={formattedLogos}
          speed={60}
          direction="left"
          logoHeight={46}
          gap={52}
          hoverSpeed={0}
          scaleOnHover={true}
          fadeOut={true}
          fadeOutColor="#F8FAFC"
          ariaLabel="Winhome Strategic European Partners"
        />
      </div>
    </section>
  );
};
