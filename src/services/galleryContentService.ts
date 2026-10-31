export interface GalleryMediaItem {
  id: string;
  title: string;
  description: string;
  src: string;
  poster?: string;
  mediaType: 'image' | 'video';
  category: 'villa' | 'commercial' | 'doors' | 'facade' | 'stairs' | 'railings' | 'windows' | 'pergolas' | string;
  location: string;
  system: string;
  year?: string;
  glassArea?: string;
  translations?: Record<string, { name?: string; title?: string; description?: string }>;
}

const STORAGE_KEY = 'winhome_admin_gallery_images_v7';
export const GALLERY_UPDATED_EVENT = 'cms_gallery_updated';

try {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('winhome_admin_gallery_images_v5');
    localStorage.removeItem('winhome_admin_gallery_images_v4');
    localStorage.removeItem('winhome_admin_gallery_images_v3');
  }
} catch {}

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
      glassArea: typeof item.glassArea === 'string' ? item.glassArea : undefined,
      poster: typeof (item as any).poster === 'string' && (item as any).poster.trim()
        ? (item as any).poster.trim()
        : src.includes('12c6d25c')
        ? '/uploads/poster_slot4.jpg'
        : src.includes('746f7fc1')
        ? '/uploads/poster_slot2.jpg'
        : src.includes('(10)') || src.includes('video_2026-09-26_07-36-00')
        ? '/products-assets/windows/poster_vid10.jpg'
        : src.includes('(11)')
        ? '/products-assets/windows/poster_vid11.jpg'
        : src.includes('(3)')
        ? '/products-assets/windows/poster_vid3.jpg'
        : src.includes('(4)')
        ? '/products-assets/windows/poster_vid4.jpg'
        : src.includes('(5)')
        ? '/products-assets/windows/poster_vid5.jpg'
        : src.includes('(6)')
        ? '/products-assets/windows/poster_vid6.jpg'
        : src.includes('(7)')
        ? '/products-assets/windows/poster_vid7.jpg'
        : src.includes('(8)')
        ? '/products-assets/unclears/poster_unclear_vid8.jpg'
        : src.includes('(9)')
        ? '/products-assets/windows/poster_vid9.jpg'
        : src.includes('6.19.54')
        ? '/products-assets/unclears/poster_unclear_tower_balconies.jpg'
        : src.includes('5.10.04')
        ? '/products-assets/unclears/poster_unclear_patio_enclosure.jpg'
        : undefined
    }];
  });
}

let isSyncing = false;
let lastLocalWriteAt = 0;

export async function fetchGalleryItemsFromCms(): Promise<GalleryMediaItem[]> {
  const startedAt = Date.now();
  try {
    const res = await fetch('/api/cms/gallery', { cache: 'no-cache' });
    if (res.ok) {
      const payload = await res.json();
      const rawList = Array.isArray(payload) ? payload : payload?.data;
      if (Array.isArray(rawList)) {
        // Ignore stale server data if the user edited/deleted locally while this request was in flight
        if (lastLocalWriteAt > startedAt) return loadGalleryItems();
        const normalized = normalizeGalleryItems(rawList);
        saveGalleryItems(normalized, true);
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
    if (saved !== null) {
      const parsed = normalizeGalleryItems(JSON.parse(saved));
      if (Array.isArray(parsed)) {
        if (typeof window !== 'undefined' && !isSyncing) {
          isSyncing = true;
          fetchGalleryItemsFromCms().finally(() => {
            isSyncing = false;
          });
        }
        return parsed;
      }
    }

    // In browser environment, initiate background sync from CMS if not already syncing
    if (typeof window !== 'undefined' && !isSyncing) {
      isSyncing = true;
      fetchGalleryItemsFromCms().finally(() => {
        isSyncing = false;
      });
    }

    return DEFAULT_GALLERY_ITEMS;
  } catch {
    return DEFAULT_GALLERY_ITEMS;
  }
}

export function saveGalleryItems(items: GalleryMediaItem[], fromServer = false): void {
  if (!fromServer) lastLocalWriteAt = Date.now();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(GALLERY_UPDATED_EVENT, { detail: items }));
  } catch (e) {
    console.error('saveGalleryItems error:', e);
  }
}
