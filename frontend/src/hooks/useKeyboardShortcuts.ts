import { useEffect } from 'react';
import { useFurnitureStore } from '../store/furnitureStore';
import { useEditorStore } from '../store/editorStore';
import { useSaveStore } from '../store/saveStore';
import { useHistory } from './useHistory';
import * as projectApi from '../api/project';

const NUDGE_MM = 10;

export function useKeyboardShortcuts(projectId: string | undefined) {
  const { pushSnapshot, undo, redo } = useHistory();
  const { setSaving, setSaved, setError } = useSaveStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const { selectedId, furniture, removeFurniture, rotateFurniture, updateFurniture } =
        useFurnitureStore.getState();
      const { isDrawing, cancelWall } = useEditorStore.getState();

      // Ctrl+Z: Undo
      if (e.ctrlKey && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        undo();
        return;
      }

      // Ctrl+Y or Ctrl+Shift+Z: Redo
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'Z')) {
        e.preventDefault();
        redo();
        return;
      }

      // Ctrl+S: Manual save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (!projectId) return;
        const { furniture: items, setDirty } = useFurnitureStore.getState();
        const { walls } = useEditorStore.getState();
        setSaving();
        projectApi
          .updateProject(projectId, {
            wallData: walls.length > 0 ? walls : undefined,
            furnitureData: items.length > 0 ? items : undefined,
          })
          .then(() => {
            setDirty(false);
            setSaved();
          })
          .catch(() => {
            setError('保存に失敗しました');
          });
        return;
      }

      // Escape: Deselect or cancel wall drawing
      if (e.key === 'Escape') {
        if (isDrawing) {
          cancelWall();
        } else {
          useFurnitureStore.getState().selectFurniture(null);
        }
        return;
      }

      // Delete / Backspace: Remove selected furniture
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!selectedId) return;
        e.preventDefault();
        pushSnapshot();
        removeFurniture(selectedId);
        return;
      }

      // R: Rotate selected furniture
      if (e.key === 'r' || e.key === 'R') {
        if (!selectedId || e.ctrlKey) return;
        pushSnapshot();
        rotateFurniture(selectedId);
        return;
      }

      // Arrow keys: Nudge selected furniture
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (!selectedId) return;
        e.preventDefault();
        const item = furniture.find((f) => f.id === selectedId);
        if (!item) return;

        pushSnapshot();
        const dx = e.key === 'ArrowRight' ? NUDGE_MM : e.key === 'ArrowLeft' ? -NUDGE_MM : 0;
        const dy = e.key === 'ArrowDown' ? NUDGE_MM : e.key === 'ArrowUp' ? -NUDGE_MM : 0;
        updateFurniture(selectedId, { x: item.x + dx, y: item.y + dy });
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [projectId, pushSnapshot, undo, redo, setSaving, setSaved, setError]);
}
