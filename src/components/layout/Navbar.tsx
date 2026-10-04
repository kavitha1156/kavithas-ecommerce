"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, Search, Menu, Moon, Sun, Heart, Sparkles, Shield, Store, Layers } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { toast } from "sonner";

export function Navbar() {
  const { setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const totalItems = useCartStore((state) => state.getTotalItems());
  const user = useAuthStore((state) => state.user);
  const switchRole = useAuthStore((state) => state.switchRole);
  const wishlistCount = useWishlistStore((state) => state.items.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleToggleRole = () => {
    const nextRole = user?.role === "ADMIN" ? "USER" : "ADMIN";
    switchRole(nextRole);
    toast.success(`Switched view to: ${nextRole === "ADMIN" ? "🛡️ Store Owner (Admin)" : "🛍️ Customer (Shopper)"}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {/* Top Demo Notification Strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 border-b border-slate-800">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-white">Kavitha's Store</span>
            <span className="hidden sm:inline text-slate-400">· Production Turnkey E-Commerce Suite</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleRole}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer text-[11px]"
              title="Click to toggle between Store Owner and Customer views"
            >
              <span>Demo View:</span>
              <span className={`font-bold ${user?.role === "ADMIN" ? "text-amber-400" : "text-emerald-400"}`}>
                {user?.role === "ADMIN" ? "🛡️ Store Owner (Admin)" : "🛍️ Customer (Shopper)"}
              </span>
              <span className="text-[10px] text-slate-400 underline ml-0.5">Switch</span>
            </button>

            {user?.role === "ADMIN" ? (
              <Link href="/admin" className="font-bold text-primary hover:underline hidden sm:inline">
                Admin Center →
              </Link>
            ) : (
              <Link href="/account" className="font-bold text-primary hover:underline hidden sm:inline">
                My Account →
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col gap-6 mt-8">
              <Link href="/" className="text-2xl font-black tracking-tight flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span>Kavitha's</span>
              </Link>
              <nav className="flex flex-col gap-3">
                {[
                  { href: "/", label: "Home" },
                  { href: "/categories", label: "Categories" },
                  { href: "/products", label: "All Products" },
                  { href: "/new-arrivals", label: "New Arrivals", badge: "New" },
                  { href: "/featured", label: "Featured" },
                  { href: "/deals", label: "Deals", badge: "🔥" },
                  { href: "/order-tracking", label: "Track Order" },
                  { href: "/account", label: "Customer Account" },
                  { href: "/admin", label: "Admin & Stock Command", badge: "Owner" },
                ].map(({ href, label, badge }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center justify-between text-base font-medium hover:text-primary transition-colors py-1.5"
                  >
                    {label}
                    {badge && (
                      <Badge variant={badge === "Owner" ? "default" : "secondary"} className="text-xs">
                        {badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Brand Logo */}
        <Link href="/" className="mr-6 flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-black tracking-tight hidden sm:inline text-foreground">Kavitha's</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {[
            { href: "/categories", label: "Categories" },
            { href: "/products", label: "Products" },
            { href: "/new-arrivals", label: "New Arrivals" },
            { href: "/deals", label: "Deals" },
            { href: "/order-tracking", label: "Track Order" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-xs font-semibold uppercase tracking-wider"
            >
              {label}
            </Link>
          ))}

          {/* Admin portal — only visible to store owner */}
          {mounted && user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="px-2.5 py-1 ml-1 rounded-md text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1"
            >
              <Shield className="h-3 w-3" /> Admin Portal
            </Link>
          )}
        </nav>

        {/* Right Section */}
        <div className="flex flex-1 items-center justify-end gap-1.5">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center mr-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 w-[220px] bg-muted/50 border-transparent focus:border-border focus:bg-background transition-all text-xs"
              />
            </div>
          </form>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>☀️ Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>🌙 Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>💻 System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Wishlist */}
          <Button variant="ghost" size="icon" className="h-9 w-9 relative" asChild>
            <Link href="/account" title="Wishlist">
              <Heart className="h-4 w-4" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-in zoom-in">
                  {wishlistCount}
                </span>
              )}
              <span className="sr-only">Wishlist</span>
            </Link>
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="h-9 w-9 relative" asChild>
            <Link href="/cart" title="Shopping Cart">
              <ShoppingCart className="h-4 w-4" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center animate-in zoom-in">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>

          {/* User / Account Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <User className="h-4 w-4" />
                <span className="sr-only">Account menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {mounted && user ? (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant="outline" className="text-[10px] font-semibold">
                          {user.role === "ADMIN" ? "🛡️ Store Owner" : "🛍️ Customer"}
                        </Badge>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="font-semibold text-primary">
                      <Shield className="h-3.5 w-3.5 mr-2" /> Admin &amp; Stock Portal
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/account">
                      <User className="h-3.5 w-3.5 mr-2" /> Customer Account
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/account">
                      <ShoppingCart className="h-3.5 w-3.5 mr-2" /> My Orders &amp; Receipts
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/order-tracking">
                      <Search className="h-3.5 w-3.5 mr-2" /> Track Shipments
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleToggleRole} className="text-xs">
                    🔄 Switch to {user.role === "ADMIN" ? "Customer View" : "Admin View"}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => useAuthStore.getState().logout()}>
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">Customer Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Portal</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
