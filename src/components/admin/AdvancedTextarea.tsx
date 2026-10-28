import React, { useRef, useEffect } from 'react';

export interface AdvancedTextareaProps {
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  minHeight?: string;
}

export const AdvancedTextarea: React.FC<AdvancedTextareaProps> = ({
  value,
  onChange,
  onBlur,
  placeholder = 'Type detailed architectural description...',
  rows = 5,
  label,
  minHeight = '150px'
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow height so all lines are visible without needing an internal scrollbar
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const minH = parseInt(minHeight, 10) || 150;
    const scrollH = el.scrollHeight;
    el.style.height = `${Math.max(minH, scrollH)}px`;
  }, [value, minHeight]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const tabSpaces = '    '; // 4 spaces for clean indentation
      const currentVal = value || '';
      const nextVal = currentVal.substring(0, start) + tabSpaces + currentVal.substring(end);
      onChange(nextVal);
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + tabSpaces.length;
        }
      });
    }
  };

  const lineCount = (value || '').split('\n').length;
  const charCount = (value || '').length;

  return (
    <div className="space-y-1 w-full text-start">
      {label && (
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span>{label}</span>
          <span className="text-[10px] text-slate-400 font-normal">
            {charCount} chars • {lineCount} line{lineCount > 1 ? 's' : ''}
          </span>
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        rows={rows}
        placeholder={placeholder}
        style={{ minHeight }}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs sm:text-sm text-slate-900 leading-relaxed font-normal focus:border-red-500 focus:ring-1 focus:ring-red-500/20 focus:outline-none transition-all resize-y"
      />
    </div>
  );
};
