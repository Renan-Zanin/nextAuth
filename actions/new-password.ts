"use server";

import * as z from "zod";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Token está faltando!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos" };
  }

  const { password } = validatedFields.data;

  const uppercaseRegex = /[A-Z]/;

  // At least 1 lowercase letter
  const lowercaseRegex = /[a-z]/;

  // At least 1 special character
  const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

  // At least 1 number
  const numberRegex = /[0-9]/;

  const hasLowercase = lowercaseRegex.test(password);
  const hasUppercase = uppercaseRegex.test(password);
  const hasNumber = numberRegex.test(password);
  const hasSpecialCharacter = specialCharacterRegex.test(password);

  if (!(hasLowercase && hasUppercase && hasNumber && hasSpecialCharacter)) {
    const missingItems = [];

    if (!hasLowercase) {
      missingItems.push("- Uma letra minúscula");
    }
    if (!hasUppercase) {
      missingItems.push("- Uma letra maiúscula");
    }
    if (!hasNumber) {
      missingItems.push("- Um número");
    }
    if (!hasSpecialCharacter) {
      missingItems.push("- Um caracter especial");
    }

    const errorMessage = `Sua senha deve conter ao menos:\n ${missingItems.join(
      "\n"
    )}`;

    const successMessage = `Sua senha contém:\n${
      hasLowercase ? "- Uma letra minúscula\n" : ""
    }${hasUppercase ? "- Uma letra maiúscula\n" : ""}${
      hasNumber ? "- Um número\n" : ""
    }${hasSpecialCharacter ? "- Um caracter especial\n" : ""}`;

    if (!hasLowercase && !hasUppercase && !hasNumber && !hasSpecialCharacter) {
      return {
        error: errorMessage,
      };
    }

    return {
      error: errorMessage,
      success: successMessage,
    };
  }

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Token inválido!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "O token expirou!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "E-mail não existe!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Senha redefinida com sucesso!" };
};
