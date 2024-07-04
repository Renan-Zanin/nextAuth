import { getAllUsers } from "@/data/user";

export const useGetAllUsers = async () => {
  const users = await getAllUsers();

  return users;
};
