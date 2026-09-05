import React from 'react';
import { ArrowRight } from 'lucide-react';
import ShinyText from './ShinyText';
import MaskedHeading from './MaskedHeading';
import GlowButton from './GlowButton';

interface HeroSectionProps {
  onOpenQuoteModal?: () => void;
  onExploreProducts?: () => void;
}

const HERO_QUOTES = [
  "Modern architectural design.",
  "Smart fenestration solutions.",
  "Reliable European quality.",
  "Extreme 50°C climate protection.",
  "Precision Erbil CNC fabrication."
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenQuoteModal,
  onExploreProducts
}) => {
  const [quoteIdx, setQuoteIdx] = React.useState(0);

  const handleShineEnd = React.useCallback(() => {
    setQuoteIdx((prev) => (prev + 1) % HERO_QUOTES.length);
  }, []);

  return (
    <section id="home" className="relative w-full min-h-screen flex flex-col justify-start overflow-hidden bg-slate-50 pt-12 sm:pt-16 md:pt-20 pb-12">
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Responsive Background Images */}
      {/* Mobile Raw Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-bottom md:hidden opacity-95"
        style={{ backgroundImage: `url('/assets/winhome/hero-mobile-bg.jpg')` }}
      />
      {/* Desktop Raw Background Image */}
      <div
        className="absolute inset-0 z-0 hidden md:block bg-cover bg-right-bottom opacity-95"
        style={{ backgroundImage: `url('/assets/winhome/hero-desktop-bg.jpg')` }}
      />

      {/* Main Hero Content Container - Positioned higher up on mobile & laptops */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full mt-0 sm:mt-2 md:mt-4 py-0 sm:py-2">
        <div className="max-w-2xl text-left space-y-4 sm:space-y-6">
          {/* Subtitle Badge (Mobile Only) */}
          <div className="inline-block md:hidden">
            <span className="text-blue-600 font-bold text-xs tracking-widest uppercase bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-blue-200/60 shadow-xs">
              WINHOME
            </span>
          </div>

          {/* Main Professional Masked Heading */}
          <MaskedHeading
            text="European Fenestration & Architectural Systems"
            tag="h1"
            src="/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg"
            fillScale={1.35}
            parallax={35}
            brightness={0.75}
            saturation={1.2}
            reveal="rise"
            trigger="view"
            align="left"
            weight={900}
            textScale={0.125}
            className="text-slate-900 font-black tracking-tight leading-[1.05]"
          />

          {/* Subtitle Paragraph with Swapping Short ShinyText Quotes */}
          <p className="text-lg sm:text-2xl lg:text-3xl max-w-xl font-extrabold leading-snug text-slate-800 min-h-[3rem]">
            <ShinyText
              key={quoteIdx}
              text={HERO_QUOTES[quoteIdx]}
              color="#334155"
              shineColor="#ffffff"
              speed={2.2}
              delay={0.1}
              spread={120}
              mode="word"
              onEnd={handleShineEnd}
            />
          </p>

          {/* Desktop Only Primary Action Button (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-4 pt-2">
            <GlowButton
              onClick={onExploreProducts || onOpenQuoteModal}
              variant="secondary"
              isDarkTheme={false}
              size="lg"
            >
              <span className="text-slate-900 font-black">Explore Our Services</span>
              <ArrowRight className="w-5 h-5 shrink-0 text-slate-900" />
            </GlowButton>
          </div>
        </div>
      </div>
    </section>
  );
};
