"use client"
import {  fetchNoteById, fetchNotes, selectAllNotes } from "@/redux_store/slices/notesSlice";
import { useDispatch, useSelector } from "react-redux";
import Avatar from '@mui/material/Avatar';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from "next/link";
import { logout } from "@/redux_store/slices/authSlice";
import { Button } from "@mui/material";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import ConfirmationDialog from "./confirmationDialog";
import TrashWindow from "./trashWindow";

interface SidebarProps {
    handleNoteClick: (documentId: string) => void;
    toggleTrashWindow: () => void;
}

const Sidebar: React.FC = () => {
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const user = useSelector((state: any) => state.auth.user.user);
    const documents = useSelector(selectAllNotes);
    console.log("first----", documents)
    const dispatch = useDispatch();
    const dispatc = useDispatch();
    const [showNewDocumentComponent, setShowNewDocumentComponent] = useState(false);
    const [showSingleNote, setShowSingleNote] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [documentIdToDelete, setDocumentIdToDelete] = useState("");
    const [showTrashWindow, setShowTrashWindow] = useState(false);

    //const [isAvailable, setIsAvailable] = useState(true);
    useEffect(() => {

        // Fetch user's notes when the component mounts
        dispatch(fetchNotes(user._id));


    }, [dispatch, user._id]);

    const handleDeleteDocument = async (documentId) => {
        console.log("handleDeleteDocument called");
        //setIsAvailable(false);

        setDocumentIdToDelete(documentId);
        setConfirmDialogOpen(true);
        console.log(confirmDialogOpen);
    };


    const toggleTrashWindow = () => {
        setShowTrashWindow(!showTrashWindow);
    };

    const closeTrashWindow = () => {
        setShowTrashWindow(false);
    };

    const handleConfirmDelete = async () => {
        try {
            console.log("confirm call")
            const response = await axios.delete(`http://localhost:3001/document/deleteDocument/${documentIdToDelete}`);
            if (response.status === 200) {
                // await toast.success('Document Deleted Successfully', {
                //   position: "top-right",
                //   autoClose: 5000,
                //   hideProgressBar: false,
                //   closeOnClick: true,
                //   pauseOnHover: true,
                //   draggable: true,
                //   progress: undefined,
                //   theme: "light",
                //   transition: Bounce,
                // });
                console.log(response);
                dispatch(fetchNotes(user._id));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setConfirmDialogOpen(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-row bg-gray-100">
            <div className="flex flex-col w-56  overflow-hidden">
                <div className="flex items-center justify-center bg-slate-950 h-20 shadow-md">
                    <Avatar sx={{ width: 24, height: 24 }}>H</Avatar>
                    <span className="text-sm font-medium pl-4 text-white">{user.username}</span>
                </div>

                <ul className="flex flex-col py-4">
                    <li>
                        <a href="#" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                            <SearchIcon className="ml-6 " />
                            {/* <input
                            type="search"
                            className="relative m-0 block flex-auto rounded border border-solid border-neutral-200 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-surface outline-none transition duration-200 ease-in-out placeholder:text-neutral-500 focus:z-[3] focus:border-primary focus:shadow-inset focus:outline-none motion-reduce:transition-none dark:border-white/10 dark:text-white dark:placeholder:text-neutral-200 dark:autofill:shadow-autofill dark:focus:border-primary"
                            placeholder="Search"
                            aria-label="Search"
                            id="exampleFormControlInput2"
                            aria-describedby="button-addon2" /> */}
                            <input type="search" id="default-search"  className="ext-sm font-medium p-1 w-32 h-7 m-4 rounded-xl bg-gray-100" placeholder="Search.." required />

                            {/* <span className="text-sm font-medium pl-4">Search</span> */}
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                            <SettingsIcon className="ml-6" />
                            <span className="text-sm font-medium pl-4">Setting</span>
                        </a>
                    </li>
                    <ul className="flex flex-col py-4">
                        {/* Mapping through notes to display titles */}
                        {documents.map((document) => (
                            <li key={document._id} className="flex items-center justify-between">
                                <button
                                    className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                                    onClick={() => { handleNoteClick(document._id) }} // Click handler to fetch note data
                                >
                                    <span className="text-sm font-medium pl-4">{document.title}</span> </button>
                                <BsTrash className="ml-10 " onClick={() => handleDeleteDocument(document._id)} />
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
                        <Link href="/routes/addpage" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                            <AddCircleOutlineIcon className="ml-6" />
                            <span className="text-sm font-medium pl-4">Add Page</span>
                        </Link>
                    </li>
                    <li className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                        <DeleteOutlineIcon className="ml-6" />
                        <TrashWindow />
                        
                        <ToastContainer />
                    </li>

                    <li>
                        <a href="#" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><i className="bx bx-user"></i></span>
                            <span className="text-sm font-medium">Profile</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><i className="bx bx-bell"></i></span>
                            <span className="text-sm font-medium">Notifications</span>
                            <span className="ml-auto mr-6 text-sm bg-red-100 rounded-full px-3 py-px text-red-500">5</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                            <LogoutIcon className="ml-6" />
                            <span className="text-sm font-medium pl-4">
                                <button onClick={() => { dispatch(logout()) }}>Logout</button>
                            </span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}
export default Sidebar;