import { Group, Rect, Text, Line } from 'react-konva';
import type Konva from 'konva';
import { useEditorStore } from '../../store/editorStore';
import { useFurnitureStore } from '../../store/furnitureStore';
import { FURNITURE_CATALOG } from '../../constants/furnitureCatalog';
import { PIXELS_PER_MM } from './RoomCanvas';
import type { FurnitureItem } from '../../types/project';

interface FurnitureLayerProps {
  roomWidthMm: number;
  roomHeightMm: number;
}

export function FurnitureLayer({ roomWidthMm, roomHeightMm }: FurnitureLayerProps) {
  const { tool, scale } = useEditorStore();
  const { furniture, selectedId, placingType, addFurniture, updateFurniture, selectFurniture } =
    useFurnitureStore();

  const isDraggable = tool === 'select' || tool === 'furniture';
  const roomWidthPx = roomWidthMm * PIXELS_PER_MM;
  const roomHeightPx = roomHeightMm * PIXELS_PER_MM;

  const handleCanvasClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (tool !== 'furniture' || !placingType) {
      selectFurniture(null);
      return;
    }

    const stage = e.target.getStage();
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const pos = stage.getAbsoluteTransform().copy().invert().point(pointer);

    const catalogItem = FURNITURE_CATALOG.find((c) => c.type === placingType);
    if (!catalogItem) return;

    const xMm = pos.x / PIXELS_PER_MM;
    const yMm = pos.y / PIXELS_PER_MM;

    const newItem: FurnitureItem = {
      id: crypto.randomUUID(),
      type: catalogItem.type,
      name: catalogItem.name,
      x: Math.max(0, Math.min(roomWidthMm, xMm)),
      y: Math.max(0, Math.min(roomHeightMm, yMm)),
      widthMm: catalogItem.defaultWidthMm,
      heightMm: catalogItem.defaultHeightMm,
      rotation: 0,
      color: catalogItem.color,
    };

    addFurniture(newItem);
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, item: FurnitureItem) => {
    const xMm = e.target.x() / PIXELS_PER_MM;
    const yMm = e.target.y() / PIXELS_PER_MM;
    updateFurniture(item.id, {
      x: Math.max(0, Math.min(roomWidthMm, xMm)),
      y: Math.max(0, Math.min(roomHeightMm, yMm)),
    });
  };

  const handleItemClick = (e: Konva.KonvaEventObject<MouseEvent>, id: string) => {
    e.cancelBubble = true;
    selectFurniture(id);
  };

  return (
    <>
      {/* クリック検出用の透明エリア */}
      <Line
        points={[0, 0, roomWidthPx, 0, roomWidthPx, roomHeightPx, 0, roomHeightPx]}
        closed
        fill="transparent"
        onClick={handleCanvasClick}
      />

      {/* 配置済みの家具 */}
      {furniture.map((item) => {
        const widthPx = item.widthMm * PIXELS_PER_MM;
        const heightPx = item.heightMm * PIXELS_PER_MM;
        const isSelected = selectedId === item.id;

        return (
          <Group
            key={item.id}
            x={item.x * PIXELS_PER_MM}
            y={item.y * PIXELS_PER_MM}
            rotation={item.rotation}
            offsetX={widthPx / 2}
            offsetY={heightPx / 2}
            draggable={isDraggable}
            onClick={(e) => handleItemClick(e, item.id)}
            onDragEnd={(e) => handleDragEnd(e, item)}
            dragBoundFunc={(pos) => {
              const xMm = pos.x / PIXELS_PER_MM;
              const yMm = pos.y / PIXELS_PER_MM;
              const clampedX = Math.max(0, Math.min(roomWidthMm, xMm));
              const clampedY = Math.max(0, Math.min(roomHeightMm, yMm));
              return {
                x: clampedX * PIXELS_PER_MM,
                y: clampedY * PIXELS_PER_MM,
              };
            }}
          >
            <Rect
              width={widthPx}
              height={heightPx}
              fill={item.color}
              stroke={isSelected ? '#2563eb' : '#64748b'}
              strokeWidth={isSelected ? 2 / scale : 1 / scale}
              cornerRadius={2}
              opacity={0.85}
            />
            <Text
              text={item.name}
              width={widthPx}
              height={heightPx}
              align="center"
              verticalAlign="middle"
              fontSize={Math.max(8, 12 / scale)}
              fill="#1f2937"
              listening={false}
            />
          </Group>
        );
      })}
    </>
  );
}
