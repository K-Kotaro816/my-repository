export interface FurnitureCatalogItem {
  type: string;
  name: string;
  category: string;
  defaultWidthMm: number;
  defaultHeightMm: number;
  color: string;
}

export const FURNITURE_CATEGORIES = [
  { id: 'bed', name: 'ベッド・寝具' },
  { id: 'seating', name: 'ソファ・椅子' },
  { id: 'table', name: 'テーブル・デスク' },
  { id: 'storage', name: '収納' },
  { id: 'appliance', name: '家電' },
] as const;

export const FURNITURE_CATALOG: FurnitureCatalogItem[] = [
  // ベッド・寝具
  {
    type: 'bed_single',
    name: 'シングルベッド',
    category: 'bed',
    defaultWidthMm: 970,
    defaultHeightMm: 1950,
    color: '#93c5fd',
  },
  {
    type: 'bed_semi_double',
    name: 'セミダブルベッド',
    category: 'bed',
    defaultWidthMm: 1200,
    defaultHeightMm: 1950,
    color: '#93c5fd',
  },
  {
    type: 'bed_double',
    name: 'ダブルベッド',
    category: 'bed',
    defaultWidthMm: 1400,
    defaultHeightMm: 1950,
    color: '#93c5fd',
  },
  {
    type: 'futon',
    name: '布団',
    category: 'bed',
    defaultWidthMm: 1000,
    defaultHeightMm: 2100,
    color: '#bfdbfe',
  },

  // ソファ・椅子
  {
    type: 'sofa_2seat',
    name: '2人掛けソファ',
    category: 'seating',
    defaultWidthMm: 1500,
    defaultHeightMm: 800,
    color: '#fca5a5',
  },
  {
    type: 'sofa_3seat',
    name: '3人掛けソファ',
    category: 'seating',
    defaultWidthMm: 2000,
    defaultHeightMm: 800,
    color: '#fca5a5',
  },
  {
    type: 'chair',
    name: '椅子',
    category: 'seating',
    defaultWidthMm: 450,
    defaultHeightMm: 450,
    color: '#fdba74',
  },

  // テーブル・デスク
  {
    type: 'dining_table_4',
    name: 'ダイニングテーブル(4人)',
    category: 'table',
    defaultWidthMm: 1350,
    defaultHeightMm: 800,
    color: '#d4a574',
  },
  {
    type: 'dining_table_6',
    name: 'ダイニングテーブル(6人)',
    category: 'table',
    defaultWidthMm: 1800,
    defaultHeightMm: 900,
    color: '#d4a574',
  },
  {
    type: 'desk',
    name: 'デスク',
    category: 'table',
    defaultWidthMm: 1200,
    defaultHeightMm: 600,
    color: '#d4a574',
  },
  {
    type: 'coffee_table',
    name: 'ローテーブル',
    category: 'table',
    defaultWidthMm: 1000,
    defaultHeightMm: 500,
    color: '#d4a574',
  },
  {
    type: 'kotatsu',
    name: 'こたつ',
    category: 'table',
    defaultWidthMm: 750,
    defaultHeightMm: 750,
    color: '#d4a574',
  },

  // 収納
  {
    type: 'wardrobe',
    name: 'ワードローブ',
    category: 'storage',
    defaultWidthMm: 1200,
    defaultHeightMm: 600,
    color: '#a3a3a3',
  },
  {
    type: 'bookshelf',
    name: '本棚',
    category: 'storage',
    defaultWidthMm: 900,
    defaultHeightMm: 300,
    color: '#a3a3a3',
  },
  {
    type: 'chest',
    name: 'チェスト',
    category: 'storage',
    defaultWidthMm: 800,
    defaultHeightMm: 450,
    color: '#a3a3a3',
  },
  {
    type: 'tv_stand',
    name: 'テレビ台',
    category: 'storage',
    defaultWidthMm: 1500,
    defaultHeightMm: 400,
    color: '#a3a3a3',
  },

  // 家電
  {
    type: 'tv',
    name: 'テレビ',
    category: 'appliance',
    defaultWidthMm: 1100,
    defaultHeightMm: 50,
    color: '#1f2937',
  },
  {
    type: 'refrigerator',
    name: '冷蔵庫',
    category: 'appliance',
    defaultWidthMm: 600,
    defaultHeightMm: 700,
    color: '#e5e7eb',
  },
  {
    type: 'washing_machine',
    name: '洗濯機',
    category: 'appliance',
    defaultWidthMm: 600,
    defaultHeightMm: 600,
    color: '#e5e7eb',
  },
];
