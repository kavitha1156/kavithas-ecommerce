"use client";

import { useState, useEffect, useId, useRef } from "react";
import {
  Package,
  Plus,
  Search,
  Trash2,
  Edit,
  X,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  ShoppingBag,
  Clock,
  Printer,
  FileText,
  Upload,
  RefreshCw,
  Layers,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  Store,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useProductStore } from "@/store/useProductStore";
import { useOrderStore, Order, OrderStatusType } from "@/store/useOrderStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Product } from "@/lib/products";
import Link from "next/link";

const CATEGORIES = [
  { value: "clothing", label: "Clothing" },
  { value: "accessories", label: "Accessories" },
  { value: "electronics", label: "Electronics" },
  { value: "home", label: "Home & Living" },
  { value: "sports", label: "Sports & Fitness" },
  { value: "books", label: "Books & Media" },
  { value: "beauty", label: "Beauty & Care" },
];

export default function AdminPortalPage() {
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((state) => state.user);
  const products = useProductStore((state) => state.products);
  const addProduct = useProductStore((state) => state.addProduct);
  const removeProduct = useProductStore((state) => state.removeProduct);
  const restockProduct = useProductStore((state) => state.restockProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const orders = useOrderStore((state) => state.orders);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);

  // Tabs state
  const [activeTab, setActiveTab] = useState("overview");

  // Inventory search & filter
  const [inventorySearch, setInventorySearch] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "healthy" | "low" | "out">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Restock Modal
  const [restockItem, setRestockItem] = useState<Product | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(25);

  // Selected Order for detail & invoice modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatusType>("Processing");
  const [trackingInput, setTrackingInput] = useState("");

  // Add Product Form State
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productForm, setProductForm] = useState({
    name: "",
    sku: "",
    price: "",
    originalPrice: "",
    stockCount: "50",
    category: "clothing",
    brand: "",
    description: "",
    variants: "S, M, L, XL",
    isNew: true,
    isFeatured: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute key executive metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalUnitsInStock = products.reduce((sum, p) => sum + (p.stockCount ?? 0), 0);
  const lowStockProducts = products.filter((p) => (p.stockCount ?? 0) > 0 && (p.stockCount ?? 0) <= 5);
  const outOfStockProducts = products.filter((p) => !p.inStock || (p.stockCount ?? 0) === 0);
  const pendingOrders = orders.filter((o) => o.status === "Processing" || o.status === "Pending" || o.status === "Confirmed");

  // Handle local image upload via FileReader
  const handleImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setUploadedImages((prev) => [...prev, result]);
          toast.success(`Uploaded ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddCustomImageUrl = () => {
    if (!customImageUrl.trim()) return;
    setUploadedImages((prev) => [...prev, customImageUrl.trim()]);
    setCustomImageUrl("");
    toast.success("Image URL added!");
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerateSku = () => {
    const prefix = productForm.category.slice(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    setProductForm((prev) => ({ ...prev, sku: `OWI-${prefix}-${random}` }));
    toast.info("Generated new SKU");
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      toast.error("Please fill in required fields: Product Name and Selling Price.");
      return;
    }

    const finalImages =
      uploadedImages.length > 0
        ? uploadedImages
        : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"];

    const priceNum = parseFloat(productForm.price);
    const origPriceNum = productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined;
    const stockNum = parseInt(productForm.stockCount || "0", 10);
    const categoryObj = CATEGORIES.find((c) => c.value === productForm.category);

    const newProd = addProduct({
      name: productForm.name.trim(),
      price: priceNum,
      originalPrice: origPriceNum,
      stockCount: stockNum,
      sku: productForm.sku.trim() || `OWI-${productForm.category.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      image: finalImages[0],
      images: finalImages,
      category: productForm.category,
      categoryLabel: categoryObj?.label || productForm.category,
      brand: productForm.brand.trim() || "Kavitha's Store",
      description:
        productForm.description.trim() ||
        `Premium ${categoryObj?.label || "apparel"} designed for style, comfort, and everyday durability. Crafted with high quality materials.`,
      inStock: stockNum > 0,
      isNew: productForm.isNew,
      isFeatured: productForm.isFeatured,
      variants: productForm.variants
        ? productForm.variants.split(",").map((v) => v.trim()).filter(Boolean)
        : ["Standard"],
    });

    toast.success(`🎉 Product "${newProd.name}" added with ${stockNum} units in stock!`);

    // Reset form
    setProductForm({
      name: "",
      sku: "",
      price: "",
      originalPrice: "",
      stockCount: "50",
      category: "clothing",
      brand: "",
      description: "",
      variants: "S, M, L, XL",
      isNew: true,
      isFeatured: false,
    });
    setUploadedImages([]);
    setActiveTab("inventory");
  };

  const handleRestockSubmit = () => {
    if (!restockItem) return;
    const addUnits = Number(restockAmount);
    if (isNaN(addUnits) || addUnits <= 0) {
      toast.error("Please enter a valid number of units to add.");
      return;
    }

    restockProduct(restockItem.id, addUnits);
    const newTotal = (restockItem.stockCount ?? 0) + addUnits;
    toast.success(`Restocked ${restockItem.name} with +${addUnits} units. Total now: ${newTotal}`);
    setRestockItem(null);
  };

  const handleUpdateOrderStatus = () => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, newStatus, trackingInput.trim() || selectedOrder.trackingNumber);
    toast.success(`Order ${selectedOrder.id} status updated to "${newStatus}"`);
    // update local reference
    setSelectedOrder({
      ...selectedOrder,
      status: newStatus,
      trackingNumber: trackingInput.trim() || selectedOrder.trackingNumber,
    });
  };

  // Filter products for inventory table
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(inventorySearch.toLowerCase())) ||
      p.brand.toLowerCase().includes(inventorySearch.toLowerCase());

    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;

    let matchesStock = true;
    const stock = p.stockCount ?? 0;
    if (stockFilter === "healthy") matchesStock = stock > 5;
    if (stockFilter === "low") matchesStock = stock > 0 && stock <= 5;
    if (stockFilter === "out") matchesStock = stock === 0 || !p.inStock;

    return matchesSearch && matchesCategory && matchesStock;
  });

  if (!mounted) {
    return (
      <div className="container py-20 text-center text-muted-foreground">
        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
        Loading Admin Operations Portal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background pb-16">
      {/* Top Banner & Header */}
      <div className="border-b bg-background shadow-xs">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-primary text-primary-foreground font-mono uppercase text-xs tracking-wider">
                  Store Management Portal
                </Badge>
                <span className="text-xs text-muted-foreground font-medium">Kavitha's Store v2.4</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight mt-1">Admin & Stock Command Center</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Complete control over products, inventory replenishment, customer orders, and store revenues.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" asChild className="gap-2">
                <Link href="/" target="_blank">
                  <Store className="h-4 w-4 text-primary" /> View Live Storefront
                </Link>
              </Button>
              <Button
                size="sm"
                className="gap-2 shadow-xs"
                onClick={() => {
                  setActiveTab("add-product");
                }}
              >
                <Plus className="h-4 w-4" /> Add New Stock & Product
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Nav Tabs */}
          <TabsList className="bg-muted/80 p-1 rounded-xl h-auto flex flex-wrap gap-1 border">
            <TabsTrigger value="overview" className="gap-2 py-2 px-4 rounded-lg">
              <TrendingUp className="h-4 w-4" /> Executive Overview
            </TabsTrigger>
            <TabsTrigger value="inventory" className="gap-2 py-2 px-4 rounded-lg relative">
              <Package className="h-4 w-4" /> Inventory & Stock Manager
              {lowStockProducts.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-white">
                  {lowStockProducts.length} low
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="add-product" className="gap-2 py-2 px-4 rounded-lg">
              <Plus className="h-4 w-4" /> Add Product with Images
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2 py-2 px-4 rounded-lg relative">
              <ShoppingBag className="h-4 w-4" /> Customer Orders & Fulfillment
              {pendingOrders.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                  {pendingOrders.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ════════════════════════════════════════════════════════════════
              TAB 1: EXECUTIVE OVERVIEW
             ════════════════════════════════════════════════════════════════ */}
          <TabsContent value="overview" className="space-y-8">
            {/* Top KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <Card className="border-border/60 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center justify-between">
                    Total Store Revenue
                    <span className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 font-bold">$</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black tracking-tight">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                    <ArrowUpRight className="h-3 w-3" /> +18.4% from last 30 days
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center justify-between">
                    Total Orders Processed
                    <ShoppingBag className="h-4 w-4 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black tracking-tight">{orders.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pendingOrders.length} pending fulfillment
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center justify-between">
                    Active Catalog Items
                    <Layers className="h-4 w-4 text-blue-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black tracking-tight">{products.length}</div>
                  <p className="text-xs text-blue-600 font-medium mt-1">
                    {totalUnitsInStock} total units in inventory
                  </p>
                </CardContent>
              </Card>

              <Card className={`border-border/60 shadow-xs relative overflow-hidden ${lowStockProducts.length > 0 ? "border-amber-400/50 bg-amber-500/5" : ""}`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full pointer-events-none" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center justify-between">
                    Restock Warnings
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black tracking-tight text-amber-600">
                    {lowStockProducts.length} <span className="text-sm font-normal text-muted-foreground">items</span>
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mt-1">
                    {outOfStockProducts.length} items currently out of stock
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Recent Orders Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders Overview */}
              <Card className="lg:col-span-2 border-border/60">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Recent Customer Orders</CardTitle>
                    <CardDescription>Live incoming purchases across web and mobile</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("orders")}>
                    View All Orders
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 border rounded-xl hover:bg-muted/40 transition-colors gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {order.customer.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-sm flex items-center gap-2">
                            <span>{order.customer.name}</span>
                            <span className="text-xs text-muted-foreground font-mono">({order.id})</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {order.items.length} item{order.items.length !== 1 ? "s" : ""} · {order.placedAt} · {order.paymentMethod}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <Badge variant="outline" className={`${order.statusColor} text-xs font-semibold`}>
                          {order.status}
                        </Badge>
                        <div className="font-bold text-sm">${order.total.toFixed(2)}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => {
                            setSelectedOrder(order);
                            setNewStatus(order.status);
                            setTrackingInput(order.trackingNumber || "");
                            setShowInvoiceModal(true);
                          }}
                        >
                          Invoice <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Inventory Health & Quick Restock shortcut */}
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle className="text-lg">Inventory Health Status</CardTitle>
                  <CardDescription>Real-time stock depletion monitor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>In-Stock Ratio</span>
                      <span className="font-bold">
                        {Math.round(((products.length - outOfStockProducts.length) / (products.length || 1)) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full"
                        style={{
                          width: `${((products.length - lowStockProducts.length - outOfStockProducts.length) / (products.length || 1)) * 100}%`,
                        }}
                      />
                      <div
                        className="bg-amber-400 h-full"
                        style={{ width: `${(lowStockProducts.length / (products.length || 1)) * 100}%` }}
                      />
                      <div
                        className="bg-rose-500 h-full"
                        style={{ width: `${(outOfStockProducts.length / (products.length || 1)) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" /> Healthy
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-amber-400" /> Low Stock
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-rose-500" /> Out
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Priority Restock Alert ({lowStockProducts.length})
                    </h4>
                    {lowStockProducts.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">All products have healthy stock levels.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {lowStockProducts.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-xs p-2 bg-muted/40 rounded-lg">
                            <div className="flex items-center gap-2 truncate pr-2">
                              <img src={item.image} alt={item.name} className="h-7 w-7 rounded object-cover" />
                              <span className="font-medium truncate">{item.name}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-7 text-xs px-2 shrink-0 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
                              onClick={() => {
                                setRestockItem(item);
                                setRestockAmount(25);
                              }}
                            >
                              + Restock ({item.stockCount} left)
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full gap-2"
                    variant="outline"
                    onClick={() => setActiveTab("add-product")}
                  >
                    <Plus className="h-4 w-4" /> Add New Product to Store
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ════════════════════════════════════════════════════════════════
              TAB 2: INVENTORY & STOCK MANAGER
             ════════════════════════════════════════════════════════════════ */}
          <TabsContent value="inventory" className="space-y-6">
            <Card className="border-border/60">
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" /> Inventory & Stock Replenishment
                    </CardTitle>
                    <CardDescription>
                      Monitor quantities, update pricing, restock newly arrived shipments, and manage product listings.
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button onClick={() => setActiveTab("add-product")} className="gap-2">
                      <Plus className="h-4 w-4" /> Add Product
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Search & Filter Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by product name, SKU, brand..."
                      className="pl-9 h-10"
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {/* Category Filter */}
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="h-10 rounded-md border border-input bg-background px-3 text-xs font-medium"
                    >
                      <option value="all">All Categories</option>
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>

                    {/* Stock Status Filter */}
                    <select
                      value={stockFilter}
                      onChange={(e) => setStockFilter(e.target.value as any)}
                      className="h-10 rounded-md border border-input bg-background px-3 text-xs font-medium"
                    >
                      <option value="all">All Stock Status</option>
                      <option value="healthy">Healthy Stock (&gt; 5)</option>
                      <option value="low">Low Stock (1-5)</option>
                      <option value="out">Out of Stock (0)</option>
                    </select>
                  </div>
                </div>

                {/* Products Table */}
                <div className="rounded-xl border overflow-hidden bg-background">
                  <div className="grid grid-cols-12 gap-3 p-3.5 bg-muted/60 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <div className="col-span-4">Product Info</div>
                    <div className="col-span-2">SKU & Category</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-2">Current Stock</div>
                    <div className="col-span-2 text-right">Stock Actions</div>
                  </div>

                  <div className="divide-y max-h-[600px] overflow-y-auto">
                    {filteredProducts.length === 0 ? (
                      <div className="py-12 text-center text-muted-foreground">
                        <Package className="h-10 w-10 mx-auto opacity-30 mb-2" />
                        <p>No products match your search/filter criteria.</p>
                      </div>
                    ) : (
                      filteredProducts.map((product) => {
                        const stock = product.stockCount ?? 0;
                        const isLow = stock > 0 && stock <= 5;
                        const isOut = stock === 0 || !product.inStock;

                        return (
                          <div
                            key={product.id}
                            className="grid grid-cols-12 gap-3 p-3.5 text-sm items-center hover:bg-muted/20 transition-colors"
                          >
                            {/* Product Info */}
                            <div className="col-span-4 flex items-center gap-3">
                              <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden shrink-0 border">
                                <img src={product.image} alt={product.name} className="object-cover h-full w-full" />
                              </div>
                              <div className="truncate">
                                <div className="font-semibold text-foreground truncate">{product.name}</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                  <span>{product.brand}</span>
                                  {product.isNew && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                      New
                                    </Badge>
                                  )}
                                  {product.isFeatured && (
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-500/40 text-amber-600">
                                      Featured
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* SKU & Category */}
                            <div className="col-span-2 space-y-1">
                              <div className="text-xs font-mono font-medium text-muted-foreground">
                                {product.sku || `OWI-${product.id}`}
                              </div>
                              <Badge variant="outline" className="text-[11px] capitalize">
                                {product.categoryLabel}
                              </Badge>
                            </div>

                            {/* Price */}
                            <div className="col-span-2">
                              <div className="font-bold">${product.price.toFixed(2)}</div>
                              {product.originalPrice && (
                                <div className="text-xs text-muted-foreground line-through">
                                  ${product.originalPrice.toFixed(2)}
                                </div>
                              )}
                            </div>

                            {/* Stock Count */}
                            <div className="col-span-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-block h-2.5 w-2.5 rounded-full shrink-0 ${
                                    isOut ? "bg-rose-500" : isLow ? "bg-amber-400" : "bg-emerald-500"
                                  }`}
                                />
                                <span className="font-bold text-sm">{stock} units</span>
                              </div>
                              <div className="text-xs mt-0.5">
                                {isOut ? (
                                  <span className="text-rose-600 font-semibold">Out of Stock</span>
                                ) : isLow ? (
                                  <span className="text-amber-600 font-semibold">Low Stock Alert!</span>
                                ) : (
                                  <span className="text-emerald-600">Healthy</span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="col-span-2 flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1 text-xs border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground font-medium"
                                onClick={() => {
                                  setRestockItem(product);
                                  setRestockAmount(25);
                                }}
                              >
                                <Plus className="h-3 w-3" /> Restock
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                title="Delete Product"
                                onClick={() => {
                                  if (confirm(`Remove "${product.name}" from catalog?`)) {
                                    removeProduct(product.id);
                                    toast.success(`Deleted "${product.name}"`);
                                  }
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ════════════════════════════════════════════════════════════════
              TAB 3: ADD PRODUCT WITH IMAGE UPLOAD
             ════════════════════════════════════════════════════════════════ */}
          <TabsContent value="add-product" className="space-y-6">
            <Card className="border-border/60 max-w-4xl mx-auto shadow-xs">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Add New Product & Stock</CardTitle>
                    <CardDescription>
                      Upload product photographs from your device, configure SKU, assign initial warehouse inventory, and publish live to the storefront.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleCreateProduct} className="space-y-8">
                  {/* 1. Image Upload Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-primary" /> Product Photographs & Gallery *
                      </label>
                      <span className="text-xs text-muted-foreground">
                        {uploadedImages.length} image{uploadedImages.length !== 1 ? "s" : ""} selected
                      </span>
                    </div>

                    {/* Drag & Drop File Upload Box */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-primary/30 hover:border-primary/70 bg-muted/20 hover:bg-primary/5 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageFiles}
                      />
                      <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6" />
                      </div>
                      <h4 className="font-semibold text-base mb-1">Click to browse or drop images from your computer</h4>
                      <p className="text-xs text-muted-foreground max-w-md">
                        Supports PNG, JPG, WebP. Images are saved locally for instant high-speed rendering across the catalog.
                      </p>
                    </div>

                    {/* Or URL Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Or paste an external Image URL (e.g. https://images.unsplash.com/...)"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        className="text-sm h-10"
                      />
                      <Button type="button" variant="outline" onClick={handleAddCustomImageUrl} className="shrink-0">
                        Add URL
                      </Button>
                    </div>

                    {/* Uploaded Thumbnails Preview */}
                    {uploadedImages.length > 0 && (
                      <div className="flex flex-wrap gap-3 pt-2">
                        {uploadedImages.map((imgUrl, index) => (
                          <div
                            key={index}
                            className="relative h-24 w-24 rounded-xl overflow-hidden border-2 border-primary/30 shadow-xs group"
                          >
                            <img src={imgUrl} alt={`Uploaded ${index + 1}`} className="object-cover h-full w-full" />
                            {index === 0 && (
                              <Badge className="absolute bottom-1 left-1 text-[9px] px-1 py-0 bg-primary/90">
                                Primary
                              </Badge>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove image"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* 2. General Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-primary" /> Product Title *
                      </label>
                      <Input
                        placeholder="e.g. Classic Oxford Cotton Shirt"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold">SKU (Stock Keeping Unit)</label>
                        <button
                          type="button"
                          onClick={handleGenerateSku}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          Auto-Generate
                        </button>
                      </div>
                      <Input
                        placeholder="e.g. OWI-CLO-2041"
                        value={productForm.sku}
                        onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Category</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Brand / Manufacturer</label>
                      <Input
                        placeholder="e.g. Kavitha's Studio, EcoWear"
                        value={productForm.brand}
                        onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* 3. Pricing and Stock Numbers */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-5 bg-muted/30 rounded-2xl border">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <DollarSign className="h-3.5 w-3.5" /> Selling Price ($) *
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="49.99"
                        required
                        className="font-bold"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">
                        Compare-at / Original ($)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="69.99 (Optional)"
                        value={productForm.originalPrice}
                        onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                      />
                      <span className="text-[11px] text-muted-foreground">Shows as crossed-out discount</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-1 text-primary">
                        <Package className="h-3.5 w-3.5" /> Initial Stock Count *
                      </label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="50"
                        required
                        className="font-bold"
                        value={productForm.stockCount}
                        onChange={(e) => setProductForm({ ...productForm, stockCount: e.target.value })}
                      />
                      <span className="text-[11px] text-muted-foreground">Units available immediately</span>
                    </div>
                  </div>

                  {/* 4. Variants & Description */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Variants / Sizes / Options (Comma separated)</label>
                      <Input
                        placeholder="e.g. Small, Medium, Large, Extra Large"
                        value={productForm.variants}
                        onChange={(e) => setProductForm({ ...productForm, variants: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Product Description</label>
                      <textarea
                        rows={3}
                        className="w-full rounded-md border border-input bg-background p-3 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Describe key features, materials, fit, warranty, and washing instructions..."
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      />
                    </div>

                    <div className="flex flex-wrap gap-6 pt-2">
                      <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.isNew}
                          onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                          className="h-4 w-4 rounded accent-primary"
                        />
                        Display &quot;New Arrival&quot; Badge
                      </label>

                      <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.isFeatured}
                          onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                          className="h-4 w-4 rounded accent-primary"
                        />
                        Highlight on Homepage Featured Carousel
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("inventory")}>
                      Cancel
                    </Button>
                    <Button type="submit" size="lg" className="gap-2 px-8 shadow-sm">
                      <Plus className="h-4 w-4" /> Publish Product to Storefront
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ════════════════════════════════════════════════════════════════
              TAB 4: CUSTOMER ORDERS & FULFILLMENT
             ════════════════════════════════════════════════════════════════ */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="border-border/60">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-primary" /> Customer Orders & Fulfillment Hub
                    </CardTitle>
                    <CardDescription>
                      View incoming customer purchases, update fulfillment statuses, assign tracking codes, and generate printable invoices.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs px-3 py-1 font-semibold w-fit">
                    {orders.length} Total Orders
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="rounded-xl border overflow-hidden">
                  <div className="grid grid-cols-12 gap-3 p-3.5 bg-muted/60 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <div className="col-span-2">Order ID</div>
                    <div className="col-span-3">Customer</div>
                    <div className="col-span-2">Placed Date</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1">Total</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>

                  <div className="divide-y max-h-[600px] overflow-y-auto">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="grid grid-cols-12 gap-3 p-3.5 text-sm items-center hover:bg-muted/20 transition-colors"
                      >
                        <div className="col-span-2 font-mono font-bold text-primary">{order.id}</div>
                        <div className="col-span-3 truncate">
                          <div className="font-semibold truncate">{order.customer.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{order.customer.email}</div>
                        </div>
                        <div className="col-span-2 text-xs text-muted-foreground">{order.placedAt}</div>
                        <div className="col-span-2">
                          <Badge variant="outline" className={`${order.statusColor} text-xs font-medium`}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="col-span-1 font-bold">${order.total.toFixed(2)}</div>
                        <div className="col-span-2 flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs gap-1"
                            onClick={() => {
                              setSelectedOrder(order);
                              setNewStatus(order.status);
                              setTrackingInput(order.trackingNumber || "");
                              setShowInvoiceModal(true);
                            }}
                          >
                            <FileText className="h-3.5 w-3.5" /> Details / Invoice
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          MODAL: QUICK RESTOCK (EXTRA STOCK SHIPMENT ARRIVED)
         ════════════════════════════════════════════════════════════════ */}
      {restockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <Card className="w-full max-w-md shadow-2xl border-primary/20">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" /> Restock Inventory
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setRestockItem(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Add newly arrived warehouse stock to &quot;{restockItem.name}&quot;
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
                <img src={restockItem.image} alt={restockItem.name} className="h-12 w-12 rounded-lg object-cover" />
                <div>
                  <div className="font-semibold text-sm">{restockItem.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Current Available Stock:{" "}
                    <span className="font-bold text-foreground">{restockItem.stockCount ?? 0} units</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">How many units arrived in this shipment?</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[10, 25, 50, 100].map((preset) => (
                    <Button
                      key={preset}
                      type="button"
                      variant={restockAmount === preset ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRestockAmount(preset)}
                      className="text-xs"
                    >
                      +{preset}
                    </Button>
                  ))}
                </div>
                <Input
                  type="number"
                  min="1"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(parseInt(e.target.value || "0", 10))}
                  className="font-bold text-center text-lg h-11"
                />
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                After restocking, total available quantity will be:{" "}
                <span className="font-bold text-sm">{(restockItem.stockCount ?? 0) + (Number(restockAmount) || 0)} units</span>.
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setRestockItem(null)}>
                  Cancel
                </Button>
                <Button className="flex-1 gap-2" onClick={handleRestockSubmit}>
                  <CheckCircle2 className="h-4 w-4" /> Confirm Restock
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODAL: ORDER DETAILS, FULFILLMENT & PRINTABLE INVOICE
         ════════════════════════════════════════════════════════════════ */}
      {showInvoiceModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-primary/20">
            <CardHeader className="border-b sticky top-0 bg-background z-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" /> Order Invoice &amp; Fulfillment
                  </CardTitle>
                  <CardDescription>Order ID: {selectedOrder.id}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => {
                      window.print();
                    }}
                  >
                    <Printer className="h-3.5 w-3.5" /> Print
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowInvoiceModal(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Order Status & Tracking Updater (Admin Control) */}
              <div className="p-4 bg-muted/40 rounded-xl border space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-primary" /> Fulfillment Status & Carrier Tracking
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Fulfillment Stage</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as OrderStatusType)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs font-semibold"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Carrier Tracking Code</label>
                    <Input
                      placeholder="e.g. OWI-TRK-984210"
                      className="h-9 text-xs font-mono"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                    />
                  </div>
                </div>
                <Button size="sm" onClick={handleUpdateOrderStatus} className="w-full sm:w-auto text-xs">
                  Save Fulfillment Update
                </Button>
              </div>

              {/* Printable Invoice Block */}
              <div className="border rounded-2xl p-6 bg-background space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <span className="text-2xl font-black tracking-tight text-primary">Kavitha's</span>
                    <p className="text-xs text-muted-foreground mt-0.5">Premium Commerce Lifestyle Ltd.</p>
                    <p className="text-xs text-muted-foreground">120 Summer Fashion Ave, Suite 400</p>
                    <p className="text-xs text-muted-foreground">support@kavithas-store.com</p>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold">INVOICE</div>
                    <div className="text-xs font-mono font-medium text-muted-foreground mt-1">
                      Invoice #: {selectedOrder.id}
                    </div>
                    <div className="text-xs text-muted-foreground">Date: {selectedOrder.placedAt}</div>
                    <div className="text-xs text-muted-foreground">Est. Delivery: {selectedOrder.estimatedDelivery}</div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-muted-foreground uppercase text-[10px]">Billed &amp; Shipped To:</span>
                    <div className="font-semibold text-sm text-foreground mt-1">{selectedOrder.customer.name}</div>
                    <div className="text-muted-foreground">{selectedOrder.shippingAddress}</div>
                    <div className="text-muted-foreground">{selectedOrder.customer.email}</div>
                    <div className="text-muted-foreground">{selectedOrder.customer.phone}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-muted-foreground uppercase text-[10px]">Payment Method:</span>
                    <div className="font-semibold text-sm text-foreground mt-1">{selectedOrder.paymentMethod}</div>
                    <div className="mt-2 font-bold text-muted-foreground uppercase text-[10px]">Tracking Number:</div>
                    <div className="font-mono text-xs text-primary font-bold">
                      {selectedOrder.trackingNumber || "Pending Dispatch"}
                    </div>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="border rounded-xl overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 p-2.5 bg-muted/60 text-[11px] font-bold uppercase text-muted-foreground">
                    <div className="col-span-6">Item</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-2 text-right">Amount</div>
                  </div>
                  <div className="divide-y text-xs">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 p-2.5 items-center">
                        <div className="col-span-6 font-medium">
                          {item.name}
                          {item.variant && <span className="text-muted-foreground ml-1">({item.variant})</span>}
                        </div>
                        <div className="col-span-2 text-center font-semibold">{item.quantity}</div>
                        <div className="col-span-2 text-right">${item.price.toFixed(2)}</div>
                        <div className="col-span-2 text-right font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="flex justify-end">
                  <div className="w-60 space-y-1.5 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal:</span>
                      <span>${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping:</span>
                      <span>{selectedOrder.shipping === 0 ? "FREE" : `$${selectedOrder.shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Estimated Tax:</span>
                      <span>${selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex justify-between font-bold text-sm text-foreground">
                      <span>Total:</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
