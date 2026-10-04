"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you within 24 hours.");
  };

  return (
    <div className="container px-4 py-12 mx-auto max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Get In Touch</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">Have a question or feedback? We'd love to hear from you. Our team is here to help.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          {[
            { icon: Mail, title: "Email Us", sub: "support@kavithas-store.com", detail: "Response within 24h" },
            { icon: Phone, title: "Call Us", sub: "+1 (555) 123-4567", detail: "Mon–Fri, 9am–6pm EST" },
            { icon: MapPin, title: "Visit Us", sub: "123 Commerce St", detail: "Tech City, 10010, USA" },
            { icon: Clock, title: "Working Hours", sub: "Mon–Fri: 9am – 6pm", detail: "Sat: 10am – 2pm" },
          ].map(({ icon: Icon, title, sub, detail }) => (
            <Card key={title}>
              <CardContent className="flex items-start gap-4 p-5">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0"><Icon className="h-5 w-5 text-primary" /></div>
                <div>
                  <div className="font-semibold">{title}</div>
                  <div className="text-sm">{sub}</div>
                  <div className="text-xs text-muted-foreground">{detail}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                  <p className="text-muted-foreground">We'll respond to you within 24 business hours.</p>
                  <Button className="mt-6" onClick={() => setSubmitted(false)}>Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Send a Message</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input placeholder="John Doe" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Email</label>
                      <Input type="email" placeholder="you@example.com" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="Order issue, return request..." required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Message</label>
                    <textarea
                      className="w-full min-h-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                      placeholder="Tell us more about your issue..."
                      required
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2"><Send className="h-4 w-4" /> Send Message</Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
