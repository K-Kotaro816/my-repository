import { useFurnitureStore } from '../../store/furnitureStore';

export function FurniturePropertiesPanel() {
  const { furniture, selectedId, collidingIds, rotateFurniture, removeFurniture, selectFurniture } =
    useFurnitureStore();

  const selectedItem = furniture.find((f) => f.id === selectedId);
  if (!selectedItem) return null;

  const isColliding = collidingIds.has(selectedItem.id);

  return (
    <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-20 w-60">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-bold text-gray-900">{selectedItem.name}</h3>
        <button
          onClick={() => selectFurniture(null)}
          className="text-gray-400 hover:text-gray-600 text-xs"
        >
          &times;
        </button>
      </div>
      {isColliding && (
        <div className="bg-red-50 border border-red-200 rounded-md px-2 py-1 mb-2">
          <p className="text-xs text-red-600">&#9888; 他の家具と重なっています</p>
        </div>
      )}
      <div className="text-xs text-gray-600 space-y-1 mb-3">
        <p>
          位置: X={Math.round(selectedItem.x / 10)}cm, Y={Math.round(selectedItem.y / 10)}cm
        </p>
        <p>
          サイズ: {selectedItem.widthMm / 10} x {selectedItem.heightMm / 10} cm
        </p>
        <p>角度: {selectedItem.rotation}°</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => rotateFurniture(selectedItem.id)}
          className="flex-1 py-1.5 px-3 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          90°回転
        </button>
        <button
          onClick={() => removeFurniture(selectedItem.id)}
          className="flex-1 py-1.5 px-3 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
        >
          削除
        </button>
      </div>
    </div>
  );
}
