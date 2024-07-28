"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { UserSession } from "@/lib/types";
import { GrTasks } from "react-icons/gr";
import { LuCalendarPlus } from "react-icons/lu";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { FaGithub } from "react-icons/fa";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as UserSession["user"] | undefined;
  if (pathname == "/sign-in" || pathname == "/sign-up") return null;
  return (
    <>
      <div className="hidden md:flex-between flex-col w-full h-screen border-r shadow-xl px-1.5 py-4 overflow-hidden">
        <div className="flex flex-col gap-4">
          <div className="animate-slide-down flex-between flex-wrap capitalize font-bold">
            <div className="text-xl">{user?.fullname || "GoTask"}</div>
            {session && (
              <button
                onClick={async () => await signOut()}
                className="text-sm text-white bg-violet-700 hover:bg-violet-500 px-2 py-1 rounded-lg shadow-lg active:translate-y-0.5"
              >
                Log Out
              </button>
            )}
          </div>
          <div className="p-1 overflow-hidden">
            <Link
              href="/"
              className="animate-slide-down group flex-between text-lg ease-in-out duration-300"
            >
              <div className="flex gap-2 items-center group-hover:text-violet-500 ease-in-out duration-300">
                <GrTasks /> Boards
              </div>
              <MdOutlineArrowForwardIos
                size={25}
                className="opacity-0 group-hover:opacity-100 group-active:translate-x-1.5 ease-in-out duration-300"
              />
            </Link>
          </div>
          {pathname !== "/create-task" && (
            <div className="p-2 overflow-hidden">
              <Link
                href="/create-task"
                className="animate-slide-down w-full flex-center gap-2 text-sm text-white bg-violet-700 hover:bg-violet-500 p-2 rounded-lg shadow-md active:translate-y-0.5"
              >
                <LuCalendarPlus />
                Create new task
              </Link>
            </div>
          )}
        </div>
        <Link
          href="https://github.com/gauravdubey19/next-project-task-mange"
          className="w-full flex-center gap-4 p-4 font-semibold text-lg bg-zinc-200 rounded-2xl scale-95 hover:scale-100 active:scale-95 active:translate-y-1 ease-in-out duration-300 overflow-hidden"
        >
          <FaGithub size={25} /> Source Code
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
