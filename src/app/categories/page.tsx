"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Laptop,
  Shirt,
  ShoppingBag,
  Home,
  Dumbbell,
  BookOpen,
  Sparkles,
  Watch,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  {
    id: "electronics",
    name: "Electronics",
    description: "Gadgets, devices, and the latest tech",
    icon: Laptop,
    productCount: 128,
    color: "from-blue-500/20 to-blue-600/5",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-500",
    featured: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
    ],
  },
  {
    id: "clothing",
    name: "Clothing",
    description: "Premium fashion for every style",
    icon: Shirt,
    productCount: 243,
    color: "from-purple-500/20 to-purple-600/5",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-500",
    featured: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80",
    ],
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Bags, belts, and style essentials",
    icon: ShoppingBag,
    productCount: 89,
    color: "from-amber-500/20 to-amber-600/5",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-500",
    featured: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&q=80",
    ],
  },
  {
    id: "home",
    name: "Home & Living",
    description: "Elevate your living space",
    icon: Home,
    productCount: 157,
    color: "from-green-500/20 to-green-600/5",
    borderColor: "border-green-500/30",
    iconColor: "text-green-500",
    featured: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300&q=80",
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=300&q=80",
    ],
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    description: "Gear up for your active lifestyle",
    icon: Dumbbell,
    productCount: 74,
    color: "from-red-500/20 to-red-600/5",
    borderColor: "border-red-500/30",
    iconColor: "text-red-500",
    featured: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&q=80",
      "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=300&q=80",
    ],
  },
  {
    id: "books",
    name: "Books & Media",
    description: "Knowledge, stories, and inspiration",
    icon: BookOpen,
    productCount: 312,
    color: "from-teal-500/20 to-teal-600/5",
    borderColor: "border-teal-500/30",
    iconColor: "text-teal-500",
    featured: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&q=80",
    ],
  },
  {
    id: "beauty",
    name: "Beauty & Care",
    description: "Skincare, grooming, and wellness",
    icon: Sparkles,
    productCount: 96,
    color: "from-pink-500/20 to-pink-600/5",
    borderColor: "border-pink-500/30",
    iconColor: "text-pink-500",
    featured: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80",
    ],
  },
  {
    id: "watches",
    name: "Watches & Jewelry",
    description: "Timeless pieces for every occasion",
    icon: Watch,
    productCount: 53,
    color: "from-yellow-500/20 to-yellow-600/5",
    borderColor: "border-yellow-500/30",
    iconColor: "text-yellow-500",
    featured: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
      "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=300&q=80",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function CategoriesPage() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="w-full py-16 md:py-24 border-b border-border/40 bg-gradient-to-br from-muted/60 via-background to-background">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 px-4 py-1 text-sm">
              Browse All Categories
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
              Find What You{" "}
              <span className="text-primary">Love</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Explore our handpicked collections across every lifestyle. From
              cutting-edge tech to timeless fashion — it's all here.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container px-4 md:px-6 mx-auto py-12 md:py-20 max-w-7xl">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isHovered = hovered === category.id;

            return (
              <motion.div
                key={category.id}
                variants={cardVariants}
                onMouseEnter={() => setHovered(category.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <Link href={`/products?category=${category.id}`}>
                  <div
                    className={`relative group overflow-hidden rounded-2xl border ${category.borderColor} bg-gradient-to-br ${category.color} p-6 h-full min-h-[220px] flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-opacity-60`}
                  >
                    {/* Background image strip */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                      {category.featured[0] && (
                        <img
                          src={category.featured[0]}
                          alt=""
                          className="w-full h-full object-cover scale-110"
                        />
                      )}
                    </div>

                    {/* Top: Icon + badge */}
                    <div className="flex items-start justify-between relative z-10">
                      <div
                        className={`p-3 rounded-xl bg-background/50 backdrop-blur-sm border ${category.borderColor}`}
                      >
                        <Icon className={`h-6 w-6 ${category.iconColor}`} />
                      </div>
                      <Badge variant="secondary" className="text-xs font-medium">
                        {category.productCount} items
                      </Badge>
                    </div>

                    {/* Bottom: Text + arrow */}
                    <div className="relative z-10 mt-6">
                      <h2 className="text-xl font-bold tracking-tight mb-1">
                        {category.name}
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {category.description}
                      </p>
                      <div
                        className={`flex items-center gap-1 text-sm font-semibold ${category.iconColor} transition-all duration-300 ${isHovered ? "translate-x-1" : ""}`}
                      >
                        Shop now{" "}
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Floating product previews on hover */}
                    <div
                      className={`absolute bottom-4 right-4 flex -space-x-3 transition-all duration-300 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
                    >
                      {category.featured.map((img, idx) => (
                        <div
                          key={idx}
                          className="h-10 w-10 rounded-full border-2 border-background overflow-hidden shadow-md"
                          style={{ zIndex: idx }}
                        >
                          <img
                            src={img}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}
