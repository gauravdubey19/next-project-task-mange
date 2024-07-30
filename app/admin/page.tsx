import { getUsers } from "../actions/users.acctions";

export default async function AdminPage() {
  const users = await getUsers();
  return (
    <section className="w-full h-screen p-4 flex flex-col gap-4">
      <h1 className="text-3xl font-black">Admin</h1>
      <h1 className="text-xl font-bold">Users</h1>
      <div className="w-full h-full flex flex-wrap gap-2 overflow-y-scroll overflow-x-hidden">
        {users}
      </div>
    </section>
  );
}
