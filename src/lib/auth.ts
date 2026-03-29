import { headers } from "next/headers";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export class AuthenticationError extends Error {
  constructor(message = "Vous devez être connecté pour effectuer cette action.") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor(message = "Vous n'avez pas les droits pour accéder à cette ressource.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * Get the current Better Auth session from server context.
 * Returns the session + user, or null if not authenticated.
 */
async function getServerSession() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });
  return session;
}

/**
 * Require authentication. Throws AuthenticationError if not logged in.
 * Returns the Better Auth user ID (which is also the Prisma User.id).
 */
export async function requireAuth(): Promise<string> {
  const session = await getServerSession();
  if (!session?.user?.id) {
    throw new AuthenticationError();
  }
  return session.user.id;
}

/**
 * Get the database User record for the current session.
 * Better Auth stores users directly in the DB, so we just fetch by ID.
 * Sets trial on first access if missing.
 *
 * Cached per request to avoid multiple DB calls.
 */
export const getCurrentUser = cache(async () => {
  const userId = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AuthenticationError();
  }

  // Set trial end date on first login if not already set
  if (!user.trialEndsAt) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    });
  }

  return user;
});

/**
 * Get just the database user ID for the current session.
 * Use this in server actions for lightweight auth checks.
 */
export const getCurrentUserId = cache(async (): Promise<string> => {
  return requireAuth();
});

/**
 * Verify that a resource belongs to the current user.
 * Use this before any update/delete operation.
 */
export async function verifyOwnership(
  resourceUserId: string
): Promise<void> {
  const userId = await getCurrentUserId();
  if (resourceUserId !== userId) {
    throw new AuthorizationError();
  }
}

/**
 * Get the session for use in RSC pages (non-throwing).
 * Returns null if not authenticated.
 */
export const getOptionalSession = cache(async () => {
  return getServerSession();
});
