"use client";

import { useState, use } from "react";
import { Star, ShieldCheck, Truck, ArrowLeft, Heart, Minus, Plus, ShoppingBag, Package, MessageSquare, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
import { useCartStore } from "@/store/useCartStore";
import { useProductStore } from "@/store/useProductStore";
import { useReviewStore } from "@/store/useReviewStore";
import { useWishlistStore } from "@/store/useWishlistStore";

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = useProductStore((state) => state.getProductById(id));
  const allProducts = useProductStore((state) => state.products);
  const reviews = useReviewStore((state) => state.getReviewsForProduct(id));
  const addReview = useReviewStore((state) => state.addReview);
  const likeReview = useReviewStore((state) => state.likeReview);
  const avgRating = useReviewStore((state) => state.getAverageRating(id));
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(id));
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] ?? "");
  const [activeImage, setActiveImage] = useState(0);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });

  if (!product) {
    return (
      <div className="container px-4 py-20 mx-auto max-w-xl text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold mb-2">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The product you are looking for does not exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/products">Browse All Products</Link>
        </Button>
      </div>
    );
  }

  const relatedProducts = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const displayRating = avgRating > 0 ? avgRating : product.rating;
  const displayReviewCount = reviews.length > 0 ? reviews.length : product.reviewsCount;

  const handleAddToCart = () => {
    useCartStore.getState().addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      variant: selectedVariant || "Standard",
      quantity,
    });
    toast.success(`${quantity}× ${product.name} (${selectedVariant || "Standard"}) added to cart!`);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) return;

    addReview(id, newReview.name, newReview.rating, newReview.comment);
    setNewReview({ name: "", rating: 5, comment: "" });
    toast.success("Thank you! Your review has been published.");
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/products" className="inline-flex items-center hover:text-foreground transition-colors">
          <ArrowLeft className="mr-1 h-4 w-4" /> Products
        </Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-foreground transition-colors capitalize">
          {product.categoryLabel}
        </Link>
        <span>/</span>
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-2xl bg-muted border border-border/50">
            {product.isNew && <Badge className="absolute top-4 left-4 z-10">New Arrival</Badge>}
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="object-cover w-full h-full transition-all duration-500"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square w-20 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === idx ? "border-primary" : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="outline" className="capitalize">{product.brand}</Badge>
              <Badge variant="outline" className="capitalize">{product.categoryLabel}</Badge>
              {product.sku && <Badge variant="secondary" className="font-mono text-xs">{product.sku}</Badge>}
              {product.inStock && (product.stockCount ?? 0) > 5 ? (
                <Badge variant="outline" className="text-emerald-600 border-emerald-600/30 bg-emerald-500/10">
                  ✓ In Stock ({product.stockCount} available)
                </Badge>
              ) : product.inStock && (product.stockCount ?? 0) > 0 ? (
                <Badge variant="outline" className="text-amber-600 border-amber-600/30 bg-amber-500/10 font-bold">
                  ⚠️ Only {product.stockCount} left in stock - order soon!
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{product.name}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(displayRating) ? "fill-current" : "opacity-30"}`} />
                ))}
                <span className="ml-2 font-medium text-foreground">{displayRating}</span>
              </div>
              <a href="#reviews" className="text-muted-foreground underline cursor-pointer">
                {displayReviewCount} reviews
              </a>
            </div>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xl text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

          <Separator className="mb-6" />

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="space-y-3 mb-6">
              <h3 className="font-medium">
                {product.category === "clothing" ? "Size" : "Option"}:{" "}
                <span className="text-muted-foreground font-normal">{selectedVariant}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <Button
                    key={variant}
                    variant={selectedVariant === variant ? "default" : "outline"}
                    onClick={() => setSelectedVariant(variant)}
                    className="rounded-full px-5"
                    size="sm"
                  >
                    {variant}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="flex items-center border rounded-md h-11 w-32">
              <button
                className="flex-1 flex justify-center items-center h-full hover:bg-muted transition-colors disabled:opacity-30 rounded-l-md"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="flex-1 text-center font-medium">{quantity}</div>
              <button
                className="flex-1 flex justify-center items-center h-full hover:bg-muted transition-colors rounded-r-md"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              size="lg"
              className="flex-1 h-11 gap-2 text-base font-semibold"
              onClick={handleAddToCart}
              disabled={!product.inStock || (product.stockCount ?? 0) === 0}
            >
              <ShoppingBag className="h-5 w-5" />
              {product.inStock && (product.stockCount ?? 0) > 0 ? "Add to Cart" : "Out of Stock"}
            </Button>

            <Button
              size="icon"
              variant="outline"
              className={`h-11 w-11 shrink-0 transition-colors ${
                isInWishlist ? "text-rose-500 border-rose-500/50 bg-rose-500/10" : "hover:text-rose-500"
              }`}
              onClick={() => {
                const added = toggleWishlist(product.id);
                if (added) {
                  toast.success(`Added "${product.name}" to wishlist!`);
                } else {
                  toast.info(`Removed "${product.name}" from wishlist.`);
                }
              }}
              title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-5 w-5 ${isInWishlist ? "fill-rose-500" : ""}`} />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary shrink-0" />
              <div>
                <div className="font-medium text-sm">Free Shipping</div>
                <div className="text-muted-foreground text-xs">Orders over $50</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <div>
                <div className="font-medium text-sm">2 Year Warranty</div>
                <div className="text-muted-foreground text-xs">Quality guaranteed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section id="reviews" className="mt-20 pt-10 border-t border-border/40">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(displayRating) ? "fill-current" : "opacity-30"}`} />
                ))}
              </div>
              <span className="text-sm font-semibold">{displayRating} out of 5</span>
              <span className="text-sm text-muted-foreground">({displayReviewCount} verified reviews)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Write a Review */}
          <Card className="lg:col-span-1 h-fit">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Write a Review</h3>
              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Your Name</label>
                  <Input
                    placeholder="e.g. Jane Doe"
                    required
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Rating</label>
                  <div className="flex gap-1 mt-1 text-yellow-500 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 ${star <= newReview.rating ? "fill-current" : "opacity-30"}`}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Review</label>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none mt-1"
                    placeholder="Share your thoughts about this product..."
                    required
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full gap-2">
                  <MessageSquare className="h-4 w-4" /> Submit Review
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="font-medium">No reviews yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Be the first to review this product!</p>
                </CardContent>
              </Card>
            )}
            {reviews.map((rev) => (
              <Card key={rev.id}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                        {rev.author[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{rev.author}</div>
                        <div className="text-xs text-muted-foreground">{rev.date}</div>
                      </div>
                    </div>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < rev.rating ? "fill-current" : "opacity-30"}`} />
                      ))}
                    </div>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{rev.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{rev.comment}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-xs h-7"
                      onClick={() => {
                        likeReview(rev.id);
                        toast.success("Thanks for your feedback!");
                      }}
                    >
                      <ThumbsUp className="h-3 w-3" /> Helpful ({rev.likes})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold tracking-tight mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                image={p.image}
                category={p.categoryLabel}
                isNew={p.isNew}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
