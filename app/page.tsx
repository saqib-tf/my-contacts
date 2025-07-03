import Image from "next/image";
import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();
  return (
    <div className="flex min-h-screen justify-center bg-white dark:bg-gray-950 pt-8">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome to My Contacts App!</h1>
        {session?.user && (
          <div className="flex justify-center mt-8">
            <Link href="/dashboard">
              <Button>Go to Dashboard Page</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
