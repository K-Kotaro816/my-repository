interface KeyboardShortcutsHelpProps {
  onClose: () => void;
}

const shortcuts = [
  { key: 'Ctrl + Z', description: '元に戻す (Undo)' },
  { key: 'Ctrl + Y', description: 'やり直す (Redo)' },
  { key: 'Ctrl + S', description: '手動保存' },
  { key: 'Delete', description: '選択した家具を削除' },
  { key: 'R', description: '選択した家具を90°回転' },
  { key: 'Escape', description: '選択解除 / 壁描画キャンセル' },
  { key: '矢印キー', description: '選択した家具を10mmずつ移動' },
];

export function KeyboardShortcutsHelp({ onClose }: KeyboardShortcutsHelpProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl shadow-black/30 p-5 w-80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-gray-100">キーボードショートカット</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-lg">
            &times;
          </button>
        </div>
        <table className="w-full text-xs">
          <tbody>
            {shortcuts.map((s) => (
              <tr key={s.key} className="border-b border-gray-700 last:border-0">
                <td className="py-2 pr-3">
                  <kbd className="px-1.5 py-0.5 bg-gray-700 border border-gray-600 rounded text-gray-300 font-mono">
                    {s.key}
                  </kbd>
                </td>
                <td className="py-2 text-gray-400">{s.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
