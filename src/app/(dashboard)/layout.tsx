"use client";
import { Sidebar } from "@/components/dashboard";
import { useGetCurrentUser } from "@/modules/user/hooks/useGetCurrentUser";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, fetchUser } = useGetCurrentUser();

  //fetch the user every time the page is loaded
  useEffect(() => {
    if (!user) {
      redirect("/");
    }
    fetchUser();
  }, []);

  return (
    <div className="h-screen flex dark:bg-[#1F1F1F]">
      <Sidebar />
      <div className="flex flex-col flex-grow">{children}</div>
    </div>
  );
};
export default MainLayout;
