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
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-5 w-80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-gray-900">キーボードショートカット</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">
            &times;
          </button>
        </div>
        <table className="w-full text-xs">
          <tbody>
            {shortcuts.map((s) => (
              <tr key={s.key} className="border-b border-gray-100 last:border-0">
                <td className="py-2 pr-3">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-700 font-mono">
                    {s.key}
                  </kbd>
                </td>
                <td className="py-2 text-gray-600">{s.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
