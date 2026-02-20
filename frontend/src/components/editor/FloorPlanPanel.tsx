import { useRef, useState } from 'react';
import * as projectApi from '../../api/project';
import { useProjectStore } from '../../store/projectStore';
import { useEditorStore } from '../../store/editorStore';

export function FloorPlanPanel() {
  const { currentProject, setCurrentProject } = useProjectStore();
  const { tool } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!currentProject || tool === 'furniture') return null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const updated = await projectApi.uploadFloorPlan(currentProject.id, file);
      setCurrentProject(updated);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    try {
      const updated = await projectApi.deleteFloorPlan(currentProject.id);
      setCurrentProject(updated);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleModeToggle = async (mode: 'draw' | 'image') => {
    try {
      const updated = await projectApi.updateProject(currentProject.id, { floorPlanMode: mode });
      setCurrentProject(updated);
    } catch (error) {
      console.error('Mode change failed:', error);
    }
  };

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-20 w-56">
      <h3 className="text-sm font-bold text-gray-900 mb-2">間取り図</h3>

      <div className="flex gap-1 mb-3">
        <button
          onClick={() => handleModeToggle('draw')}
          className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${
            currentProject.floorPlanMode === 'draw'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          壁描画
        </button>
        <button
          onClick={() => handleModeToggle('image')}
          disabled={!currentProject.floorPlanImagePath}
          className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${
            currentProject.floorPlanMode === 'image'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          画像
        </button>
      </div>

      {currentProject.floorPlanImagePath ? (
        <div>
          <p className="text-xs text-green-600 mb-2">画像アップロード済み</p>
          <button
            onClick={handleRemove}
            className="w-full py-1.5 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
          >
            画像を削除
          </button>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full py-2 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors border border-dashed border-gray-300 disabled:opacity-50"
          >
            {isUploading ? 'アップロード中...' : '間取り画像をアップロード'}
          </button>
          <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP (最大10MB)</p>
        </div>
      )}
    </div>
  );
}
