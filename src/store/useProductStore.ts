import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, INITIAL_PRODUCTS } from '@/lib/products';

interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => Product;
  removeProduct: (id: string) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  restockProduct: (id: string, additionalStock: number) => void;
  updateStock: (id: string, newStock: number) => void;
  deductStock: (items: { id: string; quantity: number }[]) => void;
  getProductById: (id: string) => Product | null;
  getByCategory: (category: string) => Product[];
  resetToDefaults: () => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      addProduct: (newProduct) => {
        const product: Product = {
          ...newProduct,
          id: `prod-${Date.now()}`,
          rating: 5.0,
          reviewsCount: 1,
          stockCount: newProduct.stockCount ?? 50,
          inStock: (newProduct.stockCount ?? 50) > 0,
          sku: newProduct.sku || `OWI-${newProduct.category.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        };
        set((state) => ({ products: [product, ...state.products] }));
        return product;
      },
      removeProduct: (id) => {
        set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
      },
      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;
            const updated = { ...p, ...updates };
            if (typeof updates.stockCount === 'number') {
              updated.inStock = updates.stockCount > 0;
            }
            return updated;
          }),
        }));
      },
      restockProduct: (id, additionalStock) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;
            const currentStock = p.stockCount ?? 0;
            const newStock = Math.max(0, currentStock + additionalStock);
            return {
              ...p,
              stockCount: newStock,
              inStock: newStock > 0,
            };
          }),
        }));
      },
      updateStock: (id, newStock) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;
            const stock = Math.max(0, newStock);
            return {
              ...p,
              stockCount: stock,
              inStock: stock > 0,
            };
          }),
        }));
      },
      deductStock: (items) => {
        set((state) => {
          const itemMap = new Map<string, number>();
          items.forEach((item) => {
            itemMap.set(item.id, (itemMap.get(item.id) || 0) + item.quantity);
          });

          return {
            products: state.products.map((p) => {
              if (!itemMap.has(p.id)) return p;
              const qtyToDeduct = itemMap.get(p.id)!;
              const currentStock = p.stockCount ?? 10;
              const remaining = Math.max(0, currentStock - qtyToDeduct);
              return {
                ...p,
                stockCount: remaining,
                inStock: remaining > 0,
              };
            }),
          };
        });
      },
      getProductById: (id) => get().products.find((p) => p.id === id) ?? null,
      getByCategory: (category) => get().products.filter((p) => p.category === category),
      resetToDefaults: () => set({ products: INITIAL_PRODUCTS }),
    }),
    {
      name: `kavithas-product-catalog-v2`,
    }
  )
);
