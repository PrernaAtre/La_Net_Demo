"use client";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
import Sidebar from "./_components/sidebar";
import { useCurrentUser } from "../routes/editor/hooks/useCurrentUser";
import { useAuthenticated } from "../routes/editor/hooks/useIsauthenticate";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthenticated()
  const { user  } = useCurrentUser()
  console.log(user);

  if (!isAuthenticated) {
    return redirect("/");
  }

  return (
    <div className="h-screen flex dark:bg-[#1F1F1F]">
      <Sidebar />

      {/* <Document children={undefined} /> */}
      {/* <main className="flex-1 h-full overflow-y-auto">
      </main> */}
      <div className="flex flex-col ml-[5%]">
        {children}
      </div>
    </div>
  );
};
export default MainLayout;
