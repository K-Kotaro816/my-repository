import { create } from 'zustand';
import type { FurnitureItem } from '../types/project';

interface FurnitureState {
  furniture: FurnitureItem[];
  selectedId: string | null;
  placingType: string | null;
  isDirty: boolean;
  setFurniture: (items: FurnitureItem[]) => void;
  addFurniture: (item: FurnitureItem) => void;
  updateFurniture: (id: string, updates: Partial<FurnitureItem>) => void;
  removeFurniture: (id: string) => void;
  selectFurniture: (id: string | null) => void;
  setPlacingType: (type: string | null) => void;
  rotateFurniture: (id: string) => void;
  setDirty: (dirty: boolean) => void;
  reset: () => void;
}

export const useFurnitureStore = create<FurnitureState>((set) => ({
  furniture: [],
  selectedId: null,
  placingType: null,
  isDirty: false,

  setFurniture: (furniture) => set({ furniture }),

  addFurniture: (item) =>
    set((state) => ({
      furniture: [...state.furniture, item],
      selectedId: item.id,
      placingType: null,
      isDirty: true,
    })),

  updateFurniture: (id, updates) =>
    set((state) => ({
      furniture: state.furniture.map((f) => (f.id === id ? { ...f, ...updates } : f)),
      isDirty: true,
    })),

  removeFurniture: (id) =>
    set((state) => ({
      furniture: state.furniture.filter((f) => f.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
      isDirty: true,
    })),

  selectFurniture: (id) => set({ selectedId: id }),

  setPlacingType: (placingType) => set({ placingType }),

  rotateFurniture: (id) =>
    set((state) => ({
      furniture: state.furniture.map((f) =>
        f.id === id ? { ...f, rotation: (f.rotation + 90) % 360 } : f,
      ),
      isDirty: true,
    })),

  setDirty: (isDirty) => set({ isDirty }),

  reset: () =>
    set({
      furniture: [],
      selectedId: null,
      placingType: null,
      isDirty: false,
    }),
}));
