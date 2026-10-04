import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: string[]; // product IDs
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: ['1', '4', '11'], // initial favorites

      addToWishlist: (productId) => {
        if (!get().items.includes(productId)) {
          set((state) => ({ items: [...state.items, productId] }));
        }
      },

      removeFromWishlist: (productId) => {
        set((state) => ({ items: state.items.filter((id) => id !== productId) }));
      },

      toggleWishlist: (productId) => {
        const exists = get().items.includes(productId);
        if (exists) {
          set((state) => ({ items: state.items.filter((id) => id !== productId) }));
          return false;
        } else {
          set((state) => ({ items: [...state.items, productId] }));
          return true;
        }
      },

      isInWishlist: (productId) => get().items.includes(productId),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: `kavithas-wishlist`,
    }
  )
);
