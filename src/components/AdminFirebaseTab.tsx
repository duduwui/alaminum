import React, { useState, useEffect } from 'react';
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  ExternalLink,
  ShieldCheck,
  Server,
  Zap,
  Globe,
  Terminal,
  Lock
} from 'lucide-react';
import {
  getRuntimeFirebaseConfig,
  saveRuntimeFirebaseConfig,
  isFirebaseConfigured,
  db,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from '../config/firebase';

export const AdminFirebaseTab: React.FC = () => {
  const [config, setConfig] = useState(getRuntimeFirebaseConfig());
  const [isConfigured, setIsConfigured] = useState(isFirebaseConfigured());
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [copiedCmd, setCopiedCmd] = useState<string>('');

  useEffect(() => {
    setIsConfigured(isFirebaseConfigured());
  }, [config]);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveRuntimeFirebaseConfig(config);
    setSaveSuccess(true);
    setIsConfigured(isFirebaseConfigured());
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('Testing Firestore Cloud connection...');

    try {
      const testDocRef = doc(db, 'system_health', 'connection_test');
      const testData = {
        testedAt: new Date().toISOString(),
        client: 'Doorhome Admin Portal',
        status: 'online',
        projectId: config.projectId || 'demo'
      };

      // Write test
      await setDoc(testDocRef, testData, { merge: true });

      // Read test
      const readSnap = await getDoc(testDocRef);
      if (readSnap.exists()) {
        setTestStatus('success');
        setTestMessage(`✓ Successfully connected to Firestore Cloud! (Project: ${config.projectId || 'doorhome-cloud'})`);
      } else {
        setTestStatus('error');
        setTestMessage('Cloud document wrote but could not be read back.');
      }
    } catch (err: any) {
      console.error('Firestore connection test failed:', err);
      setTestStatus('error');
      setTestMessage(
        err?.message || 'Connection failed. Please check your API key, Project ID, and Firestore rules.'
      );
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(''), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-red-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/30 text-red-300 text-xs font-black uppercase tracking-wider">
            <Cloud className="w-3.5 h-3.5" />
            <span>Firebase Cloud Infrastructure</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Firestore Database & 24/7 Live Deployment
          </h2>
          <p className="text-red-100/80 text-xs sm:text-sm leading-relaxed">
            Doorhome is integrated with Google Firebase Firestore for real-time customer RFQ synchronization, live catalog updates, and global 24/7 hosting on Google's high-speed CDN.
          </p>
        </div>
      </div>

      {/* Cloud Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Live Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Database Status</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black ${
                  isConfigured
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                {isConfigured ? 'Live Cloud Connected' : 'Local Standby / Ready'}
              </span>
            </div>
            <div className="text-lg font-black text-slate-900">
              {config.projectId ? config.projectId : 'doorhome-cloud'}
            </div>
            <p className="text-xs text-slate-500">
              All customer quotation requests, custom catalog products, and CMS media sync in real-time.
            </p>
          </div>

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testStatus === 'testing'}
            className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
            <span>{testStatus === 'testing' ? 'Testing Connection...' : 'Test Cloud Connection'}</span>
          </button>
        </div>

        {/* Card 2: 24/7 Hosting Target */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live URL Domain</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-red-50 text-red-700 border border-red-200">
                <Globe className="w-3 h-3" />
                <span>SSL HTTPS 24/7</span>
              </span>
            </div>
            <div className="text-sm font-black text-slate-900 break-all">
              https://{config.projectId || 'your-project'}.web.app
            </div>
            <p className="text-xs text-slate-500">
              Hosted globally on Firebase CDN with automatic SSL certificates and sub-second load times.
            </p>
          </div>

          <a
            href={`https://${config.projectId || 'doorhome-alaminum'}.web.app`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all text-center"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Live Website ↗</span>
          </a>
        </div>

        {/* Card 3: Security & Storage */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Security Rules</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                <span>Active</span>
              </span>
            </div>
            <div className="text-lg font-black text-slate-900">
              Firestore Cloud Rules
            </div>
            <p className="text-xs text-slate-500">
              Quotation requests and product catalogs protected with rules in <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">firestore.rules</code>.
            </p>
          </div>

          <div className="text-[11px] font-bold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span>Encrypted in transit & at rest</span>
          </div>
        </div>
      </div>

      {/* Test Status Feedback Banner */}
      {testMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold ${
            testStatus === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : testStatus === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {testStatus === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
          {testStatus === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          {testStatus === 'testing' && <RefreshCw className="w-5 h-5 text-red-600 animate-spin shrink-0" />}
          <span>{testMessage}</span>
        </div>
      )}

      {/* 2-Column Grid: Deployment Terminal Guide & Cloud Credentials Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: 24/7 Deployment Commands */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="font-extrabold text-sm text-slate-100">Deploy Live 24/7 with Firebase CLI</h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Production Ready
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Run these 3 standard commands in your project terminal to build and deploy your live 24/7 web application:
          </p>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                <span>1. Build Production App Bundle:</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('npm run build', 'cmd1')}
                  className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedCmd === 'cmd1' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd === 'cmd1' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-3 rounded-xl text-emerald-400 font-mono text-xs border border-slate-800 overflow-x-auto">
                npm run build
              </pre>
            </div>

            {/* Step 2 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                <span>2. Login to Google Firebase:</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('npx firebase login', 'cmd2')}
                  className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedCmd === 'cmd2' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd === 'cmd2' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-3 rounded-xl text-emerald-400 font-mono text-xs border border-slate-800 overflow-x-auto">
                npx firebase login
              </pre>
            </div>

            {/* Step 3 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                <span>3. Deploy to Live 24/7 Hosting:</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('npx firebase deploy', 'cmd3')}
                  className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedCmd === 'cmd3' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd === 'cmd3' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-3 rounded-xl text-emerald-400 font-mono text-xs border border-slate-800 overflow-x-auto">
                npx firebase deploy
              </pre>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Free hosting tier includes 10GB storage & 360MB/day transfer</span>
            <a
              href="https://console.firebase.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:underline flex items-center gap-1 font-bold"
            >
              <span>Firebase Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Column 2: Credentials Editor */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Firebase Cloud Credentials</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Saved locally and configured via <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">.env</code> or directly below.
              </p>
            </div>
            {saveSuccess && (
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 uppercase mb-1">
                Project ID (e.g. doorhome-alaminum)
              </label>
              <input
                type="text"
                value={config.projectId}
                onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
                placeholder="doorhome-alaminum"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 uppercase mb-1">
                API Key (Web API Key)
              </label>
              <input
                type="text"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-600 uppercase mb-1">
                  Auth Domain
                </label>
                <input
                  type="text"
                  value={config.authDomain}
                  onChange={(e) => setConfig({ ...config, authDomain: e.target.value })}
                  placeholder="doorhome-alaminum.firebaseapp.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-600 uppercase mb-1">
                  App ID
                </label>
                <input
                  type="text"
                  value={config.appId}
                  onChange={(e) => setConfig({ ...config, appId: e.target.value })}
                  placeholder="1:123456789012:web:abcdef..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>Save & Connect Firebase</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const resetCfg = {
                    apiKey: '',
                    authDomain: '',
                    projectId: '',
                    storageBucket: '',
                    messagingSenderId: '',
                    appId: ''
                  };
                  setConfig(resetCfg);
                  saveRuntimeFirebaseConfig(resetCfg);
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs transition-all cursor-pointer"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
