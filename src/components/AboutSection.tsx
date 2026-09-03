import React from 'react';
import { WINHOME_CONTACT, WINHOME_STATS } from '../data/winhomeData';
import { Check, ShieldCheck, MapPin } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Story & Credentials */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold uppercase tracking-wider">
              <span>Heritage & Industrial Excellence</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Building Iraq’s Most Resilient Window & Door Systems
            </h2>

            <p className="text-base text-slate-700 leading-relaxed">
              <strong className="text-slate-900 font-bold">Winhome Company</strong>, operating under <strong className="text-slate-900 font-bold">Nafza Almanzl Holding</strong>, has stood at the forefront of architectural fenestration across the Kurdistan Region and federal Iraq. We bridge world-leading European manufacturing precision with local fabrication mastery.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Extreme temperature swings in our region—from blistering summer heat waves exceeding 50°C to freezing winter lows—cause ordinary PVC and uninsulated aluminum to deform, leak drafts, and degrade within years. Winhome exclusively supplies profiles certified for <strong className="text-slate-900 font-semibold">Severe Climate Class S</strong>, utilizing European UV-stabilized formulations and certified multi-point hardware.
            </p>

            {/* Core Values / Pillar checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="p-1 rounded-full bg-sky-100 text-sky-700 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Direct European Sourcing</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">Certified distribution for Deceuninck, Winsa, Master & Lorenzoline.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="p-1 rounded-full bg-sky-100 text-sky-700 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Two Operational Branches</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">Dedicated client showroom in Erbil plus high-capacity industrial plant.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="p-1 rounded-full bg-sky-100 text-sky-700 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">CNC Precision Cutting</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">Computerized profile cutting, four-head welding, and robotic corner cleaning.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="p-1 rounded-full bg-sky-100 text-sky-700 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">10-Year Factory Warranty</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">Official written backing against colour yellowing, thermal deformation & leakage.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Imagery & Fast Stats */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <img
                src="/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg"
                alt="Winhome Erbil Fabrication Workshop & Showroom"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/winhome/photo_2023-07-03_15-49-24-760x485.jpg';
                }}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                  Fabrication Hub
                </span>
                <h4 className="text-base font-bold">
                  Winhome Automated CNC Plant, Erbil
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Daily capacity of 180+ custom engineered window & door frames
                </p>
              </div>
            </div>

            {/* Quick Numbers Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {WINHOME_STATS.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center"
                >
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-[11px] font-medium text-slate-600 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
