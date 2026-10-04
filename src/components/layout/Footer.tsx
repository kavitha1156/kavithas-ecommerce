import Link from "next/link";
import { Mail, MapPin, Phone, Globe, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-200 border-t border-slate-800">
      <div className="container mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4 pr-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">Kavitha's</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Your premier lifestyle destination for trendy fashion, casual apparel, and accessories. Designed with comfort and precision.
            </p>
            <div className="flex space-x-3 pt-2">
              <Link href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-primary hover:bg-slate-700 transition-colors">
                <FacebookIcon className="h-4 w-4" />
              </Link>
              <Link href="#" aria-label="Twitter" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-primary hover:bg-slate-700 transition-colors">
                <TwitterIcon className="h-4 w-4" />
              </Link>
              <Link href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-primary hover:bg-slate-700 transition-colors">
                <InstagramIcon className="h-4 w-4" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-primary hover:bg-slate-700 transition-colors">
                <Globe className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Col 2: Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Information</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ & Support</Link></li>
            </ul>
          </div>

          {/* Col 3: Help / Account */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Help</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/admin" className="hover:text-primary transition-colors text-amber-400 font-medium">🛡️ Admin & Stock Center</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">My Account</Link></li>
              <li><Link href="/order-tracking" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link href="/cart" className="hover:text-primary transition-colors">Shopping Cart</Link></li>
              <li><Link href="/shipping" className="hover:text-primary transition-colors">Free Global Delivery</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">Browse Catalog</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Social / Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+012-000-000-0000</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>support@kavithas-store.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-1" />
                <span>120 Summer Fashion Ave, Suite 400</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Category Footer Strip matching mockup */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-bold text-slate-300">Category:</span>
            <Link href="/products?category=clothing" className="hover:text-primary transition-colors">Tanks</Link>
            <Link href="/products?category=clothing" className="hover:text-primary transition-colors">T-Shirts</Link>
            <Link href="/products?category=clothing" className="hover:text-primary transition-colors">Polo Shirts</Link>
            <Link href="/products?category=clothing" className="hover:text-primary transition-colors">Casual Shirts</Link>
            <Link href="/products?category=accessories" className="hover:text-primary transition-colors">Bandana</Link>
            <Link href="/products?category=accessories" className="hover:text-primary transition-colors">Men Belts</Link>
          </div>
          <p>© {new Date().getFullYear()} Kavitha's. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
