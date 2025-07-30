import AppSidebar from "@/components/layout/sidebar/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { getLoggedInUser } from "@/services/actions/user.actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): Promise<React.ReactElement> {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser) {
    // If the user is not logged in, redirect to the sign-in page
    redirect("/sign-in");
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset className="rounded-lg shadow-md m-3">
        <main className="flex h-screen pl-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
