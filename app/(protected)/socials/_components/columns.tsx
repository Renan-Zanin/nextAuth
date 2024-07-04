"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";

export type SocialsColumns = {
  id: string;
  description: string;
  link: string;
};

export const columns: ColumnDef<SocialsColumns>[] = [
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "link",
    header: "Link",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
