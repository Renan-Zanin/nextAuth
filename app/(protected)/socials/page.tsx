import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AddSocialButton from "./_components/addSocialButton";
import Socials from "./_components/socials";

export default function SocialsPage() {
  return (
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          Gerencie as suas redes sociais
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Socials />
        <AddSocialButton />
      </CardContent>
    </Card>
  );
}
