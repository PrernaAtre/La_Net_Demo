"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsShare, BsTrash } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";


import { fetchNoteById, fetchNotes, selectAllNotes, selectNoteById } from "@/redux_store/slices/notesSlice";
// import { EmptyDocument } from "../../_components/empty_document";
// import { Navbar } from "../../_components/navbar";
// import singleDocument from "../../_components/singleDocument";
// import SingleDocument from "../../_components/singleDocument";
// import Sidebar from "../../_components/sidebar";
// import SingleDocument from "./[...documentId]/page";
// import Sidebar from "../_components/sidebar";
import { EmptyDocument } from "../_components/empty_document";
import { Navbar } from "../_components/navbar";
import Sidebar from "../_components/sidebar";
import SingleDocument from "./[...documentId]/page";
import TrashWindow from "../_components/trashWindow";
// import SingleDocument from "./[...documentId]/page";
// import Sidebar from "../_components/sidebar";

const Document = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isAuthenticated = useSelector((state:any) => state.auth.isAuthenticated);
    const user = useSelector((state:any) => state.auth.user.user);
    const [selectedNote, setSelectedNote] = useState(null);
    const documents = useSelector(selectAllNotes)
    const [showNewDocumentComponent, setShowNewDocumentComponent] = useState(false);
    const [showTrashWindow, setShowTrashWindow] = useState(false);
    const [showSingleNote, setShowSingleNote] = useState(false);
    const router = useRouter();
    // const [showNewDocumentComponent, setShowNewDocumentComponent] = useState(false);
    // const [showSingleNote, setShowSingleNote] = useState(false);
    // const [selectedNoteId, setSelectedNoteId] = useState(null);
    // console.log("single document : ", singleDocument);

    // const note = useSelector((state) => state.notes.notes);
    // console.log('note ',note)
    const toggleTrashWindow = () => {
        setShowTrashWindow(!showTrashWindow);
    };

    const dispatch = useDispatch()

    const handleToggleTrashWindow = () => {
        setShowTrashWindow(!showTrashWindow);
    };

    const handleCreateNoteClick = () => {
        console.log("Create Note button clicked");
        setShowNewDocumentComponent(true);
        setShowSingleNote(false);
    };

    const handleNoteClick = async (documentId: string) => {
        try {
            setShowSingleNote(true);
            console.log("single note : ", documentId)
            setShowNewDocumentComponent(false);
            router.push(`/documents/${documentId}`);
            // dispatch(fetchNoteById(documentId));
            // setSelectedNote(note);
        } catch (error) {
            console.error("Error fetching note data:", error);
        }
    };


    // console.log("nav notes : ", notes[0]._id);

    return (
        <>
            <div className="flex flex-row">
                {/* <Sidebar handleNoteClick={handleNoteClick} toggleTrashWindow={toggleTrashWindow} />
                {children} */}
            </div>

            {/* right side */}
            {/* {!showTrashWindow && !showNewDocumentComponent && !showSingleNote && (<EmptyDocument trashWindowOpen={showTrashWindow} handleCreateNoteClick={handleCreateNoteClick} />)} */}
            {showTrashWindow && <TrashWindow onClose={() => setShowTrashWindow(false)} />}
            {/* {showSingleNote && (
                    <SingleDocument />
            )}  */}
            {showNewDocumentComponent && <Navbar />}
        </>
    )
}

export default Document;