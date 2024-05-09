"use client";
import { useCurrentUser } from "@/modules/hooks/useCurrentUser";
import { Sidebar } from "@/modules/note";
import { redirect } from "next/navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useCurrentUser();
  console.log(user);

  if (!user) {
    return redirect("/");
  }

  return (
    <div className="h-screen flex dark:bg-[#1F1F1F]">
      <Sidebar />
      <div className="flex flex-col flex-grow">{children}</div>
    </div>
  );
};
export default MainLayout;
