import { create } from 'zustand'

interface ModelState {
    isOpen: boolean;
    openModals: () => void
    closeModal: () => void
}

export const useModalStore = create<ModelState>()((set) => ({
    isOpen: false,
    openModals: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
}))