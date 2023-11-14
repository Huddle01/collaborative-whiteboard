import { create } from "zustand";

interface MeetState {
    displayName: string;
    setDisplayName: (displayName: string) => void;
}

export const useMeetStore = create<MeetState>((set) => ({
    displayName: '',
    setDisplayName: (displayName) => set({ displayName })
}))