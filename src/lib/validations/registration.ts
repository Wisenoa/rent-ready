import { z } from "zod";

export const registrationSchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est requis").max(100, "Le prénom est trop long"),
  lastName: z.string().trim().max(100, "Le nom est trop long"),
  email: z.string().trim().toLowerCase().pipe(z.email("Adresse email invalide").max(254)),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").max(128, "Le mot de passe est trop long"),
});
