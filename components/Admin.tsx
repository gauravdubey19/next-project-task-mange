"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Users, UserSession } from "@/lib/types";
import { motion } from "framer-motion";

export interface UsersList {
  users: Users[];
}

const Admin: React.FC<UsersList> = ({ users }) => {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const user = session?.user as UserSession["user"] | undefined;

  if (sessionStatus !== "authenticated" || user?.role !== "admin") router.replace("/");
  return (
    <>
      {users.map((user, index) => (
        <motion.div
          key={index || user._id}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          initial="hidden"
          animate="visible"
          transition={{
            delay: index * 0.25,
            ease: "easeInOut",
            duration: 0.5,
          }}
          className="w-fit h-fit p-3 bg-transparent backdrop-blur-md rounded-2xl scale-95 shadow-[0_0_2px_rgba(0,0,0,0.5)] hover:shadow-sm hover:shadow-violet-700/60 hover:scale-100 ease-in-out duration-300"
        >
          <table className="overflow-hidden">
            <tbody className="text-md capitalize">
              <tr>
                <td className="">
                  <span className="pr-2">Full Name :</span>
                </td>
                <td className="text-violet-600">{user?.name}</td>
              </tr>
              <tr>
                <td className="">Email :</td>
                <td className="text-violet-600 lowercase">{user?.email}</td>
              </tr>
              <tr>
                <td className="">Role :</td>
                <td className="text-violet-600">{user?.role}</td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      ))}
    </>
  );
};

export default Admin;
