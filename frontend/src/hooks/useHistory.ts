import { useCallback } from 'react';
import { useHistoryStore } from '../store/historyStore';
import { useEditorStore } from '../store/editorStore';
import { useFurnitureStore } from '../store/furnitureStore';

export function useHistory() {
  const { pushHistory, undo: storeUndo, redo: storeRedo, canUndo, canRedo } = useHistoryStore();

  const pushSnapshot = useCallback(() => {
    const furniture = useFurnitureStore.getState().furniture;
    const walls = useEditorStore.getState().walls;
    pushHistory({
      furniture: JSON.parse(JSON.stringify(furniture)),
      walls: JSON.parse(JSON.stringify(walls)),
    });
  }, [pushHistory]);

  const undo = useCallback(() => {
    const currentFurniture = useFurnitureStore.getState().furniture;
    const currentWalls = useEditorStore.getState().walls;
    const currentSnapshot = {
      furniture: JSON.parse(JSON.stringify(currentFurniture)),
      walls: JSON.parse(JSON.stringify(currentWalls)),
    };

    const snapshot = storeUndo(currentSnapshot);
    if (!snapshot) return;

    useFurnitureStore.getState().setRestoring(true);
    useFurnitureStore.getState().setFurniture(snapshot.furniture);
    useEditorStore.getState().setWalls(snapshot.walls);
    useFurnitureStore.getState().setDirty(true);
    useFurnitureStore.getState().setRestoring(false);
  }, [storeUndo]);

  const redo = useCallback(() => {
    const currentFurniture = useFurnitureStore.getState().furniture;
    const currentWalls = useEditorStore.getState().walls;
    const currentSnapshot = {
      furniture: JSON.parse(JSON.stringify(currentFurniture)),
      walls: JSON.parse(JSON.stringify(currentWalls)),
    };

    const snapshot = storeRedo(currentSnapshot);
    if (!snapshot) return;

    useFurnitureStore.getState().setRestoring(true);
    useFurnitureStore.getState().setFurniture(snapshot.furniture);
    useEditorStore.getState().setWalls(snapshot.walls);
    useFurnitureStore.getState().setDirty(true);
    useFurnitureStore.getState().setRestoring(false);
  }, [storeRedo]);

  return { pushSnapshot, undo, redo, canUndo, canRedo };
}
