import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth-server";

export const authClient = createAuthClient({
  /**
   * No baseURL, so Better Auth talks to the origin the page is actually served
   * from. The previous default of "http://localhost:3000" was a hardcoded port:
   * on any other port the client sent sign-in to a different server, so the
   * account was created on this instance while the session was created
   * elsewhere — leaving the user stranded on /register with no session.
   *
   * NEXT_PUBLIC_APP_URL remains an override for deployments that genuinely need a
   * distinct auth origin.
   */
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
