"use client";

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";
import Users from "./_components/users";

export default function AdminPage() {
  function onServerActionClick() {
    admin().then((data) => {
      if (data.error) {
        toast.error(data.error);
      }

      if (data.success) {
        toast.success(data.success);
      }
    });
  }

  function onApiRouteClick() {
    fetch("/api/admin").then((response) => {
      if (response.ok) {
        toast.success("API route permitida!");
      } else {
        toast.error("API route proibida!");
      }
    });
  }

  return (
    <>
      <Card className="w-[600px]">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">Admin</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <RoleGate allowedRole={UserRole.ADMIN}>
            <FormSuccess message="Você tem permissão para esse conteúdo" />
          </RoleGate>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
            <p className="text-sm font-medium">Admin-only api route</p>
            <Button onClick={onApiRouteClick}>Click para testar</Button>
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
            <p className="text-sm font-medium">Admin-only server action</p>
            <Button onClick={onServerActionClick}>Click para testar</Button>
          </div>
        </CardContent>
      </Card>
      <Users />
    </>
  );
}
