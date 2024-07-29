"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserSession } from "@/lib/types";
import { LuCalendarPlus } from "react-icons/lu";

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
  return (
    <div className="flex-between px-4 overflow-hidden">
      <div className="animate-slide-up px-4 py-2 border rounded-md">Search</div>
      <Link
        href="/create-task"
        className="animate-slide-up flex-center gap-2 text-white bg-violet-700 hover:bg-violet-500 px-4 py-2 rounded-lg shadow-lg active:translate-y-1"
      >
        <LuCalendarPlus />
        Create new task
      </Link>
    </div>
  );
};

const SearchTask = () => {
  return (
    <>
      <div className=""></div>
    </>
  );
};
