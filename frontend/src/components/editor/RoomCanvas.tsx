import { useRef, useCallback } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import type Konva from 'konva';
import { useEditorStore } from '../../store/editorStore';

const PIXELS_PER_MM = 0.5;

interface RoomCanvasProps {
  roomWidthMm: number;
  roomHeightMm: number;
  children?: React.ReactNode;
}

export function RoomCanvas({ roomWidthMm, roomHeightMm, children }: RoomCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const { scale, position, setScale, setPosition, tool } = useEditorStore();

  const roomWidthPx = roomWidthMm * PIXELS_PER_MM;
  const roomHeightPx = roomHeightMm * PIXELS_PER_MM;

  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const stage = stageRef.current;
      if (!stage) return;

      const oldScale = scale;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const scaleBy = 1.1;
      const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

      const mousePointTo = {
        x: (pointer.x - position.x) / oldScale,
        y: (pointer.y - position.y) / oldScale,
      };

      setScale(newScale);
      setPosition({
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      });
    },
    [scale, position, setScale, setPosition],
  );

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      setPosition({ x: e.target.x(), y: e.target.y() });
    },
    [setPosition],
  );

  const isDraggable = tool === 'pan' || tool === 'select';

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight - 120}
      scaleX={scale}
      scaleY={scale}
      x={position.x}
      y={position.y}
      draggable={isDraggable}
      onWheel={handleWheel}
      onDragEnd={handleDragEnd}
      className="bg-gray-100"
    >
      <Layer>
        <Rect
          x={0}
          y={0}
          width={roomWidthPx}
          height={roomHeightPx}
          fill="#ffffff"
          stroke="#94a3b8"
          strokeWidth={2}
        />
      </Layer>
      {children}
    </Stage>
  );
}

export { PIXELS_PER_MM };
