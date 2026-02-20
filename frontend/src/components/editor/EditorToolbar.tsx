import { useEditorStore, type EditorTool } from '../../store/editorStore';

const tools: { id: EditorTool; label: string; description: string }[] = [
  { id: 'select', label: '選択', description: 'オブジェクト選択・パン' },
  { id: 'wall', label: '壁描画', description: 'クリックで頂点配置、ダブルクリックで確定' },
  { id: 'pan', label: '移動', description: 'ドラッグでキャンバス移動' },
];

export function EditorToolbar() {
  const { tool, setTool, gridVisible, toggleGrid, scale, isDrawing, cancelWall } = useEditorStore();

  return (
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 z-20 flex flex-col gap-1">
      {tools.map((t) => (
        <button
          key={t.id}
          onClick={() => setTool(t.id)}
          title={t.description}
          className={`px-3 py-2 text-sm rounded-md transition-colors ${
            tool === t.id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {t.label}
        </button>
      ))}

      <hr className="my-1 border-gray-200" />

      <button
        onClick={toggleGrid}
        title="グリッド表示切り替え"
        className={`px-3 py-2 text-sm rounded-md transition-colors ${
          gridVisible ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-100'
        }`}
      >
        グリッド
      </button>

      {isDrawing && (
        <button
          onClick={cancelWall}
          className="px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50 transition-colors"
        >
          キャンセル
        </button>
      )}

      <hr className="my-1 border-gray-200" />

      <span className="px-3 py-1 text-xs text-gray-400 text-center">
        {Math.round(scale * 100)}%
      </span>
    </div>
  );
}
