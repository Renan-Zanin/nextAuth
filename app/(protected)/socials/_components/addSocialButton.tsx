"use client";

import { Button } from "@/components/ui/button";
import { useSocialModal } from "@/hooks/use-social-modal";

export default function AddSocialButton() {
  const socialModal = useSocialModal();

  return (
    <Button onClick={() => socialModal.onOpen()}>
      Adicionar nova rede social
    </Button>
  );
}
