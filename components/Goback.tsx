"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { IoChevronBackSharp } from "react-icons/io5";

const Goback = () => {
  const router = useRouter();

  return (
    <>
      <div
        onClick={() => router.back()}
        className="w-fit group animate-slide-down left-5 top-5 backdrop-blur-md p-2 rounded-full cursor-pointer shadow-[0_0_8px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <IoChevronBackSharp size={25}
          className="group-hover:scale-110 fill-white group-hover:fill-[red] group-active:-translate-x-1 ease-in-out duration-200"
        />
      </div>
    </>
  );
};

export default Goback;
