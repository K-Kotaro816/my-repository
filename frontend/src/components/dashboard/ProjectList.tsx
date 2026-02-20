import type { Project } from '../../types/project';
import { ProjectCard } from './ProjectCard';

interface ProjectListProps {
  projects: Project[];
  onDelete: (id: string) => void;
}

export function ProjectList({ projects, onDelete }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">プロジェクトはまだありません</p>
        <p className="text-gray-400 text-sm mt-2">「新規プロジェクト」ボタンから作成してください</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onDelete={onDelete} />
      ))}
    </div>
  );
}
