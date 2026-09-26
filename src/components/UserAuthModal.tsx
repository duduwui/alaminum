import React, { useState } from 'react';
import {
  X,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  User as UserIcon,
  UserPlus,
  LogIn,
  Mail,
  Lock,
  Phone,
  Building,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { loginUser, registerUser } from '../services/authService';
import { User } from '../types/auth';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  promptTitle?: string;
  promptMessage?: string;
  initialMode?: 'login' | 'signup';
}

const IRAQ_CITIES = [
  'Erbil (Hawler)',
  'Baghdad',
  'Sulaymaniyah',
  'Duhok',
  'Kirkuk',
  'Basra',
  'Najaf',
  'Karbala',
  'Mosul',
  'Zakho',
  'Other City'
];

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  promptTitle,
  promptMessage,
  initialMode = 'login'
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialMode);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCity, setSignupCity] = useState('Erbil (Hawler)');
  const [customSignupCity, setCustomSignupCity] = useState('');
  const [signupCompany, setSignupCompany] = useState('');

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const user = await loginUser({
        email: loginEmail,
        password: loginPassword
      });
      setIsSubmitting(false);
      setSuccessMessage(`Welcome back, ${user.name}!`);
      setTimeout(() => {
        onSuccess(user);
        onClose();
      }, 600);
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || 'Login failed. Please verify your email and password.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!signupName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!signupPassword || signupPassword.length < 4) {
      setError('Please create a password of at least 4 characters.');
      return;
    }

    setIsSubmitting(true);

    const resolvedCity = (signupCity === 'Other City' || signupCity === 'Other')
      ? (customSignupCity.trim() || 'Other City')
      : signupCity;

    try {
      const user = await registerUser({
        name: signupName.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
        phone: signupPhone.trim() || '+964 750 000 0000',
        city: resolvedCity,
        company: signupCompany.trim() || 'Private Client'
      });
      setIsSubmitting(false);
      setSuccessMessage(`Account created successfully! Welcome, ${user.name}.`);
      setTimeout(() => {
        onSuccess(user);
        onClose();
      }, 700);
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || 'Registration failed. Please check your information.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col text-slate-900">
        
        {/* Modal Top Header */}
        <div className="p-5 pb-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-black border border-red-200 shadow-2xs">
              {activeTab === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                Client & Buyer Portal
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Doorhome Architectural Systems Iraq
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Optional Prompt Context from Cart */}
        {promptTitle && (
          <div className="mx-5 mt-4 p-3 rounded-2xl bg-red-50 border border-red-200/80 flex items-center gap-2.5 text-xs text-red-900">
            <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
            <div>
              <span className="font-extrabold block">{promptTitle}</span>
              {promptMessage && <span className="text-[11px] text-red-700">{promptMessage}</span>}
            </div>
          </div>
        )}

        {/* Error / Success Feedback */}
        {error && (
          <div className="mx-5 mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800 font-bold">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-5 mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Dual Tab Switcher: Sign In vs Create Account */}
        <div className="px-5 pt-4">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError('');
              }}
              className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setError('');
              }}
              className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'signup'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5">
          {activeTab === 'login' ? (
            /* TAB 1: SIGN IN (EXISTING CLIENT) */
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block mb-1 text-[10px] font-extrabold uppercase text-slate-700 tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your registered email"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-red-600 text-slate-900 font-semibold transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-[10px] font-extrabold uppercase text-slate-700 tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your account password"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-red-600 text-slate-900 font-semibold transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !loginEmail.trim() || !loginPassword.trim()}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {isSubmitting ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In to Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2 border-t border-slate-100">
                <p className="text-[11px] text-slate-500">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setError('');
                    }}
                    className="text-red-600 font-bold hover:underline cursor-pointer"
                  >
                    Create a client account →
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* TAB 2: CREATE ACCOUNT (NEW CLIENT REGISTRATION) */
            <form onSubmit={handleSignupSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 text-[10px] font-extrabold uppercase text-slate-700 tracking-wider">
                  Full Name / Contact Person *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => {
                      setSignupName(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="e.g. Kak Dana Farhad"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-red-600 text-slate-900 font-semibold transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block mb-1 text-[10px] font-extrabold uppercase text-slate-700 tracking-wider">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => {
                        setSignupEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="client@example.com"
                      required
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-red-600 text-slate-900 font-semibold transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-[10px] font-extrabold uppercase text-slate-700 tracking-wider">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="+964 750 ..."
                      required
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-red-600 text-slate-900 font-semibold transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block mb-1 text-[10px] font-extrabold uppercase text-slate-700 tracking-wider">
                    City / Governorate
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={signupCity}
                      onChange={(e) => setSignupCity(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-red-600 text-slate-900 font-semibold transition-all"
                    >
                      {IRAQ_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(signupCity === 'Other City' || signupCity === 'Other') && (
                    <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <input
                        type="text"
                        required
                        value={customSignupCity}
                        onChange={(e) => setCustomSignupCity(e.target.value)}
                        placeholder="Type your city name..."
                        className="w-full px-3 py-1.5 rounded-lg border-2 border-red-400 bg-red-50/50 focus:bg-white focus:outline-none focus:border-red-600 text-slate-900 text-xs font-semibold"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-[10px] font-extrabold uppercase text-slate-700 tracking-wider">
                    Project / Company
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={signupCompany}
                      onChange={(e) => setSignupCompany(e.target.value)}
                      placeholder="e.g. Private Villa"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-red-600 text-slate-900 font-semibold transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-[10px] font-extrabold uppercase text-slate-700 tracking-wider">
                  Create Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => {
                      setSignupPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="At least 4 characters"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-red-600 text-slate-900 font-semibold transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !signupName.trim() || !signupEmail.trim() || !signupPassword.trim()}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {isSubmitting ? (
                    <span>Registering Account...</span>
                  ) : (
                    <>
                      <span>Create Account & Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2 border-t border-slate-100">
                <p className="text-[11px] text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setError('');
                    }}
                    className="text-red-600 font-bold hover:underline cursor-pointer"
                  >
                    Sign in here →
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserAuthModal;
