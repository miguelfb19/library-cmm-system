import { create } from "zustand";

interface State{
    isCloseSession: boolean;
    closingSession: () => void;
    reset: () => void;
}


export const useLogoutStore = create<State>()((set) => ({
    isCloseSession: false,
    closingSession: () => set({ isCloseSession: true }),
    reset: () => set({ isCloseSession: false }),
}));
