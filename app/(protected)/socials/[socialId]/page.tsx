import { getSocialById } from "@/data/social";
import SocialIdForm from "./_components/social-id-form";

export default async function SocialIdPage({
  params,
}: {
  params: { socialId: string };
}) {
  const social = await getSocialById(params.socialId);

  return (
    <div className="flex- col">
      <div className="flex-1 pace-y-4 p-8 pt-6">
        <SocialIdForm initialData={social} />
      </div>
    </div>
  );
}
