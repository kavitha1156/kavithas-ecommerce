"use client";

import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { useProductStore } from "@/store/useProductStore";

export default function NewArrivalsPage() {
  const products = useProductStore((state) => state.products);
  const newProducts = products.filter(p => p.isNew);
  return (
    <div className="container px-4 py-12 mx-auto max-w-7xl">
      <div className="mb-10">
        <Badge variant="outline" className="mb-3">Just Dropped</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight">New Arrivals</h1>
        <p className="text-muted-foreground mt-2">The freshest additions to the Kavitha's collection.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {newProducts.map(p => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            price={p.price}
            originalPrice={p.originalPrice}
            image={p.image}
            category={p.categoryLabel}
            isNew={p.isNew}
            inStock={p.inStock}
            stockCount={p.stockCount}
          />
        ))}
      </div>
    </div>
  );
}
