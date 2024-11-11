import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';
import type {} from '@redux-devtools/extension'; // required for devtools typing

export enum UnitTypes {
    COUNT = "count",
    GRAMS = "grams",
}

export interface CartItem {
    quantity: number,
    unit: UnitTypes,
    expirationDays: number,
};

export const makeDefaultItem = (): CartItem => {
    // (name: string) => {
    // when expDates and unit types are available in database, use them here
    return {
        quantity: 1,
        unit: UnitTypes.COUNT,
        expirationDays: 5,
    }
};

interface ScanningCartState {
    // Modal State
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;

    // Cart State
    cartItems: {
        [name: string]: CartItem;
    },
    setItems: (items: { [name: string]: CartItem }) => void;
    addItem: (name: string) => void;
    removeItem: (name: string) => void;
    updateItem: (name: string, updates: { quantity?: number, unit?: UnitTypes, expirationDays?: number }) => void;
}

export const useScanningCart = create<ScanningCartState>()(
  devtools(
    persist(
        (set) => ({
            isModalOpen: false,
            openModal: () => set(() => ({ isModalOpen: true })),
            closeModal: () => set(() => ({ isModalOpen: false })),
            cartItems: {},
            setItems: (items: { [name: string]: CartItem }) => set(() => ({ cartItems: items })),
            addItem: (name: string) => set((state) => {
                state.cartItems[name] = makeDefaultItem();
                return state;
            }),
            removeItem: (name: string) => set((state) => {
                if (name in state.cartItems) {
                    const newItems = state.cartItems;
                    delete newItems[name];
                    return { cartItems: newItems };
                }
                return {};
            }),
            updateItem: (
                name: string,
                updates: {
                    quantity?: number,
                    unit?: UnitTypes,
                    expirationDays?: number,
                }
            ) => set((state) => {
                if (name in state.cartItems) {
                    const item = state.cartItems[name];
                    return { 
                        cartItems: { 
                            ...state.cartItems, 
                            [name]: {
                                quantity: updates.quantity ?? item.quantity,
                                unit: updates.unit ?? item.unit,
                                expirationDays: updates.expirationDays ?? item.expirationDays,
                            }
                        }
                    };
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