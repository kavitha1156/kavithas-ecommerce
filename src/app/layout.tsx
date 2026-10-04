import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

import { AIChatbot } from "@/components/AIChatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kavitha's - Premium Lifestyle Store",
  description: "Your premier lifestyle destination for trendy fashion, casual apparel, accessories, and home goods.",
  openGraph: {
    title: "Kavitha's - Premium Lifestyle Store",
    description: "Your premier lifestyle destination for trendy fashion, casual apparel, accessories, and home goods.",
    url: "https://kavithas-store.com",
    siteName: "Kavitha's Store",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster />
          <AIChatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
