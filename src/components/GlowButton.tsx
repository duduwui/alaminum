import React from 'react';

export interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'active' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isDarkTheme?: boolean;
  className?: string;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isDarkTheme = false,
  className = '',
  ...props
}) => {
  const isDark = isDarkTheme || variant === 'accent';

  const sizeClasses = {
    sm: 'py-2 px-3.5 text-xs gap-1.5 min-w-[90px]',
    md: 'py-2.5 px-5 text-xs sm:text-sm gap-2 min-w-[110px]',
    lg: 'py-3.5 px-7 text-sm sm:text-base gap-2.5 min-w-[140px]'
  }[size];

  const colorClass = isDark ? 'cornerstone-box-white' : 'cornerstone-box-black';
  const activeClass = variant === 'active' ? 'cornerstone-box-active' : '';

  return (
    <button
      className={`cornerstone-btn ${className}`.trim()}
      {...props}
    >
      <span className={`cornerstone-box ${colorClass} ${activeClass} ${sizeClasses}`}>
        {children}
      </span>
    </button>
  );
};

export default GlowButton;
