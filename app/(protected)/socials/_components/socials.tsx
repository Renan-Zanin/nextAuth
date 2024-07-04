import { columns } from "@/app/(protected)/socials/_components/columns";
import { DataTable } from "@/app/(protected)/socials/_components/data-table";
import { getAllSocials } from "@/data/social";

export default async function Socials() {
  const socials = await getAllSocials();

  if (socials) {
    return <DataTable columns={columns} data={socials} />;
  }
}
