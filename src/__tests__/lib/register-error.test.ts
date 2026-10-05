import { describe, it, expect } from "vitest";
import {
  registerErrorMessage,
  visitorSafe,
  GENERIC_REGISTER_ERROR,
} from "@/lib/register-error";

/**
 * The registration form used to render whatever Prisma threw.
 *
 * `registerWithStripeCustomer` ended with:
 *
 *   } catch (error: any) {
 *     const message = error?.message ?? "Erreur lors de la création du compte.";
 *     return { success: false, error: message };
 *   }
 *
 * With the database container stopped, that message was
 *
 *   could not open file "global/pg_filenode.map": I/O error
 *
 * and Playwright captured it rendered in the page during the E2E run that
 * produced 38 `waitForURL` timeouts. It names an infrastructure mechanism and
 * must never reach a visitor.
 */
describe("l'inscription ne divulgue pas d'erreur d'infrastructure", () => {
  it("remplace l'erreur Postgres reellement observee", () => {
    const observed = new Error(
      'could not open file "global/pg_filenode.map": I/O error'
    );
    const message = registerErrorMessage(observed);

    expect(message).toBe(GENERIC_REGISTER_ERROR);
    expect(message).not.toContain("pg_filenode");
    expect(message).not.toContain("I/O error");
    expect(message).not.toContain("global/");
  });

  it.each([
    ["connexion refusee", new Error("connect ECONNREFUSED 127.0.0.1:5432")],
    ["requete SQL", new Error('relation "Transaction" does not exist')],
    ["timeout", new Error("ETIMEDOUT while reaching the database")],
    ["chemin de fichier", new Error("/var/lib/postgresql/data/base/5432 not writable")],
    ["trace d'appels", new Error("Error: boom\n    at signUpEmail (auth.ts:42:7)")],
    ["constante d'environnement", new Error("DATABASE_URL is not set")],
  ])("masque : %s", (_label, error) => {
    const message = registerErrorMessage(error);
    expect(message).toBe(GENERIC_REGISTER_ERROR);
    for (const leak of [
      "ECONNREFUSED",
      "Transaction",
      "ETIMEDOUT",
      "postgres",
      "DATABASE_URL",
      "at signUpEmail",
    ]) {
      expect(message).not.toContain(leak);
    }
  });

  it("conserve les echecs que le visiteur peut corriger", () => {
    // Better Auth identifies these by UPPER_SNAKE code, and the same table backs
    // the login form: one source of truth, not a second set of patterns.
    expect(
      registerErrorMessage({
        code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
        message: "User already exists. Use another email.",
      })
    ).toBe("Un compte existe déjà avec cette adresse email.");

    expect(
      registerErrorMessage({ code: "PASSWORD_TOO_SHORT", message: "Too short" })
    ).toBe("Le mot de passe doit contenir au moins 8 caractères.");

    expect(
      registerErrorMessage({
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests",
        status: 429,
      })
    ).toContain("Trop de tentatives");
  });

  it("un code connu ne suffit pas si le texte sent la machine", () => {
    // The infrastructure check runs first, so a thrown value cannot smuggle a
    // path out by wearing a legitimate code.
    expect(
      registerErrorMessage({
        code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
        message: 'could not open file "global/pg_filenode.map": I/O error',
      })
    ).toBe(GENERIC_REGISTER_ERROR);
  });

  it("n'invente rien pour une erreur inconnue ou vide", () => {
    expect(registerErrorMessage(new Error(""))).toBe(GENERIC_REGISTER_ERROR);
    expect(registerErrorMessage(undefined)).toBe(GENERIC_REGISTER_ERROR);
    expect(registerErrorMessage(null)).toBe(GENERIC_REGISTER_ERROR);
    expect(registerErrorMessage("une chaine")).toBe(GENERIC_REGISTER_ERROR);
  });
});

/**
 * `visitorSafe` guards text the action already classified. It must NOT
 * reclassify: a correct French message has to survive, otherwise every precise
 * error becomes the generic one and the visitor learns nothing.
 */
describe("visitorSafe ne degrade pas un message correct", () => {
  it("laisse passer un message deja classe", () => {
    expect(visitorSafe("Un compte avec cet email existe déjà.")).toBe(
      "Un compte avec cet email existe déjà."
    );
    expect(
      visitorSafe("Le mot de passe doit contenir au moins 8 caractères.")
    ).toBe("Le mot de passe doit contenir au moins 8 caractères.");
  });

  it("bloque un texte qui ressemble a une sortie machine", () => {
    expect(
      visitorSafe('could not open file "global/pg_filenode.map": I/O error')
    ).toBe(GENERIC_REGISTER_ERROR);
  });

  it("retombe sur le generique si le message est absent", () => {
    expect(visitorSafe(undefined)).toBe(GENERIC_REGISTER_ERROR);
    expect(visitorSafe("")).toBe(GENERIC_REGISTER_ERROR);
  });
});
