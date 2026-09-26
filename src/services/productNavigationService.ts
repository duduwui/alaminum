import { ProductCategoryDivision, ProductNavModel, PRODUCT_DIVISIONS } from '../data/productNavigationData';

const STORAGE_KEY = 'winhome_product_divisions_v3';
const DIVISIONS_CHANGE_EVENT = 'winhome_divisions_updated';

export const loadProductDivisions = (): ProductCategoryDivision[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading product divisions:', e);
  }
  // Initialize with standard 5 divisions only on first run
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(PRODUCT_DIVISIONS));
  } catch (e) {
    // ignore
  }
  return PRODUCT_DIVISIONS;
};

export const saveProductDivisions = (divisions: ProductCategoryDivision[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(divisions));
    window.dispatchEvent(new CustomEvent(DIVISIONS_CHANGE_EVENT, { detail: divisions }));
  } catch (e) {
    console.error('Error saving product divisions:', e);
  }
};

export const addCategoryDivision = (newDiv: {
  title: string;
  kurdishTitle: string;
  divisionLabel?: string;
  kurdishDivisionLabel?: string;
  categoryTarget?: string;
  featuredImage?: string;
  featuredTitle?: string;
  featuredSubtitle?: string;
}): ProductCategoryDivision => {
  const current = loadProductDivisions();
  const slug = newDiv.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const created: ProductCategoryDivision = {
    id: `div-${Date.now()}`,
    key: (slug as any) || 'custom',
    title: newDiv.title,
    kurdishTitle: newDiv.kurdishTitle,
    divisionLabel: newDiv.divisionLabel || `${newDiv.title} Division`,
    kurdishDivisionLabel: newDiv.kurdishDivisionLabel || `قسمی ${newDiv.kurdishTitle}`,
    iconName: 'LayoutGrid',
    featuredImage: newDiv.featuredImage || './assets/doorhome/03-2.jpg',
    featuredTitle: newDiv.featuredTitle || newDiv.title,
    featuredSubtitle: newDiv.featuredSubtitle || newDiv.kurdishTitle,
    categoryTarget: newDiv.categoryTarget || 'products',
    subCategories: [
      {
        id: `sub-${Date.now()}`,
        title: 'General Series',
        kurdishTitle: 'مۆدێلە گشتییەکان',
        items: []
      }
    ]
  };

  const updated = [...current, created];
  saveProductDivisions(updated);
  return created;
};

export const updateCategoryDivision = (
  divisionId: string,
  updates: Partial<ProductCategoryDivision>
): void => {
  const current = loadProductDivisions();
  const updated = current.map((d) => (d.id === divisionId ? { ...d, ...updates } : d));
  saveProductDivisions(updated);
};

export const deleteCategoryDivision = (divisionId: string): void => {
  const current = loadProductDivisions();
  const updated = current.filter((d) => d.id !== divisionId);
  saveProductDivisions(updated);
};

export const addModelToDivision = (
  divisionId: string,
  subCategoryId: string,
  modelData: {
    name: string;
    kurdishName: string;
    modelCode: string;
    description: string;
    categoryTarget?: string;
    image?: string;
    productId?: string;
  }
): ProductNavModel => {
  const current = loadProductDivisions();
  const newModel: ProductNavModel = {
    id: `model-${Date.now()}`,
    productId: modelData.productId,
    name: modelData.name,
    kurdishName: modelData.kurdishName,
    modelCode: modelData.modelCode || 'STD',
    description: modelData.description,
    categoryTarget: modelData.categoryTarget || 'products',
    image: modelData.image || './assets/doorhome/03-2.jpg'
  };

  const updated = current.map((div) => {
    if (div.id !== divisionId) return div;
    
    // Check if subCategory exists, else push into first subCategory
    let subCats = [...div.subCategories];
    if (subCats.length === 0) {
      subCats = [
        {
          id: `sub-${Date.now()}`,
          title: 'General Series',
          kurdishTitle: 'مۆدێلەکان',
          items: [newModel]
        }
      ];
    } else {
      let targetSubIdx = subCats.findIndex((s) => s.id === subCategoryId);
      if (targetSubIdx === -1) targetSubIdx = 0;
      subCats[targetSubIdx] = {
        ...subCats[targetSubIdx],
        items: [...subCats[targetSubIdx].items, newModel]
      };
    }

    return { ...div, subCategories: subCats };
  });

  saveProductDivisions(updated);
  return newModel;
};

export const updateModelInDivision = (
  divisionId: string,
  modelId: string,
  updates: Partial<ProductNavModel>
): void => {
  const current = loadProductDivisions();
  const updated = current.map((div) => {
    if (div.id !== divisionId) return div;
    const updatedSubCats = div.subCategories.map((sub) => ({
      ...sub,
      items: sub.items.map((m) => (m.id === modelId ? { ...m, ...updates } : m))
    }));
    return { ...div, subCategories: updatedSubCats };
  });
  saveProductDivisions(updated);
};

export const deleteModelFromDivision = (divisionId: string, modelId: string): void => {
  const current = loadProductDivisions();
  const updated = current.map((div) => {
    if (div.id !== divisionId) return div;
    const updatedSubCats = div.subCategories.map((sub) => ({
      ...sub,
      items: sub.items.filter((m) => m.id !== modelId)
    }));
    return { ...div, subCategories: updatedSubCats };
  });
  saveProductDivisions(updated);
};

export const resetProductDivisionsToDefault = (): ProductCategoryDivision[] => {
  saveProductDivisions(PRODUCT_DIVISIONS);
  return PRODUCT_DIVISIONS;
};

export const addSubCategoryToDivision = (
  divisionId: string,
  title: string,
  kurdishTitle: string
): void => {
  const current = loadProductDivisions();
  const updated = current.map((div) => {
    if (div.id !== divisionId) return div;
    const newSub = {
      id: `sub-${Date.now()}`,
      title,
      kurdishTitle,
      items: []
    };
    return {
      ...div,
      subCategories: [...div.subCategories, newSub]
    };
  });
  saveProductDivisions(updated);
};

export const deleteSubCategoryFromDivision = (
  divisionId: string,
  subCategoryId: string
): void => {
  const current = loadProductDivisions();
  const updated = current.map((div) => {
    if (div.id !== divisionId) return div;
    return {
      ...div,
      subCategories: div.subCategories.filter((s) => s.id !== subCategoryId)
    };
  });
  saveProductDivisions(updated);
};

export const subscribeToDivisions = (
  callback: (divisions: ProductCategoryDivision[]) => void
): (() => void) => {
  const handleUpdate = () => {
    callback(loadProductDivisions());
  };

  window.addEventListener(DIVISIONS_CHANGE_EVENT, handleUpdate);
  window.addEventListener('storage', handleUpdate);

  return () => {
    window.removeEventListener(DIVISIONS_CHANGE_EVENT, handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
};
