import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  Building,
  ArrowRight,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '../services/authService';
import { User as UserType } from '../types/auth';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: UserType) => void;
  onNavigateToAdmin?: () => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  onNavigateToAdmin
}) => {
  const [currentUser, setCurrentUserState] = useState<UserType | null>(() => getCurrentUser());
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<'client' | 'architect' | 'fabricator' | 'other'>('client');
  const [customRole, setCustomRole] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync state when opened
  React.useEffect(() => {
    if (isOpen) {
      setCurrentUserState(getCurrentUser());
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const user = await loginUser({ email: loginEmail, password: loginPassword });
      setCurrentUserState(user);
      setSuccessMsg(`Welcome back, ${user.name}!`);
      if (onAuthSuccess) onAuthSuccess(user);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const user = await registerUser({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        role: regRole === 'architect' ? 'architect' : regRole === 'fabricator' ? 'fabricator' : 'client',
        company: regRole === 'other' ? (customRole.trim() || 'Custom Role') : undefined
      });
      setCurrentUserState(user);
      setSuccessMsg(`Account successfully created! Welcome, ${user.name}.`);
      if (onAuthSuccess) onAuthSuccess(user);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUserState(null);
    setSuccessMsg('You have been logged out.');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden max-w-md w-full shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-[#3E4346] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-black shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">
                {currentUser ? 'My Account Profile' : 'Log into your account'}
              </h3>
              <p className="text-[11px] text-slate-300">
                {currentUser ? currentUser.email : 'Doorhome Architectural Portal'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Status Messages */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {currentUser ? (
            /* Logged-In User Profile Card */
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Full Name:</span>
                  <strong className="text-slate-900 font-bold">{currentUser.name}</strong>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Email Address:</span>
                  <strong className="text-slate-900 font-bold">{currentUser.email}</strong>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Account Type:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-600 text-white">
                    {currentUser.role}
                  </span>
                </div>
                {currentUser.phone && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Phone Number:</span>
                    <strong className="text-slate-900">{currentUser.phone}</strong>
                  </div>
                )}
              </div>

              {currentUser.role === 'admin' && onNavigateToAdmin && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToAdmin();
                  }}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-600/20"
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Open Admin Portal</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full py-3 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            /* Login / Register Forms (Alumil style) */
            <div>
              {/* Tabs Switcher */}
              <div className="flex border-b border-slate-200 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider transition-all relative ${
                    activeTab === 'login'
                      ? 'text-[#3E4346] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-red-600'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Log into your account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider transition-all relative ${
                    activeTab === 'register'
                      ? 'text-[#3E4346] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-red-600'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Create an account
                </button>
              </div>

              {/* Social Login Button (Google Auth Placeholder) */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('Google Authentication will be connected with your OAuth Client ID.');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative px-3 bg-white text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  or with email
                </span>
              </div>

              {activeTab === 'login' ? (
                /* Login Form */
                <form onSubmit={handleLoginSubmit} className="space-y-3.5" autoComplete="off">
                  {/* Decoy fields for browser autofill suppression */}
                  <input type="text" name="decoy_user" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                  <input type="password" name="decoy_pass" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        name="dh_usr_acc_email"
                        id="dh_usr_acc_email"
                        autoComplete="off"
                        data-lpignore="true"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        name="dh_usr_acc_pass"
                        id="dh_usr_acc_pass"
                        autoComplete="new-password"
                        data-lpignore="true"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>{loading ? 'Authenticating...' : 'Log into your account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Password (min 6 chars)
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+964 750 ..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Account Role
                    </label>
                    <select
                      value={regRole}
                      onChange={(e: any) => setRegRole(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-red-600"
                    >
                      <option value="client">Homeowner / Property Client</option>
                      <option value="architect">Architect / Specifier</option>
                      <option value="fabricator">Aluminium Fabricator / Installer</option>
                      <option value="other">Other Role</option>
                    </select>

                    {regRole === 'other' && (
                      <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <input
                          type="text"
                          required
                          value={customRole}
                          onChange={(e) => setCustomRole(e.target.value)}
                          placeholder="Specify your role or business type..."
                          className="w-full px-3 py-1.5 bg-red-50/50 border-2 border-red-400 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-red-600 focus:bg-white"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
