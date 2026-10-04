"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, SlidersHorizontal, X, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useProductStore } from "@/store/useProductStore";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const CATEGORIES = ["All", "electronics", "clothing", "accessories", "home", "sports", "books", "beauty"];
const CATEGORY_LABELS: Record<string, string> = {
  All: "All",
  electronics: "Electronics",
  clothing: "Clothing",
  accessories: "Accessories",
  home: "Home & Living",
  sports: "Sports",
  books: "Books",
  beauty: "Beauty",
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "All";
  const initialSearch = searchParams.get("search") ?? "";

  const products = useProductStore((state) => state.products);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(
    CATEGORIES.includes(initialCategory) ? initialCategory : "All"
  );

  // Update search when URL changes
  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    if (urlSearch) setSearch(urlSearch);
    const urlCategory = searchParams.get("category") ?? "All";
    if (CATEGORIES.includes(urlCategory)) setSelectedCategory(urlCategory);
  }, [searchParams]);

  const filteredProducts = products.filter((product) => {
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.categoryLabel.toLowerCase().includes(searchTerm);
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {selectedCategory === "All" ? "All Products" : CATEGORY_LABELS[selectedCategory]}
          </h1>
          <p className="text-muted-foreground mt-1">
            Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""}
            {search && <span> for &quot;{search}&quot;</span>}
          </p>
        </div>

        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, brand, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 max-w-xs"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Refine your product search.</SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Categories</h3>
                  <div className="flex flex-col gap-2">
                    {CATEGORIES.map((category) => (
                      <label key={category} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="accent-primary"
                        />
                        {CATEGORY_LABELS[category]}
                        <span className="text-muted-foreground text-xs ml-auto">
                          ({products.filter(p => category === 'All' || p.category === category).length})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setSelectedCategory(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </Button>
        ))}
      </div>

      {/* Active filter chips */}
      {(selectedCategory !== "All" || search) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedCategory !== "All" && (
            <Badge variant="secondary" className="gap-1 px-3 py-1">
              {CATEGORY_LABELS[selectedCategory]}
              <button onClick={() => setSelectedCategory("All")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {search && (
            <Badge variant="secondary" className="gap-1 px-3 py-1">
              &quot;{search}&quot;
              <button onClick={() => setSearch("")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <button
            onClick={() => { setSearch(""); setSelectedCategory("All"); }}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Clear all
          </button>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Filter className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold">No products found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => { setSearch(""); setSelectedCategory("All"); }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              category={product.categoryLabel}
              isNew={product.isNew}
              inStock={product.inStock}
              stockCount={product.stockCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container py-8">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
