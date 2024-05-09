"use client";
import { Sidebar } from "@/components/dashboard";
import { useCurrentUser } from "@/modules/hooks/useCurrentUser";
import { redirect } from "next/navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useCurrentUser();

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
