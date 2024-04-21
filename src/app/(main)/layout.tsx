"use client"
import { useSelector } from "react-redux";
import Navigation from "./_components/navigation";
import { redirect } from "next/navigation";
import Document from "./documents/page";
import TrashWindowPage from "./TrashWindowpage/page";
import Sidebar from "./_components/sidebar";
import { EmptyDocument } from "./_components/empty_document";


const MainLayout = ({ children }: { children: React.ReactNode; }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user.user);
  console.log(user);

  if (!isAuthenticated) {
    return redirect("/");
  }

  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <Sidebar />
   
      {/* <Document children={undefined} /> */}
      {/* <main className="flex-1 h-full overflow-y-auto">
      </main> */}
      <div className="flex flex-col items-center justify-center ml-[500px]">
        {children}
      </div>
    </div>
  )
}
export default MainLayout;