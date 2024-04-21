"use client"
import { fetchNoteById, selectNoteById } from "@/redux_store/slices/notesSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router';
import Document from "../page";


const SingleDocument: React.FC<{ params: { documentId: string } }> = ({ params }) => {

    const { documentId } = params; // Destructure documentId from params
    console.log("hello guys");
    console.log("params : ", params);
    
    console.log("document id : ", documentId);
    const router = useRouter();
    // console.log("document id : ", params);
    const singleDocument = useSelector((state) => state.notes.note);
    const dispatch = useDispatch();

    useEffect(() => {
        // Fetch the note details when the component mounts
        if (!singleDocument) {
            dispatch(fetchNoteById(documentId));
            console.log("singleDocument : ", singleDocument);
        }
    }, [dispatch, documentId, singleDocument]);
    if (!singleDocument) {
        return <p>No note selected</p>;
    }

    return (
        <>
        <Document>
            <div>
                <h2>{singleDocument.title}</h2>
                <p>{singleDocument.description}</p>
                <img src={singleDocument.coverImageUrl} alt="Cover Image" />
                {/* Render other details of the note */}
            </div>
        </Document>
        </>
    )
}
export default SingleDocument;

