import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  variant: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string, variant?: string) => void;
  updateQuantity: (id: string, delta: number, variant?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const { items } = get();
        const quantityToAdd = newItem.quantity ?? 1;
        const variant = newItem.variant || "Standard";

        const existingIndex = items.findIndex(
          (item) => item.id === newItem.id && item.variant === variant
        );

        if (existingIndex > -1) {
          const updatedItems = [...items];
          updatedItems[existingIndex].quantity += quantityToAdd;
          set({ items: updatedItems });
        } else {
          set({
            items: [
              ...items,
              {
                id: newItem.id,
                name: newItem.name,
                price: newItem.price,
                image: newItem.image,
                variant,
                quantity: quantityToAdd,
              },
            ],
          });
        }
      },
      removeItem: (id, variant) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === id && (variant ? item.variant === variant : true))
          ),
        });
      },
      updateQuantity: (id, delta, variant) => {
        set({
          items: get().items.map((item) => {
            if (item.id === id && (variant ? item.variant === variant : true)) {
              const newQty = item.quantity + delta;
              return { ...item, quantity: Math.max(1, newQty) };
            }
            return item;
          }),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getSubtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'kavithas-shopping-cart',
    }
  )
);
