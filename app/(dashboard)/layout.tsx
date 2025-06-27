import Link from "next/link";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSessionAndTenant } from "@/lib/getSessionAndTenant";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }
  const sessionTenant = await getSessionAndTenant();
  if (!sessionTenant?.user) {
    redirect("/register");
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        {/* <SidebarTrigger /> */}
        <div className="p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
