"use client"

import { CommandPaletteProvider } from "@/components/command-palette"

export function DashboardClientProvider({ children }: { children: React.ReactNode }) {
  return <CommandPaletteProvider>{children}</CommandPaletteProvider>
}
