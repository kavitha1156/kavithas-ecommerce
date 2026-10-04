import { Truck, RefreshCcw, Clock, Package } from "lucide-react";
export const metadata = { title: "Shipping & Returns – Kavitha's" };
export default function ShippingPage() {
  return (
    <div className="container px-4 py-12 mx-auto max-w-3xl">
      <h1 className="text-4xl font-extrabold tracking-tight mb-3">Shipping & Returns</h1>
      <p className="text-muted-foreground mb-10 text-lg">Everything you need to know about delivery and returns.</p>
      <div className="space-y-8">
        {[
          { icon: Truck, title: "Shipping Options", items: ["Standard (3–7 days): Free on orders $50+, otherwise $5.99","Express (1–2 days): $14.99","International (7–14 days): from $19.99"] },
          { icon: Clock, title: "Processing Time", items: ["Orders placed before 2pm EST ship same day","Orders after 2pm ship next business day","Custom/personalized items take 2–3 extra days"] },
          { icon: RefreshCcw, title: "Returns Policy", items: ["30-day hassle-free returns","Items must be unused and in original packaging","Initiate a return from your Dashboard → Orders","Refunds processed within 5–7 business days"] },
          { icon: Package, title: "Damaged or Lost Items", items: ["Contact us within 48h of delivery for damaged items","Lost packages: contact us after 10 business days","We'll resend or fully refund — no questions asked"] },
        ].map(({ icon: Icon, title, items }) => (
          <div key={title} className="border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg"><Icon className="h-5 w-5 text-primary" /></div>
              <h2 className="text-xl font-bold">{title}</h2>
            </div>
            <ul className="space-y-2">
              {items.map(item => <li key={item} className="text-muted-foreground text-sm flex items-start gap-2"><span className="text-primary mt-0.5">•</span>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
