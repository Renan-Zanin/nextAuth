"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos!" };
  }

  const { email, password, name } = validatedFields.data;

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

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email já existe!" };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "e-mail de verificação enviado" };
};
