import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useAnimationFrame, useTransform, MotionValue } from 'motion/react';
import './ShinyText.css';

export interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
  yoyo?: boolean;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
  delay?: number;
  mode?: 'full' | 'word';
  onEnd?: () => void;
}

const WordItem: React.FC<{
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  color: string;
  shineColor: string;
  spread: number;
}> = ({ word, index, total, progress, color, shineColor, spread }) => {
  const step = 100 / total;
  const start = index * step;
  const end = (index + 1) * step;

  const bgPos = useTransform(progress, (p: number) => {
    if (p < start) return '150% center';
    if (p > end) return '-50% center';
    const localP = ((p - start) / (end - start)) * 100;
    return `${150 - localP * 2}% center`;
  });

  const style: React.CSSProperties = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 30%, ${shineColor} 50%, ${color} 70%, ${color} 100%)`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block'
  };

  return (
    <motion.span style={{ ...style, backgroundPosition: bgPos }} className="mr-[0.3em] inline-block">
      {word}
    </motion.span>
  );
};

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 2.5,
  className = '',
  color = '#475569',
  shineColor = '#ffffff',
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = 'left',
  delay = 0.2,
  mode = 'word',
  onEnd
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const directionRef = useRef(direction === 'left' ? 1 : -1);
  const hasTriggeredEndRef = useRef(false);

  const animationDuration = speed * 1000;
  const delayDuration = delay * 1000;

  useAnimationFrame((time) => {
    if (disabled || isPaused) {
      lastTimeRef.current = null;
      return;
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    elapsedRef.current += deltaTime;

    if (yoyo) {
      const cycleDuration = animationDuration + delayDuration;
      const fullCycle = cycleDuration * 2;
      const cycleTime = elapsedRef.current % fullCycle;

      if (cycleTime < animationDuration) {
        const p = (cycleTime / animationDuration) * 100;
        progress.set(directionRef.current === 1 ? p : 100 - p);
        hasTriggeredEndRef.current = false;
      } else if (cycleTime < cycleDuration) {
        progress.set(directionRef.current === 1 ? 100 : 0);
        if (!hasTriggeredEndRef.current) {
          hasTriggeredEndRef.current = true;
          onEnd?.();
        }
      } else if (cycleTime < cycleDuration + animationDuration) {
        const reverseTime = cycleTime - cycleDuration;
        const p = 100 - (reverseTime / animationDuration) * 100;
        progress.set(directionRef.current === 1 ? p : 100 - p);
      } else {
        progress.set(directionRef.current === 1 ? 0 : 100);
      }
    } else {
      const cycleDuration = animationDuration + delayDuration;
      const cycleTime = elapsedRef.current % cycleDuration;

      if (cycleTime < animationDuration) {
        const p = (cycleTime / animationDuration) * 100;
        progress.set(directionRef.current === 1 ? p : 100 - p);
        hasTriggeredEndRef.current = false;
      } else {
        progress.set(directionRef.current === 1 ? 100 : 0);
        if (!hasTriggeredEndRef.current) {
          hasTriggeredEndRef.current = true;
          onEnd?.();
        }
      }
    }
  });

  useEffect(() => {
    directionRef.current = direction === 'left' ? 1 : -1;
    elapsedRef.current = 0;
    hasTriggeredEndRef.current = false;
    progress.set(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction, text]);

  const backgroundPosition = useTransform(progress, (p: number) => `${150 - p * 2}% center`);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };

  const words = text.split(' ');

  if (mode === 'word' && words.length > 1) {
    return (
      <span
        className={`shiny-text ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {words.map((word, i) => (
          <WordItem
            key={i}
            word={word}
            index={i}
            total={words.length}
            progress={progress}
            color={color}
            shineColor={shineColor}
            spread={spread}
          />
        ))}
      </span>
    );
  }

  return (
    <motion.span
      className={`shiny-text ${className}`}
      style={{ ...gradientStyle, backgroundPosition }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </motion.span>
  );
};

export default ShinyText;
