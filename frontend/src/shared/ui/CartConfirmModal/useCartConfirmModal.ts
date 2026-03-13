import { create } from 'zustand';

interface CartConfirmModalState {
    isOpen: boolean;
    itemName: string;
    open: (itemName: string) => void;
    close: () => void;
}

export const useCartConfirmModal = create<CartConfirmModalState>((set) => ({
    isOpen: false,
    itemName: '',
    open: (itemName) => set({ isOpen: true, itemName }),
    close: () => set({ isOpen: false, itemName: '' }),
}));
