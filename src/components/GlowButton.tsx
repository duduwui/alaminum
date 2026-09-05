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
  isDarkTheme,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'py-2 px-4 text-xs gap-1.5 rounded-xl',
    md: 'py-2.5 px-5 text-xs sm:text-sm gap-2 rounded-xl',
    lg: 'py-3 px-6 text-sm sm:text-base gap-2.5 rounded-2xl'
  }[size];

  const variantClasses = {
    primary: 'bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20 font-bold border border-sky-600',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-200/80',
    accent: 'bg-slate-900 hover:bg-slate-800 text-white font-bold border border-slate-800 shadow-sm',
    active: 'bg-sky-600 text-white font-extrabold shadow-md shadow-sky-600/25 border border-sky-600',
    outline: 'bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-300'
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center font-sans tracking-wide transition-all duration-200 active:scale-98 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/40 ${sizeClasses} ${variantClasses} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default GlowButton;
