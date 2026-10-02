export interface GalleryMediaItem {
  id: string;
  title: string;
  description: string;
  src: string;
  mediaType: 'image' | 'video';
  category: 'villa' | 'commercial' | 'doors' | 'facade';
  location: string;
  system: string;
  year?: string;
  glassArea?: string;
  translations?: Record<string, { name?: string; title?: string; description?: string }>;
}

const STORAGE_KEY = 'winhome_admin_gallery_images';
export const GALLERY_UPDATED_EVENT = 'cms_gallery_updated';

import { MASTER_GALLERY_ITEMS } from '../data/galleryData';

export const DEFAULT_GALLERY_ITEMS: GalleryMediaItem[] = MASTER_GALLERY_ITEMS;

export function normalizeGalleryItems(value: unknown): GalleryMediaItem[] {
  if (!Array.isArray(value)) return DEFAULT_GALLERY_ITEMS;
  return value.flatMap((raw, index): GalleryMediaItem[] => {
    const item = typeof raw === 'string' ? { src: raw } : raw;
    if (!item || typeof item !== 'object' || typeof item.src !== 'string' || !item.src.trim()) return [];
    const src = item.src.trim();
    const isVid = item.mediaType === 'video' || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(src) || src.startsWith('data:video/');
    const mediaType = isVid ? 'video' : 'image';
    return [{
      id: typeof item.id === 'string' ? item.id : `gallery-item-${index}`,
      title: typeof item.title === 'string' ? item.title : `Doorhome Architectural Project #${index + 1}`,
      description: typeof item.description === 'string'
        ? item.description.startsWith('Custom architectural fenestration')
          ? item.description.replace(/engineered and fabricated in Erbil\.?/i, 'designed for modern spaces.')
          : item.description
        : 'Custom architectural fenestration designed for modern spaces.',
      src,
      translations: item.translations && typeof item.translations === 'object' ? item.translations : undefined,
      mediaType,
      category: ['villa', 'commercial', 'doors', 'facade'].includes(item.category) ? item.category : 'villa',
      location: typeof item.location === 'string' ? item.location : '',
      system: typeof item.system === 'string' ? item.system : 'Doorhome Certified European Systems',
      year: typeof item.year === 'string' ? item.year : undefined,
      glassArea: typeof item.glassArea === 'string' ? item.glassArea : undefined
    }];
  });
}

let isSyncing = false;

export async function fetchGalleryItemsFromCms(): Promise<GalleryMediaItem[]> {
  try {
    const res = await fetch('/api/cms/gallery', { cache: 'no-cache' });
    if (res.ok) {
      const payload = await res.json();
      const rawList = Array.isArray(payload) ? payload : payload?.data;
      if (Array.isArray(rawList) && rawList.length > 0) {
        const normalized = normalizeGalleryItems(rawList);
        saveGalleryItems(normalized);
        return normalized;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch CMS gallery items from server:', err);
  }
  return loadGalleryItems();
}

export function loadGalleryItems(): GalleryMediaItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    let parsed: GalleryMediaItem[] = [];
    if (saved) {
      parsed = normalizeGalleryItems(JSON.parse(saved));
    }
    
    // Merge custom uploaded items with default gallery items
    const map = new Map<string, GalleryMediaItem>();
    if (Array.isArray(parsed) && parsed.length > 0) {
      parsed.forEach(p => map.set(p.src, p));
    }
    DEFAULT_GALLERY_ITEMS.forEach(d => {
      if (!map.has(d.src)) {
        map.set(d.src, d);
      }
    });

    // In browser environment, initiate background sync from CMS if not already syncing
    if (typeof window !== 'undefined' && !isSyncing) {
      isSyncing = true;
      fetchGalleryItemsFromCms().finally(() => {
        isSyncing = false;
      });
    }

    return Array.from(map.values());
  } catch {
    return DEFAULT_GALLERY_ITEMS;
  }
}

export function saveGalleryItems(items: GalleryMediaItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(GALLERY_UPDATED_EVENT, { detail: items }));
  } catch (e) {
    console.error('saveGalleryItems error:', e);
  }
}
