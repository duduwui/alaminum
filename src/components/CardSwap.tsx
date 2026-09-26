import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  ReactNode,
  HTMLAttributes
} from 'react';
import gsap from 'gsap';
import './CardSwap.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  customClass?: string;
  children?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

interface Slot {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  zIndex: number;
  rotation: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  scale: Math.max(0.78, 1 - i * 0.038),
  opacity: i === 0 ? 1 : Math.max(0.65, 1 - i * 0.09),
  zIndex: total - i,
  rotation: -i * 1.5
});

const placeNow = (el: HTMLElement | null, slot: Slot) => {
  if (!el) return;
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    scale: slot.scale,
    opacity: slot.opacity,
    rotation: slot.rotation,
    xPercent: -50,
    yPercent: -50,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });
};

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: ReactNode;
}

const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 32,
  verticalDistance = 24,
  delay = 4000,
  pauseOnHover = true,
  onCardClick,
  children
}) => {
  const [responsiveWidth, setResponsiveWidth] = React.useState<number | string>(width);

  useEffect(() => {
    const handleResize = () => {
      if (typeof width === 'number') {
        const maxWidth = Math.min(width, window.innerWidth - 36);
        setResponsiveWidth(maxWidth);
      } else {
        setResponsiveWidth(width);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width]);

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));
  const isAnimatingRef = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | undefined>(undefined);
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total)));

    const swap = () => {
      if (order.current.length < 2 || isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      const [front, ...rest] = order.current;
      const elFront = refs[front]?.current;
      if (!elFront) {
        isAnimatingRef.current = false;
        return;
      }

      const totalSlots = refs.length;
      const currentSlot = makeSlot(0, cardDistance, verticalDistance, totalSlots);
      const backSlot = makeSlot(totalSlots - 1, cardDistance, verticalDistance, totalSlots);

      const tl = gsap.timeline({
        onComplete: () => {
          order.current = [...rest, front];
          isAnimatingRef.current = false;
        }
      });
      tlRef.current = tl;

      // 1. Smoothly glide front card slightly out and to the right
      tl.to(elFront, {
        x: currentSlot.x + 130,
        y: currentSlot.y - 18,
        rotation: 4,
        scale: 1.02,
        opacity: 0.96,
        duration: 0.45,
        ease: 'power2.out'
      });

      // 2. Concurrently step all underlying cards forward smoothly
      tl.addLabel('stepForward', '-=0.32');
      rest.forEach((idx, i) => {
        const el = refs[idx]?.current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, totalSlots);
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            scale: slot.scale,
            opacity: slot.opacity,
            rotation: slot.rotation,
            zIndex: slot.zIndex,
            duration: 0.48,
            ease: 'power2.out'
          },
          'stepForward'
        );
      });

      // 3. Drop front card behind and smoothly tuck it into rear slot
      tl.addLabel('tuckBack', '-=0.18');
      tl.set(elFront, { zIndex: backSlot.zIndex }, 'tuckBack');
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          scale: backSlot.scale,
          opacity: backSlot.opacity,
          rotation: backSlot.rotation,
          duration: 0.48,
          ease: 'power2.inOut'
        },
        'tuckBack'
      );
    };

    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current;
      if (!node) return;

      const pause = () => {
        clearInterval(intervalRef.current);
      };

      const resume = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(swap, delay);
      };

      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      return () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        clearInterval(intervalRef.current);
        tlRef.current?.kill();
      };
    }

    return () => {
      clearInterval(intervalRef.current);
      tlRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover]);

  const rendered = childArr.map((child, i) => {
    if (!isValidElement(child)) return child;
    const element = child as React.ReactElement<any>;
    return cloneElement(element, {
      key: i,
      ref: refs[i],
      style: { width: responsiveWidth, height, ...(element.props?.style ?? {}) },
      onClick: (e: React.MouseEvent) => {
        element.props?.onClick?.(e);
        onCardClick?.(i);
      }
    } as any);
  });

  return (
    <div ref={container} className="card-swap-container" style={{ width: responsiveWidth, height }}>
      {rendered}
    </div>
  );
};

export default CardSwap;
