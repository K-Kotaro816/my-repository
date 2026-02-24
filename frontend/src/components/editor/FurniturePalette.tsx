import { useEditorStore } from '../../store/editorStore';
import { useFurnitureStore } from '../../store/furnitureStore';
import { FURNITURE_CATALOG, FURNITURE_CATEGORIES } from '../../constants/furnitureCatalog';

export function FurniturePalette() {
  const { tool } = useEditorStore();
  const { placingType, setPlacingType } = useFurnitureStore();

  if (tool !== 'furniture') return null;

  return (
    <div className="absolute top-0 right-0 h-full w-64 bg-gray-800 shadow-lg shadow-black/20 z-20 overflow-y-auto p-4">
      <h2 className="text-sm font-bold text-gray-100 mb-3">家具カタログ</h2>
      {FURNITURE_CATEGORIES.map((category) => {
        const items = FURNITURE_CATALOG.filter((item) => item.category === category.id);
        if (items.length === 0) return null;
        return (
          <div key={category.id} className="mb-4">
            <h3 className="text-xs font-semibold text-gray-400 mb-2">{category.name}</h3>
            <div className="grid grid-cols-2 gap-2">
              {items.map((item) => (
                <button
                  key={item.type}
                  onClick={() => setPlacingType(placingType === item.type ? null : item.type)}
                  className={`p-2 text-xs border rounded-md hover:bg-blue-900/20 transition-colors text-left ${
                    placingType === item.type ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700'
                  }`}
                >
                  <div
                    className="w-full h-6 rounded mb-1"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="block font-medium text-gray-300 truncate">{item.name}</span>
                  <span className="text-gray-500">
                    {item.defaultWidthMm / 10}x{item.defaultHeightMm / 10}cm
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
      <p className="text-xs text-gray-500 mt-2">家具を選択してキャンバスをクリックで配置</p>
    </div>
  );
}
