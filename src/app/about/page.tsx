import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Package, Globe } from "lucide-react";

export const metadata = { title: "About Kavitha's Store" };

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="py-20 md:py-32 bg-gradient-to-br from-muted/60 to-background border-b text-center px-4">
        <Badge variant="outline" className="mb-4">Our Story</Badge>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">
          We believe shopping <br className="hidden md:block" />
          should feel <span className="text-primary">effortless</span>.
        </h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-8">
          Kavitha's was founded with a clear mission: deliver trendy, high-quality fashion,
          accessories, and lifestyle essentials with an unparalleled shopping experience.
        </p>
        <Button size="lg" asChild><Link href="/products">Shop Now</Link></Button>
      </section>

      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Package, label: "Products", value: "1,200+" },
              { icon: Users, label: "Happy Customers", value: "85,000+" },
              { icon: Globe, label: "Countries Shipped", value: "52" },
              { icon: Star, label: "Average Rating", value: "4.8 ★" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="space-y-2">
                <div className="flex justify-center"><Icon className="h-8 w-8 text-primary" /></div>
                <div className="text-3xl font-bold">{value}</div>
                <div className="text-muted-foreground text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-3xl font-bold mb-6">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { title: "Quality First", desc: "Every item goes through our 5-point quality check before listing." },
            { title: "Sustainability", desc: "We work with eco-conscious brands and offset 100% of our shipping carbon." },
            { title: "Community", desc: "We donate 1% of every sale to education charities across the globe." },
          ].map(({ title, desc }) => (
            <div key={title} className="p-6 border rounded-2xl hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
