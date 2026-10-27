import { ProductItem } from '../data/winhomeData';
import { PRODUCTION_PRODUCTS_SEED } from '../data/productionProductsSeed';
import {
  db,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot
} from '../config/firebase';

const STORAGE_KEY = 'winhome_admin_products_v6';
const DELETED_PRODUCTS_KEY = 'winhome_deleted_product_ids';
const COLLECTION_NAME = 'products';
export const PRODUCTS_UPDATED_EVENT = 'winhome_products_updated';

export function getDeletedProductIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_PRODUCTS_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch {}
  return new Set();
}

export function markProductAsDeleted(id: string): void {
  try {
    const ids = getDeletedProductIds();
    ids.add(id);
    localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify([...ids]));
  } catch {}
}

export function loadLocalProducts(): ProductItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const deletedIds = getDeletedProductIds();
        return parsed.filter((item: ProductItem) => item && item.id && !deletedIds.has(item.id));
      }
    }
  } catch (e) {
    console.error('Error loading products from storage:', e);
  }
  const deletedIds = getDeletedProductIds();
  return PRODUCTION_PRODUCTS_SEED.filter((p) => !deletedIds.has(p.id));
}

export function saveLocalProducts(products: ProductItem[]): void {
  try {
    const cleaned: ProductItem[] = products.filter((item: ProductItem) => Boolean(item && item.id));
    const nextJson = JSON.stringify(cleaned);
    const prevJson = localStorage.getItem(STORAGE_KEY);
    if (prevJson === nextJson) return;
    localStorage.setItem(STORAGE_KEY, nextJson);
    window.dispatchEvent(new CustomEvent(PRODUCTS_UPDATED_EVENT, { detail: cleaned }));
  } catch (e) {
    console.error('Error saving products locally:', e);
  }
}

export function resetProductsToDefault(): ProductItem[] {
  saveLocalProducts(PRODUCTION_PRODUCTS_SEED);
  return PRODUCTION_PRODUCTS_SEED;
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

  return loadLocalProducts();
}

export async function saveProductToCloud(product: ProductItem): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTION_NAME, product.id), product);
  } catch (err) {
    console.warn('Firestore save product error:', err);
  }

  try {
    const current = loadLocalProducts();
    const updated = [product, ...current.filter((p) => p.id !== product.id)];
    saveLocalProducts(updated);
  } catch (e) {
    // ignore
  }
}

export async function deleteProductFromCloud(productId: string): Promise<void> {
  markProductAsDeleted(productId);
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, productId));
  } catch (err) {
    console.warn('Firestore delete product error:', err);
  }

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
