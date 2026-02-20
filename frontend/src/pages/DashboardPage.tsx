import { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { ProjectList } from '../components/dashboard/ProjectList';
import { CreateProjectDialog } from '../components/dashboard/CreateProjectDialog';
import { useProjectStore } from '../store/projectStore';

export function DashboardPage() {
  const { projects, isLoading, error, fetchProjects, createProject, deleteProject, clearError } =
    useProjectStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = async (name: string, widthMm: number, heightMm: number) => {
    try {
      await createProject({ name, roomWidthMm: widthMm, roomHeightMm: heightMm });
      setIsDialogOpen(false);
    } catch {
      // エラーはストアで管理
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('このプロジェクトを削除しますか？')) {
      await deleteProject(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">プロジェクト一覧</h2>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            新規プロジェクト
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-500 hover:text-red-700 text-sm">
              閉じる
            </button>
          </div>
        )}

        {isLoading && projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">読み込み中...</p>
          </div>
        ) : (
          <ProjectList projects={projects} onDelete={handleDelete} />
        )}
      </main>

      <CreateProjectDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={handleCreate}
        isLoading={isLoading}
      />
    </div>
  );
}
