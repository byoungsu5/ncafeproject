import { create } from 'zustand';

export interface CartItem {
    id: number;
    korName: string;
    engName: string;
    price: number;
    imageSrc: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: number) => void;
    increaseQuantity: (id: number) => void;
    decreaseQuantity: (id: number) => void;
    clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
    items: [],
    addItem: (item) =>
        set((state) => {
            const existing = state.items.find((i) => i.id === item.id);
            if (existing) {
                return {
                    items: state.items.map((i) =>
                        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
                    ),
                };
            }
            return {
                items: [
                    ...state.items,
                    {
                        ...item,
                        quantity: 1,
                    },
                ],
            };
        }),
    removeItem: (id) =>
        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
        })),
    increaseQuantity: (id) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
            ),
        })),
    decreaseQuantity: (id) =>
        set((state) => ({
            items: state.items
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item,
                )
                .filter((item) => item.quantity > 0),
        })),
    clear: () => set({ items: [] }),
}));

