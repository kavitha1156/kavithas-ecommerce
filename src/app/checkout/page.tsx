"use client";

import { useState, useEffect } from "react";
import { CreditCard, Truck, CheckCircle2, ShieldCheck, ChevronRight, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useProductStore } from "@/store/useProductStore";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);

  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const deductStock = useProductStore((state) => state.deductStock);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.address || !formData.city || !formData.postalCode) {
        toast.error("Please fill in required shipping fields.");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const subtotal = getSubtotal();
      const shipping = subtotal > 50 ? 0 : 15;
      const tax = subtotal * 0.08;
      const total = subtotal + shipping + tax;

      const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.postalCode}`;

      // 1. Deduct stock from the catalog
      deductStock(items.map((it) => ({ id: it.id, quantity: it.quantity })));

      // 2. Place order in the persistent order store
      const order = useOrderStore.getState().placeOrder(
        items,
        subtotal,
        shipping,
        tax,
        total,
        fullAddress,
        {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: fullAddress,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        paymentMethod
      );

      // 3. Clear shopping cart
      clearCart();
      setIsProcessing(false);

      toast.success(`🎉 Order ${order.id} confirmed! Stock updated.`);
      router.push(`/order-tracking?id=${order.id}`);
    }, 1200);
  };

  const subtotal = mounted ? getSubtotal() : 0;
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (mounted && items.length === 0 && !isProcessing) {
    return (
      <div className="container px-4 py-20 mx-auto max-w-md text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Add some products to your cart before proceeding to checkout.
        </p>
        <Button asChild>
          <Link href="/products">Browse All Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-10 mx-auto max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Express Checkout</h1>
          <p className="text-xs text-muted-foreground mt-1">Complete your purchase with instant order confirmation and tracking.</p>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-xs gap-1">
          <Link href="/cart">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Cart
          </Link>
        </Button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-10 relative max-w-xl mx-auto">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 -translate-y-1/2 rounded-full" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
          style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
        />

        {[
          { num: 1, label: "Shipping", icon: Truck },
          { num: 2, label: "Payment", icon: CreditCard },
          { num: 3, label: "Review", icon: CheckCircle2 },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = step >= item.num;
          return (
            <div key={item.num} className="flex flex-col items-center gap-1.5 bg-background px-3">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs"
                    : "border-muted-foreground/30 bg-background text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className={`text-xs font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <Card className="border-border/60 shadow-xs">
              <CardHeader>
                <CardTitle className="text-lg">Shipping Destination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">First Name *</label>
                    <Input
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Last Name</label>
                    <Input
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Email for Tracking Updates *</label>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Phone Number</label>
                    <Input
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Street Address *</label>
                  <Input
                    placeholder="123 Commerce Way, Apt 4B"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1 space-y-1.5">
                    <label className="text-xs font-semibold">City *</label>
                    <Input
                      placeholder="Tech City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">State</label>
                    <Input
                      placeholder="CA"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Postal Code *</label>
                    <Input
                      placeholder="10010"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    />
                  </div>
                </div>

                <Button className="w-full mt-4 h-11" onClick={handleNext}>
                  Continue to Payment <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <Card className="border-border/60 shadow-xs">
              <CardHeader>
                <CardTitle className="text-lg">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Credit Card (•••• 4242)")}
                    className={`p-3.5 border-2 rounded-xl text-left flex items-center gap-3 transition-all ${
                      paymentMethod.includes("Credit") ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-xs font-bold">Credit / Debit Card</div>
                      <div className="text-[10px] text-muted-foreground">Visa, Mastercard, Amex</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Apple Pay")}
                    className={`p-3.5 border-2 rounded-xl text-left flex items-center gap-3 transition-all ${
                      paymentMethod.includes("Apple") ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <span className="font-black text-lg"></span>
                    <div>
                      <div className="text-xs font-bold">Apple Pay</div>
                      <div className="text-[10px] text-muted-foreground">1-Touch Checkout</div>
                    </div>
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold">Card Number</label>
                  <Input
                    placeholder="4242 •••• •••• 4242"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Expiry Date</label>
                    <Input
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Security CVC</label>
                    <Input
                      placeholder="123"
                      type="password"
                      maxLength={4}
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={handleNext}>
                    Review Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <Card className="border-border/60 shadow-xs">
              <CardHeader>
                <CardTitle className="text-lg">Review &amp; Confirm Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="p-4 bg-muted/30 rounded-xl space-y-1 text-xs">
                  <span className="font-bold text-[10px] uppercase text-muted-foreground">Delivery Destination</span>
                  <p className="font-semibold text-sm text-foreground">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-muted-foreground">
                    {formData.address}, {formData.city}, {formData.state} {formData.postalCode}
                  </p>
                  <p className="text-muted-foreground">Contact: {formData.email} · {formData.phone}</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-xl space-y-1 text-xs">
                  <span className="font-bold text-[10px] uppercase text-muted-foreground">Payment Method</span>
                  <p className="font-semibold text-sm text-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" /> {paymentMethod}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button
                    className="flex-1 h-11 text-base font-bold shadow-sm"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Finalizing Order..." : `Place Order · $${total.toFixed(2)}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-border/60 sticky top-24">
            <CardContent className="p-6">
              <h2 className="font-bold text-base mb-4">Cart Breakdown ({items.length} items)</h2>

              <div className="space-y-3 mb-4 max-h-[260px] overflow-y-auto pr-1 divide-y">
                {items.map((item) => (
                  <div key={`${item.id}-${item.variant}`} className="flex gap-3 pt-3 first:pt-0">
                    <div className="h-14 w-14 bg-muted rounded-lg overflow-hidden shrink-0 border">
                      <img src={item.image} alt={item.name} className="object-cover h-full w-full" />
                    </div>
                    <div className="flex-grow text-xs">
                      <div className="font-semibold line-clamp-1">{item.name}</div>
                      <div className="text-muted-foreground mt-0.5">
                        Qty: {item.quantity} · {item.variant}
                      </div>
                      <div className="font-bold mt-1">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="font-medium text-foreground">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center mb-5">
                <span className="font-bold text-base">Total</span>
                <span className="font-black text-xl text-primary">${total.toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground justify-center bg-muted/40 p-2.5 rounded-lg border">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
