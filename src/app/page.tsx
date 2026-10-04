"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Star,
  Shield,
  Phone,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Quote,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProductStore } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { toast } from "sonner";

// 6 Top Categories matching the mockup showcase
const FEATURED_CATEGORIES = [
  {
    title: "TANKS",
    rating: 5,
    reviews: "35k",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
    slug: "clothing",
  },
  {
    title: "T-SHIRTS",
    rating: 5,
    reviews: "54k",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80",
    slug: "clothing",
  },
  {
    title: "POLO SHIRTS",
    rating: 5,
    reviews: "42k",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80",
    slug: "clothing",
  },
  {
    title: "CASUAL SHIRTS",
    rating: 5,
    reviews: "29k",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
    slug: "clothing",
  },
  {
    title: "BANDANA & SCARVES",
    rating: 5,
    reviews: "15k",
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&q=80",
    slug: "accessories",
  },
  {
    title: "MEN BELTS",
    rating: 5,
    reviews: "22k",
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80",
    slug: "accessories",
  },
];

// Testimonials data matching the mockup
const TESTIMONIALS = [
  {
    id: 1,
    name: "John Smith",
    date: "10 August, 2026",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80",
    rating: 5,
    review: "The quality of the cotton and stitching is truly top notch. Delivered right on time in pristine packaging!",
  },
  {
    id: 2,
    name: "Michael Ross",
    date: "14 August, 2026",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80",
    rating: 5,
    review: "Ordered 3 polo shirts and a leather belt. The fit was perfect and the customer service was super responsive.",
  },
  {
    id: 3,
    name: "David Wright",
    date: "18 August, 2026",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80",
    rating: 5,
    review: "One of the best shopping experiences online. Great discounts on summer items and prompt dispatch.",
  },
];

const FILTER_TABS = ["All", "Tanks", "T-Shirts", "Polo Shirts", "Casual Shirts", "Bandana", "Belts"];

export default function Home() {
  const products = useProductStore((state) => state.products);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const [selectedTab, setSelectedTab] = useState("All");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter products for "Just For You"
  const justForYouProducts = products.filter((p) => {
    if (selectedTab === "All") return true;
    const searchKey = selectedTab.toLowerCase();
    return (
      p.name.toLowerCase().includes(searchKey) ||
      p.category.toLowerCase().includes(searchKey) ||
      p.categoryLabel.toLowerCase().includes(searchKey)
    );
  });

  const handleQuickAdd = (p: typeof products[0]) => {
    addItem({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      variant: p.variants?.[0] || "Standard",
      quantity: 1,
    });
    toast.success(`Added "${p.name}" to your cart!`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafbfc] text-[#222]">
      {/* ── 1. HERO SECTION (Summer Special Collection) ── */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#f8f9fc] via-[#f4f5f8] to-[#edf0f5] py-16 md:py-24 border-b border-border/40">
        {/* Floating circular product showcases matching modern e-commerce UI */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:flex absolute top-12 left-10 items-center gap-3 bg-white/90 backdrop-blur-md p-2 pr-4 rounded-full shadow-lg border border-primary/20 z-20 pointer-events-auto group hover:scale-105 transition-transform"
        >
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary shadow-sm shrink-0">
            <img
              src="https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=300&q=80"
              alt="Silk Bandana & Scarves"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-primary tracking-wider">Summer Drop</div>
            <div className="text-xs font-extrabold text-[#1a1f2c]">Silk Bandana</div>
            <div className="text-[11px] font-bold text-muted-foreground">$14.99</div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="hidden lg:flex absolute bottom-12 left-[38%] items-center gap-3 bg-white/95 backdrop-blur-md p-2 pr-4 rounded-full shadow-xl border border-primary/30 z-20 pointer-events-auto group hover:scale-105 transition-transform"
        >
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary shadow-sm shrink-0">
            <img
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&q=80"
              alt="Classic Crewneck T-Shirt"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">🔥 20% Off</div>
            <div className="text-xs font-extrabold text-[#1a1f2c]">Organic Tees</div>
            <div className="text-[11px] font-bold text-muted-foreground">$24.00</div>
          </div>
        </motion.div>

        {/* Large Decorative Backdrop Glow Circle */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-primary/15 via-primary/5 to-transparent blur-3xl pointer-events-none" />

        {/* Big stylized watermark on right */}
        <span className="hidden xl:block absolute right-8 top-1/2 -translate-y-1/2 -rotate-90 text-8xl font-black tracking-widest text-muted/30 select-none pointer-events-none">
          Kavitha's
        </span>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <div className="inline-block">
                <span className="font-serif italic text-2xl text-primary font-semibold tracking-wide">
                  Starting At Only $9.5
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-[#1a1f2c] uppercase leading-[1.1]">
                <span className="text-primary underline decoration-wavy decoration-primary/40">Summer</span> Special <br />
                Collection
              </h1>

              <p className="text-muted-foreground text-lg max-w-lg font-medium">
                Brand day flat 20% off and free shipping on all orders over $30. Discover premium materials crafted for every day.
              </p>

              {/* Action buttons matching mockup */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  size="lg"
                  className="rounded-md px-8 py-6 text-base font-bold shadow-lg shadow-primary/30 bg-primary hover:bg-primary/90 text-primary-foreground"
                  asChild
                >
                  <Link href="/products">Shop Now</Link>
                </Button>

                <div className="flex items-center gap-3 px-4 py-3 rounded-md bg-white shadow-sm border border-border/60">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground uppercase font-semibold">Hotline 24/7</div>
                    <div className="text-sm font-bold text-[#1a1f2c]">+1 (800) KAVITHA</div>
                  </div>
                </div>
              </div>

              {/* Slider dot indicators */}
              <div className="flex items-center gap-2 pt-6">
                {[0, 1, 2, 3].map((dot) => (
                  <button
                    key={dot}
                    onClick={() => setCurrentSlide(dot)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === dot ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                    }`}
                    aria-label={`Go to slide ${dot + 1}`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Right Hero Model Image with Circular Backdrop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 flex justify-center relative items-center"
            >
              {/* Circular Backdrop Ring */}
              <div className="absolute w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] rounded-full border-4 border-dashed border-primary/25 animate-[spin_60s_linear_infinite] pointer-events-none" />
              <div className="absolute w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full bg-gradient-to-br from-primary/20 via-orange-100/50 to-primary/5 pointer-events-none" />

              <div className="relative w-full max-w-[390px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-10">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&q=85"
                  alt="Summer Collection Model"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full shadow-md text-xs font-bold text-primary flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-current text-primary" /> Top Rated
                </div>

                {/* Floating Bottom Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-2xl text-white flex items-center justify-between border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-primary">
                      <img src="https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=150&q=80" alt="Polo" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-[10px] text-primary uppercase font-bold tracking-wider">Featured Style</div>
                      <div className="text-xs font-bold">Classic Polo & Chinos</div>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-primary">$34.99</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. FEATURED 6 CATEGORY CARDS ── */}
      <section className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-white rounded-xl overflow-hidden border border-border/60 p-4 shadow-sm hover:shadow-md transition-shadow group flex flex-col"
            >
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-muted/40 mb-4">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div>
                  <h3 className="font-extrabold text-base tracking-tight text-[#1a1f2c]">{cat.title}</h3>
                  <div className="flex items-center gap-1 mt-1 text-primary">
                    {[...Array(cat.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">({cat.reviews})</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 rounded"
                  asChild
                >
                  <Link href={`/products?category=${cat.slug}`}>Shop Now</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 3. JUST FOR YOU TABBED SECTION ── */}
      <section className="container mx-auto px-4 md:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1a1f2c]">Just For You</h2>
          <p className="text-muted-foreground text-sm mt-1">Hand-picked styles recommended for your taste</p>

          {/* Filter tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {FILTER_TABS.map((tab) => (
              <Button
                key={tab}
                variant={selectedTab === tab ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTab(tab)}
                className={`rounded-md px-5 font-semibold transition-all ${
                  selectedTab === tab
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-white text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {justForYouProducts.slice(0, 8).map((product) => {
            const originalPrice = (product.price * 1.3).toFixed(2);
            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-border/70 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group"
              >
                <div className="relative aspect-square overflow-hidden bg-muted/30">
                  <Link href={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  {product.isNew && (
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold">
                      HOT
                    </Badge>
                  )}
                  <button
                    onClick={() => {
                      const added = toggleWishlist(product.id);
                      if (added) {
                        toast.success(`Saved "${product.name}" to wishlist!`);
                      } else {
                        toast.info(`Removed "${product.name}" from wishlist.`);
                      }
                    }}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition-all shadow-sm ${
                      isInWishlist(product.id)
                        ? "text-rose-500 opacity-100"
                        : "text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-rose-500" : ""}`} />
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <div className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider mb-1">
                    {product.categoryLabel}
                  </div>
                  <Link href={`/product/${product.id}`}>
                    <h4 className="font-semibold text-sm text-[#1a1f2c] line-clamp-1 hover:text-primary transition-colors">
                      {product.name}
                    </h4>
                  </Link>

                  <div className="flex items-center gap-1 my-2 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < Math.floor(product.rating || 5) ? "fill-current" : "opacity-30"}`}
                      />
                    ))}
                    <span className="text-[11px] text-muted-foreground ml-1">({product.reviewsCount || 48})</span>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
                    <div className="flex items-baseline gap-2">
                      <span className="font-extrabold text-base text-primary">${product.price.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground line-through">${originalPrice}</span>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleQuickAdd(product)}
                      className="rounded bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-3 h-8 text-xs"
                    >
                      <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. TRENDY PRODUCTS SPOTLIGHT ── */}
      <section className="container mx-auto px-4 md:px-8 py-12">
        <div className="bg-gradient-to-r from-[#f7f8fb] via-[#f3f5fa] to-[#eaedf4] rounded-2xl p-8 md:p-12 border border-border/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left perks list */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Best Deal</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1a1f2c]">Trendy Products</h2>

              <ul className="space-y-3 text-sm font-medium text-[#444]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Free Shipping on All Eligible Orders
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> 100% Secure Checkout & Money Back
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Quality Ensured Authentic Brands
                </li>
              </ul>

              <div className="flex items-center gap-3 pt-2">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6" asChild>
                  <Link href="/products">Shop Now</Link>
                </Button>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-9 w-9 bg-white" asChild>
                    <Link href="/products">
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9 bg-white" asChild>
                    <Link href="/products">
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right highlighted products with orange borders matching mockup */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {products.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-3 border-2 border-primary/80 shadow-md flex flex-col items-center text-center group"
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted/40 mb-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="font-bold text-xs line-clamp-1 text-[#1a1f2c]">{item.name}</h4>
                  <span className="font-extrabold text-sm text-primary mt-1">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. WHAT OUR CLIENTS SAY (Testimonials) ── */}
      <section className="container mx-auto px-4 md:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1a1f2c]">What Our Clients Say?</h2>
          <p className="text-muted-foreground text-sm mt-1">Real reviews from our satisfied global customers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl border border-border/60 p-6 shadow-sm flex flex-col text-center items-center relative group hover:shadow-md transition-shadow"
            >
              {/* Quote bubble icon on top right */}
              <div className="absolute top-4 right-4 text-primary/30">
                <Quote className="h-6 w-6" />
              </div>

              {/* Client Avatar with orange border */}
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary p-0.5 mb-3">
                <img src={t.avatar} alt={t.name} className="w-full h-full object-cover rounded-full" />
              </div>

              <h4 className="font-bold text-sm text-[#1a1f2c]">{t.name}</h4>
              <span className="text-[11px] text-muted-foreground mb-3">{t.date}</span>

              {/* 5 star ratings */}
              <div className="flex text-primary gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed italic">{t.review}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. TRUST BADGES (Free return, fast delivery, quality) ── */}
      <section className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border border-border/70 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1a1f2c]">Free 7 Days Return Policy</h4>
              <p className="text-xs text-muted-foreground">Easy returns on eligible clothing items</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-border/70 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1a1f2c]">Fast Free Delivery</h4>
              <p className="text-xs text-muted-foreground">Prompt courier dispatch to your door</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-border/70 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1a1f2c]">Quality Ensured</h4>
              <p className="text-xs text-muted-foreground">100% authentic craftsmanship</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
