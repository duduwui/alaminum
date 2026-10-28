import React, { useRef, useEffect, useState } from 'react';
import { ProductItem } from '../data/winhomeData';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../utils/localizedContent';

interface Parallax3DImageRingProps {
  items: ProductItem[];
  onSelectProduct: (product: ProductItem) => void;
}

export const Parallax3DImageRing: React.FC<Parallax3DImageRingProps> = ({
  items,
  onSelectProduct
}) => {
  const { currentLanguage } = useLanguage();
  const langCode = currentLanguage.code;
  const isRtl = langCode === 'ar' || langCode === 'ckb';

  // Ring items: duplicate to form a 6-slot 3D cylinder if fewer items exist
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

  // DOM Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Physics & Animation state stored in refs for 60-120fps hardware execution (zero React re-renders)
  const currentRotRef = useRef<number>(0);
  const targetRotRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);

  const startXRef = useRef<number>(0);
  const startRotRef = useRef<number>(0);
  const lastXRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const hasMovedRef = useRef<boolean>(false);

  // Responsive radius
  const [radius, setRadius] = useState<number>(380);

  useEffect(() => {
    const updateRadius = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setRadius(250);
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

  // 60-120fps direct hardware rendering loop
  useEffect(() => {
    let animId: number;
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const dt = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;

      if (isDraggingRef.current) {
        // While dragging: smoothly interpolate currentRot to targetRot
        currentRotRef.current += (targetRotRef.current - currentRotRef.current) * 0.35;
      } else {
        // While idle or floating:
        if (Math.abs(velocityRef.current) > 0.04) {
          // Momentum coasting with silky friction
          velocityRef.current *= 0.94;
          targetRotRef.current += velocityRef.current;
          currentRotRef.current += (targetRotRef.current - currentRotRef.current) * 0.25;
        } else {
          velocityRef.current = 0;
          if (!isHoveredRef.current) {
            // Gentle continuous idle rotation (smooth 6 deg/sec)
            targetRotRef.current -= 6.0 * dt;
            currentRotRef.current = targetRotRef.current;
          }
        }
      }

      // Update ring transform directly on the GPU
      if (ringRef.current) {
        ringRef.current.style.transform = `rotateY(${currentRotRef.current}deg)`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Pointer event listeners (unified mouse + touch)
  const handlePointerDown = (clientX: number) => {
    isDraggingRef.current = true;
    startXRef.current = clientX;
    startRotRef.current = currentRotRef.current;
    lastXRef.current = clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    hasMovedRef.current = false;
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const deltaX = clientX - startXRef.current;
    if (Math.abs(deltaX) > 4) {
      hasMovedRef.current = true;
    }

    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);
    const stepDelta = clientX - lastXRef.current;

    // Direct responsive sensitivity (inverted in RTL for natural finger feel)
    const factor = isRtl ? -0.38 : 0.38;
    targetRotRef.current = startRotRef.current + deltaX * factor;

    // Instantaneous velocity
    velocityRef.current = (stepDelta / dt) * 16 * factor;

    lastXRef.current = clientX;
    lastTimeRef.current = now;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleCardClick = (prod: ProductItem) => {
    // If the user was dragging/swiping, do not trigger click
    if (hasMovedRef.current) return;
    onSelectProduct(prod);
  };

  return (
    <div
      ref={containerRef}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative w-full py-8 sm:py-12 select-none overflow-hidden"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        isDraggingRef.current = false;
      }}
      onMouseDown={(e) => handlePointerDown(e.clientX)}
      onMouseMove={(e) => handlePointerMove(e.clientX)}
      onMouseUp={handlePointerUp}
      onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
      onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
      onTouchEnd={handlePointerUp}
      style={{ cursor: 'grab' }}
    >
      {/* 3D Perspective Viewport */}
      <div
        className="relative mx-auto flex items-center justify-center h-[380px] sm:h-[460px] md:h-[500px] w-full"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%'
        }}
      >
        {/* Soft Ambient Depth Shadow */}
        <div
          className="absolute bottom-4 w-[420px] sm:w-[580px] h-16 rounded-full bg-slate-900/10 blur-2xl pointer-events-none -translate-x-1/2 left-1/2"
          aria-hidden="true"
        />

        {/* 3D Rotating Ring Cylinder */}
        <div
          ref={ringRef}
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
        >
          {ringItems.map((prod, slotIdx) => {
            const slotAngle = slotIdx * angleStep;
            const localized = getLocalizedProduct(prod, langCode);

            return (
              <div
                key={`${prod.id}-${slotIdx}`}
                onClick={() => handleCardClick(prod)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[290px] md:w-[330px] h-[340px] sm:h-[410px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-200 cursor-pointer group hover:scale-[1.02]"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${slotAngle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'hidden',
                  willChange: 'transform'
                }}
              >
                {/* Image Stage */}
                <div className="relative w-full h-full overflow-hidden bg-slate-950">
                  <img
                    src={prod.image || './assets/doorhome/03-2.jpg'}
                    alt={localized.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = './assets/doorhome/03-2.jpg';
                    }}
                  />

                  {/* Clean Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent pointer-events-none" />

                  {/* Card Bottom Info Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-10 flex flex-col justify-end space-y-1.5 pointer-events-none">
                    <h3
                      dir="auto"
                      className="text-white text-sm sm:text-base font-black line-clamp-2 leading-snug drop-shadow-md group-hover:text-red-400 transition-colors"
                    >
                      {localized.name}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
