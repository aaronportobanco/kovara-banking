"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { items } from "../../../../constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "./NavUser";
import { Separator } from "@/components/ui/separator";
import { ArrowUpCircleIcon } from "lucide-react";

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

const AppSidebar = () => {
  const pathname = usePathname();
  // Suponiendo que Sidebar maneja internamente el estado de colapsado, pero para aplicar la clase necesitamos forzarla.
  // Si Sidebar expone el estado, úsalo aquí. Si no, simplemente añade la clase para la variante "icon".
  const isCollapsed = true; // Forzamos para la variante "icon", ajusta si tienes un estado real

  return (
    <section>
      <Sidebar
        variant="inset"
        collapsible="icon"
        className={isCollapsed ? "sidebar-collapsed" : undefined}
        data-collapsed={isCollapsed ? "true" : "false"}
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <a href="#">
                  <ArrowUpCircleIcon className="h-5 w-5" />
                  <span className="text-base font-semibold">Acme Inc.</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="sidebar-link">
                {items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title} className="w-full">
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={isActive ? "sidebar-link-active" : undefined}
                      >
                        {/* Using `asChild` to allow custom components like Link */}
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <Separator />
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
    </section>
  );
};

export default AppSidebar;
