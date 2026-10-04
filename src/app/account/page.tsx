"use client";

import { useState, useEffect } from "react";
import {
  Package,
  User,
  Heart,
  MapPin,
  Clock,
  ExternalLink,
  Trash2,
  Plus,
  CheckCircle2,
  CreditCard,
  Truck,
  Shield,
  FileText,
  ShoppingBag,
  Bell,
  ArrowRight,
  Printer,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useOrderStore, Order } from "@/store/useOrderStore";
import { useProductStore } from "@/store/useProductStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

interface SavedAddress {
  id: string;
  type: string;
  recipient: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export default function AccountPage() {
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((state) => state.user);
  const switchRole = useAuthStore((state) => state.switchRole);

  const orders = useOrderStore((state) => state.orders);
  const products = useProductStore((state) => state.products);
  const wishlistIds = useWishlistStore((state) => state.items);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const addToCart = useCartStore((state) => state.addItem);

  // Tab State
  const [activeTab, setActiveTab] = useState("orders");

  // Selected Order for Receipt Modal
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Address Book state
  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: "addr-1",
      type: "Home (Default)",
      recipient: "John Doe",
      street: "123 Commerce Way, Apt 4B",
      city: "Tech City",
      state: "CA",
      zip: "94016",
      isDefault: true,
    },
    {
      id: "addr-2",
      type: "Office",
      recipient: "John Doe (C/O Tech Corp)",
      street: "500 Market St, Floor 12",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      isDefault: false,
    },
  ]);

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: "Home",
    recipient: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  // Profile Form state
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 234-5678",
    notifications: true,
    orderUpdates: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter products matching wishlist
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.recipient || !newAddress.street || !newAddress.city) {
      toast.error("Please fill in recipient, street, and city.");
      return;
    }

    const created: SavedAddress = {
      id: `addr-${Date.now()}`,
      type: newAddress.type || "Home",
      recipient: newAddress.recipient,
      street: newAddress.street,
      city: newAddress.city,
      state: newAddress.state || "CA",
      zip: newAddress.zip || "10001",
      isDefault: addresses.length === 0,
    };

    setAddresses([...addresses, created]);
    setShowAddAddress(false);
    setNewAddress({ type: "Home", recipient: "", street: "", city: "", state: "", zip: "" });
    toast.success("New shipping address added!");
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    toast.success("Default address updated!");
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    toast.success("Address removed.");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Account profile and notification preferences updated!");
  };

  if (!mounted) {
    return <div className="container py-16 text-center text-muted-foreground">Loading Account Portal...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background pb-16">
      {/* Top Banner */}
      <div className="border-b bg-background shadow-xs">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl border">
                JD
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight">{profile.name}</h1>
                  <Badge variant="secondary" className="text-xs">
                    Customer Portal
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {profile.email} · Member since 2025 · {orders.length} orders
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild className="gap-2 text-xs">
                <Link href="/admin">
                  <Shield className="h-3.5 w-3.5 text-primary" /> Store Owner Admin Portal
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/80 p-1 rounded-xl h-auto flex flex-wrap gap-1 border">
            <TabsTrigger value="orders" className="gap-2 py-2 px-4 rounded-lg">
              <Package className="h-4 w-4" /> My Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-2 py-2 px-4 rounded-lg">
              <Heart className="h-4 w-4" /> Wishlist ({wishlistProducts.length})
            </TabsTrigger>
            <TabsTrigger value="addresses" className="gap-2 py-2 px-4 rounded-lg">
              <MapPin className="h-4 w-4" /> Saved Addresses ({addresses.length})
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2 py-2 px-4 rounded-lg">
              <User className="h-4 w-4" /> Profile &amp; Settings
            </TabsTrigger>
          </TabsList>

          {/* ════════════════════════════════════════════════════════════════
              TAB 1: MY ORDERS
             ════════════════════════════════════════════════════════════════ */}
          <TabsContent value="orders" className="space-y-4">
            {orders.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                <h3 className="text-lg font-bold">No orders placed yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Browse our catalog, pick items, and complete checkout to see them tracked here in real time.
                </p>
                <Button asChild>
                  <Link href="/products">Explore Store Catalog</Link>
                </Button>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="border-border/60 overflow-hidden shadow-xs">
                  {/* Order Header */}
                  <div className="p-4 bg-muted/40 border-b flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Order ID</span>
                        <span className="font-mono font-bold text-sm text-primary">{order.id}</span>
                      </div>
                      <Separator orientation="vertical" className="h-7 hidden sm:block" />
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Date Placed</span>
                        <span className="font-medium text-foreground">{order.placedAt}</span>
                      </div>
                      <Separator orientation="vertical" className="h-7 hidden sm:block" />
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Total</span>
                        <span className="font-bold text-sm text-foreground">${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${order.statusColor} text-xs font-semibold px-2.5 py-0.5`}>
                        {order.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1"
                        onClick={() => setReceiptOrder(order)}
                      >
                        <FileText className="h-3.5 w-3.5" /> Digital Receipt
                      </Button>
                    </div>
                  </div>

                  {/* Order Body */}
                  <CardContent className="p-5 space-y-4">
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4 py-1">
                          <div className="flex items-center gap-3 truncate">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-14 w-14 rounded-lg object-cover border shrink-0"
                            />
                            <div className="truncate">
                              <Link
                                href={`/product/${item.id}`}
                                className="font-semibold text-sm hover:text-primary transition-colors truncate block"
                              >
                                {item.name}
                              </Link>
                              <div className="text-xs text-muted-foreground">
                                Qty: {item.quantity} · Variant: {item.variant || "Standard"} · ${item.price.toFixed(2)} ea
                              </div>
                            </div>
                          </div>
                          <div className="font-bold text-sm shrink-0">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Truck className="h-4 w-4 text-primary shrink-0" />
                        <span>
                          Estimated Delivery: <strong className="text-foreground">{order.estimatedDelivery}</strong>
                          {order.trackingNumber && (
                            <span className="ml-1.5 font-mono text-[11px]">({order.trackingNumber})</span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="default" asChild className="h-8 gap-1.5 text-xs">
                          <Link href={`/order-tracking?id=${order.id}`}>
                            <Clock className="h-3.5 w-3.5" /> Track Package Live
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* ════════════════════════════════════════════════════════════════
              TAB 2: WISHLIST
             ════════════════════════════════════════════════════════════════ */}
          <TabsContent value="wishlist" className="space-y-4">
            {wishlistProducts.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <h3 className="text-lg font-bold">Your wishlist is currently empty</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tap the heart icon on any product in the store to save it here for later.
                </p>
                <Button asChild>
                  <Link href="/products">Browse All Products</Link>
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {wishlistProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden group border-border/60 flex flex-col justify-between">
                    <div>
                      <div className="aspect-square relative overflow-hidden bg-muted">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur text-rose-500 hover:text-rose-600 hover:bg-background"
                          onClick={() => {
                            removeFromWishlist(product.id);
                            toast.info(`Removed "${product.name}" from wishlist`);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <span className="text-xs text-muted-foreground capitalize">{product.categoryLabel}</span>
                        <h4 className="font-semibold text-base line-clamp-1 mt-0.5">{product.name}</h4>
                        <div className="font-bold text-lg mt-1">${product.price.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <Button
                        className="w-full gap-2"
                        disabled={!product.inStock}
                        onClick={() => {
                          addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            variant: product.variants[0] || "Standard",
                          });
                          toast.success(`Moved "${product.name}" to cart!`);
                        }}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        {product.inStock ? "Move to Cart" : "Out of Stock"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ════════════════════════════════════════════════════════════════
              TAB 3: SAVED ADDRESSES
             ════════════════════════════════════════════════════════════════ */}
          <TabsContent value="addresses" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Delivery Addresses</h3>
                <p className="text-xs text-muted-foreground">Manage your shipping destinations for faster 1-click checkout</p>
              </div>
              <Button size="sm" className="gap-1.5" onClick={() => setShowAddAddress(!showAddAddress)}>
                <Plus className="h-4 w-4" /> Add New Address
              </Button>
            </div>

            {showAddAddress && (
              <Card className="border-primary/30 bg-primary/5 p-6 animate-in fade-in">
                <form onSubmit={handleAddAddress} className="space-y-4">
                  <h4 className="font-bold text-sm">Add Shipping Address</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold">Address Label</label>
                      <Input
                        placeholder="e.g. Home, Office, Beach House"
                        value={newAddress.type}
                        onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold">Recipient Full Name</label>
                      <Input
                        placeholder="e.g. Jane Doe"
                        required
                        value={newAddress.recipient}
                        onChange={(e) => setNewAddress({ ...newAddress, recipient: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold">Street Address</label>
                      <Input
                        placeholder="e.g. 742 Evergreen Terrace, Apt 10"
                        required
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold">City</label>
                      <Input
                        placeholder="e.g. Springfield"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-semibold">State</label>
                        <Input
                          placeholder="OR"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold">ZIP Code</label>
                        <Input
                          placeholder="97477"
                          value={newAddress.zip}
                          onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowAddAddress(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm">
                      Save Address
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <Card key={addr.id} className={`border ${addr.isDefault ? "border-primary bg-primary/5" : "border-border/60"}`}>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-primary" /> {addr.type}
                      </span>
                      {addr.isDefault && (
                        <Badge variant="default" className="text-[10px]">
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs space-y-0.5 text-muted-foreground">
                      <p className="font-semibold text-foreground text-sm">{addr.recipient}</p>
                      <p>{addr.street}</p>
                      <p>
                        {addr.city}, {addr.state} {addr.zip}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t text-xs">
                      {!addr.isDefault ? (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-primary hover:underline font-medium"
                        >
                          Set as Default
                        </button>
                      ) : (
                        <span className="text-muted-foreground text-[11px]">Active shipping address</span>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteAddress(addr.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ════════════════════════════════════════════════════════════════
              TAB 4: PROFILE & SETTINGS
             ════════════════════════════════════════════════════════════════ */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-border/60 max-w-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Customer Profile &amp; Preferences</CardTitle>
                <CardDescription>Personal details and communication alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold">Full Name</label>
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold">Email Address</label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold">Phone Number</label>
                      <Input
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Notification Preferences
                    </h4>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.orderUpdates}
                        onChange={(e) => setProfile({ ...profile, orderUpdates: e.target.checked })}
                        className="h-4 w-4 rounded accent-primary"
                      />
                      Send SMS and Email tracking notifications on order shipment
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.notifications}
                        onChange={(e) => setProfile({ ...profile, notifications: e.target.checked })}
                        className="h-4 w-4 rounded accent-primary"
                      />
                      Receive exclusive member discounts and seasonal flash sales
                    </label>
                  </div>

                  <div className="pt-3">
                    <Button type="submit">Save Profile Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          RECEIPT MODAL
         ════════════════════════════════════════════════════════════════ */}
      {receiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <Card className="w-full max-w-lg shadow-2xl border-primary/20">
            <CardHeader className="border-b pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Official Order Receipt</CardTitle>
                <CardDescription>Kavitha's · {receiptOrder.id}</CardDescription>
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={() => window.print()}>
                  <Printer className="h-3 w-3" /> Print
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setReceiptOrder(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              <div className="flex justify-between pb-3 border-b">
                <div>
                  <span className="font-bold text-primary text-base">Kavitha's</span>
                  <p className="text-muted-foreground text-[11px]">support@kavithas-store.com</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">Date: {receiptOrder.placedAt}</p>
                  <p className="text-muted-foreground font-mono">{receiptOrder.paymentMethod}</p>
                </div>
              </div>

              <div>
                <span className="font-bold text-[10px] uppercase text-muted-foreground">Ship To:</span>
                <p className="font-semibold text-foreground text-sm">{receiptOrder.customer.name}</p>
                <p className="text-muted-foreground">{receiptOrder.shippingAddress}</p>
              </div>

              <div className="border rounded-lg overflow-hidden divide-y">
                {receiptOrder.items.map((it, i) => (
                  <div key={i} className="flex justify-between p-2.5">
                    <div>
                      <span className="font-medium">{it.name}</span>
                      <span className="text-muted-foreground ml-1">× {it.quantity}</span>
                    </div>
                    <span className="font-bold">${(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-right">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal:</span>
                  <span>${receiptOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping:</span>
                  <span>{receiptOrder.shipping === 0 ? "FREE" : `$${receiptOrder.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (8%):</span>
                  <span>${receiptOrder.tax.toFixed(2)}</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between text-sm font-bold text-foreground">
                  <span>Total Paid:</span>
                  <span>${receiptOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
