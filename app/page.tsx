import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Task from "@/components/Task";
import TaskBoard from "@/components/TaskBoard";

export default async function Home() {
  const session = await getServerSession();
  if (!session) redirect("/sign-in");

  // console.log(session);

  return (
    <main className="w-full">
      <Task />
      <TaskBoard />
    </main>
  );
}
