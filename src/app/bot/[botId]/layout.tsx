import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";

const BotLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="p-10">{children}</main>
      </SidebarInset>
      {/* <main className="flex flex-col">
        <SidebarTrigger />
        {children}
      </main> */}
    </SidebarProvider>
  );
};

export default BotLayout;
