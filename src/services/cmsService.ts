import {
  db,
  doc,
  setDoc,
  getDoc,
  onSnapshot
} from '../config/firebase';

const STORAGE_KEY_HOMEPAGE = 'winhome_cms_homepage_media';
const STORAGE_KEY_GALLERY = 'winhome_admin_gallery_images';

export interface HomepageCmsData {
  aboutFactoryImage: string;
  aboutTitle?: string;
  aboutSubtitle?: string;
  heroPosterImage: string;
  heroTagline?: string;
  heroSubtitle?: string;
  showcaseImages?: Record<string, string>;
  showcaseProductIds?: Record<string, string>;
  showcaseContent?: Record<string, { title?: string; subtitle?: string; description?: string }>;
  showcaseContentByLanguage?: Record<string, Record<string, { title?: string; subtitle?: string; description?: string }>>;
  showcaseSectionText?: Record<string, { title?: string; subtitle?: string }>;
  bentoImages?: Record<string, string>;
}

export type SharedCmsSection = 'homepage' | 'gallery' | 'products' | 'divisions';

export async function hasAdminCmsSession(): Promise<boolean> {
  try {
    const token = localStorage.getItem('dh_admin_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/cms/session', {
      cache: 'no-store',
      credentials: 'include',
      headers
    });
    if (!response.ok) return false;
    const payload = await response.json().catch(() => ({}));
    return payload.authenticated === true;
  } catch {
    return false;
  }
}

export async function loadSharedCmsSection<T>(section: SharedCmsSection): Promise<T | null> {
  const response = await fetch(`/api/cms/${section}`);
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
    throw new Error(`Shared ${section} content is unavailable.`);
  }
  const payload = await response.json();
  return payload.data ?? null;
}

export async function saveSharedCmsSection(section: SharedCmsSection, data: unknown): Promise<void> {
  const token = localStorage.getItem('dh_admin_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`/api/cms/${section}`, {
    method: 'PUT',
    headers,
    credentials: 'include',
    body: JSON.stringify({ data })
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `Could not save ${section} content.`);
  }
}

export async function fetchHomepageCms(): Promise<HomepageCmsData | null> {
  // 1. Try Firestore
  try {
    const snap = await getDoc(doc(db, 'cms_content', 'homepage'));
    if (snap.exists()) {
      const data = snap.data() as HomepageCmsData;
      localStorage.setItem(STORAGE_KEY_HOMEPAGE, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Firestore fetch CMS error (using local):', err);
  }

  // 2. Local fallback
  try {
    const saved = localStorage.getItem(STORAGE_KEY_HOMEPAGE);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }

  return null;
}

export async function saveHomepageCmsToCloud(data: HomepageCmsData): Promise<void> {
  // 1. Save to Firestore
  try {
    await setDoc(doc(db, 'cms_content', 'homepage'), data, { merge: true });
  } catch (err) {
    console.warn('Firestore save CMS error:', err);
  }

  // 2. Save local
  try {
    localStorage.setItem(STORAGE_KEY_HOMEPAGE, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export async function fetchGalleryImages(): Promise<string[] | null> {
  try {
    const snap = await getDoc(doc(db, 'cms_content', 'gallery'));
    if (snap.exists()) {
      const data = snap.data()?.images as string[];
      if (Array.isArray(data)) {
        localStorage.setItem(STORAGE_KEY_GALLERY, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('Firestore fetch gallery error:', err);
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY_GALLERY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }

  return null;
}

export async function saveGalleryImagesToCloud(images: string[]): Promise<void> {
  try {
    await setDoc(doc(db, 'cms_content', 'gallery'), { images, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.warn('Firestore save gallery error:', err);
  }

  try {
    localStorage.setItem(STORAGE_KEY_GALLERY, JSON.stringify(images));
  } catch {
    // ignore
  }
}
