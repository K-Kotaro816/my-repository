import { create } from 'zustand';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface SaveState {
  status: SaveStatus;
  lastSavedAt: Date | null;
  errorMessage: string | null;
  setSaving: () => void;
  setSaved: () => void;
  setError: (message: string) => void;
  setIdle: () => void;
}

export const useSaveStore = create<SaveState>((set) => ({
  status: 'idle',
  lastSavedAt: null,
  errorMessage: null,

  setSaving: () => set({ status: 'saving', errorMessage: null }),
  setSaved: () => set({ status: 'saved', lastSavedAt: new Date(), errorMessage: null }),
  setError: (message) => set({ status: 'error', errorMessage: message }),
  setIdle: () => set({ status: 'idle' }),
}));
