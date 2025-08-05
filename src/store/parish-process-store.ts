import { create } from "zustand";

interface State {
    isViewProcesses: boolean;
    openProcesses: () => void;
    closeProcesses: () => void;
}

export const useParishProcessStore = create<State>((set) => ({
  isViewProcesses: false,
  openProcesses: () => set({ isViewProcesses: true }),
  closeProcesses: () => set({ isViewProcesses: false }),
}));