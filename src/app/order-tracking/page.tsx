"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Package, Truck, CheckCircle, MapPin, Copy, Clock, ArrowRight, PackageOpen, ShoppingBag, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useOrderStore, Order } from "@/store/useOrderStore";
import Link from "next/link";

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");

  const [query, setQuery] = useState(idParam || "");
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [mounted, setMounted] = useState(false);

  const orders = useOrderStore((state) => state.orders);
  const getOrderById = useOrderStore((state) => state.getOrderById);

  useEffect(() => {
    setMounted(true);
    if (idParam) {
      setQuery(idParam);
      const found = getOrderById(idParam);
      if (found) {
        setTrackedOrder(found);
        setSearchAttempted(true);
      }
    }
  }, [idParam, getOrderById]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAttempted(true);
    if (query.trim()) {
      const found = getOrderById(query.trim());
      setTrackedOrder(found);
      if (!found) toast.error(`No order found with ID "${query.trim()}". Please check and try again.`);
    }
  };

  const handleQuickTrack = (orderId: string) => {
    setQuery(orderId);
    const found = getOrderById(orderId);
    setTrackedOrder(found);
    setSearchAttempted(true);
  };

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success(`Copied ${id} to clipboard`);
  };

  const getStepIcon = (label: string, done: boolean) => {
    const iconClass = `h-4 w-4 ${done ? "text-primary-foreground" : "text-muted-foreground"}`;
    switch (label) {
      case "Order Placed":
        return <ShoppingBag className={iconClass} />;
      case "Processing":
        return <Package className={iconClass} />;
      case "Shipped":
        return <Truck className={iconClass} />;
      case "Out for Delivery":
        return <MapPin className={iconClass} />;
      case "Delivered":
        return <CheckCircle className={iconClass} />;
      default:
        return <Clock className={iconClass} />;
    }
  };

  return (
    <div className="container px-4 py-12 mx-auto max-w-3xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4">
          <Truck className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Track Your Order</h1>
        <p className="text-muted-foreground max-w-md mx-auto text-sm">
          Enter your order confirmation number to get real-time dispatch updates and carrier delivery status.
        </p>
      </div>

      <form onSubmit={handleTrack} className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Enter Order ID (e.g. ORD-7294)"
            className="pl-9 h-12 text-base font-mono"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit" size="lg" className="h-12 px-8">
          Track Order
        </Button>
      </form>

      {/* Tracked Order Result */}
      {searchAttempted && !trackedOrder && (
        <Card className="mb-8 border-destructive/30 bg-destructive/5">
          <CardContent className="p-6 text-center">
            <PackageOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-bold mb-1">Order Not Found</h3>
            <p className="text-muted-foreground text-sm">
              We couldn&apos;t find an order with ID &quot;{query}&quot;. Please verify the order number from your confirmation email.
            </p>
          </CardContent>
        </Card>
      )}

      {trackedOrder && (
        <div className="space-y-6 mb-10">
          {/* Order Header */}
          <Card className="border-border/60 shadow-xs">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-black text-primary">{trackedOrder.id}</span>
                    <button
                      onClick={() => copyOrderId(trackedOrder.id)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Copy ID"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Placed on {trackedOrder.placedAt} · Customer: {trackedOrder.customer?.name}
                  </p>
                </div>
                <Badge variant="outline" className={`${trackedOrder.statusColor} text-sm font-semibold px-3 py-1`}>
                  {trackedOrder.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/40 rounded-xl text-xs mb-6">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Estimated Delivery</span>
                  <span className="font-bold text-sm text-foreground">{trackedOrder.estimatedDelivery}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Carrier Tracking Number</span>
                  <span className="font-mono font-bold text-sm text-primary">
                    {trackedOrder.trackingNumber || "Pending Courier Scan"}
                  </span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Fulfillment Milestones</h4>
                <div className="relative pl-6 space-y-6 border-l-2 border-primary/30 ml-3">
                  {trackedOrder.steps.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div
                        className={`absolute -left-[31px] top-0 h-6 w-6 rounded-full flex items-center justify-center border-2 ${
                          step.done
                            ? "border-primary bg-primary text-primary-foreground shadow-xs"
                            : "border-muted-foreground/30 bg-background text-muted-foreground"
                        }`}
                      >
                        {getStepIcon(step.label, step.done)}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-semibold ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.label}
                        </span>
                        <span className="text-muted-foreground font-mono">{step.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Package Items */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Items in this shipment ({trackedOrder.items.length})
                </h4>
                <div className="divide-y">
                  {trackedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2.5 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="h-10 w-10 rounded-md object-cover border" />
                        <div>
                          <p className="font-semibold text-foreground">{item.name}</p>
                          <p className="text-muted-foreground">
                            Qty: {item.quantity} · {item.variant}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Orders helper for demo */}
      {mounted && orders.length > 0 && !trackedOrder && (
        <div>
          <h2 className="text-base font-bold tracking-tight mb-3 text-muted-foreground">Or click an order to track:</h2>
          <div className="space-y-2.5">
            {orders.slice(0, 4).map((order) => (
              <Card
                key={order.id}
                className="hover:border-primary/40 transition-colors cursor-pointer"
                onClick={() => handleQuickTrack(order.id)}
              >
                <CardContent className="p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-1.5 text-sm">
                        <span>{order.id}</span>
                        <span className="text-muted-foreground font-normal">({order.customer.name})</span>
                      </div>
                      <div className="text-muted-foreground">
                        {order.placedAt} · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`${order.statusColor} text-[11px]`}>
                      {order.status}
                    </Badge>
                    <span className="font-bold text-sm">${order.total.toFixed(2)}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center text-muted-foreground">Loading Tracking...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
