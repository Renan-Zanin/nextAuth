import { UserRole } from "@prisma/client";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email é necessário",
  }),
  password: z.string().min(1, {
    message: "Senha é necessária",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email é necessário",
  }),
  password: z.string().min(6, {
    message: "Senha deve ter ao menos 6 caracteres",
  }),
  name: z.string().min(1, { message: "Nome é necessário" }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email é necessário",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string(),
});

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Nova senha é necessária",
      path: ["newPassword"],
    }
  );

export const SocialMedialSchema = z.object({
  description: z.string(),
  link: z.string(),
});
