import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isTrialExpired,
  isAccessBlocked,
  SubscriptionGate,
} from "../../components/subscription-gate";

// Mocks
const mockGetSession = vi.fn();
const mockFindUnique = vi.fn();
const mockRedirect = vi.fn();
const mockHeaders = vi.fn();

vi.mock("@/lib/auth-server", () => ({
  auth: {
    api: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
    },
  },
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    throw new Error("NEXT_REDIRECT");
  },
}));

vi.mock("next/headers", () => ({
  headers: () => mockHeaders(),
}));

describe("SubscriptionGate & logic tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("isTrialExpired", () => {
    it("returns false when trialEndsAt is null (new users)", () => {
      expect(isTrialExpired(null)).toBe(false);
    });

    it("returns false when trialEndsAt is in the future", () => {
      const future = new Date(Date.now() + 86400 * 1000 * 7); // +7 days
      expect(isTrialExpired(future)).toBe(false);
    });

    it("returns true when trialEndsAt is in the past", () => {
      const past = new Date(Date.now() - 86400 * 1000 * 2); // -2 days
      expect(isTrialExpired(past)).toBe(true);
    });
  });

  describe("isAccessBlocked", () => {
    it("allows ACTIVE subscriptions regardless of trial date", () => {
      const past = new Date(Date.now() - 86400 * 1000);
      expect(isAccessBlocked("ACTIVE", past)).toBe(false);
      expect(isAccessBlocked("ACTIVE", null)).toBe(false);
    });

    it("allows TRIAL subscriptions with null or future trialEndsAt", () => {
      const future = new Date(Date.now() + 86400 * 1000);
      expect(isAccessBlocked("TRIAL", null)).toBe(false);
      expect(isAccessBlocked("TRIAL", future)).toBe(false);
    });

    it("blocks TRIAL subscriptions when trial date is in the past", () => {
      const past = new Date(Date.now() - 86400 * 1000);
      expect(isAccessBlocked("TRIAL", past)).toBe(true);
    });

    it("blocks PAST_DUE, CANCELLED, and EXPIRED statuses", () => {
      expect(isAccessBlocked("PAST_DUE", null)).toBe(true);
      expect(isAccessBlocked("CANCELLED", null)).toBe(true);
      expect(isAccessBlocked("EXPIRED", null)).toBe(true);
    });
  });

  describe("SubscriptionGate runtime behavior", () => {
    it("redirects unauthenticated requests to login", async () => {
      mockHeaders.mockResolvedValue(new Map());
      mockGetSession.mockResolvedValue(null);

      await expect(SubscriptionGate()).rejects.toThrow("NEXT_REDIRECT");
      expect(mockRedirect).toHaveBeenCalledWith("/login");
    });

    it("lets active users through without redirect", async () => {
      mockHeaders.mockResolvedValue(new Map());
      mockGetSession.mockResolvedValue({ user: { id: "user_active_1" } });
      mockFindUnique.mockResolvedValue({
        subscriptionStatus: "ACTIVE",
        trialEndsAt: null,
      });

      await expect(SubscriptionGate()).resolves.toBeUndefined();
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("lets new users with trialEndsAt null through without redirect", async () => {
      mockHeaders.mockResolvedValue(new Map());
      mockGetSession.mockResolvedValue({ user: { id: "user_new_1" } });
      mockFindUnique.mockResolvedValue({
        subscriptionStatus: "TRIAL",
        trialEndsAt: null,
      });

      await expect(SubscriptionGate()).resolves.toBeUndefined();
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("redirects expired trial users on /dashboard to /billing", async () => {
      const headerMap = new Map([["x-pathname", "/dashboard"]]);
      mockHeaders.mockResolvedValue(headerMap);
      mockGetSession.mockResolvedValue({ user: { id: "user_expired_1" } });
      mockFindUnique.mockResolvedValue({
        subscriptionStatus: "TRIAL",
        trialEndsAt: new Date(Date.now() - 100000),
      });

      await expect(SubscriptionGate()).rejects.toThrow("NEXT_REDIRECT");
      expect(mockRedirect).toHaveBeenCalledWith(
        "/billing?paywall=expired&status=TRIAL"
      );
    });

    it("does NOT redirect expired users when already requesting /billing (breaks loop)", async () => {
      const headerMap = new Map([["x-pathname", "/billing"]]);
      mockHeaders.mockResolvedValue(headerMap);
      mockGetSession.mockResolvedValue({ user: { id: "user_expired_2" } });
      mockFindUnique.mockResolvedValue({
        subscriptionStatus: "EXPIRED",
        trialEndsAt: null,
      });

      // Must resolve cleanly without throwing NEXT_REDIRECT
      await expect(SubscriptionGate()).resolves.toBeUndefined();
      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });
});


describe("subscription verification failures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHeaders.mockResolvedValue(new Map([["x-pathname", "/dashboard"]]));
    mockGetSession.mockResolvedValue({ user: { id: "user-1" } });
  });
  it("propagates a database outage instead of granting access", async () => {
    mockFindUnique.mockRejectedValueOnce(new Error("database unavailable"));
    await expect(SubscriptionGate()).rejects.toThrow("database unavailable");
  });
  it("propagates an authentication service outage", async () => {
    mockGetSession.mockRejectedValueOnce(new Error("auth unavailable"));
    await expect(SubscriptionGate()).rejects.toThrow("auth unavailable");
  });
  it("rejects a deleted user with a cached session", async () => {
    mockFindUnique.mockResolvedValueOnce(null);
    await expect(SubscriptionGate()).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });
  it.each(["referer", "x-url"])("does not trust a %s containing billing", async (header) => {
    mockHeaders.mockResolvedValueOnce(new Map([["x-pathname", "/properties"], [header, "https://lokna.fr/billing"]]));
    mockFindUnique.mockResolvedValueOnce({ subscriptionStatus: "EXPIRED", trialEndsAt: null });
    await expect(SubscriptionGate()).rejects.toThrow("NEXT_REDIRECT");
  });
  it("blocks unknown states", () => expect(isAccessBlocked("UNKNOWN", null)).toBe(true));
  it("expires at the precise boundary", () => expect(isAccessBlocked("TRIAL", new Date(0))).toBe(true));
});
