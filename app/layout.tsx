import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import Loading from "./loading";
import "./globals.css";
import AuthProvider from "@/utils/SessionProvider";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GoTaskManage",
  description:
    "'GoTaskManage' a robust Task-Management App that offers secure user authentication with session, a personalized Task-Board with columns/status of 'To-Do', 'In Progress', 'Under Review', and 'Finished'.\n Users can create, edit, and delete tasks, set priorities and deadlines, and enjoy drag-and-drop functionality for easy task movement.\n All data is securely stored and each user can only manage their own tasks.",
  icons: { icon: "/logo.webp" },
  keywords:
    "task management, productivity, efficiency, to-do list, Task Manage Next.js app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={session}>
          <Suspense fallback={<Loading />}>
            <div className="w-full flex">
              <div className="md:w-[15%] overflow-hidden">
                <Sidebar />
              </div>
              <div className="w-full md:w-[85%]">{children}</div>
            </div>
          </Suspense>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
