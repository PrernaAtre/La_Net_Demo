"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsShare, BsTrash } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import Avatar from '@mui/material/Avatar';
import UserItem from "./user-item";
import { Item } from "@radix-ui/react-dropdown-menu";
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from "next/link";
import { logout } from "@/redux_store/slices/authSlice";
import { Button } from "@mui/material";
import { ArrowRight } from "lucide-react";
import { Navbar } from "./navbar";
import { fetchNoteById, fetchNotes, selectAllNotes, selectNoteById } from "@/redux_store/slices/notesSlice";
import { EmptyDocument } from "./empty_document";
import singleDocument from "./singleDocument";
import SingleDocument from "./singleDocument";


const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const user = useSelector((state) => state.auth.user.user);
    const [selectedNote, setSelectedNote] = useState(null);
    const documents = useSelector(selectAllNotes)
    // console.log("single document : ", singleDocument);

    // const note = useSelector((state) => state.notes.notes);
    // console.log('note ',note)
   
    const [showSingleNote, setShowSingleNote] = useState(false);
    const dispatch = useDispatch()

    const handleCreateNoteClick = () => {
        console.log("Create Note button clicked");
        setShowNewDocumentComponent(true);
    };

    // useEffect(() => {

    //     // Fetch user's notes when the component mounts
    //     dispatch(fetchNotes(user._id));
    // }, [dispatch, documents,]);


    const handleNoteClick = async (documentId: any) => {
        try {
            setShowSingleNote(true);
            // console.log("single note : ",documentId)
            dispatch(fetchNoteById(documentId));
            // setSelectedNote(note);
        } catch (error) {
            console.error("Error fetching note data:", error);
        }
    };

    // console.log("nav notes : ", notes[0]._id);

    return (
        <>
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
                                <input type="search" id="default-search" className="ext-sm font-medium p-1 w-32 h-7 m-4 rounded-xl bg-gray-100" placeholder="Search.." required />

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
                                <li key={document._id}>
                                    <button
                                        className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                                        onClick={() => handleNoteClick(document._id)} // Click handler to fetch note data

                                    >
                                        <span className="text-sm font-medium pl-4">{document.title}</span>
                                        <BsTrash className="ml-10 " />
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <li>
                            <a href="#" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                                <AddCircleOutlineIcon className="ml-6" />
                                <span className="text-sm font-medium pl-4">Add Page</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                                <DeleteOutlineIcon className="ml-6" />
                                <span className="text-sm font-medium pl-4">Trash</span>
                            </a>
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
            {/* right side */}

            {!showNewDocumentComponent && !showSingleNote && (<EmptyDocument handleCreateNoteClick={handleCreateNoteClick} />)}

            {showSingleNote && (
                <SingleDocument />
            )}

            {showNewDocumentComponent && <Navbar />}
        </>
    )
}

export default Navigation;