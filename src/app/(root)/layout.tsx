import AppSidebar from "@/components/layout/sidebar/AppSidebar";
import SiteHeader from "@/components/layout/sidebar/SiteHeader";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen} >
      <AppSidebar />
      <SidebarInset className="rounded-[8px] shadow-md m-3">
        <SiteHeader />
        <main className="flex h-screen px-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
