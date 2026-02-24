import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types/project';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const widthCm = project.roomWidthMm / 10;
  const heightCm = project.roomHeightMm / 10;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg shadow-black/20 border border-gray-700 p-4 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-100 truncate">{project.name}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project.id);
          }}
          className="text-gray-500 hover:text-red-400 text-sm"
        >
          削除
        </button>
      </div>
      <p className="text-sm text-gray-400 mb-3">
        {widthCm} x {heightCm} cm
      </p>
      <p className="text-xs text-gray-500 mb-4">更新: {formatDate(project.updatedAt)}</p>
      <button
        onClick={() => navigate(`/editor/${project.id}`)}
        className="w-full py-2 px-4 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
      >
        編集する
      </button>
    </div>
  );
}
