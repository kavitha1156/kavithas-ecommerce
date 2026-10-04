// Shared product data store used across the entire app

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  categoryLabel: string;
  brand: string;
  description: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  sku: string;
  isNew: boolean;
  isFeatured: boolean;
  variants: string[];
}

const RAW_PRODUCTS: Omit<Product, "stockCount" | "sku">[] = [
  {
    id: "1",
    name: "Minimalist Leather Backpack",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    ],
    category: "accessories",
    categoryLabel: "Accessories",
    brand: "Nomad",
    description:
      "Handcrafted from premium full-grain leather, this minimalist backpack is designed for the modern professional. Features a padded laptop sleeve, water-resistant interior, and ergonomic straps for all-day comfort.",
    rating: 4.8,
    reviewsCount: 124,
    inStock: true,
    isNew: true,
    isFeatured: true,
    variants: ["Black", "Brown", "Tan"],
  },
  {
    id: "2",
    name: "Wireless Noise-Cancelling Headphones",
    price: 299.0,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
    ],
    category: "electronics",
    categoryLabel: "Electronics",
    brand: "SoundWave",
    description:
      "Experience pure audio bliss with industry-leading noise cancellation. Up to 30 hours of battery life, premium comfort earcups, and Hi-Res Audio certification.",
    rating: 4.9,
    reviewsCount: 342,
    inStock: true,
    isNew: false,
    isFeatured: true,
    variants: ["Midnight Black", "Arctic White"],
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    price: 34.5,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80",
    ],
    category: "clothing",
    categoryLabel: "Clothing",
    brand: "EcoWear",
    description:
      "100% GOTS-certified organic cotton. Soft, breathable, and kind to the planet. Available in a range of curated colours. Pre-washed to prevent shrinkage.",
    rating: 4.5,
    reviewsCount: 89,
    inStock: true,
    isNew: false,
    isFeatured: false,
    variants: ["White", "Black", "Olive", "Navy"],
  },
  {
    id: "4",
    name: "Smart Fitness Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
    ],
    category: "electronics",
    categoryLabel: "Electronics",
    brand: "PulseTrack",
    description:
      "Track your health 24/7 with ECG, SpO2, sleep monitoring, and 50+ workout modes. GPS, 5-day battery, and swimproof design.",
    rating: 4.7,
    reviewsCount: 218,
    inStock: true,
    isNew: true,
    isFeatured: true,
    variants: ["Midnight", "Starlight", "Red"],
  },
  {
    id: "5",
    name: "Classic Aviator Sunglasses",
    price: 89.0,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    ],
    category: "accessories",
    categoryLabel: "Accessories",
    brand: "RayVision",
    description:
      "Timeless aviator style with polarised UV400 lenses. Lightweight metal frame, spring-loaded hinges, and scratch-resistant coating.",
    rating: 4.6,
    reviewsCount: 74,
    inStock: true,
    isNew: false,
    isFeatured: false,
    variants: ["Gold/Green", "Silver/Blue", "Black/Grey"],
  },
  {
    id: "6",
    name: "Ceramic Pour-Over Coffee Maker",
    price: 45.0,
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80",
      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=80",
    ],
    category: "home",
    categoryLabel: "Home & Living",
    brand: "BrewCraft",
    description:
      "Handmade ceramic pour-over dripper for a rich, smooth cup every time. Dishwasher safe, compatible with standard #2 filters.",
    rating: 4.4,
    reviewsCount: 56,
    inStock: true,
    isNew: false,
    isFeatured: false,
    variants: ["White", "Matte Black"],
  },
  {
    id: "7",
    name: "Mechanical Keychron Keyboard",
    price: 110.0,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    ],
    category: "electronics",
    categoryLabel: "Electronics",
    brand: "Keychron",
    description:
      "Compact 75% layout with RGB backlight, hot-swappable switches, and Bluetooth 5.1. Works on Mac, Windows, and iOS.",
    rating: 4.8,
    reviewsCount: 193,
    inStock: true,
    isNew: false,
    isFeatured: true,
    variants: ["Red Switch", "Blue Switch", "Brown Switch"],
  },
  {
    id: "8",
    name: "Scented Soy Candle",
    price: 24.0,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80",
      "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=800&q=80",
    ],
    category: "home",
    categoryLabel: "Home & Living",
    brand: "LumaCo",
    description:
      "Hand-poured 100% natural soy wax candle with a cotton wick. 50-hour burn time, in a reusable glass vessel. Available in 6 signature scents.",
    rating: 4.3,
    reviewsCount: 41,
    inStock: true,
    isNew: true,
    isFeatured: false,
    variants: ["Vanilla Oak", "Sea Salt", "Citrus Bloom"],
  },

  // ── Sports & Fitness ──
  {
    id: "9",
    name: "Pro Performance Yoga Mat",
    price: 68.0,
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80",
    ],
    category: "sports",
    categoryLabel: "Sports",
    brand: "FlexFit",
    description:
      "Extra-thick 6mm eco-friendly TPE non-slip grip yoga mat. Designed for hot yoga, Pilates, and high-intensity floor workouts. Includes carrying strap.",
    rating: 4.9,
    reviewsCount: 112,
    inStock: true,
    isNew: true,
    isFeatured: true,
    variants: ["Forest Green", "Plum Purple", "Ocean Blue"],
  },
  {
    id: "10",
    name: "Adjustable Cast Iron Dumbbells Set",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
    ],
    category: "sports",
    categoryLabel: "Sports",
    brand: "IronGrip",
    description:
      "Quick-change weight selector system from 5lbs to 52.5lbs. Heavy-duty steel plates with textured anti-slip handles for home workouts.",
    rating: 4.7,
    reviewsCount: 84,
    inStock: true,
    isNew: false,
    isFeatured: true,
    variants: ["50 lbs Set", "100 lbs Pair"],
  },

  // ── Books & Media ──
  {
    id: "11",
    name: "The Art of Clean Code (Hardcover)",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    ],
    category: "books",
    categoryLabel: "Books",
    brand: "TechPress",
    description:
      "A practical guide to software design principles, refactoring, clean architecture, and building maintainable enterprise systems.",
    rating: 4.9,
    reviewsCount: 310,
    inStock: true,
    isNew: true,
    isFeatured: true,
    variants: ["Hardcover", "Paperback", "Collector's Edition"],
  },
  {
    id: "12",
    name: "Atomic Habits: Micro-Changes, Remarkable Results",
    price: 21.50,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
    ],
    category: "books",
    categoryLabel: "Books",
    brand: "Penguin",
    description:
      "Transform your life with tiny, easy-to-implement habits. Proven strategies to build good habits, break bad ones, and master small behaviors.",
    rating: 5.0,
    reviewsCount: 1420,
    inStock: true,
    isNew: false,
    isFeatured: true,
    variants: ["Hardcover", "Paperback"],
  },

  // ── Beauty & Care ──
  {
    id: "13",
    name: "Hydrating Hyaluronic Acid Serum",
    price: 42.0,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
    ],
    category: "beauty",
    categoryLabel: "Beauty",
    brand: "GlowLab",
    description:
      "Deeply penetrating multi-molecular weight serum. Plumps skin, locks in 24-hour hydration, and restores natural radiance.",
    rating: 4.8,
    reviewsCount: 164,
    inStock: true,
    isNew: true,
    isFeatured: true,
    variants: ["30ml Bottle", "50ml Value Pack"],
  },
  {
    id: "14",
    name: "Botanical Facial Cleansing Oil",
    price: 36.0,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    ],
    category: "beauty",
    categoryLabel: "Beauty",
    brand: "Botanica",
    description:
      "Nourishing cleansing oil formulated with jojoba, rosehip, and vitamin E. Gently melts away waterproof makeup and impurities without stripping skin.",
    rating: 4.7,
    reviewsCount: 95,
    inStock: true,
    isNew: false,
    isFeatured: false,
    variants: ["150ml Glass Bottle"],
  },

  // ── More Sports & Fitness ──
  {
    id: "15",
    name: "Carbon Fiber Tennis Racket",
    price: 189.99,
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80"],
    category: "sports",
    categoryLabel: "Sports",
    brand: "AcePro",
    description: "Ultra-lightweight carbon fiber racket with vibration dampening technology. Perfect balance of power and control for intermediate to advanced players.",
    rating: 4.7,
    reviewsCount: 63,
    inStock: true,
    isNew: true,
    isFeatured: false,
    variants: ["Grip 2", "Grip 3", "Grip 4"],
  },
  {
    id: "16",
    name: "Resistance Band Set (5-Pack)",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&q=80"],
    category: "sports",
    categoryLabel: "Sports",
    brand: "FlexFit",
    description: "Set of 5 natural latex resistance bands (10–50 lbs). Ideal for home workouts, physical therapy, and muscle toning. Includes carry pouch.",
    rating: 4.6,
    reviewsCount: 201,
    inStock: true,
    isNew: false,
    isFeatured: true,
    variants: ["Standard Set", "Heavy Set"],
  },
  {
    id: "17",
    name: "Insulated Sports Water Bottle 32oz",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80"],
    category: "sports",
    categoryLabel: "Sports",
    brand: "HydroFlow",
    description: "Double-wall vacuum insulated stainless steel bottle. Keeps drinks cold for 24 hours or hot for 12. BPA-free, leak-proof lid.",
    rating: 4.8,
    reviewsCount: 340,
    inStock: true,
    isNew: false,
    isFeatured: false,
    variants: ["Arctic White", "Midnight Black", "Ocean Blue"],
  },

  // ── More Books & Media ──
  {
    id: "18",
    name: "Deep Learning with Python (2nd Edition)",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80"],
    category: "books",
    categoryLabel: "Books",
    brand: "Manning",
    description: "Comprehensive guide to deep learning using Keras and TensorFlow 2. Covers neural networks, computer vision, NLP, and generative models with hands-on examples.",
    rating: 4.8,
    reviewsCount: 186,
    inStock: true,
    isNew: true,
    isFeatured: true,
    variants: ["Paperback", "eBook Bundle"],
  },
  {
    id: "19",
    name: "The Psychology of Money",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800&q=80"],
    category: "books",
    categoryLabel: "Books",
    brand: "Harriman House",
    description: "Timeless lessons on wealth, greed, and happiness. Morgan Housel explores how people think about money and the strange ways we behave with it.",
    rating: 4.9,
    reviewsCount: 2100,
    inStock: true,
    isNew: false,
    isFeatured: true,
    variants: ["Hardcover", "Paperback", "Audiobook"],
  },
  {
    id: "20",
    name: "Sapiens: A Brief History of Humankind",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80"],
    category: "books",
    categoryLabel: "Books",
    brand: "Harper",
    description: "Yuval Noah Harari's groundbreaking exploration of human history — from the Stone Age to Silicon Valley. A must-read that challenges everything you think you know.",
    rating: 4.8,
    reviewsCount: 3800,
    inStock: true,
    isNew: false,
    isFeatured: false,
    variants: ["Paperback", "Illustrated Edition"],
  },

  // ── More Beauty & Care ──
  {
    id: "21",
    name: "Vitamin C Brightening Moisturizer",
    price: 38.00,
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&q=80"],
    category: "beauty",
    categoryLabel: "Beauty",
    brand: "GlowLab",
    description: "Lightweight daily moisturizer infused with stabilized Vitamin C, niacinamide, and SPF 30. Brightens skin tone and protects from UV damage.",
    rating: 4.7,
    reviewsCount: 128,
    inStock: true,
    isNew: true,
    isFeatured: true,
    variants: ["50ml Tube"],
  },
  {
    id: "22",
    name: "Natural Rose Lip Balm Set",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80"],
    category: "beauty",
    categoryLabel: "Beauty",
    brand: "Botanica",
    description: "Set of 3 organic lip balms with real rose extract, shea butter, and beeswax. Deeply moisturizing, non-sticky formula. Subtly tinted.",
    rating: 4.5,
    reviewsCount: 89,
    inStock: true,
    isNew: false,
    isFeatured: false,
    variants: ["Rose Pink", "Berry Red", "Nude"],
  },
  {
    id: "23",
    name: "Retinol Night Repair Cream",
    price: 55.00,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80"],
    category: "beauty",
    categoryLabel: "Beauty",
    brand: "GlowLab",
    description: "Advanced retinol formula with peptides and ceramides for overnight skin renewal. Reduces fine lines, improves texture, and firms skin while you sleep.",
    rating: 4.9,
    reviewsCount: 210,
    inStock: true,
    isNew: true,
    isFeatured: true,
    variants: ["30ml", "50ml Premium"],
  },
];

export const INITIAL_PRODUCTS: Product[] = RAW_PRODUCTS.map((p, idx) => ({
  ...p,
  stockCount: (p as any).stockCount ?? (idx === 7 ? 3 : idx === 13 ? 2 : Math.floor(25 + ((idx * 17) % 65))),
  sku: (p as any).sku ?? `OWI-${p.category.slice(0, 3).toUpperCase()}-${String(100 + idx).padStart(3, '0')}`,
  originalPrice: p.originalPrice ?? (idx % 2 === 0 ? Math.round(p.price * 1.25 * 100) / 100 : undefined),
}));

// In-memory store that can be dynamically expanded at runtime by Admin
export let ALL_PRODUCTS: Product[] = [...INITIAL_PRODUCTS];

export function addProduct(newProduct: Omit<Product, "id" | "rating" | "reviewsCount">) {
  const product: Product = {
    ...newProduct,
    id: `prod-${Date.now()}`,
    rating: 5.0,
    reviewsCount: 1,
    stockCount: newProduct.stockCount ?? 50,
    sku: newProduct.sku || `OWI-${newProduct.category.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
  };
  ALL_PRODUCTS = [product, ...ALL_PRODUCTS];
  return product;
}

export function getProductById(id: string) {
  return ALL_PRODUCTS.find((p) => p.id === id) ?? null;
}
