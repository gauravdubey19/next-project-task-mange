"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { UserSession } from "@/lib/types";
import { GrTasks } from "react-icons/gr";
import { LuCalendarPlus } from "react-icons/lu";
import { MdOutlineArrowForwardIos } from "react-icons/md";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as UserSession["user"] | undefined;
  if (pathname == "/sign-in" || pathname == "/sign-up") return null;
  return (
    <>
      <div className="hidden sticky top-0 left-0 lg:flex flex-col gap-6 w-[20rem] h-screen border shadow-xl p-4 overflow-hidden">
        <div className="animate-slide-down flex-between flex-wrap capitalize font-bold">
          <div className="text-xl">{user?.fullname || "GoTask"}</div>
          {session && (
            <button
              onClick={async () => await signOut()}
              className="text-md text-white bg-violet-700 hover:bg-violet-500 px-4 py-2 rounded-lg shadow-lg active:translate-y-0.5"
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
              className="animate-slide-down w-full flex-center gap-2 text-white bg-violet-700 hover:bg-violet-500 p-4 rounded-lg shadow-md active:translate-y-0.5"
            >
              <LuCalendarPlus />
              Create new task
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
