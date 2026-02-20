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

export interface FurnitureItem {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  widthMm: number;
  heightMm: number;
  rotation: number;
  color: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  roomWidthMm: number;
  roomHeightMm: number;
  wallData: WallSegment[] | null;
  furnitureData: FurnitureItem[] | null;
  floorPlanImagePath: string | null;
  floorPlanMode: 'draw' | 'image';
  canvasState: CanvasState | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  roomWidthMm: number;
  roomHeightMm: number;
}

export interface UpdateProjectInput {
  name?: string;
  roomWidthMm?: number;
  roomHeightMm?: number;
  wallData?: WallSegment[];
  furnitureData?: FurnitureItem[];
  canvasState?: CanvasState;
  floorPlanMode?: 'draw' | 'image';
}
