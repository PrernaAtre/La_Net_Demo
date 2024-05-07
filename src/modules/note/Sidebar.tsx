"use client";
import { useCreatePage } from "@/modules/editor/hooks/useCreatePage";
import { useCurrentUserPages } from "@/modules/editor/hooks/useCurrentUserPages";
import { useMakeTrashPage } from "@/modules/editor/hooks/useMakeTrashPage";
import { useCurrentUser } from "@/modules/hooks";
import { removeCurrentUser } from "@/store/features/auth";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import UserIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import UserProfileModal from "../user/profile/ProfileModal";
import TrashWindow from "./TrashWindow";

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { pages } = useCurrentUserPages();

  const { user } = useCurrentUser();

  const { handleTrashPage } = useMakeTrashPage();

  const { handleCreatePage, isLoading } = useCreatePage();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const unTrashedPages = useMemo(() => {
    return pages?.filter((d: any) => !d?.isTrashed) || [];
  }, [pages]);

  const createPage = async () => {
    const page = await handleCreatePage(
      {
        name: "Untitled",
        document: [
          {
            id: "1",
            type: "heading",
            content: "",
            props: { level: 1 },
          },
        ],
      },
      (createdPage: any) =>
        createdPage?.data && router.push(`/page/${createdPage?.data?._id}`)
    );
  };

  function handleLogout() {
    dispatch(removeCurrentUser());
    router.push("/");
  }

  return (
    <div className="flex flex-row bg-secondary">
      <div className="flex flex-col w-56">
        <div className="flex items-center justify-start ml-4 bg-secondary h-14">
          <Avatar sx={{ width: 24, height: 24 }} src={user?.profile_image} />
          <span className="text-sm font-medium pl-2 text-white/80">
            {!user?.username ? "User" : user?.username}
          </span>
        </div>

        <ul className="flex flex-col px-2">
          <li>
            <a
              href="#"
              className="flex flex-row items-center h-10 rounded-lg text-muted-foreground hover:bg-primary/5"
            >
              <SearchIcon className="ml-2" fontSize="small" />
              <span className="text-sm font-medium w-28 text-left pl-2">
                Search
              </span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex flex-row items-center h-10 rounded-lg text-muted-foreground hover:bg-primary/5"
            >
              <SettingsIcon className="ml-2" fontSize="small" />
              <span className="text-sm font-medium pl-2">Settings</span>
            </a>
          </li>
          <ul className="flex flex-col my-2 w-full">
            {unTrashedPages &&
              unTrashedPages.map((page: any) => (
                <li
                  key={page._id}
                  className="flex flex-row items-center h-10 rounded-lg text-muted-foreground"
                >
                  <div className="hover:bg-primary/5 py-1 rounded-lg w-36">
                    <NoteAddIcon className="ml-2" fontSize="small" />
                    <Link href={`/page/${page._id}`} className="w-20">
                      <span className="text-sm font-medium pl-2">
                        {page.name}
                      </span>
                    </Link>
                  </div>
                  <div className="mr-4 cursor-pointer hover:bg-primary/5 p-2 rounded-lg">
                    <BsTrash onClick={() => handleTrashPage(page._id)} />
                  </div>
                </li>
              ))}
          </ul>
          <li>
            <button
              // href="/page"
              className="flex flex-row w-full items-center h-10 rounded-lg text-muted-foreground hover:bg-primary/5"
              onClick={createPage}
              disabled={isLoading}
            >
              <AddCircleOutlineIcon className="ml-2" fontSize="small" />
              <span className="text-sm font-medium pl-2">Add Page</span>
            </button>
          </li>
          <li>
            <Link
              href="/routes/quickNote"
              className="flex flex-row items-center h-10 rounded-lg text-muted-foreground hover:bg-primary/5"
            >
              <AddCircleOutlineIcon className="ml-2" fontSize="small" />
              <span className="text-sm font-medium pl-2">Quick Email</span>
            </Link>
          </li>
          <li className="flex flex-row items-center h-10 rounded-lg text-muted-foreground hover:bg-primary/5">
            <DeleteOutlineIcon className="ml-2" />
            <TrashWindow />
            <ToastContainer />
          </li>

          <li>
            <div
              className="flex flex-row items-center h-10 rounded-lg text-muted-foreground hover:bg-primary/5 cursor-pointer"
              onClick={() => setIsProfileModalOpen(true)}
            >
              <UserIcon className="ml-2" />
              <span className="text-sm font-medium pl-2">Profile</span>
            </div>
          </li>
          {/* <li>
            <a
              href="#"
              className="flex flex-row items-center h-10 rounded-lg text-muted-foreground hover:bg-primary/5"
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                <i className="bx bx-bell"></i>
              </span>
              <span className="text-sm font-medium">Notifications</span>
              <span className="ml-auto mr-6 text-sm bg-red-100 rounded-full px-3 py-px text-red-500">
                5
              </span>
            </a>
          </li> */}
          <li>
            <div
              className="w-full flex flex-row items-center text h-10 rounded-lg text-muted-foreground hover:bg-primary/5 cursor-pointer"
              onClick={() => {
                handleLogout();
              }}
            >
              <LogoutIcon className="ml-2" fontSize="small" />
              <span className="text-sm font-medium pl-2">Logout</span>
            </div>
          </li>
        </ul>

        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      </div>
    </div>
  );
};
