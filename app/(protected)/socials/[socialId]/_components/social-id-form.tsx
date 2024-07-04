"use client";

import { useTransition, useState } from "react";
import { useSession } from "next-auth/react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SocialMedialSchema } from "@/schemas";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormSuccess } from "@/components/form-success";
import { FormError } from "@/components/form-error";
import { updateSocialById } from "@/actions/socials";
import { SocialMedia } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface SocialFormProps {
  initialData: SocialMedia | null;
}

export default function SocialIdForm({ initialData }: SocialFormProps) {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SocialMedialSchema>>({
    resolver: zodResolver(SocialMedialSchema),
    defaultValues: {
      description: initialData?.description || undefined,
      link: initialData?.link || undefined,
    },
  });

  function onSubmit(values: z.infer<typeof SocialMedialSchema>) {
    if (initialData) {
      startTransition(() => {
        updateSocialById(initialData.id, values)
          .then((data) => {
            if (data.error) {
              setError(data.error);
            }
            if (data.success) {
              update();
              router.push("/socials");
              setSuccess(data.success);
            }
          })
          .catch(() => setError("Algo deu errado!"));
      });
    }
  }

  return (
    <Card className="w-[600px]">
      <CardHeader className="flex flex-row justify-start items-center pl-2">
        <Button onClick={() => router.push("/socials")} variant="link">
          <ArrowLeft />
        </Button>
        <p className="text-2xl font-semibold text-center ml-[60px]">
          Atualizar informações de rede
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Descrição"
                        disabled={isPending}
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
                        placeholder="Link"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" disabled={isPending}>
              Salvar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
