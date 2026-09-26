import React from 'react';
import { ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface AlumilWhyAluminiumProps {
  onLearnMore: () => void;
}

export const AlumilWhyAluminium: React.FC<AlumilWhyAluminiumProps> = ({ onLearnMore }) => {
  return (
    <section id="about" className="w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Text Block - Left */}
          <div className="space-y-4 text-[#3E4346]">
            <h4 className="text-xs font-black tracking-widest uppercase text-slate-400">
              Why Aluminium & uPVC
            </h4>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#3E4346] leading-tight">
              Material Superiority for Extreme Climates
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Are you still indecisive about the material for your new window and door frames? The answer is simple, and we explain why in detail.
            </p>

            <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Superior Polyamide Thermal-Break Insulation (Uw ≤ 0.95 W/m²K)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>45 dB Sound Insulation Barrier for Quiet Living</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Class 4 Air / Class 9A Water Storm Resistance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Multipoint RC2/RC3 European Locking Mechanisms</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onLearnMore}
                className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-2 shadow-md shadow-red-600/20 cursor-pointer"
              >
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Image Block - Right */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200">
            <img
              src="./assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg"
              alt="Aluminium Superiority"
              className="w-full h-[400px] object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = './assets/doorhome/03-2.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] font-black uppercase text-red-400 tracking-wider">
                Erbil CNC Precision Plant
              </span>
              <p className="text-xs font-semibold text-slate-100">
                Severe Climate Class S Certified Extrusions
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
