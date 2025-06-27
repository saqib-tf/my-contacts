import Link from "next/link";
import { Button } from "@/components/ui/button";
import SignIn from "@/components/sign-in";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <p className="text-lg text-muted-foreground">You are not logged in.</p>
      <div className="flex gap-4">
        <SignIn />
        <SignIn redirectUrl="/register" label="Register New Account" variant="outline" />
      </div>
    </div>
  );
}
