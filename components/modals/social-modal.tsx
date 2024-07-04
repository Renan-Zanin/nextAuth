"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SocialMedialSchema } from "@/schemas";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { createSocial } from "@/actions/socials";
import { Modal } from "@/components/ui/modal";
import { useSocialModal } from "@/hooks/use-social-modal";
import { useRouter } from "next/navigation";

export function SocialModal() {
  const router = useRouter();

  const socialModal = useSocialModal();

  const [isPending, startTransiction] = useTransition();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof SocialMedialSchema>>({
    resolver: zodResolver(SocialMedialSchema),
    defaultValues: {
      description: "",
      link: "",
    },
  });

  function onSubmit(values: z.infer<typeof SocialMedialSchema>) {
    setError("");
    setSuccess("");

    startTransiction(() => {
      createSocial(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
        })
        .finally(() => {
          socialModal.onClose();
          router.refresh();
        });
    });
  }

  return (
    <Modal
      title="Adicionar rede"
      description="Adicione uma nova rede social às suas contas"
      isOpen={socialModal.isOpen}
      onClose={socialModal.onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="Descrição"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="instagram.com/suaconta"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <div className="pt-2 space-x-4 flex items-center justify-end w-full">
            <Button
              disabled={isPending}
              variant="outline"
              onClick={socialModal.onClose}
            >
              Cancelar
            </Button>
            <Button type="submit" className="w-auto" disabled={isPending}>
              Adicionar rede social
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
