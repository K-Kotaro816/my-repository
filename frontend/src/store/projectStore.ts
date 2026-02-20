import { create } from 'zustand';
import type { Project, CreateProjectInput } from '../types/project';
import * as projectApi from '../api/project';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  createProject: (data: CreateProjectInput) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await projectApi.listProjects();
      set({ projects, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'プロジェクトの取得に失敗しました';
      set({ error: message, isLoading: false });
    }
  },

  fetchProject: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const project = await projectApi.getProject(id);
      set({ currentProject: project, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'プロジェクトの取得に失敗しました';
      set({ error: message, isLoading: false });
    }
  },

  createProject: async (data: CreateProjectInput) => {
    set({ isLoading: true, error: null });
    try {
      const project = await projectApi.createProject(data);
      set((state) => ({
        projects: [project, ...state.projects],
        isLoading: false,
      }));
      return project;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'プロジェクトの作成に失敗しました';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteProject: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await projectApi.deleteProject(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'プロジェクトの削除に失敗しました';
      set({ error: message, isLoading: false });
    }
  },

  setCurrentProject: (project) => set({ currentProject: project }),
  clearError: () => set({ error: null }),
}));
