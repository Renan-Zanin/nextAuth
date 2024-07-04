import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const getSocialByLink = async (link: string) => {
  try {
    const social = await db.socialMedia.findFirst({
      where: { link },
    });

    return social;
  } catch {
    return null;
  }
};

export const getSocialById = async (id: string) => {
  try {
    const social = await db.socialMedia.findUnique({
      where: { id },
    });

    return social;
  } catch {
    return null;
  }
};

export const getAllSocials = async () => {
  const user = await currentUser();
  try {
    const socials = await db.socialMedia.findMany({
      where: { userId: user?.id },
    });

    return socials;
  } catch {
    return null;
  }
};
