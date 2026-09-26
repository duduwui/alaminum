import React from 'react';
import { ArrowRight } from 'lucide-react';

interface AlumilAchievementsProps {
  onLearnMore?: () => void;
}

export const AlumilAchievements: React.FC<AlumilAchievementsProps> = ({ onLearnMore }) => {
  return (
    <section className="py-20 bg-[#3E4346] text-white relative overflow-hidden border-b border-slate-700">
      {/* Background World/Earth glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title in Gold/Blue */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-red-400 tracking-tight mb-12">
          Our Achievements for 2026
        </h2>

        {/* 3 Circular Metric Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {/* Circle 1 */}
          <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs flex flex-col items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-300 mb-4">Energy intensity</h3>
              <div className="w-32 h-32 rounded-full border-4 border-red-500 flex items-center justify-center mx-auto my-2">
                <span className="text-2xl sm:text-3xl font-black text-white">-17.50%</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              in MWh per million revenue reduction across facilities
            </p>
          </div>

          {/* Circle 2 */}
          <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs flex flex-col items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-300 mb-4">Recycled Aluminium & PVC</h3>
              <div className="w-32 h-32 rounded-full border-4 border-red-500 flex items-center justify-center mx-auto my-2">
                <span className="text-2xl sm:text-3xl font-black text-white">&gt;70%</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Surpassing environmental sustainability commitments in Kurdistan
            </p>
          </div>

          {/* Circle 3 */}
          <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs flex flex-col items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-300 mb-4">Training & CNC Hours</h3>
              <div className="w-32 h-32 rounded-full border-4 border-red-500 flex items-center justify-center mx-auto my-2">
                <span className="text-2xl sm:text-3xl font-black text-white">31,831</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Continuous master training for certified facade engineers
            </p>
          </div>
        </div>

        {/* Narrative Box */}
        <div className="p-8 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-3xl">
            <h4 className="text-base font-black text-white uppercase tracking-wider mb-2">
              Sustainable Development & Social Contribution
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We strive to create a better built environment for future generations, where homes remain energy-efficient, quiet, and thermally protected from extreme summer heat.
            </p>
          </div>

          <button
            onClick={onLearnMore}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded transition-colors shrink-0 cursor-pointer shadow-md shadow-red-600/30"
          >
            Learn more
          </button>
        </div>
      </div>
    </section>
  );
};
