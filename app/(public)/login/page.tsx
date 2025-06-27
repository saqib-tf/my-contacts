"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <p className="text-lg text-muted-foreground">You are not logged in.</p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/register">Register New Account</Link>
        </Button>
      </div>
    </div>
  );
}
