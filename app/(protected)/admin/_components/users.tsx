import { getAllUsers } from "@/actions/users";
import { columns } from "@/app/(protected)/admin/_components/columns";
import { DataTable } from "@/app/(protected)/admin/_components/data-table";
import { BeatLoader } from "react-spinners";

export default async function Users() {
  const users = await getAllUsers();

  if (users) {
    return <DataTable columns={columns} data={users} />;
  }
}
