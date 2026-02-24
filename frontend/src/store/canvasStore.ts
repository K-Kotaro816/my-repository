import { create } from 'zustand';
import type Konva from 'konva';

interface CanvasState {
  stageRef: Konva.Stage | null;
  setStageRef: (ref: Konva.Stage | null) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  stageRef: null,
  setStageRef: (stageRef) => set({ stageRef }),
}));
