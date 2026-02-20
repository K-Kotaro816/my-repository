import { Line, Circle } from 'react-konva';
import type Konva from 'konva';
import { useEditorStore } from '../../store/editorStore';
import { PIXELS_PER_MM } from './RoomCanvas';

interface WallDrawingLayerProps {
  roomWidthMm: number;
  roomHeightMm: number;
}

export function WallDrawingLayer({ roomWidthMm, roomHeightMm }: WallDrawingLayerProps) {
  const { tool, walls, currentWallPoints, isDrawing, addWallPoint, finishWall, scale } =
    useEditorStore();

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (tool !== 'wall') return;

    const stage = e.target.getStage();
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const pos = stage.getAbsoluteTransform().copy().invert().point(pointer);

    // 部屋の範囲内に制限
    const roomWidthPx = roomWidthMm * PIXELS_PER_MM;
    const roomHeightPx = roomHeightMm * PIXELS_PER_MM;
    const x = Math.max(0, Math.min(roomWidthPx, pos.x));
    const y = Math.max(0, Math.min(roomHeightPx, pos.y));

    addWallPoint(x, y);
  };

  const handleDblClick = () => {
    if (tool !== 'wall' || !isDrawing) return;
    finishWall();
  };

  const vertexRadius = 4 / scale;

  return (
    <>
      {/* クリック検出用の透明レクト */}
      <Line
        points={[
          0,
          0,
          roomWidthMm * PIXELS_PER_MM,
          0,
          roomWidthMm * PIXELS_PER_MM,
          roomHeightMm * PIXELS_PER_MM,
          0,
          roomHeightMm * PIXELS_PER_MM,
        ]}
        closed
        fill="transparent"
        onClick={handleStageClick}
        onDblClick={handleDblClick}
      />

      {/* 確定済みの壁 */}
      {walls.map((wall, i) => (
        <Line
          key={`wall-${i}`}
          points={wall.points}
          closed={wall.closed}
          stroke="#1e293b"
          strokeWidth={3 / scale}
          fill="rgba(148, 163, 184, 0.2)"
          listening={false}
        />
      ))}

      {/* 描画中の壁 */}
      {isDrawing && currentWallPoints.length >= 2 && (
        <>
          <Line
            points={currentWallPoints}
            stroke="#3b82f6"
            strokeWidth={2 / scale}
            dash={[6 / scale, 3 / scale]}
            listening={false}
          />
          {/* 頂点マーカー */}
          {Array.from({ length: currentWallPoints.length / 2 }, (_, i) => (
            <Circle
              key={`point-${i}`}
              x={currentWallPoints[i * 2]}
              y={currentWallPoints[i * 2 + 1]}
              radius={vertexRadius}
              fill="#3b82f6"
              listening={false}
            />
          ))}
        </>
      )}
    </>
  );
}
