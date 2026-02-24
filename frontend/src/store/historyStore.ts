import { create } from 'zustand';
import type { FurnitureItem, WallSegment } from '../types/project';

export interface HistorySnapshot {
  furniture: FurnitureItem[];
  walls: WallSegment[];
}

interface HistoryState {
  past: HistorySnapshot[];
  future: HistorySnapshot[];
  canUndo: boolean;
  canRedo: boolean;
  pushHistory: (snapshot: HistorySnapshot) => void;
  undo: (currentSnapshot: HistorySnapshot) => HistorySnapshot | null;
  redo: (currentSnapshot: HistorySnapshot) => HistorySnapshot | null;
  clear: () => void;
}

const MAX_HISTORY = 50;

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  pushHistory: (snapshot) =>
    set((state) => {
      const newPast = [...state.past, snapshot];
      if (newPast.length > MAX_HISTORY) {
        newPast.shift();
      }
      return {
        past: newPast,
        future: [],
        canUndo: true,
        canRedo: false,
      };
    }),

  undo: (currentSnapshot) => {
    const { past } = get();
    if (past.length === 0) return null;

    const snapshot = past[past.length - 1];
    set((state) => {
      const newPast = state.past.slice(0, -1);
      return {
        past: newPast,
        future: [...state.future, currentSnapshot],
        canUndo: newPast.length > 0,
        canRedo: true,
      };
    });
    return snapshot;
  },

  redo: (currentSnapshot) => {
    const { future } = get();
    if (future.length === 0) return null;

    const snapshot = future[future.length - 1];
    set((state) => {
      const newFuture = state.future.slice(0, -1);
      return {
        past: [...state.past, currentSnapshot],
        future: newFuture,
        canUndo: true,
        canRedo: newFuture.length > 0,
      };
    });
    return snapshot;
  },

  clear: () =>
    set({
      past: [],
      future: [],
      canUndo: false,
      canRedo: false,
    }),
}));
