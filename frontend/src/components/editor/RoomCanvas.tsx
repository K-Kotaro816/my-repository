import { useRef, useCallback, useEffect } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import type Konva from 'konva';
import { useEditorStore } from '../../store/editorStore';
import { useCanvasStore } from '../../store/canvasStore';

const PIXELS_PER_MM = 0.5;
const MIN_SCALE = 0.1;
const MAX_SCALE = 5.0;

interface RoomCanvasProps {
  roomWidthMm: number;
  roomHeightMm: number;
  children?: React.ReactNode;
}

export function RoomCanvas({ roomWidthMm, roomHeightMm, children }: RoomCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const tool = useEditorStore((s) => s.tool);
  const setScale = useEditorStore((s) => s.setScale);
  const setPosition = useEditorStore((s) => s.setPosition);
  const setStageRef = useCanvasStore((s) => s.setStageRef);

  useEffect(() => {
    setStageRef(stageRef.current);
    return () => setStageRef(null);
  }, [setStageRef]);

  const roomWidthPx = roomWidthMm * PIXELS_PER_MM;
  const roomHeightPx = roomHeightMm * PIXELS_PER_MM;

  // Initialize Stage: center the room on screen
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const { scale } = useEditorStore.getState();
    const stageWidth = stage.width();
    const stageHeight = stage.height();
    const centerX = (stageWidth - roomWidthPx * scale) / 2;
    const centerY = (stageHeight - roomHeightPx * scale) / 2;
    stage.scaleX(scale);
    stage.scaleY(scale);
    stage.x(centerX);
    stage.y(centerY);
    setPosition({ x: centerX, y: centerY });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const stage = stageRef.current;
      if (!stage) return;

      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const scaleBy = 1.1;
      const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
      const clampedScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      const newX = pointer.x - mousePointTo.x * clampedScale;
      const newY = pointer.y - mousePointTo.y * clampedScale;

      stage.scaleX(clampedScale);
      stage.scaleY(clampedScale);
      stage.x(newX);
      stage.y(newY);
      stage.batchDraw();

      setScale(clampedScale);
      setPosition({ x: newX, y: newY });
    },
    [setScale, setPosition],
  );

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      if (e.target !== stageRef.current) return;
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
      draggable={isDraggable}
      onWheel={handleWheel}
      onDragEnd={handleDragEnd}
      className="bg-gray-950"
    >
      <Layer>
        <Rect
          x={0}
          y={0}
          width={roomWidthPx}
          height={roomHeightPx}
          fill="#1e293b"
          stroke="#475569"
          strokeWidth={2}
        />
      </Layer>
      {children}
    </Stage>
  );
}

export { PIXELS_PER_MM };
