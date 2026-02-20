import { useEffect, useState } from 'react';
import { Image as KonvaImage } from 'react-konva';
import { PIXELS_PER_MM } from './RoomCanvas';

interface FloorPlanImageLayerProps {
  imagePath: string;
  roomWidthMm: number;
  roomHeightMm: number;
}

export function FloorPlanImageLayer({
  imagePath,
  roomWidthMm,
  roomHeightMm,
}: FloorPlanImageLayerProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  const baseUrl = apiUrl.replace(/\/api$/, '');
  const imageUrl = `${baseUrl}/uploads/${imagePath}`;

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImage(img);
    img.onerror = () => console.error('Floor plan image failed to load:', imageUrl);
    img.src = imageUrl;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  if (!image) return null;

  const roomWidthPx = roomWidthMm * PIXELS_PER_MM;
  const roomHeightPx = roomHeightMm * PIXELS_PER_MM;

  return (
    <KonvaImage
      image={image}
      x={0}
      y={0}
      width={roomWidthPx}
      height={roomHeightPx}
      opacity={0.6}
      listening={false}
    />
  );
}
