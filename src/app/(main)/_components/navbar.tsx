import { useEffect, useState } from "react";

import { fetchNoteById } from "@/redux_store/slices/notesSlice";
import { useDispatch, useSelector } from "react-redux";
import ShareDocument from "./shareDocument";
//   import { useLocation } from "react-router-dom";
//   import Center from "../components/utils/Center";
//   import { getPage } from "../api/getPage";
//   import { updateTitle, updateContent } from "../api/updatePage";
export const Navbar = ({ documentId }: { documentId: string }) => {
  const [title, setTitle] = useState("hey");
  const singleDocument = useSelector((state) => state.notes.note);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch the note details when the component mounts

    dispatch(fetchNoteById(documentId));
    console.log("singleDocument : ", singleDocument);
  }, [dispatch, documentId]);

  const handleShare = () => {
    // Toggle the visibility of the modal
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <nav className="bg-white ml-9 justify-end dark:bg-gray-900 fixed w-[1310px] top-0 border-b border-gray-200 dark:border-gray-600">
        <div className="flex  flex-wrap justify-between mx-auto p-4">
          <img src={singleDocument.iconImage} alt="Icon" className="h-8 w-8" />
          <span className=" text-2xl font-semibold whitespace-nowrap dark:text-white">
            {singleDocument.title}
          </span>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <ShareDocument documentId={singleDocument._id} />
          </div>
        </div>
      </nav>
    </>
  );
};

// const ShareButton = ({ text }) => {
//     return (
//         <button className="share-button">
//             {text}
//         </button>
//     );
// };