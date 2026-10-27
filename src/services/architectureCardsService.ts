export interface ArchitectureCatalogueCard {
  id: string; // e.g. 'cat1', 'cat2', or custom id
  brand: string;
  logo: string;
  image?: string;
  title: string;
  desc: string;
  pdfUrl: string;
  fileName?: string;
  company: string;
  buttonText?: string;
  translations?: Record<string, { title?: string; desc?: string; buttonText?: string }>;
}

export interface ArchitectureHardwareItem {
  id: string;
  title: string;
  brand: string;
  origin: string;
  category: string;
  image: string;
  fallbackImage: string;
  badge: string;
  pdfUrl: string;
  description: string;
  specs: Array<{ label: string; val: string }>;
}

export const ARCH_CARDS_STORAGE_KEY = 'winhome_cms_arch_cards';
export const ARCH_CARDS_UPDATED_EVENT = 'cms_arch_cards_updated';

export const DEFAULT_CATALOGUE_CARDS: ArchitectureCatalogueCard[] = [
  {
    id: 'cat1',
    brand: 'WIEK SYSTEM',
    logo: '/assets/showcase/wiek-logo.png',
    image: '/assets/showcase/wiek_hidden_hinge-04.png',
    title: 'WIEK Belgium Architectural Catalog',
    desc: 'Concealed hinge solutions & architectural fenestration',
    pdfUrl: '/catalogs/wiek-general-catalog-2026.pdf',
    fileName: 'WIEK-General-Catalog-2026.pdf',
    company: 'WIEK Belgium',
    buttonText: 'Open Catalog',
    translations: {
      ar: {
        title: 'كتالوج شركة WIEK بلجيكا',
        desc: 'المفصلات المخفية والأنظمة المعمارية 2026',
        buttonText: 'فتح الكتالوج'
      },
      ckb: {
        title: 'کەتەلۆگی کۆمپانیای WIEKی بەلجیکی',
        desc: 'چارەسەری نەرمەلۆی شاردراوە و سیستەمی تەلارسازی',
        buttonText: 'کردنەوەی کەتەلۆگ'
      },
      kmr: {
        title: 'Kataloga WIEK Belçîka ya Mîmarî',
        desc: 'Çareseriyên alavên veşartî û pencereyên nûjen',
        buttonText: 'Katalogê Veke'
      },
      tr: {
        title: 'WIEK Belçika Mimari Kataloğu',
        desc: 'Gizli menteşe ve mimari kapı pencere donanımları',
        buttonText: 'Kataloğu Aç'
      }
    }
  },
  {
    id: 'cat2',
    brand: 'STAC Spain',
    logo: '/assets/showcase/stac-logo.png',
    image: '/assets/showcase/stac_lift_slide-108.png',
    title: 'STAC Spain Hardware Catalog',
    desc: 'Minimalist cremones & monumental lift & slide hardware',
    pdfUrl: '/catalogs/stac-hardware-accessories.pdf',
    fileName: 'STAC-Hardware-Accessories-Catalogue.pdf',
    company: 'STAC Spain',
    buttonText: 'Open Catalog',
    translations: {
      ar: {
        title: 'كتالوج شركة STAC إسبانيا',
        desc: 'المقابض المينيماليست وتروس الرفع والسحب',
        buttonText: 'فتح الكتالوج'
      },
      ckb: {
        title: 'کەتەلۆگی گشتی STACی ئیسپانی',
        desc: 'دەسکی مۆدێرن و سیستەمی لیفت و سلایدینگ',
        buttonText: 'کردنەوەی کەتەلۆگ'
      },
      kmr: {
        title: 'Kataloga STAC ya Spanyayê',
        desc: 'Destikên mînîmalîst û pergala hebeşîbe',
        buttonText: 'Katalogê Veke'
      },
      tr: {
        title: 'STAC İspanya Donanım Kataloğu',
        desc: 'Minimalist kollar ve hebeschiebe donanımları',
        buttonText: 'Kataloğu Aç'
      }
    }
  }
];

export function loadArchitectureCards(): ArchitectureCatalogueCard[] {
  try {
    const raw = localStorage.getItem(ARCH_CARDS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 2) {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_CATALOGUE_CARDS;
}

export function saveArchitectureCards(cards: ArchitectureCatalogueCard[]): void {
  try {
    localStorage.setItem(ARCH_CARDS_STORAGE_KEY, JSON.stringify(cards));
    window.dispatchEvent(new CustomEvent(ARCH_CARDS_UPDATED_EVENT, { detail: cards }));
  } catch (err) {
    console.error('Failed to save architecture cards:', err);
  }
}

export function subscribeToArchitectureCards(callback: (cards: ArchitectureCatalogueCard[]) => void): () => void {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<ArchitectureCatalogueCard[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(loadArchitectureCards());
    }
  };
  window.addEventListener(ARCH_CARDS_UPDATED_EVENT, handler);
  return () => window.removeEventListener(ARCH_CARDS_UPDATED_EVENT, handler);
}
