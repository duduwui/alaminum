import React, { useState } from 'react';
import { ArrowLeft, Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { loginAdminUser } from '../services/authService';
import { User as UserType } from '../types/auth';
import { DOORHOME_CONTACT } from '../data/winhomeData';

interface AdminGuardModalProps {
  isOpen: boolean;
  onSuccess: (user?: UserType) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export function AdminGuardModal({ isOpen, onSuccess, onCancel, onClose }: AdminGuardModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = onCancel || onClose || (() => {});

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await loginAdminUser({
        email: email.trim(),
        password: password.trim()
      });

      if (user.role !== 'admin' && user.role !== 'super_admin') {
        setError('Access restricted. This account does not have Administrative privileges.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setEmail('');
      setPassword('');
      onSuccess(user);
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || 'Invalid administrator credentials. Access denied.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-md my-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200 text-slate-900">
        {/* Top Red Accent Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-700 via-red-500 to-rose-400" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2 shadow-sm">
                <img
                  src={DOORHOME_CONTACT.logo}
                  alt="Doorhome"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/doorhome-logo.jpg';
                  }}
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Doorhome Admin Portal
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Secure Administrator Authorization
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 font-bold animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} dir="ltr" className="space-y-4" autoComplete="off">
            {/* Username / Email Field */}
            <div className="space-y-1.5 text-start">
              <label htmlFor="admin-email" className="block text-xs font-black uppercase tracking-wider text-slate-600">
                Admin Username or Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="admin-email"
                  type="text"
                  required
                  autoFocus
                  placeholder="admin or admin@doorhome.company"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-slate-900 font-bold text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-start">
              <label htmlFor="admin-password" className="block text-xs font-black uppercase tracking-wider text-slate-600">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-slate-900 font-bold text-sm outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-60 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <span>Sign In to Admin Portal</span>
              )}
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="pt-2 border-t border-slate-100 flex justify-center">
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors py-1 px-3 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Homepage</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminGuardModal;
