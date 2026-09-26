import React from 'react';
import CountUp from './CountUp';
import { ShieldCheck, Award, Factory, Leaf, Sparkles, CheckCircle2 } from 'lucide-react';

export const AlumilImpactSection: React.FC = () => {
  const metrics = [
    {
      num: 15000,
      suffix: '+ m²',
      label: 'Annual Fabrication Capacity',
      desc: 'Precision double-miter CNC cutting and robotic glazing assembly in Erbil.'
    },
    {
      num: 50,
      suffix: '+',
      label: 'Engineers & Master Fabricators',
      desc: 'European-trained technicians ensuring airtight German standard installation.'
    },
    {
      num: 100,
      suffix: '%',
      label: 'European Certified Alloys',
      desc: '6063-T6 architectural aluminium & Severe Climate Class S uPVC formulations.'
    },
    {
      num: 15,
      suffix: '+ Years',
      label: 'Guaranteed System Warranty',
      desc: 'Comprehensive structural integrity, weather-tightness, and hardware warranty.'
    }
  ];

  return (
    <section className="w-full py-16 sm:py-24 bg-[#0A192F] text-white relative overflow-hidden">
      {/* Subtle Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Block */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800/80 text-red-400 text-xs font-black uppercase tracking-widest border border-slate-700 mb-4">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sustainability, Innovation & Quality</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Engineering Sustainable Comfort for <span className="text-red-400">Extreme Climates</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            By combining high-performance thermal breaks with Low-E triple glazing, Doorhome fenestration systems reduce residential energy consumption by up to 35%, keeping Erbil homes cool in 50°C heat while lowering carbon footprints.
          </p>
        </div>

        {/* 4 Metric Counters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-14">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-800 hover:border-red-400/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-red-400 tracking-tight flex items-baseline">
                  <CountUp from={0} to={m.num} duration={2.5} separator="," />
                  <span className="text-xl sm:text-2xl ml-1 font-bold text-slate-200">
                    {m.suffix}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-white mt-3 group-hover:text-red-300 transition-colors">
                  {m.label}
                </h4>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {m.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Certifications Strip */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-white">
                International Compliance Standards
              </div>
              <div className="text-[11px] text-slate-400">
                Rigorous testing by accredited European laboratories
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-bold text-slate-300">
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
              CE Mark Compliant
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
              ISO 9001:2015 Quality
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
              ift Rosenheim Class S
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
              QUALICOAT Seaside Anodizing
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
