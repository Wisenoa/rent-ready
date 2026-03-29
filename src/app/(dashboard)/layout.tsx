import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { CommandPaletteProvider, CommandPaletteTrigger } from "@/components/command-palette";
import { UserMenu } from "@/components/user-menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <CommandPaletteProvider>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/50 bg-card/50 backdrop-blur-sm px-6">
            <SidebarTrigger className="-ml-2" />
            <Separator orientation="vertical" className="mr-2 !h-5" />
            <CommandPaletteTrigger />
            <div className="flex-1" />
            <UserMenu />
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </CommandPaletteProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
