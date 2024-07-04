"use client";

import { useEffect, useState } from "react";

import { SocialModal } from "@/components/modals/social-modal";

export function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SocialModal />
    </>
  );
}
