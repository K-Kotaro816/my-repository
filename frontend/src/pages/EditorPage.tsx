import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layer } from 'react-konva';
import { useProjectStore } from '../store/projectStore';
import { useEditorStore } from '../store/editorStore';
import { RoomCanvas } from '../components/editor/RoomCanvas';
import { GridLayer } from '../components/editor/GridLayer';
import { WallDrawingLayer } from '../components/editor/WallDrawingLayer';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { FurnitureLayer } from '../components/editor/FurnitureLayer';
import { FurniturePalette } from '../components/editor/FurniturePalette';
import { FurniturePropertiesPanel } from '../components/editor/FurniturePropertiesPanel';
import { useFurnitureStore } from '../store/furnitureStore';
import { useAutoSave } from '../hooks/useAutoSave';

export function EditorPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { currentProject, isLoading, error, fetchProject, setCurrentProject } = useProjectStore();
  const { setWalls, reset } = useEditorStore();
  const { setFurniture, reset: resetFurniture } = useFurnitureStore();

  useAutoSave(projectId);

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
    return () => {
      setCurrentProject(null);
      reset();
      resetFurniture();
    };
  }, [projectId, fetchProject, setCurrentProject, reset, resetFurniture]);

  useEffect(() => {
    if (currentProject?.wallData) {
      setWalls(currentProject.wallData);
    }
    if (currentProject?.furnitureData) {
      setFurniture(currentProject.furnitureData);
    }
  }, [currentProject, setWalls, setFurniture]);

  if (isLoading && !currentProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700"
          >
            ダッシュボードに戻る
          </button>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="bg-white shadow-sm px-4 py-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← 戻る
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{currentProject.name}</h1>
          <span className="text-sm text-gray-400">
            {currentProject.roomWidthMm / 10} x {currentProject.roomHeightMm / 10} cm
          </span>
        </div>
      </header>
      <div className="flex-1 relative">
        <EditorToolbar />
        <FurniturePalette />
        <FurniturePropertiesPanel />
        <RoomCanvas
          roomWidthMm={currentProject.roomWidthMm}
          roomHeightMm={currentProject.roomHeightMm}
        >
          <Layer>
            <GridLayer
              roomWidthMm={currentProject.roomWidthMm}
              roomHeightMm={currentProject.roomHeightMm}
            />
          </Layer>
          <Layer>
            <WallDrawingLayer
              roomWidthMm={currentProject.roomWidthMm}
              roomHeightMm={currentProject.roomHeightMm}
            />
          </Layer>
          <Layer>
            <FurnitureLayer
              roomWidthMm={currentProject.roomWidthMm}
              roomHeightMm={currentProject.roomHeightMm}
            />
          </Layer>
        </RoomCanvas>
      </div>
    </div>
  );
}
