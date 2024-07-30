"use client";

import React, { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { addTask } from "@/app/actions/task.actions";
import Goback from "./Goback";
import { toast } from "./ui/use-toast";
import { TaskProps } from "@/lib/types";
import { RiLoaderFill } from "react-icons/ri";
import { PiWarningDiamond } from "react-icons/pi";
import { CiCalendar } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import { BsClockHistory } from "react-icons/bs";
import { LuLoader2 } from "react-icons/lu";

const CreateTask: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { data: session, status: sessionStatus } = useSession();
  const email = session?.user?.email;

  const task = {
    title: title || "Title",
    status: status || "In Progress",
    priority: priority || "Low",
    deadline: deadline || "2020-10-20",
    description: description || "Description.........",
  };

  const isFormValid = useMemo(() => {
    return title && status && priority && deadline && description;
  }, [deadline, description, priority, status, title]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast({
        variant: "destructive",
        title: "Please login first!",
        description: "Then try again later...",
      });
      return router.push("/sign-in");
    }

    setLoading(true);
    try {
      console.log(email, task);
      const res = await addTask({
        title,
        status,
        priority,
        deadline,
        description,
      });

      if (res === "created") {
        toast({
          title: "✅ Your first task created successfully!",
          description: "Now you can manage your tasks...",
        });
        return router.push("/");
      }
      if (res === "added") {
        toast({
          title: "✅ New task added successfully!",
          description: "Now you can manage your tasks..",
        });
        return router.push("/");
      }
      if (res === "doesn't-exists") {
        toast({
          variant: "destructive",
          title: "Please login first!",
          description: "Then try again later...",
        });
        return router.push("/sign-in");
      }
      if (res === "err") {
        return toast({
          variant: "destructive",
          title: "Something went wrong, server seems busy.",
          description: "Try again later...",
        });
      }
    } catch (err) {
      return toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "Try again later...",
      });
    } finally {
      setLoading(false);
    }
  };

  if (sessionStatus === "unauthenticated") router.replace("/sign-in");

  return (
    <section className="relative w-full p-4 overflow-hidden">
      <Goback />
      <form
        className="animate-slide-down w-full mt-5 p-2 text-lg overflow-hidden"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Title"
          className="w-full bg-transparent text-5xl font-bold outline-none hover:border-b focus:border-b"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <table className="w-full px-2 mt-5 overflow-hidden">
          <tbody>
            <tr>
              <td className="w-fit flex items-center gap-4 p-2 md:pr-10">
                <RiLoaderFill size={25} />
                <span className="ml-2">Status</span>
              </td>
              <td className="md:w-full">
                <select
                  name="status"
                  className="w-full p-1"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Not Selected</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Finished">Finished</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="w-fit flex items-center gap-4 p-2 md:pr-10">
                <PiWarningDiamond size={25} />
                <span className="ml-2">Priority</span>
              </td>
              <td>
                <select
                  name="priority"
                  className="w-full p-1"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="">Not Selected</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="w-fit flex items-center gap-4 p-2 md:pr-10">
                <CiCalendar size={25} />
                <span className="ml-2">Deadline</span>
              </td>
              <td>
                <input
                  type="datetime-local"
                  name="deadline"
                  className="w-full bg-transparent outline-none hover:border-b focus:border-b"
                  value={deadline}
                  min={new Date().toISOString().slice(0, 16)}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="w-fit flex items-center gap-4 p-2 md:pr-10">
                <GoPencil size={25} />
                <span className="ml-2">Description</span>
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Description.."
                  className="w-full bg-transparent placeholder:text-black outline-none hover:border-b focus:border-b"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full bg-violet-700 text-white text-lg font-bold py-2 rounded-md shadow-md flex-center ${
            !isFormValid || loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-violet-500 active:translate-y-1"
          }`}
        >
          {loading ? (
            <span className="flex gap-4">
              Loading...
              <LuLoader2 size={25} className="animate-spin" />
            </span>
          ) : (
            "Create Task"
          )}
        </button>
      </form>
      <div className="animate-slide-up mt-4 mb-4 w-fit text-lg font-semibold">
        {task.status}
      </div>
      <TaskCard task={task} />
    </section>
  );
};
export default CreateTask;

const TaskCard: React.FC<TaskProps> = ({ task }) => {
  return (
    <>
      <div className="animate-slide-up h-auto w-fit md:max-w-[20rem] flex flex-col gap-2 p-4 rounded-2xl bg-slate-200 shadow-lg hover:scale-105 ease-in-out duration-500 overflow-hidden">
        <div className="text-xl font-bold text-balance">{task.title}</div>
        <div className="text-lg text-wrap">{task.description}</div>
        <div className="w-fit text-lg text-white font-semibold rounded-2xl bg-violet-600 flex-center py-2 px-4">
          {task.priority}
        </div>
        <div className="w-full flex items-center gap-4 p-2 md:pr-10">
          <BsClockHistory size={25} />
          {new Date(task.deadline).toLocaleString()}
        </div>
        <div className="w-fit text-lg font-semibold mt-4">0 sec ago</div>
      </div>
    </>
  );
};
