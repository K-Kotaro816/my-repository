import { create } from 'zustand';
import type { WallSegment } from '../types/project';

export type EditorTool = 'select' | 'wall' | 'pan' | 'furniture';

interface EditorState {
  tool: EditorTool;
  walls: WallSegment[];
  currentWallPoints: number[];
  isDrawing: boolean;
  scale: number;
  position: { x: number; y: number };
  gridVisible: boolean;
  setTool: (tool: EditorTool) => void;
  addWallPoint: (x: number, y: number) => void;
  finishWall: () => void;
  cancelWall: () => void;
  setScale: (scale: number) => void;
  setPosition: (pos: { x: number; y: number }) => void;
  setWalls: (walls: WallSegment[]) => void;
  toggleGrid: () => void;
  reset: () => void;
}

const MIN_SCALE = 0.1;
const MAX_SCALE = 5.0;

export const useEditorStore = create<EditorState>((set) => ({
  tool: 'select',
  walls: [],
  currentWallPoints: [],
  isDrawing: false,
  scale: 1,
  position: { x: 0, y: 0 },
  gridVisible: true,

  setTool: (tool) =>
    set((state) => {
      if (state.isDrawing) {
        return { tool, currentWallPoints: [], isDrawing: false };
      }
      return { tool };
    }),

  addWallPoint: (x, y) =>
    set((state) => ({
      currentWallPoints: [...state.currentWallPoints, x, y],
      isDrawing: true,
    })),

  finishWall: () =>
    set((state) => {
      if (state.currentWallPoints.length < 4) {
        return { currentWallPoints: [], isDrawing: false };
      }
      const newWall: WallSegment = {
        points: state.currentWallPoints,
        closed: true,
      };
      return {
        walls: [...state.walls, newWall],
        currentWallPoints: [],
        isDrawing: false,
      };
    }),

  cancelWall: () => set({ currentWallPoints: [], isDrawing: false }),

  setScale: (scale) => set({ scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale)) }),

  setPosition: (position) => set({ position }),

  setWalls: (walls) => set({ walls }),

  toggleGrid: () => set((state) => ({ gridVisible: !state.gridVisible })),

  reset: () =>
    set({
      tool: 'select',
      walls: [],
      currentWallPoints: [],
      isDrawing: false,
      scale: 1,
      position: { x: 0, y: 0 },
      gridVisible: true,
    }),
}));
