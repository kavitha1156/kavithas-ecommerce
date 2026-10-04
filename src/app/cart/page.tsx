"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, Tag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number } | null>(null);

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container px-4 py-20 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="h-12 w-12 bg-muted rounded-full"></div>
          <div className="h-6 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const codeUpper = promoCode.trim().toUpperCase();
    if (codeUpper === "KAVITHA20" || codeUpper === "CRAFT20") {
      setAppliedPromo({ code: "KAVITHA20", discountPercent: 20 });
      toast.success("Promo code 'KAVITHA20' applied! You save 20% 🎉");
      setPromoCode("");
    } else if (codeUpper === "WELCOME10") {
      setAppliedPromo({ code: "WELCOME10", discountPercent: 10 });
      toast.success("Promo code 'WELCOME10' applied! (10% off)");
      setPromoCode("");
    } else {
      toast.error("Invalid promo code. Try 'KAVITHA20' for 20% off!");
    }
  };

  const subtotal = getSubtotal();
  const discount = appliedPromo ? (subtotal * appliedPromo.discountPercent) / 100 : 0;
  const discountedSubtotal = subtotal - discount;
  const shipping = discountedSubtotal > 50 || discountedSubtotal === 0 ? 0 : 15;
  const total = discountedSubtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container px-4 py-20 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
        <div className="bg-muted p-6 rounded-full mb-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button size="lg" asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Shopping Cart ({items.reduce((sum, i) => sum + i.quantity, 0)} {items.reduce((sum, i) => sum + i.quantity, 0) === 1 ? "item" : "items"})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={`${item.id}-${item.variant}`} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-center p-4 gap-4">
                  <div className="h-24 w-24 shrink-0 rounded-md overflow-hidden bg-muted">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>

                  <div className="flex-grow flex flex-col justify-between h-full space-y-2 sm:space-y-0 w-full text-center sm:text-left">
                    <div>
                      <Link href={`/product/${item.id}`} className="font-semibold hover:text-primary transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <div className="text-sm text-muted-foreground mt-1">Variant: {item.variant}</div>
                    </div>
                    <div className="font-bold sm:hidden">${item.price.toFixed(2)}</div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="hidden sm:block font-bold w-24 text-right">${item.price.toFixed(2)}</div>

                    <div className="flex items-center border rounded-md h-9">
                      <button
                        className="px-3 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                        onClick={() => updateQuantity(item.id, -1, item.variant)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <div className="w-8 text-center text-sm font-medium">{item.quantity}</div>
                      <button
                        className="px-3 flex items-center justify-center hover:bg-muted transition-colors"
                        onClick={() => updateQuantity(item.id, 1, item.variant)}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id, item.variant)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2 mb-6">
                <Input
                  placeholder="Promo code (e.g. KAVITHA20)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="text-xs uppercase"
                />
                <Button type="submit" variant="outline" size="sm">Apply</Button>
              </form>

              {appliedPromo && (
                <div className="flex items-center justify-between p-2.5 bg-green-500/10 text-green-600 rounded-lg text-xs font-medium mb-4">
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    <span>Code <strong>{appliedPromo.code}</strong> applied</span>
                  </div>
                  <button onClick={() => setAppliedPromo(null)} className="hover:underline">Remove</button>
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromo.discountPercent}%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-xl">${total.toFixed(2)}</span>
              </div>

              <Button className="w-full h-12 text-base gap-2" asChild>
                <Link href="/checkout">
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <div className="mt-4 text-xs text-center text-muted-foreground">
                Try promo code <strong>KAVITHA20</strong> for 20% off · <strong>WELCOME10</strong> for 10% off
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
