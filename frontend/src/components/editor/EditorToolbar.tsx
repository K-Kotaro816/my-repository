import { useState } from 'react';
import { useEditorStore, type EditorTool } from '../../store/editorStore';
import { useCanvasStore } from '../../store/canvasStore';
import { useProjectStore } from '../../store/projectStore';
import { useHistoryStore } from '../../store/historyStore';
import { useHistory } from '../../hooks/useHistory';
import { exportToPng } from '../../utils/exportCanvas';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';

const tools: { id: EditorTool; label: string; description: string }[] = [
  { id: 'select', label: '選択', description: 'オブジェクト選択・パン' },
  { id: 'wall', label: '壁描画', description: 'クリックで頂点配置、ダブルクリックで確定' },
  { id: 'furniture', label: '家具配置', description: 'カタログから家具を選んで配置' },
  { id: 'pan', label: '移動', description: 'ドラッグでキャンバス移動' },
];

export function EditorToolbar() {
  const { tool, setTool, gridVisible, toggleGrid, scale, isDrawing, cancelWall } = useEditorStore();
  const stageRef = useCanvasStore((s) => s.stageRef);
  const currentProject = useProjectStore((s) => s.currentProject);
  const { canUndo, canRedo } = useHistoryStore();
  const { undo, redo } = useHistory();
  const [showHelp, setShowHelp] = useState(false);

  const handleExport = () => {
    if (!stageRef) return;
    exportToPng(stageRef, currentProject?.name ?? 'layout');
  };

  return (
    <div className="absolute top-4 left-4 bg-gray-800 rounded-lg shadow-lg shadow-black/20 p-2 z-20 flex flex-col gap-1">
      {tools.map((t) => (
        <button
          key={t.id}
          onClick={() => setTool(t.id)}
          title={t.description}
          className={`px-3 py-2 text-sm rounded-md transition-colors ${
            tool === t.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          {t.label}
        </button>
      ))}

      <hr className="my-1 border-gray-700" />

      <button
        onClick={toggleGrid}
        title="グリッド表示切り替え"
        className={`px-3 py-2 text-sm rounded-md transition-colors ${
          gridVisible ? 'bg-gray-600 text-gray-100' : 'text-gray-400 hover:bg-gray-700'
        }`}
      >
        グリッド
      </button>

      {isDrawing && (
        <button
          onClick={cancelWall}
          className="px-3 py-2 text-sm rounded-md text-red-400 hover:bg-red-900/20 transition-colors"
        >
          キャンセル
        </button>
      )}

      <hr className="my-1 border-gray-700" />

      <div className="flex gap-1">
        <button
          onClick={undo}
          disabled={!canUndo}
          title="元に戻す (Ctrl+Z)"
          className="flex-1 px-2 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ↩
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          title="やり直す (Ctrl+Y)"
          className="flex-1 px-2 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ↪
        </button>
      </div>

      <hr className="my-1 border-gray-700" />

      <button
        onClick={handleExport}
        title="PNG画像として出力"
        className="px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
      >
        PNG出力
      </button>

      <hr className="my-1 border-gray-700" />

      <span className="px-3 py-1 text-xs text-gray-500 text-center">
        {Math.round(scale * 100)}%
      </span>

      <button
        onClick={() => setShowHelp(true)}
        title="キーボードショートカット"
        className="px-3 py-2 text-sm rounded-md text-gray-500 hover:bg-gray-700 hover:text-gray-300 transition-colors"
      >
        ?
      </button>

      {showHelp && <KeyboardShortcutsHelp onClose={() => setShowHelp(false)} />}
    </div>
  );
}
