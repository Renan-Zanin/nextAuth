"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SocialsColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import AlertModal from "@/components/modals/alert-modal";
import { deleteSocialById } from "@/actions/socials";

interface CellActionProps {
  data: SocialsColumns;
}

export default function CellAction({ data }: CellActionProps) {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [isPending, startTransiction] = useTransition();

  async function onDelete(id: string) {
    startTransiction(() => {
      deleteSocialById(id);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete(data.id)}
        loading={isPending}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => router.push(`/socials/${data.id}`)}>
            <Edit className="m-2 h-4 w-4" />
            Atualizar
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="m-2 h-4 w-4" />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
