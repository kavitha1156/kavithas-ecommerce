"use client";

import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { useProductStore } from "@/store/useProductStore";

export default function DealsPage() {
  const products = useProductStore((state) => state.products);
  const deals = products.filter(p => p.price < 100);
  return (
    <div className="container px-4 py-12 mx-auto max-w-7xl">
      <div className="mb-10">
        <Badge className="mb-3 bg-red-500/10 text-red-500 border-red-500/30">Limited Time</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight">Special Deals</h1>
        <p className="text-muted-foreground mt-2">Amazing products at prices that won&apos;t last long.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {deals.map(p => (
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
