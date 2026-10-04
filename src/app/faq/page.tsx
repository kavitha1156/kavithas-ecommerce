"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const FAQS = [
  { q: "How long does shipping take?", a: "Standard shipping takes 3–7 business days. Express shipping (1–2 days) is available at checkout for an additional fee." },
  { q: "What is your return policy?", a: "We offer a 30-day hassle-free return policy. Items must be unused and in original packaging. Initiate a return from your dashboard." },
  { q: "Do you ship internationally?", a: "Yes! We ship to 50+ countries. International delivery typically takes 7–14 business days. Customs fees may apply." },
  { q: "How can I track my order?", a: "Once your order ships, you'll receive a tracking email. You can also visit the Order Tracking page or check your dashboard." },
  { q: "Can I change or cancel my order?", a: "Orders can be modified or cancelled within 1 hour of placement. After that, please contact our support team immediately." },
  { q: "Are my payment details secure?", a: "Absolutely. All payments are processed via Stripe with industry-standard TLS encryption. We never store your card details." },
  { q: "Do you offer gift wrapping?", a: "Yes! Select 'Gift Wrap' at checkout for $5. You can also add a personalised message card." },
  { q: "How do I apply a coupon code?", a: "Enter your coupon code in the 'Promo Code' field on the Cart page before proceeding to checkout." },
  { q: "What payment methods are accepted?", a: "We accept Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay, and UPI (for India)." },
  { q: "How do I contact customer support?", a: "Visit our Contact page or email support@kavithas-store.com. We respond within 24 hours on business days." },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container px-4 py-12 mx-auto max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Frequently Asked Questions</h1>
        <p className="text-muted-foreground text-lg">Everything you need to know About Kavitha's Store.</p>
      </div>
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search questions..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No results found.</p>
        )}
        {filtered.map((faq, i) => (
          <motion.div key={i} className="border rounded-xl overflow-hidden" initial={false}>
            <button
              className="w-full flex items-center justify-between p-5 text-left font-medium hover:bg-muted/50 transition-colors"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span>{faq.q}</span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
