"use client";

import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  inStock?: boolean;
  stockCount?: number;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  isNew,
  inStock = true,
  stockCount,
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(id));
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  const isLowStock = typeof stockCount === "number" && stockCount > 0 && stockCount <= 5;
  const isOutOfStock = inStock === false || stockCount === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem({ id, name, price, image, variant: "Standard" });
    toast.success(`Added "${name}" to cart!`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(id);
    if (added) {
      toast.success(`Added "${name}" to your wishlist!`);
    } else {
      toast.info(`Removed "${name}" from wishlist.`);
    }
  };

  return (
    <Card className="group overflow-hidden flex flex-col h-full border-border/60 bg-background/60 hover:border-primary/50 hover:shadow-md transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {isNew && (
            <Badge className="bg-primary/90 text-[10px] font-semibold" variant="default">
              New
            </Badge>
          )}
          {isLowStock && (
            <Badge variant="destructive" className="bg-amber-500 text-white text-[10px]">
              Only {stockCount} left
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="destructive" className="text-[10px]">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <Button
          size="icon"
          variant="ghost"
          className={`absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur transition-all ${
            isInWishlist
              ? "text-rose-500 opacity-100"
              : "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-500"
          }`}
          onClick={handleToggleWishlist}
          title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${isInWishlist ? "fill-rose-500" : ""}`} />
          <span className="sr-only">Wishlist</span>
        </Button>

        <Link href={`/product/${id}`}>
          <img
            src={image}
            alt={name}
            className={`object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 ${
              isOutOfStock ? "grayscale opacity-60" : ""
            }`}
            loading="lazy"
          />
        </Link>
      </div>

      <CardContent className="p-4 flex-grow">
        <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">{category}</div>
        <Link href={`/product/${id}`}>
          <h3 className="font-semibold text-base line-clamp-1 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-bold text-lg">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full gap-2 text-xs font-semibold"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          variant={isOutOfStock ? "secondary" : "default"}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
