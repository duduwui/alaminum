import { ProductItem } from '../data/winhomeData';
import { HOMEPAGE_SECTION_ITEMS_SEED } from '../data/homepageSectionItemsSeed';

const STORAGE_KEY = 'winhome_homepage_section_slides_v2';
export const SECTION_ITEMS_UPDATED_EVENT = 'winhome_section_items_updated';

let isFetchingCms = false;

export async function fetchHomepageSectionItemsFromCms(): Promise<ProductItem[]> {
  try {
    const res = await fetch('/api/cms/homepageSectionSlides', { cache: 'no-cache' });
    if (res.ok) {
      const payload = await res.json();
      const rawList = Array.isArray(payload) ? payload : payload?.data;
      if (Array.isArray(rawList) && rawList.length > 0) {
        saveHomepageSectionItems(rawList);
        return rawList;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch homepage section slides from CMS:', err);
  }
  return loadHomepageSectionItems();
}

export function loadHomepageSectionItems(): ProductItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (typeof window !== 'undefined' && !isFetchingCms) {
          isFetchingCms = true;
          fetchHomepageSectionItemsFromCms().finally(() => {
            isFetchingCms = false;
          });
        }
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load homepage section items from localStorage:', err);
  }

  if (typeof window !== 'undefined' && !isFetchingCms) {
    isFetchingCms = true;
    fetchHomepageSectionItemsFromCms().finally(() => {
      isFetchingCms = false;
    });
  }

  return HOMEPAGE_SECTION_ITEMS_SEED;
}

export function saveHomepageSectionItems(items: ProductItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(SECTION_ITEMS_UPDATED_EVENT, { detail: items }));
  } catch (err) {
    console.error('Failed to save homepage section items:', err);
  }
}

export function subscribeToHomepageSectionItems(
  callback: (items: ProductItem[]) => void
): () => void {
  const handler = (e: Event) => {
    const custom = e as CustomEvent<ProductItem[]>;
    if (custom.detail) {
      callback(custom.detail);
    } else {
      callback(loadHomepageSectionItems());
    }
  };
  window.addEventListener(SECTION_ITEMS_UPDATED_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(SECTION_ITEMS_UPDATED_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
