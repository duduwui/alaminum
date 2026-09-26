import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { loginAdminUser } from '../services/authService';
import { User } from '../types/auth';
import './NeumorphicLoginForm.css';

interface AdminGuardModalProps {
  isOpen: boolean;
  onSuccess: (user?: User) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export function AdminGuardModal({ isOpen, onSuccess, onCancel, onClose }: AdminGuardModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative flex flex-col items-center">
        {/* From Uiverse.io by Harsha2lucky & TISEPSE */}
        <div className="content">
          <div className="text">
            Admin
          </div>

          {error && (
            <div className="neumorphic-alert error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} dir="ltr" autoComplete="off">
            {/* Decoy inputs to prevent browser autofill */}
            <input type="text" name="decoy_admin_user" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
            <input type="password" name="decoy_admin_pass" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

            <div className="field">
              <input
                required
                type="text"
                name="dh_admin_email_field"
                id="dh_admin_email_field"
                autoComplete="off"
                data-lpignore="true"
                className={`input ${email ? 'has-val' : ''}`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
              />
              <span className="span">
                <svg viewBox="0 0 512 512" height="20" width="50" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#595959" d="M256 0c-74.439 0-135 60.561-135 135s60.561 135 135 135 135-60.561 135-135S330.439 0 256 0zM423.966 358.195C387.006 320.667 338.009 300 286 300h-60c-52.008 0-101.006 20.667-137.966 58.195C51.255 395.539 31 444.833 31 497c0 8.284 6.716 15 15 15h420c8.284 0 15-6.716 15-15 0-52.167-20.255-101.461-57.034-138.805z" />
                </svg>
              </span>
      <label className="label">Admin username or email</label>
            </div>

            <div className="field">
              <input
                required
                type="password"
                name="dh_admin_pass_field"
                id="dh_admin_pass_field"
                autoComplete="new-password"
                data-lpignore="true"
                className={`input ${password ? 'has-val' : ''}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
              />
              <span className="span">
                <svg viewBox="0 0 512 512" height="20" width="50" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#595959" d="M336 192h-16v-64C320 57.406 262.594 0 192 0S64 57.406 64 128v64H48c-26.453 0-48 21.523-48 48v224c0 26.477 21.547 48 48 48h288c26.453 0 48-21.523 48-48V240c0-26.477-21.547-48-48-48zm-229.332-64c0-47.063 38.27-85.332 85.332-85.332s85.332 38.27 85.332 85.332v64H106.668zm0 0" />
                </svg>
              </span>
              <label className="label">Password</label>
            </div>

            <button className="btn2" type="submit" disabled={isSubmitting}>
              <span className="spn2">{isSubmitting ? 'Verifying...' : 'Sign in'}</span>
            </button>
          </form>
        </div>

        {/* Back link */}
        <button
          onClick={handleClose}
          className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors bg-slate-900/80 px-4 py-2 rounded-full border border-slate-700 hover:border-slate-500 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>
      </div>
    </div>
  );
}

export default AdminGuardModal;
