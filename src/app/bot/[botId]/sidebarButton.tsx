import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

interface SidebarButtonProps {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
}

export const SidebarButton = ({
  icon: Icon,
  label,
  isActive,
}: SidebarButtonProps) => {
  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      className={cn(
        "items-center space-x-2 p-2.5 text-center text-base font-medium focus:outline-none text-gray-900 hover:text-gray-500 flex w-full justify-start h-10 rounded-lg",
        isActive && "bg-muted text-primary"
      )}
    >
      <Icon className={`!size-5 font-semibold`} />
      <span className="font-semibold">{label}</span>
    </Button>
  );
};

export default SidebarButton;
