import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar";
import {
  Landmark,
  Home,
  ScrollText,
  CreditCard,
  ArrowLeftRight,
} from "lucide-react";
import SearchForm from "./SearchForm";
import { NavUser } from "./NavUser";

const user = {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  }

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "My Banks",
    url: "",
    icon: Landmark,
  },
  {
    title: "Transactions History",
    url: "",
    icon: ScrollText,
  },
  {
    title: "Payment Transfer",
    url: "",
    icon: ArrowLeftRight,
  },
  {
    title: "Connect Bank Account",
    url: "",
    icon: CreditCard,
  },
];

const AppSidebar = () => {
  return (
    <section>
      <Sidebar variant="inset" className="font-semibold">
        <SidebarHeader>
          <SearchForm className="font-normal" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title} className="sidebar-link">
                    <SidebarMenuButton asChild isActive>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
    </section>
  );
};

export default AppSidebar;
