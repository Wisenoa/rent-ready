import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const fromEmail = process.env.RESEND_DOMAIN
  ? `Rent-Ready <notifications@${process.env.RESEND_DOMAIN}>`
  : "Rent-Ready <noreply@rent-ready.fr>";

export { resend };
