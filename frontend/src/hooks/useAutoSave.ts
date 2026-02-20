import { useEffect, useRef } from 'react';
import { useFurnitureStore } from '../store/furnitureStore';
import { useEditorStore } from '../store/editorStore';
import * as projectApi from '../api/project';

const AUTO_SAVE_DELAY_MS = 2000;

export function useAutoSave(projectId: string | undefined) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const { furniture, isDirty, setDirty } = useFurnitureStore();
  const { walls } = useEditorStore();

  useEffect(() => {
    if (!isDirty || !projectId) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      try {
        await projectApi.updateProject(projectId, {
          wallData: walls.length > 0 ? walls : undefined,
          furnitureData: furniture.length > 0 ? furniture : undefined,
        });
        setDirty(false);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, AUTO_SAVE_DELAY_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isDirty, projectId, furniture, walls, setDirty]);
}
