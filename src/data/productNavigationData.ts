export interface ProductNavModel {
  id: string;
  productId?: string;
  name: string;
  kurdishName: string;
  arabicName?: string;
  modelCode: string;
  badge?: string;
  badgeColor?: string;
  description: string;
  categoryTarget: string;
  image?: string;
}

export interface ProductNavSubCategory {
  id: string;
  title: string;
  kurdishTitle: string;
  arabicTitle?: string;
  items: ProductNavModel[];
}

export interface ProductCategoryDivision {
  id: string;
  key: 'windows' | 'doors' | 'glass' | 'railings' | 'accessories';
  title: string;
  kurdishTitle: string;
  arabicTitle?: string;
  divisionLabel: string;
  kurdishDivisionLabel: string;
  arabicDivisionLabel?: string;
  iconName: string;
  featuredImage: string;
  featuredTitle: string;
  featuredSubtitle: string;
  categoryTarget: string;
  subCategories: ProductNavSubCategory[];
}

export const PRODUCT_DIVISIONS: ProductCategoryDivision[] = [
  {
    id: 'division-windows',
    key: 'windows',
    title: 'Windows Systems',
    kurdishTitle: 'پەنجەرەکان',
    arabicTitle: 'أنظمة النوافذ',
    divisionLabel: 'Windows Division',
    kurdishDivisionLabel: 'بەشی پەنجەرە',
    arabicDivisionLabel: 'قسم النوافذ',
    iconName: 'LayoutGrid',
    featuredImage: './assets/doorhome/03-2.jpg',
    featuredTitle: 'أنظمة النوافذ المعمارية',
    featuredSubtitle: 'عزل حراري وصوتي فائق مع إطلالات بانورامية واسعة',
    categoryTarget: 'windows',
    subCategories: []
  },
  {
    id: 'division-doors',
    key: 'doors',
    title: 'Door Systems',
    kurdishTitle: 'دەرگاکان',
    arabicTitle: 'أنظمة الأبواب',
    divisionLabel: 'Doors Division',
    kurdishDivisionLabel: 'بەشی دەرگا',
    arabicDivisionLabel: 'قسم الأبواب',
    iconName: 'Home',
    featuredImage: './assets/doorhome/02.jpg',
    featuredTitle: 'أنظمة الأبواب والمداخل',
    featuredSubtitle: 'أبواب وبوابات عصرية تجمع بين الفخامة والصلابة والأمان',
    categoryTarget: 'doors',
    subCategories: []
  },
  {
    id: 'division-glass',
    key: 'glass',
    title: 'Glass & Facades',
    kurdishTitle: 'شووشە و ڕوکارەکان',
    arabicTitle: 'الزجاج والواجهات',
    divisionLabel: 'Glass Division',
    kurdishDivisionLabel: 'بەشی شووشە و ڕوکار',
    arabicDivisionLabel: 'قسم الزجاج والواجهات',
    iconName: 'Building',
    featuredImage: './assets/doorhome/01.jpg',
    featuredTitle: 'الواجهات والأسقف الزجاجية',
    featuredSubtitle: 'واجهات كورتن وول إنشائية وأسقف زجاجية بانورامية',
    categoryTarget: 'glass',
    subCategories: []
  },
  {
    id: 'division-railings',
    key: 'railings',
    title: 'Railings & Balustrades',
    kurdishTitle: 'مەحاجەرە و دەستەچینەکان',
    arabicTitle: 'الدرابزينات والحواجز',
    divisionLabel: 'Railings Division',
    kurdishDivisionLabel: 'بەشی مەحاجەرە',
    arabicDivisionLabel: 'قسم الدرابزينات',
    iconName: 'Shield',
    featuredImage: '/uploads/503a52b8-eba7-47a9-bc40-4829d9a4ba81.jpg',
    featuredTitle: 'حواجز السلالم والشرفات الزجاجية',
    featuredSubtitle: 'أنظمة درابزينات زجاجية بدون إطار تجمع بين الأمان والأناقة',
    categoryTarget: 'railings',
    subCategories: []
  },
  {
    id: 'division-accessories',
    key: 'accessories',
    title: 'Hardware & Accessories',
    kurdishTitle: 'ئاسن و ئێکسسوارات',
    arabicTitle: 'الحديد والإكسسوارات',
    divisionLabel: 'Hardware Division',
    kurdishDivisionLabel: 'بەشی ئێکسسوارات',
    arabicDivisionLabel: 'قسم الحديد والإكسسوارات',
    iconName: 'Layers',
    featuredImage: './assets/doorhome/10.png',
    featuredTitle: 'الإكسسوارات والمقابض المعمارية',
    featuredSubtitle: 'أقفال ومقابض ومفصلات ستانلس ستيل عالية المتانة',
    categoryTarget: 'accessories',
    subCategories: []
  }
];
