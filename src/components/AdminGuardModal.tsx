import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';

interface AdminGuardModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const DEFAULT_DEMO_PASSCODE = 'admin123';

export function AdminGuardModal({ isOpen, onSuccess, onCancel }: AdminGuardModalProps) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      if (passcode.trim() === DEFAULT_DEMO_PASSCODE || passcode.trim().toLowerCase() === 'admin') {
        setIsSubmitting(false);
        setPasscode('');
        onSuccess();
      } else {
        setIsSubmitting(false);
        setError('Invalid passcode. Access denied. (Demo Key: admin123)');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 p-6 sm:p-8">
        {/* Glow Header Accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-5 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black tracking-tight text-white mb-2">
            Restricted Admin Portal
          </h3>
          <p className="text-sm text-slate-400 mb-6">
            Please enter your management passcode to access Winhome quotation management tools.
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter access passcode (admin123)"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950/70 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 transition-all font-mono tracking-wider"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!passcode.trim() || isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Authenticate & Enter</span>
                </>
              )}
            </button>
          </form>

          <button
            onClick={onCancel}
            className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Homepage</span>
          </button>
        </div>
      </div>
    </div>
  );
}
