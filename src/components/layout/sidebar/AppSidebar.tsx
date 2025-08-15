"use client";

import React, { JSX, useEffect, useState } from "react";
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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { items } from "../../../../constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "./NavUser";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PlaidLink from "@/app/(auth)/plaid-link/PlaidLink";
import { getLoggedInUser } from "@/services/actions/user.actions";
import { User } from "#/types";

const AppSidebar = (): JSX.Element => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  // Suponiendo que Sidebar maneja internamente el estado de colapsado, pero para aplicar la clase necesitamos forzarla.
  // Si Sidebar expone el estado, úsalo aquí. Si no, simplemente añade la clase para la variante "icon".
  const isCollapsed = true; // Forzamos para la variante "icon", ajusta si tienes un estado real

  useEffect(() => {
    const fetchUser = async () => {
      const loggedInUser = await getLoggedInUser();
      setUser(loggedInUser);
    };
    fetchUser();
  }, []);

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
              <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                <Link href="/">
                  <SidebarTrigger className="h-5 w-5" />
                  <span className="text-base font-semibold">Acme Inc.</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="sidebar-link">
                {items.map(item => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title} className="w-full">
                      <Tooltip delayDuration={1000}>
                        <TooltipTrigger asChild>
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
                        </TooltipTrigger>
                        <TooltipContent side="right">{item.title}</TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                })}
                {user && (
                  <SidebarMenuItem className="w-full">
                    <PlaidLink user={user} variant="sidebar" />
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <Separator />
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </section>
  );
};

export default AppSidebar;
