"use client";
import { logout } from "@/redux_store/slices/authSlice";
import {
  fetchDeletedDocuments,
  fetchNotes,
  selectAllNotes,
} from "@/redux_store/slices/notesSlice";

import { toast } from "sonner";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import ConfirmationDialog from "./confirmationDialog";
import TrashWindow from "./trashWindow";
import { useCurrentUserPages } from "@/app/routes/editor/hooks/useCurrentUserPages";
import { useMakeTrashMutation } from "@/store/features/page";
import { useMakeTrashPage } from "@/app/routes/editor/hooks/useMakeTrashPage";
import { useRouter } from "next/navigation";
import { useCreatePage } from "@/app/routes/editor/hooks/useCreatePage";
import { useAuthenticated } from "@/app/routes/editor/hooks/useIsauthenticate";
import { useCurrentUser } from "@/app/routes/editor/hooks/useCurrentUser";

interface SidebarProps {
  handleNoteClick: (documentId: string) => void;
  toggleTrashWindow: () => void;
}

const Sidebar: React.FC = () => {
  const router = useRouter();
  

  const { isAuthenticated } = useAuthenticated()
  const { user  } = useCurrentUser()

  const { pages } = useCurrentUserPages();

  const { handleTrashPage } = useMakeTrashPage();

  const { handleCreatePage, isLoading } = useCreatePage();

  console.log("pages", pages);

  console.log("user--", user);
  const documents = useSelector(selectAllNotes);
  console.log("first----", documents);
  const dispatch = useDispatch();
  const [showNewDocumentComponent, setShowNewDocumentComponent] =
    useState(false);
  const [showSingleNote, setShowSingleNote] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [documentIdToDelete, setDocumentIdToDelete] = useState("");
  const [showTrashWindow, setShowTrashWindow] = useState(false);


  const toggleTrashWindow = () => {
    setShowTrashWindow(!showTrashWindow);
  };

  const closeTrashWindow = () => {
    setShowTrashWindow(false);
  };

  // const handleConfirmDelete = async () => {
  //   try {
  //     console.log("confirm call");
  //     const response = await axios.delete(
  //       `http://localhost:3001/document/deleteDocument/${documentIdToDelete}`
  //     );
  //     if (response.status === 200) {
  //       // await toast.success('Document Deleted Successfully', {
  //       //   position: "top-right",
  //       //   autoClose: 5000,
  //       //   hideProgressBar: false,
  //       //   closeOnClick: true,
  //       //   pauseOnHover: true,
  //       //   draggable: true,
  //       //   progress: undefined,
  //       //   theme: "light",
  //       //   transition: Bounce,
  //       // });
  //       console.log(response);
  //       dispatch(fetchNotes(user._id));
  //       dispatch(fetchDeletedDocuments(user._id));
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setConfirmDialogOpen(false);
  //   }
  // };

  const unTrashedPages = useMemo(() => {
    return pages?.filter((d: any) => !d?.isTrashed) || [];
  }, [pages]);

  console.log("unTrashedPages", unTrashedPages);

  const createPage = async () => {
    const page = await handleCreatePage(
      {
        name: "Note 1",
        userId: user._id,
        document: "",
      },
      (createdPage: any) =>
        createdPage?.data &&
        router.push(`/routes/editor?id=${createdPage?.data?._id}`)
    );
  //   toast.promise(page, {
  //     loading: "Creating a new note...",
  //     success: "New note created!",
  //     error: "Failed to create a new note."
  // });
    
  };

  function handleLogout() {
    dispatch(logout());
   router.push("/");
  }

  return (
    <div className="h-screen flex flex-row bg-gray-100">
      <div className="flex flex-col w-60 overflow-hidden">
        <div className="flex items-center justify-center bg-slate-950 h-20 shadow-md sticky">
          <Avatar sx={{ width: 24, height: 24 }}>H</Avatar>
          <span className="text-sm font-medium pl-4 text-white">
            {user.username}
          </span>
        </div>

        <ul className="flex flex-col py-4 items-start">
          <li>
            <a
              href="#"
              className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
            >
              <SearchIcon className="ml-6 " />
              <input
                type="search"
                id="default-search"
                className="ext-sm font-medium p-1 w-32 h-7 m-4 rounded-xl bg-gray-100"
                placeholder="Search.."
                required
              />

              {/* <span className="text-sm font-medium pl-4">Search</span> */}
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
            >
              <SettingsIcon className="ml-6" />
              <span className="text-sm font-medium pl-4">Setting</span>
            </a>
          </li>
          <ul className="flex flex-col my-2">
            {(unTrashedPages || []).map((page: any) => (
              <li
                key={page._id}
                className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
              >
                <NoteAddIcon className="ml-6" />
                <Link href={`/routes/editor?id=${page._id}`}>
                  <span className="text-sm font-medium pl-4">{page.name? page.name : "Untitled page"}</span>
                </Link>
                <div className="flex-grow" />{" "}
                {/* This creates space to push the trash icon to the end */}
                <button className="pl-20">
                <BsTrash
                  className="mr-[]"
                  onClick={() => handleTrashPage(page._id)}
                /></button>
              </li>
            ))}

            {confirmDialogOpen && (
              <ConfirmationDialog
                open={confirmDialogOpen}
                handleClose={() => setConfirmDialogOpen(false)}
                handleConfirm={handleConfirmDelete}
              />
            )}
          </ul>
          <li>
            <button
              // href="/routes/editor"
              className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
              onClick={createPage}
              disabled={isLoading}
            >
              <AddCircleOutlineIcon className="ml-6" />
              <span className="text-sm font-medium pl-4">Add Page</span>
            </button>
          </li>
          <li>
            <Link
              href="/routes/quickNote"
              className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
            >
              <AddCircleOutlineIcon className="ml-6" />
              <span className="text-sm font-medium pl-4">Quick Email</span>
            </Link>
          </li>
          <li className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
            <DeleteOutlineIcon className="ml-6" />
            <TrashWindow />
            <ToastContainer />
          </li>

          <li>
            <a
              href="#"
              className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                <i className="bx bx-user"></i>
              </span>
              <span className="text-sm font-medium">Profile</span>
            </a>
          </li>
      
          <li>
           
              <LogoutIcon className="ml-6" />
              <span className="text-sm font-medium pl-4">
                <button
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </span>
          
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;
