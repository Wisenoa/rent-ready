"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  CreditCard,
  LayoutDashboard,
  Plus,
  Receipt,
  ScanLine,
  Search,
  Users,
  Wrench,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { searchAll, type SearchResults } from "@/lib/actions/search-actions";

const navigationItems = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { label: "Biens", href: "/properties", icon: Building2 },
  { label: "Locataires", href: "/tenants", icon: Users },
  { label: "Paiements", href: "/billing", icon: CreditCard },
  { label: "Dépenses", href: "/expenses", icon: Receipt },
  { label: "Maintenance", href: "/maintenance", icon: Wrench },
] as const;

const quickActions = [
  { label: "Ajouter un bien", href: "/properties?action=add", icon: Plus },
  { label: "Ajouter un locataire", href: "/tenants?action=add", icon: Plus },
  { label: "Nouvelle dépense", href: "/expenses?action=add", icon: Plus },
  { label: "Scanner une facture", href: "/expenses?action=scan", icon: ScanLine },
  {
    label: "Enregistrer un paiement",
    href: "/billing?action=add",
    icon: CreditCard,
  },
] as const;

// Context to share open state between CommandPalette and CommandPaletteTrigger
const CommandPaletteContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({ open: false, setOpen: () => {} });

/**
 * Provider that wraps the palette dialog and any trigger buttons.
 * Place this in the layout to make the palette available on every page.
 */
export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [results, setResults] = React.useState<SearchResults>({
    tenants: [],
    properties: [],
  });
  const [isPending, startTransition] = React.useTransition();

  // Global Cmd+K / Ctrl+K shortcut
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch data when palette opens
  React.useEffect(() => {
    if (!open) return;
    startTransition(async () => {
      try {
        const data = await searchAll("");
        setResults(data);
      } catch {
        // Silently fail — palette still works for static items
      }
    });
  }, [open]);

  function select(href: string) {
    setOpen(false);
    router.push(href);
  }

  const contextValue = React.useMemo(() => ({ open, setOpen }), [open]);

  return (
    <CommandPaletteContext value={contextValue}>
      {children}

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Palette de commandes"
        description="Rechercher un locataire, un bien, une action..."
      >
        <CommandInput placeholder="Rechercher un locataire, un bien, une action..." />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>

          <CommandGroup heading="Navigation">
            {navigationItems.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => select(item.href)}
                keywords={[item.label]}
              >
                <item.icon className="text-muted-foreground" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Actions rapides">
            {quickActions.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => select(item.href)}
                keywords={[item.label]}
              >
                <item.icon className="text-muted-foreground" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>

          {results.tenants.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Locataires">
                {results.tenants.map((tenant) => (
                  <CommandItem
                    key={tenant.id}
                    onSelect={() =>
                      select(`/tenants?highlight=${tenant.id}`)
                    }
                    keywords={[tenant.name, tenant.email ?? ""]}
                  >
                    <Users className="text-muted-foreground" />
                    <span>{tenant.name}</span>
                    {tenant.email && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {tenant.email}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {results.properties.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Biens">
                {results.properties.map((property) => (
                  <CommandItem
                    key={property.id}
                    onSelect={() =>
                      select(`/properties?highlight=${property.id}`)
                    }
                    keywords={[property.name, property.address]}
                  >
                    <Building2 className="text-muted-foreground" />
                    <span>{property.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {property.address}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {isPending && results.tenants.length === 0 && results.properties.length === 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Chargement...">
                <CommandItem disabled>Recherche en cours...</CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </CommandPaletteContext>
  );
}

/**
 * Search trigger button for the header.
 * Must be rendered inside CommandPaletteProvider.
 */
export function CommandPaletteTrigger() {
  const { setOpen } = React.useContext(CommandPaletteContext);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="flex h-8 w-full max-w-56 items-center gap-2 rounded-lg border border-input/50 bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Search className="size-3.5" />
      <span className="flex-1 text-left text-xs">Rechercher...</span>
      <kbd className="pointer-events-none hidden rounded border border-border/50 bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-block">
        ⌘K
      </kbd>
    </button>
  );
}
