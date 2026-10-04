"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Headphones, Check, Truck, Clock, ShieldCheck, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOrderStore } from "@/store/useOrderStore";
import Link from "next/link";

interface ChatMessage {
  id: string;
  sender: "support" | "user";
  text: string;
  time: string;
  orderLink?: string;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const getOrderById = useOrderStore((state) => state.getOrderById);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "support",
      text: "Hello! Welcome to Kavitha's Store. How can our customer care team assist you today?",
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: queryText,
      time: userTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    // Realistic intelligent customer concierge logic
    setTimeout(() => {
      const lower = queryText.toLowerCase();
      let replyText = "";
      let orderLink: string | undefined = undefined;

      // 1. Order ID inquiry
      const orderMatch = queryText.match(/ORD-\d{4}/i);
      if (orderMatch) {
        const foundOrder = getOrderById(orderMatch[0]);
        if (foundOrder) {
          replyText = `Found order ${foundOrder.id}! It is currently marked as "${foundOrder.status}" with estimated arrival on ${foundOrder.estimatedDelivery}.`;
          orderLink = `/order-tracking?id=${foundOrder.id}`;
        } else {
          replyText = `I checked our fulfillment database for "${orderMatch[0]}", but couldn't locate it. Please check your confirmation email or visit our Order Tracking page.`;
          orderLink = "/order-tracking";
        }
      } else if (lower.includes("track") || lower.includes("where is my order") || lower.includes("status")) {
        replyText =
          "To track an existing shipment, simply enter your Order ID (for example: ORD-7294) here or open our Live Tracking portal.";
        orderLink = "/order-tracking";
      } else if (lower.includes("return") || lower.includes("refund") || lower.includes("exchange")) {
        replyText =
          "We offer a 30-day money-back guarantee and complimentary exchanges on all items. You can initiate a self-service return directly from your Customer Account page.";
        orderLink = "/account";
      } else if (lower.includes("shipping") || lower.includes("delivery") || lower.includes("free shipping")) {
        replyText =
          "Standard delivery is 100% FREE on all orders over $50! Domestic shipments arrive within 2–4 business days via express ground courier.";
      } else if (lower.includes("discount") || lower.includes("coupon") || lower.includes("promo") || lower.includes("sale")) {
        replyText =
          "We're currently running our Seasonal Brand Day with flat 20% savings across summer casual apparel. Check our Deals section for limited-time offers!";
        orderLink = "/deals";
      } else if (lower.includes("contact") || lower.includes("phone") || lower.includes("email") || lower.includes("agent") || lower.includes("human")) {
        replyText =
          "Our senior support specialists are on standby Monday through Saturday, 9am–9pm EST. You can reach us at support@kavithas-store.com or call +012-000-000-0000.";
      } else {
        replyText =
          "Thank you for contacting Kavitha's Store! Our support team is here to assist with sizing advice, order status inquiries, returns, and inventory questions. How may we help?";
      }

      const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [
        ...prev,
        {
          id: `rep-${Date.now()}`,
          sender: "support",
          text: replyText,
          time: replyTime,
          orderLink,
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 p-0 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105"
        title="Live Customer Support"
      >
        <Headphones className="h-6 w-6" />
        <span className="sr-only">Live Customer Support</span>
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-84 sm:w-96 shadow-2xl z-50 flex flex-col h-[520px] border-border/80 overflow-hidden animate-in fade-in zoom-in-95">
      {/* Header */}
      <CardHeader className="p-4 border-b bg-slate-900 text-white flex flex-row items-center justify-between rounded-t-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl">
              <Headphones className="h-5 w-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              Kavitha's Support
            </CardTitle>
            <p className="text-[11px] text-slate-300 flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Senior Specialists Online
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      {/* Messages Scroll Area */}
      <CardContent className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-background/50 text-xs">
        {messages.map((m) => {
          const isUser = m.sender === "user";
          return (
            <div key={m.id} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs ${
                  isUser
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-background border text-foreground rounded-bl-none"
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                {m.orderLink && (
                  <Button
                    size="sm"
                    variant={isUser ? "secondary" : "outline"}
                    className="mt-2 h-7 text-[11px] gap-1 w-full"
                    asChild
                  >
                    <Link href={m.orderLink} onClick={() => setIsOpen(false)}>
                      View Details / Tracking →
                    </Link>
                  </Button>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 px-1">{m.time}</span>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-1.5 p-2 bg-background border rounded-2xl w-16 text-muted-foreground text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      {/* Quick Suggestions */}
      <div className="px-3 py-2 bg-muted/40 border-t flex gap-1.5 overflow-x-auto shrink-0 text-[11px]">
        {[
          "Track My Order",
          "Shipping Times",
          "Return Policy",
          "Contact Agent",
        ].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleSendMessage(chip)}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-background border hover:bg-accent text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <CardFooter className="p-3 border-t bg-background shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2 w-full"
        >
          <Input
            placeholder="Type a message or Order ID..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="text-xs h-10"
          />
          <Button type="submit" size="icon" className="h-10 w-10 shrink-0" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
