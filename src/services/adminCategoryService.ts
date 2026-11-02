import { autoTranslateText } from './translateService';
import { loadSharedCmsSection, saveSharedCmsSection } from './cmsService';
import { loadProductDivisions, saveProductDivisions } from './productNavigationService';

export interface AdminCategoryItem {
  id: string;
  key: string;
  nameAr: string;
  nameCkb: string;
  nameEn: string;
}

export const DEFAULT_ADMIN_CATEGORIES: AdminCategoryItem[] = [
  { id: 'cat-doors', key: 'doors', nameAr: 'الأبواب والمداخل', nameCkb: 'دەرگاکان', nameEn: 'Doors & Entrances' },
  { id: 'cat-windows', key: 'windows', nameAr: 'أنظمة النوافذ والشبابيك', nameCkb: 'پەنجەرەکان', nameEn: 'Windows Systems' },
  { id: 'cat-shorfa', key: 'shorfa', nameAr: 'حواجز الشرفات والبلكونات والتراسات', nameCkb: 'شرفە و باڵکۆنەکان', nameEn: 'Glass Balustrades & Balconies' },
  { id: 'cat-stairs', key: 'stairs', nameAr: 'حواجز السلالم', nameCkb: 'قادرمە و دەربزینەکان', nameEn: 'Stairs & Railings' },
  { id: 'cat-accessories', key: 'accessories', nameAr: 'الملحقات والإكسسوارات', nameCkb: 'اکسسوارات و پێداویستییەکان', nameEn: 'Accessories & Hardware' },
];

const STORAGE_KEY = 'dh_admin_categories';
const CATEGORIES_EVENT = 'dh_admin_categories_updated';

export function getAdminCategories(): AdminCategoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error loading admin categories:', e);
  }
  return DEFAULT_ADMIN_CATEGORIES;
}

export function saveAdminCategories(categories: AdminCategoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(CATEGORIES_EVENT, { detail: categories }));
    }
  } catch (e) {
    console.error('Error saving admin categories:', e);
  }

  // Also sync to shared CMS section 'divisions'
  void saveSharedCmsSection('divisions', categories).catch(() => {});
}

export function subscribeToAdminCategories(callback: (categories: AdminCategoryItem[]) => void): () => void {
  const handler = (e: Event) => {
    const custom = e as CustomEvent<AdminCategoryItem[]>;
    if (custom.detail) {
      callback(custom.detail);
    } else {
      callback(getAdminCategories());
    }
  };
  window.addEventListener(CATEGORIES_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(CATEGORIES_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

/**
 * Creates a new category from a single Arabic name input.
 * Automatically translates to English & Kurdish, derives slug/key.
 */
export async function createCategoryFromArabic(arabicName: string): Promise<AdminCategoryItem> {
  const cleanAr = arabicName.trim();
  if (!cleanAr) {
    throw new Error('Please enter the category name in Arabic');
  }

  // Auto-translate to English and Kurdish
  let enName = '';
  let ckbName = '';

  try {
    const [enRes, ckbRes] = await Promise.all([
      autoTranslateText(cleanAr, 'en'),
      autoTranslateText(cleanAr, 'ckb')
    ]);
    enName = enRes?.trim() || cleanAr;
    ckbName = ckbRes?.trim() || cleanAr;
  } catch {
    enName = cleanAr;
    ckbName = cleanAr;
  }

  // Derive unique slug/key
  let slug = enName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug || slug.length < 2) {
    slug = `cat-${Date.now().toString(36)}`;
  }

  // Ensure slug uniqueness
  const current = getAdminCategories();
  let finalKey = slug;
  let counter = 1;
  while (current.some((c) => c.key === finalKey)) {
    finalKey = `${slug}-${counter}`;
    counter++;
  }

  const newCategory: AdminCategoryItem = {
    id: `cat-${Date.now()}`,
    key: finalKey,
    nameAr: cleanAr,
    nameCkb: ckbName,
    nameEn: enName
  };

  const updated = [...current, newCategory];
  saveAdminCategories(updated);
  return newCategory;
}
