import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';
import type {} from '@redux-devtools/extension'; // required for devtools typing

interface ScanningCartState {
    // Modal State
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;

    // Cart State
    cartItems: {
        [name: string]: number;
    },
    setItems: (items: { [name: string]: number }) => void;
    addItem: (name: string) => void;
    removeItem: (name: string) => void;
    updateItem: (name: string, quantity: number) => void;
}

export const useScanningCart = create<ScanningCartState>()(
  devtools(
    persist(
        (set) => ({
            isModalOpen: false,
            openModal: () => set(() => ({ isModalOpen: true })),
            closeModal: () => set(() => ({ isModalOpen: false })),
            cartItems: {},
            setItems: (items: { [name: string]: number }) => set(() => ({ cartItems: items })),
            addItem: (name: string) => set((state) => {
                if (name in state.cartItems) return {};
                return { cartItems: { ...state.cartItems, [name]: 1 } };
            }),
            removeItem: (name: string) => set((state) => {
                if (name in state.cartItems) {
                    const newItems = state.cartItems;
                    delete newItems[name];
                    return { cartItems: newItems };
                }
                return {};
            }),
            updateItem: (name: string, quantity: number) => set((state) => {
                if (name in state.cartItems) {
                    return { cartItems: { ...state.cartItems, [name]: quantity } };
                }
                return {};
            }),
        }),
            {
                name: 'scanning-cart-storage',
            },
        ),
    ),
)