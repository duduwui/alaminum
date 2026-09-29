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

export const DEFAULT_GALLERY_ITEMS: GalleryMediaItem[] = [
  { id: 'proj-1', title: 'Empire World Luxury Villa Compound', location: 'Empire World, Erbil', system: 'Lorenzo 70LS Minimalist Sliding & Facade 50F', category: 'villa', src: './assets/doorhome/03-2.jpg', mediaType: 'image', description: 'Monumental 3.2-meter high thermal-break sliding doors seamlessly connecting expansive indoor living areas with landscaped infinity pool terraces.', year: '2024', glassArea: '480 m² Glazing' },
  { id: 'proj-2', title: 'Dream City Private Residence', location: 'Dream City, Erbil', system: 'Deceuninck Legend 80 Passive uPVC', category: 'villa', src: './assets/doorhome/photo_2023-07-03_15-41-20-1280x820.jpg', mediaType: 'image', description: 'Custom 6-chamber triple-glazed acoustic fenestration package providing extreme 45 dB noise isolation and severe climate energy efficiency.', year: '2023', glassArea: '320 m² Glazing' },
  { id: 'proj-3', title: 'Gulan Expressway Corporate Tower', location: 'Gulan District, Erbil', system: 'Curtain Wall Facade 50F Structural Glazing', category: 'commercial', src: './assets/doorhome/3-2.jpg', mediaType: 'image', description: 'Engineered mullion-transom structural curtain wall engineered for Class C5 wind resistance with solar-reflective double glazing.', year: '2024', glassArea: '1,250 m² Facade' },
  { id: 'proj-4', title: 'Italian Village II Modern Renovation', location: 'Italian Village II, Erbil', system: 'Winsa Dorado 76 & Italian Comunello Hardware', category: 'villa', src: './assets/doorhome/4-2.jpg', mediaType: 'image', description: 'Modernized residential envelope with concealed hardware tilt-and-turn windows and integrated motorized thermal rolling shutters.', year: '2023', glassArea: '210 m² Glazing' },
  { id: 'proj-5', title: 'Commercial Automobile Showroom', location: '100m Expressway, Erbil', system: '50F High-Span Curtain Wall & Automatic Entrances', category: 'facade', src: './assets/doorhome/24-1.jpg', mediaType: 'image', description: 'Expansive panoramic glass facades offering crystal-clear visibility and certified heavy-traffic entrance doors.', year: '2023', glassArea: '650 m² Glazing' },
  { id: 'proj-6', title: 'Vank City Executive Residence', location: 'Vank City, Erbil', system: 'Lorenzo 58TT Thermal-Break Casement', category: 'villa', src: './assets/doorhome/photo_2023-07-03_15-49-24-760x485.jpg', mediaType: 'image', description: 'High-security European multipoint locking windows with argon gas filled Low-E solar control units.', year: '2024', glassArea: '180 m² Glazing' },
  { id: 'proj-7', title: 'Royal City Luxury Penthouse', location: 'Royal City, Erbil', system: 'Lorenzo 70LS Lift & Slide Panorama', category: 'villa', src: './assets/doorhome/11-2.jpg', mediaType: 'image', description: 'Zero-threshold sliding panorama doors engineered for unobstructed panoramic views and high wind resistance at elevation.', year: '2024', glassArea: '310 m² Glazing' },
  { id: 'proj-8', title: 'Atlantic Towers Commercial Center', location: 'Airport Road, Erbil', system: 'Facade 50F & Motorized Louver Integration', category: 'commercial', src: './assets/doorhome/17-2.jpg', mediaType: 'image', description: 'Precision fabricated curtain wall with integrated architectural louvers providing solar shading and optimal thermal comfort.', year: '2023', glassArea: '890 m² Facade' }
];

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
