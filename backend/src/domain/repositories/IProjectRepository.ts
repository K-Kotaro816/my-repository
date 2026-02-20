import { Project } from '../entities/Project';

export interface CreateProjectData {
  userId: string;
  name: string;
  roomWidthMm: number;
  roomHeightMm: number;
}

export interface UpdateProjectData {
  name?: string;
  roomWidthMm?: number;
  roomHeightMm?: number;
  wallData?: unknown;
  canvasState?: unknown;
  floorPlanMode?: string;
  floorPlanImagePath?: string;
}

export interface IProjectRepository {
  findById(id: string): Promise<Project | null>;
  findByUserId(userId: string): Promise<Project[]>;
  create(data: CreateProjectData): Promise<Project>;
  update(id: string, data: UpdateProjectData): Promise<Project>;
  delete(id: string): Promise<void>;
}
