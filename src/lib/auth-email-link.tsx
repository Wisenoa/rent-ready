/**
 * Sends a magic link (email sign-in) email via Resend.
 * Imported dynamically from auth-server.ts to keep JSX out of .ts config files.
 */
export async function sendMagicLinkEmail({
  email,
  magicLink,
}: {
  email: string;
  magicLink: string;
}): Promise<void> {
  const { resend, fromEmail } = await import("@/lib/email");
  // emails/ is at project root, not inside src/
  const { MagicLinkEmail } = await import("../../emails/magic-link");

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Votre lien de connexion RentReady",
    react: (
      <MagicLinkEmail
        email={email}
        magicLink={magicLink}
        expiresIn="15 minutes"
      />
    ),
  });
}
