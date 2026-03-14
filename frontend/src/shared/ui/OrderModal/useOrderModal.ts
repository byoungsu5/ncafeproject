import { create } from 'zustand';

export type OrderModalType = 'confirm' | 'success' | 'error' | 'payment';

interface OrderModalState {
    isOpen: boolean;
    type: OrderModalType;
    title: string;
    message: string;
    orderId?: number;
    amount?: number;
    onConfirm?: () => void;
    onPaymentSuccess?: (payment: any) => void;
    onClose?: () => void;
    
    open: (params: {
        type: OrderModalType;
        title: string;
        message: string;
        orderId?: number;
        amount?: number;
        onConfirm?: () => void;
        onPaymentSuccess?: (payment: any) => void;
        onClose?: () => void;
    }) => void;
    close: () => void;
}

export const useOrderModal = create<OrderModalState>((set) => ({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
    open: (params) => set({ isOpen: true, ...params }),
    close: () => set((state) => {
        if (state.onClose) state.onClose();
        return { isOpen: false };
    }),
}));
