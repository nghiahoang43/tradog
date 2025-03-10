"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useBotId } from "@/hooks/useBotId";
import { useRouter } from "next/navigation";
import { useCreateBotModal } from "@/app/features/bot/store/useCreateBotModal";
import { useGetBot } from "@/app/features/bot/api/useGetBot";
import { useGetBots } from "@/app/features/bot/api/useGetBots";
import { FaRobot } from "react-icons/fa";

export const BotSwitcher = () => {
  const { isMobile } = useSidebar();

  const router = useRouter();
  const botId = useBotId();

  const [_open, setOpen] = useCreateBotModal();

  const { data: bot, isLoading: botLoading } = useGetBot({ id: botId });

  const { data: bots, isLoading: botsLoading } = useGetBots();

  const filteredBots = bots?.filter((bot) => bot?._id !== botId);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <FaRobot className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{bot?.name}</span>
                <span className="truncate text-xs">${bot?.budget}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Bots
            </DropdownMenuLabel>
            {filteredBots?.map((bot, index) => (
              <DropdownMenuItem
                key={bot._id}
                onClick={() => router.push(`/bot/${bot._id}`)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <FaRobot className="size-4 shrink-0" />
                </div>
                {bot.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => setOpen(true)}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add a bot</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
