import { create } from "zustand";

interface State {
    isOpen: boolean;
    openMenu: () => void;
    closeMenu: () => void;
}

export const useMenuStore = create<State>((set) => ({
  isOpen: false,
  openMenu: () => set({ isOpen: true }),
  closeMenu: () => set({ isOpen: false }),
}));