import { ProductItem, ALL_PRODUCTS } from '../data/winhomeData';
import {
  db,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot
} from '../config/firebase';

const STORAGE_KEY = 'winhome_admin_products';
const COLLECTION_NAME = 'products';
export const PRODUCTS_UPDATED_EVENT = 'winhome_products_updated';

export function loadLocalProducts(): ProductItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const defaultMap = new Map(ALL_PRODUCTS.map((p) => [p.id, p]));
        const merged: ProductItem[] = parsed.map((item: ProductItem) => {
          const defaultItem = defaultMap.get(item.id);
          if (defaultItem) {
            return {
              ...defaultItem,
              ...item,
              videoUrl: item.videoUrl || defaultItem.videoUrl,
              mediaType: item.mediaType || defaultItem.mediaType,
              image: item.image?.startsWith('/uploads') ? item.image : defaultItem.image,
              translations: { ...defaultItem.translations, ...item.translations }
            };
          }
          return item;
        });

        // Append any new default products that were not present in cache
        const existingIds = new Set(merged.map((p) => p.id));
        ALL_PRODUCTS.forEach((dp) => {
          if (!existingIds.has(dp.id)) {
            merged.push(dp);
          }
        });

        return merged;
      }
    }
  } catch (e) {
    console.error('Error loading products from storage:', e);
  }
  // If never initialized before, set default products
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ALL_PRODUCTS));
  } catch (e) {
    // ignore
  }
  return ALL_PRODUCTS;
}

export function saveLocalProducts(products: ProductItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent(PRODUCTS_UPDATED_EVENT, { detail: products }));
  } catch (e) {
    console.error('Error saving products locally:', e);
  }
}

export function resetProductsToDefault(): ProductItem[] {
  saveLocalProducts(ALL_PRODUCTS);
  return ALL_PRODUCTS;
}

export function subscribeToLocalProducts(callback: (products: ProductItem[]) => void): () => void {
  const handler = (e: Event) => {
    const custom = e as CustomEvent<ProductItem[]>;
    if (custom.detail) {
      callback(custom.detail);
    } else {
      callback(loadLocalProducts());
    }
  };
  window.addEventListener(PRODUCTS_UPDATED_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(PRODUCTS_UPDATED_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

export async function fetchAllProducts(): Promise<ProductItem[]> {
  // 1. Try Firebase Firestore
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    if (!snapshot.empty) {
      const items: ProductItem[] = [];
      snapshot.forEach((d) => {
        items.push({ ...(d.data() as ProductItem), id: d.id });
      });
      saveLocalProducts(items);
      return items;
    }
  } catch (err) {
    console.warn('Firestore fetch products warning (using local):', err);
  }

  // 2. Fall back to local products
  return loadLocalProducts();
}

export async function saveProductToCloud(product: ProductItem): Promise<void> {
  // 1. Save to Firestore
  try {
    await setDoc(doc(db, COLLECTION_NAME, product.id), product);
  } catch (err) {
    console.warn('Firestore save product error:', err);
  }

  // 2. Update local cache
  try {
    const current = loadLocalProducts();
    const updated = [product, ...current.filter((p) => p.id !== product.id)];
    saveLocalProducts(updated);
  } catch (e) {
    // ignore
  }
}

export async function deleteProductFromCloud(productId: string): Promise<void> {
  // 1. Delete from Firestore
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, productId));
  } catch (err) {
    console.warn('Firestore delete product error:', err);
  }

  // 2. Update local cache
  try {
    const current = loadLocalProducts();
    const filtered = current.filter((p) => p.id !== productId);
    saveLocalProducts(filtered);
  } catch (e) {
    // ignore
  }
}

export function subscribeToProducts(onUpdate: (products: ProductItem[]) => void): () => void {
  try {
    return onSnapshot(
      collection(db, COLLECTION_NAME),
      (snapshot) => {
        if (!snapshot.empty) {
          const items: ProductItem[] = [];
          snapshot.forEach((d) => {
            items.push({ ...(d.data() as ProductItem), id: d.id });
          });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
          onUpdate(items);
        }
      },
      (error) => {
        console.warn('Firestore products subscription error:', error);
      }
    );
  } catch {
    return () => {};
  }
}
