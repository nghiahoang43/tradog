"use client";

import {
  Calendar,
  Home,
  Inbox,
  LineChart,
  Search,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { BotSwitcher } from "./bot-switcher";
import UserButton from "@/app/features/auth/components/UserButton";
import { useRouter, usePathname } from "next/navigation";
import { useBotId } from "@/hooks/useBotId";
import { cn } from "@/lib/utils";
import Link from "next/link";
// Menu items.
const items = [
  {
    title: "Home",
    icon: Home,
    path: "dashboard",
  },
  {
    title: "Positions",
    icon: LineChart,
    path: "positions",
  },
];

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const router = useRouter();
  const pathname = usePathname();
  const botId = useBotId();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BotSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => {
              const isActive = pathname.includes(item.path);
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "font-semibold",
                      "data-[state=active]:bg-sidebar-accent",
                      "data-[state=active]:text-sidebar-accent-foreground"
                    )}
                    tooltip={item.title}
                    isActive={isActive}
                  >
                    <Link href={`/bot/${botId}/${item.path}`}>
                      {item.icon && <item.icon />}
                      <span className="hidden lg:inline-block data-[collapsed=true]:lg:hidden">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
