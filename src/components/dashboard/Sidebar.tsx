"use client";
import Modal from "@/components/modals/Modal";
import { SettingsModal } from "@/components/modals/settings-modal";
import { SearchCommand } from "@/components/search-command";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreatePage } from "@/modules/editor/hooks/useCreatePage";
import { useCurrentUserPages } from "@/modules/editor/hooks/useCurrentUserPages";
import { removeCurrentUser } from "@/store/features/auth";
import { useMakeTrashPage } from "@/modules/editor/hooks/useMakeTrashPage";
import { useCurrentUser } from "@/modules/hooks";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import UserIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import StarIcon from "@mui/icons-material/Star";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BsTrash } from "react-icons/bs";
import PushPinIcon from '@mui/icons-material/PushPin';
import { toast } from "sonner";
import TrashWindow from "./TrashWindow";
import { useManageSubscription } from "@/modules/subscription/hooks";
import { useCreateSubscription } from "@/modules/user/hooks/useCreateSubsciption";
import { ProfileForm } from "@/modules/user/profile";
import { useDispatch } from "react-redux";
import AuthToken from "@/lib/AuthToken";
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationWindow from "./NotificationWindow";

const Sidebar: React.FC = () => {
  const router = useRouter();

  const pathName = usePathname();

  const { pages } = useCurrentUserPages();

  const { user } = useCurrentUser();

  const { handleTrashPage } = useMakeTrashPage();

  const { handleCreatePage, isLoading } = useCreatePage();

  const { handleClick } = useCreateSubscription();
  const dispatch = useDispatch();

  // const { logout } = useLogout();
  const logout = () => {
    AuthToken.remove();
    dispatch(removeCurrentUser())
    toast.success("Logout successful");
    router.push("/");
  }

  const { handleManageSubscription, isLoading: manageSubscriptionLoading } =
    useManageSubscription();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

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
      (createdPage: any) => {
        if (createdPage.data) {
          toast.success("Page created successfully");
          router.push(`/page/${createdPage?.data?._id}`);
        }
      }
    );
  };

  return (
    <div className="flex flex-row bg-secondary w-60 overflow-y-auto h-[700px]">
      <div className="flex flex-col w-56">
        <div className="flex items-center justify-start ml-4 bg-secondary h-14">
          <Avatar sx={{ width: 24, height: 24 }} src={user?.profile_image} />
          <span className="text-lg font-medium pl-2 text-black dark:text-white/80">
            {!user?.username ? "User" : user?.username}
          </span>
        </div>

        <ul className="flex flex-col px-2 space-y-0">
          <li>
            <div
              className="flex flex-row items-center h-10 rounded-lg text-black dark:text-white/80 hover:bg-primary/5 cursor-pointer"
              onClick={() => setIsSearchModalOpen(true)}
            >
              <SearchIcon className="ml-2" fontSize="small" />
              <span className="text-base font-medium w-28 text-left pl-2">
                Search
              </span>
            </div>
            <SearchCommand
              isOpen={isSearchModalOpen}
              onClose={setIsSearchModalOpen}
            />
          </li>
          <li>
            <div
              className="flex flex-row items-center h-10 rounded-lg text-black dark:text-white/80 hover:bg-primary/5 cursor-pointer"
              onClick={() => setIsSettingsModalOpen(true)}
            >
              <SettingsIcon className="ml-2" fontSize="small" />
              <span className="text-base font-medium pl-2">Settings</span>
            </div>
            <SettingsModal
              isOpen={isSettingsModalOpen}
              onClose={setIsSettingsModalOpen}
            />
          </li>
          {unTrashedPages?.length > 0 && (
            <ul className="flex flex-col w-full space-y-0">
              {unTrashedPages.map((page: any) => (
                <li
                  key={page._id}
                  className="flex flex-row items-center h-10 rounded-lg text-black dark:text-white/80 border-2"
                >
                  <div className="hover:bg-primary/5 py-1 rounded-lg w-36">
                    <NoteAddIcon className="ml-2" fontSize="small" />
                    <Link href={`/page/${page._id}`} className="w-20">
                      <span className="text-base font-medium pl-2">
                        {page.name}
                      </span>
                    </Link>
                  </div>
                  <div className="mr-4 cursor-pointer hover:bg-primary/5 p-2 rounded-lg">
                    <BsTrash
                      onClick={() => {
                        if (pathName.split("/")[1] === "page") {
                          if (page._id === pathName.split("/")[2]) {
                            router.push("/page");
                          }
                          return handleTrashPage(page._id);
                        }
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <li>
            <button
              // href="/page"
              className="flex flex-row w-full items-center h-10 rounded-lg text-black dark:text-white/80 hover:bg-primary/5"
              onClick={createPage}
              disabled={isLoading}
            >
              <AddCircleOutlineIcon className="ml-2" fontSize="small" />
              <span className="text-base font-medium pl-2">Add Page</span>
            </button>
          </li>
          <li>
            <Link
              href="/quickNote"
              className="flex flex-row items-center h-10 rounded-lg text-black dark:text-white/80 hover:bg-primary/5"
            >
              <PushPinIcon className="ml-2" fontSize="small" />
              <span className="text-base font-medium pl-2">Quick Note</span>
            </Link>
          </li>
          <li className="flex flex-row items-center h-10 rounded-lg text-black dark:text-white/80 hover:bg-primary/5">
            <DeleteOutlineIcon className="ml-2" />
            &nbsp;
            <TrashWindow />
          </li>
          <li className="flex flex-row items-center h-10 rounded-lg text-black dark:text-white/80 hover:bg-primary/5">
            <NotificationsIcon className="ml-2" />
            &nbsp;
            <NotificationWindow />
          </li>
          <li>
            <div 
              className="flex flex-row items-center h-10 rounded-lg text-black dark:text-white/80 hover:bg-primary/5 cursor-pointer"
              onClick={() => setIsProfileModalOpen(true)}
            >
              <UserIcon className="ml-2" />
              <span className="text-base font-medium pl-2">Profile</span>
            </div>
          </li>
          <li className="">
            {!user?.isSubscribed ? (
              <Dialog>
                <DialogTrigger className="" asChild>
                  <div className="flex flex-row items-center h-10 rounded-lg hover:bg-primary/5">
                    <Button
                      size="sm"
                      className="px-0 ml-2 text-black dark:text-white/80 hover:bg-transparent hover:text-black"
                      variant="ghost"
                    >
                      <StarIcon />
                      &nbsp; Upgrade Plan
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upgrade to publish</DialogTitle>
                    <DialogDescription>
                      You can upgrade to publish your notes.
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <Button size="sm" onClick={handleClick}>
                      Upgrade
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog>
                <DialogTrigger className="" asChild>
                  <div className="flex flex-row items-center h-10 rounded-lg hover:bg-primary/5">
                    <Button
                      size="sm"
                      className="px-0 ml-2 text-black dark:text-white/80 hover:bg-transparent hover:text-black"
                      variant="ghost"
                    >
                      <StarIcon />
                      &nbsp; Premium Plan
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Premium Plan</DialogTitle>
                    <DialogDescription>
                      You have a premium plan.
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <Button
                      size="sm"
                      onClick={handleManageSubscription}
                      disabled={manageSubscriptionLoading}
                    >
                      Manage Plan
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </li>
          <hr className="border-t border-gray-300 my-2" />
          <li>
            <div
              className="w-full flex flex-row items-center text h-10 rounded-lg text-black dark:text-white/80 hover:bg-primary/5 cursor-pointer"
              onClick={logout}
            >
              <LogoutIcon className="ml-2" fontSize="small" />
              <span className="text-base font-medium pl-2">Logout</span>
            </div>
          </li>
        </ul>

        <Modal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        >
          <ProfileForm />
        </Modal>
      </div>
    </div>
  );
};

export default Sidebar;
