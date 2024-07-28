import React from "react";
import Image from "next/image";

export default function Loading() {
  return (
    <>
      <div className="w-full h-[77vh] flex-center relative">
        <Image
          src="https://cdn.dribbble.com/users/563824/screenshots/3678774/dash2.gif"
          alt="authImg"
          width={400}
          height={400}
          // fill={true}
          className="w-full h-hull"
        />
      </div>
    </>
  );
}
