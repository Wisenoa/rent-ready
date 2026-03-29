import { auth, currentUser } from "@clerk/nextjs/server";
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
 * Get the current authenticated user's Clerk ID.
 * Throws AuthenticationError if not authenticated.
 */
export async function requireAuth(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new AuthenticationError();
  }
  return userId;
}

/**
 * Get or create the database User record for the current Clerk user.
 * This is the main entry point for multitenancy — returns the DB user
 * whose `id` is used to scope all queries.
 *
 * Cached per request to avoid multiple DB calls.
 */
export const getCurrentUser = cache(async () => {
  const clerkId = await requireAuth();
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new AuthenticationError();
  }

  // Upsert: create user if first login, update if profile changed
  const user = await prisma.user.upsert({
    where: { clerkId },
    update: {
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      firstName: clerkUser.firstName ?? "",
      lastName: clerkUser.lastName ?? "",
    },
    create: {
      clerkId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      firstName: clerkUser.firstName ?? "",
      lastName: clerkUser.lastName ?? "",
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
    },
  });

  return user;
});

/**
 * Get just the database user ID for the current session.
 * Use this in server actions for lightweight auth checks.
 */
export const getCurrentUserId = cache(async (): Promise<string> => {
  const user = await getCurrentUser();
  return user.id;
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
