import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BoomerangVideoBg } from './BoomerangVideoBg';

export const BoomerangHeroSection: React.FC = () => {
  return (
    <section className="relative flex flex-col items-center overflow-hidden h-screen w-full bg-white">
      {/* Hero Video Background with Boomerang ping-pong canvas playback */}
      <BoomerangVideoBg />

      {/* Hero Content Block (centered) */}
      <div className="relative z-10 pt-24 sm:pt-26 md:pt-32 px-4 sm:px-6 text-center flex flex-col items-center max-w-4xl mx-auto">
        {/* H1 Serif Mackinac */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tighter text-[#191919] font-normal">
          Build lasting <br />
          relationships.
        </h1>

        {/* Subcopy */}
        <p className="max-w-sm sm:max-w-md mt-5 sm:mt-6 md:mt-8 text-sm md:text-base text-[#191919]/70 leading-relaxed font-sans">
          Conversational AI platform for modern financial institutions — agents that handle the full borrower lifecycle across email, SMS, and voice.
        </p>

        {/* Book A Demo Button */}
        <button className="mt-6 sm:mt-8 md:mt-10 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#191919] text-white text-sm sm:text-base font-medium rounded-lg hover:bg-[#191919]/90 transition-colors duration-200 cursor-pointer shadow-md">
          Book A Demo
        </button>
      </div>

      {/* Bottom Info Panel (sits flush on bottom of viewport) */}
      <div className="relative z-10 mt-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 border-b-0 pt-8 sm:pt-12 md:pt-16 px-5 sm:px-8 md:px-12 pb-0 shadow-sm">
          {/* Row 1 — 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-end">
            {/* Left Column */}
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#191919]/50 font-medium block">
                WHAT DO WE DO?
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-serif font-normal leading-tight tracking-tight text-[#191919]">
                Conversations that <br className="hidden sm:block" />
                build momentum
              </h2>
            </div>

            {/* Right Column */}
            <div>
              <p className="text-sm md:text-[15px] text-[#191919]/70 leading-relaxed">
                Conversational AI built for regulated financial institutions. Agents that hold a real conversation, plug into the systems you run, and show their work.
              </p>
            </div>
          </div>

          {/* Hairline Divider */}
          <div className="mt-6 sm:mt-8 md:mt-10 h-px bg-gray-200 w-full" />

          {/* Row 2 — 3 Interactive Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 py-4 sm:py-6">
            {/* Item 01 */}
            <div className="group bg-[#F4F3F3] hover:bg-[#eaeaea] transition-all duration-200 cursor-pointer px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between rounded-sm">
              <div className="flex items-center text-sm">
                <span className="text-[#191919]/40">01</span>
                <span className="mx-2 text-[#191919]/30">/</span>
                <span className="font-medium text-[#191919]">Conversational</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
            </div>

            {/* Item 02 */}
            <div className="group bg-[#F4F3F3] hover:bg-[#eaeaea] transition-all duration-200 cursor-pointer px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between rounded-sm">
              <div className="flex items-center text-sm">
                <span className="text-[#191919]/40">02</span>
                <span className="mx-2 text-[#191919]/30">/</span>
                <span className="font-medium text-[#191919]">Connected</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
            </div>

            {/* Item 03 */}
            <div className="group bg-[#F4F3F3] hover:bg-[#eaeaea] transition-all duration-200 cursor-pointer px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between rounded-sm">
              <div className="flex items-center text-sm">
                <span className="text-[#191919]/40">03</span>
                <span className="mx-2 text-[#191919]/30">/</span>
                <span className="font-medium text-[#191919]">Compliant</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
