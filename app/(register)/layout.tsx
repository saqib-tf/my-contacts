import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
import { getSessionAndTenant } from "@/lib/getSessionAndTenant";

export default async function RegisterLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }
  const sessionAndTenant = await getSessionAndTenant();
  if (sessionAndTenant?.tenantId) {
    redirect("/dashboard");
  }
  return <SessionProvider>{children}</SessionProvider>;
}
