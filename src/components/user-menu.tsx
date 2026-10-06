"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  async function handleSignOut() {
    setIsLoggingOut(true);
    try {
      // `fetchOptions.onSuccess` was never invoked: sign-out returned and the
      // page stayed on /dashboard, so the session survived the click. A landlord
      // could not sign out of their own account.
      //
      // Better Auth's client call resolves once the request completes, so the
      // navigation is done here rather than in a callback it does not call. The
      // error path navigates too: Better Auth clears the cookie server-side even
      // when the client call reports a failure, so leaving the page on a dead
      // session is worse than leaving it on /login.
      const result = await signOut();
      if (result?.error) {
        console.error("logout failed:", result.error);
      }
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            // The trigger shows the initials and nothing else, so it had no
            // accessible name: a screen reader announced « button » with no way
            // to say what it opens.
            aria-label="Menu du compte"
            className="relative h-8 w-8 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20"
          />
        }
      >
        {initials}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Inside a <DropdownMenuGroup>: Base UI's GroupLabel reads a group
            context, and without one the menu CRASHES the whole dashboard with
            « MenuGroupRootContext is missing » the moment a landlord opens their
            own account menu — so they could not sign out at all. */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.name ?? "Utilisateur"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email ?? ""}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* Both entries used to point at /settings, which does not exist: every
            authenticated screen 404'd from its own user menu. There is now one
            settings route, so both labels lead there rather than duplicating a
            dead link. */}
        <DropdownMenuItem onClick={() => router.push("/settings/profile")}>
          <User className="mr-2 size-4" />
          Mon profil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings/profile")}>
          <Settings className="mr-2 size-4" />
          Paramètres
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 size-4" />
          {isLoggingOut ? "Déconnexion…" : "Se déconnecter"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
