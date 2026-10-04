"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Shield, User, Store, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      router.replace("/admin");
    } else {
      router.replace("/account");
    }
  }, [user, router]);

  return (
    <div className="container max-w-2xl py-20 px-4 mx-auto text-center space-y-6">
      <h1 className="text-3xl font-extrabold">Redirecting to your portal...</h1>
      <p className="text-muted-foreground text-sm">
        Select whether you want to enter the Store Owner Command Center or Customer Account:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-4">
        <Link href="/admin">
          <Card className="hover:border-primary transition-all cursor-pointer group h-full">
            <CardHeader className="pb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Shield className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center justify-between">
                Admin Panel <ArrowRight className="h-4 w-4" />
              </CardTitle>
              <CardDescription>
                Manage stock replenishment, add products with images, fulfill customer orders, and view revenues.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/account">
          <Card className="hover:border-primary transition-all cursor-pointer group h-full">
            <CardHeader className="pb-2">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-2">
                <User className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center justify-between">
                Customer Account <ArrowRight className="h-4 w-4" />
              </CardTitle>
              <CardDescription>
                View order tracking, saved wishlist items, manage delivery addresses, and account details.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
