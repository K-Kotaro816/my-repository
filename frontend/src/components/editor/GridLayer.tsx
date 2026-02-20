import { Line } from 'react-konva';
import { PIXELS_PER_MM } from './RoomCanvas';
import { useEditorStore } from '../../store/editorStore';

const GRID_INTERVAL_MM = 100; // 10cm

interface GridLayerProps {
  roomWidthMm: number;
  roomHeightMm: number;
}

export function GridLayer({ roomWidthMm, roomHeightMm }: GridLayerProps) {
  const { gridVisible } = useEditorStore();

  if (!gridVisible) return null;

  const widthPx = roomWidthMm * PIXELS_PER_MM;
  const heightPx = roomHeightMm * PIXELS_PER_MM;
  const intervalPx = GRID_INTERVAL_MM * PIXELS_PER_MM;

  const lines: React.ReactNode[] = [];

  // 縦線
  for (let x = 0; x <= widthPx; x += intervalPx) {
    lines.push(
      <Line
        key={`v-${x}`}
        points={[x, 0, x, heightPx]}
        stroke="#e2e8f0"
        strokeWidth={0.5}
        listening={false}
      />,
    );
  }

  // 横線
  for (let y = 0; y <= heightPx; y += intervalPx) {
    lines.push(
      <Line
        key={`h-${y}`}
        points={[0, y, widthPx, y]}
        stroke="#e2e8f0"
        strokeWidth={0.5}
        listening={false}
      />,
    );
  }

  return <>{lines}</>;
}
