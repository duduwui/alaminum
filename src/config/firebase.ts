/// <reference types="vite/client" />

// Firebase Web SDK Configuration & Firestore Setup
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  type DocumentData
} from 'firebase/firestore';

export interface FirebaseConfigOptions {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

const STORAGE_KEY_FIREBASE = 'winhome_firebase_config';

export function getRuntimeFirebaseConfig(): FirebaseConfigOptions {
  // Check localStorage first
  try {
    const saved = localStorage.getItem(STORAGE_KEY_FIREBASE);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.projectId && parsed.apiKey) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading saved Firebase config:', e);
  }

  // Check Vite environment variables
  const env = (import.meta as any).env || {};
  return {
    apiKey: env.VITE_FIREBASE_API_KEY || '',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: env.VITE_FIREBASE_APP_ID || '',
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || ''
  };
}

export function saveRuntimeFirebaseConfig(config: FirebaseConfigOptions): void {
  try {
    localStorage.setItem(STORAGE_KEY_FIREBASE, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save Firebase config:', e);
  }
}

export function isFirebaseConfigured(): boolean {
  const cfg = getRuntimeFirebaseConfig();
  return Boolean(
    cfg.projectId &&
    cfg.projectId !== 'winhome-demo' &&
    cfg.projectId.trim() !== '' &&
    cfg.apiKey &&
    cfg.apiKey !== 'demo-api-key' &&
    cfg.apiKey.trim() !== ''
  );
}

const initialConfig = getRuntimeFirebaseConfig();

// Fallback dummy config if nothing is specified yet
const activeConfig: FirebaseConfigOptions = {
  apiKey: initialConfig.apiKey || 'AIzaSyDemoKeyFallback001122334455',
  authDomain: initialConfig.authDomain || (initialConfig.projectId ? `${initialConfig.projectId}.firebaseapp.com` : 'winhome-cloud.firebaseapp.com'),
  projectId: initialConfig.projectId || 'winhome-cloud',
  storageBucket: initialConfig.storageBucket || (initialConfig.projectId ? `${initialConfig.projectId}.appspot.com` : 'winhome-cloud.appspot.com'),
  messagingSenderId: initialConfig.messagingSenderId || '123456789012',
  appId: initialConfig.appId || '1:123456789012:web:abcdef12345678'
};

let appInstance: FirebaseApp;
try {
  appInstance = !getApps().length ? initializeApp(activeConfig) : getApp();
} catch (e) {
  console.warn('Firebase app init warning:', e);
  appInstance = getApps()[0] || initializeApp(activeConfig);
}

export const app = appInstance;
export const db: Firestore = getFirestore(app);

export {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  type DocumentData
};
