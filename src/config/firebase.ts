/// <reference types="vite/client" />

// Firebase Web SDK Configuration & Firestore Setup Template
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'winhome-demo.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'winhome-demo',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'winhome-demo.appspot.com',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef'
};

// Initialize Firebase App safely
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export Firestore Database instance
export const db = getFirestore(app);
