"use client";

import { JSX, useEffect, useState } from "react";
import { LogOutIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { getLoggedInUser, signOut } from "@/services/actions/user.actions";
import { Skeleton } from "../ui/skeleton";
import { User } from "#/types";

export const NavUser = (): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const loggedInUser = await getLoggedInUser();
      setUser(loggedInUser);
    };
    fetchUser();
  }, []);

  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }
  const name = `${user.firstName} ${user.lastName}`;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-default"
        >
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <AvatarImage alt={name} />
            <AvatarFallback className="rounded-lg">
              {name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{name}</span>
            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
          </div>
          <LogOutIcon
            className="ml-auto size-4 cursor-pointer hover:text-red-500 transition-colors"
            onClick={() => signOut()}
          />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
