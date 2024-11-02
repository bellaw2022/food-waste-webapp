import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';
import type {} from '@redux-devtools/extension'; // required for devtools typing

interface ScanningCartState {
    // Modal State
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;

    // Cart State

}

export const useScanningCart = create<ScanningCartState>()(
  devtools(
    persist(
      (set) => ({
        isModalOpen: false,
        openModal: () => set(() => ({ isModalOpen: true })),
        closeModal: () => set(() => ({ isModalOpen: false })),
        // bears: 0,
        // increase: (by) => set((state) => ({ bears: state.bears + by })),
      }),
      {
        name: 'scanning-cart-storage',
      },
    ),
  ),
)