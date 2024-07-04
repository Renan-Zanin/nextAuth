"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserRole } from "@prisma/client";

export type UsersColumns = {
  id: string | null;
  name: string | null;
  email: string | null;
  role: UserRole | null;
  isTwoFactorEnabled: boolean | null;
};

export const columns: ColumnDef<UsersColumns>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "isTwoFactorEnabled",
    header: "2FA",
  },
];
