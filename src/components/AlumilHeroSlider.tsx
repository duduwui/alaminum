import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface AlumilHeroSliderProps {
  onPlanProject: () => void;
  onExploreProducts: () => void;
}

interface SlideItem {
  id: string;
  category: string;
  title: string;
  description: string;
  btnText: string;
  image: string;
  fallbackImage: string;
  thumbImage: string;
  thumbTitle: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 'slide-1',
    category: 'ARCHITECTURAL INNOVATION',
    title: 'Minimalist Panorama & German Engineering',
    description:
      'Lorenzo 70LS & Alumil Panorama sliding systems engineered for Iraqi climate extremes up to 50°C. Ultra-slim sightlines with heavy-load thermal sliding.',
    btnText: 'Explore System',
    image: './assets/showcase/showcase_lorenzo70ls_1789926091155.jpg',
    fallbackImage: './assets/doorhome/03-2.jpg',
    thumbImage: './assets/doorhome/03-2.jpg',
    thumbTitle: 'Lorenzo 70LS Minimal'
  },
  {
    id: 'slide-2',
    category: 'SUSTAINABILITY & PASSIVHAUS',
    title: 'Legend 80: Achieving Thermal & Acoustic Comfort',
    description:
      'Class-leading 80mm profile depth with 6 insulation chambers and triple continuous EPDM gaskets. Eliminates ambient city noise by up to 45 dB.',
    btnText: 'Discover uPVC Series',
    image: './assets/showcase/showcase_legend80_1789926007847.jpg',
    fallbackImage: './assets/doorhome/4-2.jpg',
    thumbImage: './assets/doorhome/4-2.jpg',
    thumbTitle: 'Legend 80 Acoustic'
  },
  {
    id: 'slide-3',
    category: 'STRUCTURAL FACADES',
    title: 'Commercial 50F High-Span Curtain Walls',
    description:
      'Engineered mullion-transom systems for expansive commercial headquarters and luxury villa living rooms. Class C5 wind resistance and Class 9A watertightness.',
    btnText: 'View Facade Specs',
    image: './assets/showcase/showcase_curtain50f_1789926115841.jpg',
    fallbackImage: './assets/doorhome/3-2.jpg',
    thumbImage: './assets/doorhome/3-2.jpg',
    thumbTitle: 'Facade 50F Tower'
  },
  {
    id: 'slide-4',
    category: 'BIOCLIMATIC LIVING',
    title: 'Motorized Bioclimatic Pergolas & Louvers',
    description:
      'Automated rotating louvers (0° to 135°) with hidden rainwater drainage, perimeter LED lighting, and smart weather sensors for Middle Eastern patios.',
    btnText: 'Outdoor Solutions',
    image: './assets/doorhome/signature-bg.jpg',
    fallbackImage: './assets/doorhome/hero-bg.png',
    thumbImage: './assets/doorhome/signature-bg.jpg',
    thumbTitle: 'Bioclimatic Pergolas'
  }
];

const SLIDE_DURATION = 6000;

export const AlumilHeroSlider: React.FC<AlumilHeroSliderProps> = ({
  onPlanProject,
  onExploreProducts
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (isPaused) return;

    startTimeRef.current = Date.now() - (progress / 100) * SLIDE_DURATION;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const nextProgress = (elapsed / SLIDE_DURATION) * 100;

      if (nextProgress >= 100) {
        setProgress(0);
        setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
        startTimeRef.current = Date.now();
      } else {
        setProgress(nextProgress);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    goToSlide((currentIndex - 1 + SLIDES.length) % SLIDES.length);
  };

  const slide = SLIDES[currentIndex];

  // SVG Circular countdown geometry
  const radius = 17;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <section
      id="home"
      className="relative w-full min-h-[580px] lg:min-h-[680px] bg-slate-950 text-white overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Slide Images */}
      {SLIDES.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = s.fallbackImage;
            }}
          />
          {/* Alumil Scrim Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>
      ))}

      {/* 2. Slide Content Foreground */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 sm:pt-24 pb-36">
        <div className="max-w-2xl space-y-4">
          <div className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-red-400">
            {slide.category}
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
            {slide.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
            {slide.description}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreProducts}
              className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded transition-colors shadow-lg shadow-red-600/30 cursor-pointer"
            >
              {slide.btnText}
            </button>
            <button
              onClick={onPlanProject}
              className="px-6 py-3.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs uppercase tracking-wider rounded backdrop-blur-md border border-white/30 transition-colors cursor-pointer"
            >
              Plan Your Project
            </button>
          </div>
        </div>
      </div>

      {/* 3. Alumil Paradise Carousel Controls (Timer, Arrows & Thumbnail Indicators) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/60 backdrop-blur-md border-t border-white/10 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Circular Countdown Timer + Nav Arrows */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="w-10 h-10 -rotate-90 transform">
                <circle
                  cx="20"
                  cy="20"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="2.5"
                  fill="transparent"
                />
                <circle
                  cx="20"
                  cy="20"
                  r={radius}
                  stroke="#2563EB"
                  strokeWidth="2.5"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[11px] font-black text-red-400">
                0{currentIndex + 1}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={prevSlide}
                className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10"
                title="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10"
                title="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Slide Thumbnail Tabs (Alumil style) */}
          <div className="hidden sm:flex items-center gap-3 overflow-x-auto">
            {SLIDES.map((s, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => goToSlide(idx)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white/20 border border-red-500'
                      : 'hover:bg-white/10 border border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={s.thumbImage}
                    alt={s.thumbTitle}
                    className="w-10 h-10 rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = './assets/doorhome/10.png';
                    }}
                  />
                  <div>
                    <h5 className="text-xs font-bold text-white whitespace-nowrap">
                      {s.thumbTitle}
                    </h5>
                    <span className="text-[10px] text-slate-300">Slide 0{idx + 1}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
