export interface WallSegment {
  points: number[];
  closed: boolean;
}

export interface CanvasState {
  scaleX: number;
  scaleY: number;
  x: number;
  y: number;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  roomWidthMm: number;
  roomHeightMm: number;
  wallData: WallSegment[] | null;
  floorPlanImagePath: string | null;
  floorPlanMode: string;
  canvasState: CanvasState | null;
  createdAt: Date;
  updatedAt: Date;
}
