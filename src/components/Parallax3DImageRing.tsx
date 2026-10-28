import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ProductItem } from '../data/winhomeData';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../utils/localizedContent';
import { ChevronLeft, ChevronRight, Eye, Hand } from 'lucide-react';

interface Parallax3DImageRingProps {
  items: ProductItem[];
  onSelectProduct: (product: ProductItem) => void;
}

export const Parallax3DImageRing: React.FC<Parallax3DImageRingProps> = ({
  items,
  onSelectProduct
}) => {
  const { currentLanguage, t } = useLanguage();
  const langCode = currentLanguage.code;
  const isRtl = langCode === 'ar' || langCode === 'ckb';

  // Ring items: if less than 6 items, duplicate to form a full 6-slot 3D cylinder
  const ringItems = React.useMemo(() => {
    if (items.length === 0) return [];
    if (items.length >= 6) return items;
    let expanded: ProductItem[] = [];
    while (expanded.length < 6) {
      expanded = [...expanded, ...items];
    }
    return expanded.slice(0, 6);
  }, [items]);

  const totalSlots = ringItems.length;
  const angleStep = 360 / totalSlots;

  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Responsive radius based on viewport
  const [radius, setRadius] = useState(380);

  useEffect(() => {
    const updateRadius = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setRadius(260);
      } else if (w < 1024) {
        setRadius(340);
      } else {
        setRadius(420);
      }
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  // Continuous auto-rotation when not interacting
  useEffect(() => {
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const dt = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (!isDragging && !isHovered) {
        setRotation((prev) => {
          // If there is residual velocity from drag, apply friction
          if (Math.abs(velocityRef.current) > 0.05) {
            velocityRef.current *= 0.92;
            return prev + velocityRef.current;
          } else {
            // Gentle continuous idle rotation (approx 4.5 deg/sec)
            velocityRef.current = 0;
            return prev - 4.5 * dt;
          }
        });
      } else if (!isDragging && isHovered && Math.abs(velocityRef.current) > 0.05) {
        // Continue momentum even if hovered
        velocityRef.current *= 0.92;
        setRotation((prev) => prev + velocityRef.current);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDragging, isHovered]);

  // Track which card is facing the front
  useEffect(() => {
    const normalized = ((-rotation % 360) + 360) % 360;
    const closest = Math.round(normalized / angleStep) % totalSlots;
    setActiveIndex(closest);
  }, [rotation, angleStep, totalSlots]);

  // Pointer drag handlers (Mouse + Touch unified)
  const onPointerDown = (clientX: number) => {
    setIsDragging(true);
    dragStartX.current = clientX;
    dragStartRotation.current = rotation;
    lastXRef.current = clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const onPointerMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);
    const deltaX = clientX - lastXRef.current;
    
    // Sensitivity factor
    const speedFactor = 0.35;
    const newRot = dragStartRotation.current + (clientX - dragStartX.current) * speedFactor;
    setRotation(newRot);

    // Compute velocity for momentum
    velocityRef.current = (deltaX / dt) * 12;

    lastXRef.current = clientX;
    lastTimeRef.current = now;
  }, [isDragging]);

  const onPointerUp = () => {
    setIsDragging(false);
  };

  // Step rotation by 1 slot
  const rotateByStep = (direction: number) => {
    velocityRef.current = 0;
    setRotation((prev) => {
      const currentSlot = Math.round(prev / angleStep);
      return (currentSlot + direction) * angleStep;
    });
  };

  return (
    <div
      ref={containerRef}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative w-full py-10 sm:py-14 select-none overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
      onMouseDown={(e) => onPointerDown(e.clientX)}
      onMouseMove={(e) => onPointerMove(e.clientX)}
      onMouseUp={onPointerUp}
      onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
      onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
      onTouchEnd={onPointerUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Interactive 3D Perspective Stage */}
      <div
        className="relative mx-auto flex items-center justify-center h-[420px] sm:h-[500px] md:h-[540px] w-full"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%'
        }}
      >
        {/* Subtle 3D Ambient Floor Shadow & Glow */}
        <div
          className="absolute bottom-6 w-[500px] sm:w-[650px] h-20 rounded-full bg-red-600/10 blur-3xl pointer-events-none -translate-x-1/2 left-1/2"
          aria-hidden="true"
        />

        {/* The 3D Rotating Ring Cylinder */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotation}deg)`
          }}
        >
          {ringItems.map((prod, slotIdx) => {
            const slotAngle = slotIdx * angleStep;
            const localized = getLocalizedProduct(prod, langCode);

            // Parallax offset inside card: as card rotates around cylinder,
            // calculate relative angle to camera (0 deg = facing directly)
            const relativeAngle = ((rotation + slotAngle) % 360 + 540) % 360 - 180;
            // Parallax image shift: -30px to +30px based on viewing angle
            const parallaxShift = Math.max(-36, Math.min(36, relativeAngle * 0.45));
            const isFacingFront = Math.abs(relativeAngle) < 35;

            return (
              <div
                key={`${prod.id}-${slotIdx}`}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[300px] md:w-[340px] h-[340px] sm:h-[420px] md:h-[460px] rounded-3xl overflow-hidden transition-shadow duration-300 group"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${slotAngle}deg) translateZ(${radius}px)`,
                  boxShadow: isFacingFront
                    ? '0 30px 60px -15px rgba(0,0,0,0.45), 0 0 0 2px rgba(220,38,38,0.5)'
                    : '0 20px 40px -15px rgba(0,0,0,0.3)',
                  opacity: Math.abs(relativeAngle) > 95 ? 0.35 : 1,
                  filter: Math.abs(relativeAngle) > 95 ? 'blur(1px)' : 'none'
                }}
              >
                {/* Image Stage with Opposite Parallax Shift */}
                <div className="relative w-full h-full overflow-hidden bg-slate-950">
                  <img
                    src={prod.image || './assets/doorhome/03-2.jpg'}
                    alt={localized.name}
                    className="w-full h-full object-cover pointer-events-none scale-110"
                    style={{
                      transform: `translateX(${parallaxShift}px)`,
                      transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = './assets/doorhome/03-2.jpg';
                    }}
                  />

                  {/* Dramatic 3D Vignette & Lighting Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Card Bottom Info Overlay & Action */}
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10 flex flex-col justify-end space-y-2.5 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent">
                    <h3
                      dir="auto"
                      className="text-white text-sm sm:text-base font-black line-clamp-2 leading-snug drop-shadow-md"
                    >
                      {localized.name}
                    </h3>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(prod);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>
                          {langCode === 'ar'
                            ? 'فحص الموديل والتفاصيل'
                            : langCode === 'ckb'
                              ? 'بینینی وردەکاری مۆدێل'
                              : langCode === 'kmr'
                                ? 'Hûrgiliyên Modelê'
                                : langCode === 'tr'
                                  ? 'Modeli İncele'
                                  : 'Inspect Details'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls & Interactive Guidance Strip */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto px-4">
        {/* Drag Hint Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs">
          <Hand className="w-3.5 h-3.5 text-red-600 animate-pulse" />
          <span>
            {langCode === 'ar'
              ? 'اسحب أو مرر باللمس لتدوير حلقة العرض ثلاثية الأبعاد 3D'
              : langCode === 'ckb'
                ? 'ڕابکێشە بۆ سووڕاندنی بازنەی پیشاندانی سێ ڕەهەندی 3D'
                : langCode === 'kmr'
                  ? 'Bişopîne da ku zengila 3D bizivirînî'
                  : langCode === 'tr'
                    ? '3D döner halkayı çevirmek için sürükleyin'
                    : 'Drag or swipe to rotate the 3D parallax ring'}
          </span>
        </div>

        {/* Step Arrows & Quick Switcher */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => rotateByStep(1)}
            aria-label="Rotate ring backward"
            className="w-10 h-10 rounded-xl bg-white hover:bg-red-50 hover:border-red-200 border border-slate-200 text-slate-800 hover:text-red-600 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => rotateByStep(-1)}
            aria-label="Rotate ring forward"
            className="w-10 h-10 rounded-xl bg-white hover:bg-red-50 hover:border-red-200 border border-slate-200 text-slate-800 hover:text-red-600 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <ChevronRight className="w-5 h-5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
