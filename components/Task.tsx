"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { TasksValues, UserSession } from "@/lib/types";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "./ui/dialog";
import { LuCalendarPlus } from "react-icons/lu";
import { BsClockHistory } from "react-icons/bs";
import { getTasks, searchTasks } from "@/app/actions/task.actions";
import { TaskTime } from "./TaskBoard";

const Task: React.FC = () => {
  const { data: session } = useSession();

  const user = session?.user as UserSession["user"];
  const firstname = user?.fullname ? user?.fullname.split(" ")[0] : "User";

  return (
    <section className="w-full flex flex-col gap-4 mb-2 overflow-hidden">
      <Greetings firstname={firstname} />
      <Bar />
    </section>
  );
};

export default Task;

const Greetings = ({ firstname }: { firstname: string }) => {
  const getGreeting = (): string => {
    const hours = new Date().getHours();

    if (hours >= 5 && hours < 12) {
      return "Good Morning";
    } else if (hours >= 12 && hours < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const greeting = getGreeting();

  return (
    <div className="animate-slide-down w-full p-4 text-4xl font-black capitalize">
      {greeting},<span className="text-violet-700">{" " + firstname}</span>!
    </div>
  );
};

const Bar = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const handleSearchClose = () => {
    setOpen(!isOpen);
  };
  return (
    <div className="flex-between px-4 overflow-hidden">
      <button
        onClick={() => setOpen(!isOpen)}
        className="animate-slide-up px-4 py-2 border rounded-md shadow-lg hover:border-violet-500 active:scale-95 ease-in-out duration-300"
      >
        Search Tasks
      </button>
      <Link
        href="/create-task"
        className="animate-slide-up flex-center gap-2 text-white bg-violet-700 hover:bg-violet-500 px-4 py-2 rounded-lg shadow-lg active:translate-y-1"
      >
        <LuCalendarPlus />
        Create new task
      </Link>
      {isOpen && (
        <SearchTask isOpen={isOpen} handleSearchClose={handleSearchClose} />
      )}
    </div>
  );
};

const SearchTask: React.FC<{
  isOpen: boolean;
  handleSearchClose: () => void;
}> = ({ isOpen, handleSearchClose }) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [userTasks, setUserTasks] = useState<TasksValues[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserTasks = async () => {
      setLoading(true);
      try {
        let res: TasksValues[] | { error: string };
        if (searchInput.trim() === "") {
          res = await getTasks();
        } else {
          res = await searchTasks({ title: searchInput });
        }
        if (Array.isArray(res)) {
          setUserTasks(res);
        } else {
          console.error(res.error);
          setUserTasks([]);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setUserTasks([]);
      } finally {
        setLoading(false);
      }
    };

    // if (userTasks?.length === 0 || searchInput) fetchUserTasks();
    fetchUserTasks();
  }, [searchInput]);

  return (
    <Dialog open={isOpen} onOpenChange={handleSearchClose}>
      <DialogContent className="h-[80%] border-none text-white bg-transparent backdrop-blur-md rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:shadow-sm hover:shadow-violet-400/20 ease-in-out duration-300 overflow-y-scroll overflow-x-hidden">
        <form className="sticky top-3 left-0 right-0 h-fit z-[99] mb-14 flex-center bg-black/80 rounded-md overflow-hidden">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for tasks"
            className="w-full p-2 rounded-md bg-transparent border-none focus:px-3 outline-none ease-in-out duration-300"
          />
        </form>
        <div className="flex flex-col gap-2">
          {loading ? (
            <div className="h-fit flex-center p-3 text-2xl text-gray-300">
              Loading...
            </div>
          ) : userTasks.length > 0 ? (
            userTasks.map((task, index) => (
              <motion.div
                key={task._id}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                initial="hidden"
                animate="visible"
                transition={{
                  delay: index * 0.25,
                  ease: "easeInOut",
                  duration: 0.5,
                }}
                className="h-fit flex flex-col gap-2 p-3 group cursor-pointer rounded-xl scale-95 shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_5px_violet] hover:scale-100 active:translate-y-1 ease-in-out duration-200 overflow-hidden"
              >
                <div className="w-full text-xl font-bold group-hover:text-violet-500 group-hover:text-2xl capitalize line-clamp-1 ease-in-out duration-300">
                  {task.title}
                </div>
                <div className="w-full text-sm">{task.description}</div>
                <div className="w-full flex-between text-sm">
                  <div className="flex items-center gap-2">
                    <BsClockHistory
                      size={25}
                      className="group-hover:text-violet-500 group-hover:animate-pulse"
                    />
                    {new Date(task.deadline).toLocaleString()}
                  </div>
                  <div
                    className={`w-fit text-sm text-white capitalize rounded-2xl flex-center py-1 px-3 ${task.priority === "Urgent" ? "bg-red-500" : task.priority === "Medium" ? "bg-violet-600" : "bg-green-500"}`}
                  >
                    {task.priority}
                  </div>
                </div>
                <div className="flex justify-end">
                  <TaskTime datetime={task.datetime} />
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              initial="hidden"
              animate="visible"
              transition={{
                delay: 0.25,
                ease: "easeInOut",
                duration: 0.5,
              }}
              className="h-fit flex-center p-3 text-2xl text-red-500 rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              No Tasks found
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
