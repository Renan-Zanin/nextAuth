"use server";

import * as z from "zod";
import { SocialMedialSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getSocialById, getSocialByLink } from "@/data/social";
import { currentUser } from "@/lib/auth";

export const createSocial = async (
  values: z.infer<typeof SocialMedialSchema>
) => {
  const validatedFields = SocialMedialSchema.safeParse(values);
  const user = await currentUser();

  if (!validatedFields.success) {
    return { error: "Campos inválidos!" };
  }

  const { description, link } = validatedFields.data;

  const existingLink = await getSocialByLink(link);

  if (existingLink) {
    return { error: "Link já está em uso!" };
  }

  if (!user) {
    return { error: "Usuário não encontrado!" };
  }

  await db.socialMedia.create({
    data: { description, link, userId: user?.id },
  });

  return { success: "Rede social adicionada com sucesso!" };
};

export const deleteSocialById = async (id: string) => {
  const user = await currentUser();

  try {
    await db.socialMedia.delete({
      where: { userId: user?.id, id: id },
    });
    console.log("teste", id);
  } catch {
    return null;
  }
};

export const updateSocialById = async (
  id: string,
  values: z.infer<typeof SocialMedialSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Não autorizado" };
  }

  const social = await getSocialById(id);

  if (social?.userId !== user.id) {
    return { error: "Não autorizado" };
  }

  if (!social) {
    return { error: "Rede social não encontrada!" };
  }

  await db.socialMedia.update({
    where: { userId: user.id, id },
    data: {
      ...values,
    },
  });

  return { success: "Dados atualizados" };
};
