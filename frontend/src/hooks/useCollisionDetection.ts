import { useCallback } from 'react';
import { useFurnitureStore } from '../store/furnitureStore';
import { detectCollisionsForItem, detectAllCollisions } from '../utils/collision';

export function useCollisionDetection() {
  const furniture = useFurnitureStore((s) => s.furniture);
  const setCollidingIds = useFurnitureStore((s) => s.setCollidingIds);

  const checkCollisionsOnDrag = useCallback(
    (itemId: string, currentX: number, currentY: number) => {
      const item = furniture.find((f) => f.id === itemId);
      if (!item) return;
      const tempItem = { ...item, x: currentX, y: currentY };
      const ids = detectCollisionsForItem(tempItem, furniture);
      setCollidingIds(ids);
    },
    [furniture, setCollidingIds],
  );

  const checkAllCollisions = useCallback(() => {
    const ids = detectAllCollisions(furniture);
    setCollidingIds(ids);
  }, [furniture, setCollidingIds]);

  return { checkCollisionsOnDrag, checkAllCollisions };
}
