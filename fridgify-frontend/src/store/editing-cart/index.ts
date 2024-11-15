import { UnitTypes } from "@/store/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface EditingCartItem {
    name: string;
    cartItemId: string; // from userproduce_id
    quantity: number;
    unit: UnitTypes;
    expirationDays: number;
};

interface EditingCartState {
    isEditing: boolean;
    toggleEditing: () => void;

    // Cart State
    cartItems: Record<string, EditingCartItem>; // uuid - item
    setItems: (items: { [cartItemId: string]: EditingCartItem }) => void;
    addItem: (cartItemId: string, item: EditingCartItem) => void;
    removeItem: (cartItemId: string) => void;
    updateItem: (cartItemId: string, updates: { quantity?: number, unit?: UnitTypes, expirationDays?: number }) => void;
}

export const useEditingCart = create<EditingCartState>()(
  devtools(
    persist(
        (set) => ({
            isEditing: false,
            toggleEditing: () => set((state) => ({ isEditing: !state.isEditing })),
            cartItems: {},
            setItems: (items: { [name: string]: EditingCartItem }) => set(() => ({ cartItems: items })),
            addItem: (cartItemId: string, item: EditingCartItem) => set((state) => {
                if (cartItemId in state.cartItems) return {};

                const newItems = { ...state.cartItems };
                newItems[cartItemId] = item;
                return { cartItems: newItems };
            }),
            removeItem: (cartItemId: string) => set((state) => {
                if (cartItemId in state.cartItems) {
                    const newItems = { ...state.cartItems };
                    delete newItems[cartItemId];
                    return { cartItems: newItems };
                }
                return {};
            }),
            updateItem: (
                cartItemId: string,
                updates: {
                    quantity?: number,
                    unit?: UnitTypes,
                    expirationDays?: number,
                }
            ) => set((state) => {
                if (cartItemId in state.cartItems) {
                    const item = state.cartItems[cartItemId];
                    return { 
                        cartItems: { 
                            ...state.cartItems, 
                            [cartItemId]: {
                                ...item,
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