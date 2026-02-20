import client from './client';
import type { Project, CreateProjectInput, UpdateProjectInput } from '../types/project';

export async function listProjects(): Promise<Project[]> {
  const response = await client.get<Project[]>('/projects');
  return response.data;
}

export async function getProject(id: string): Promise<Project> {
  const response = await client.get<Project>(`/projects/${id}`);
  return response.data;
}

export async function createProject(data: CreateProjectInput): Promise<Project> {
  const response = await client.post<Project>('/projects', data);
  return response.data;
}

export async function updateProject(id: string, data: UpdateProjectInput): Promise<Project> {
  const response = await client.put<Project>(`/projects/${id}`, data);
  return response.data;
}

export async function deleteProject(id: string): Promise<void> {
  await client.delete(`/projects/${id}`);
}
