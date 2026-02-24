import { useEffect, useRef } from 'react';
import { useFurnitureStore } from '../store/furnitureStore';
import { useEditorStore } from '../store/editorStore';
import { useSaveStore } from '../store/saveStore';
import * as projectApi from '../api/project';

const AUTO_SAVE_DELAY_MS = 2000;

export function useAutoSave(projectId: string | undefined) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const { furniture, isDirty, isRestoring, setDirty } = useFurnitureStore();
  const { walls } = useEditorStore();
  const { setSaving, setSaved, setError } = useSaveStore();

  useEffect(() => {
    if (!isDirty || !projectId || isRestoring) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      setSaving();
      try {
        await projectApi.updateProject(projectId, {
          wallData: walls.length > 0 ? walls : undefined,
          furnitureData: furniture.length > 0 ? furniture : undefined,
        });
        setDirty(false);
        setSaved();
      } catch (error) {
        console.error('Auto-save failed:', error);
        setError('自動保存に失敗しました');
      }
    }, AUTO_SAVE_DELAY_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isDirty, isRestoring, projectId, furniture, walls, setDirty, setSaving, setSaved, setError]);
}
