// components/TrashWindow.tsx
"use client";
import {
  fetchDeletedDocuments,
  fetchNotes,
  selectAllDeletedDocuments,
} from "@/redux_store/slices/notesSlice";
import RestorePageIcon from "@mui/icons-material/RestorePage";
import { Modal } from "antd";
import axios from "axios";
import React, { use, useEffect, useMemo, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationDialog from "./confirmationDialog";
import { useCurrentUserPages } from "@/app/routes/editor/hooks/useCurrentUserPages";
import { useMakeTrashPage } from "@/app/routes/editor/hooks/useMakeTrashPage";
import { useDeletePage } from "@/app/routes/editor/hooks/useDeletePage";

interface DeletedDocument {
  _id: string;
  title: string;
}

const TrashWindow: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deletedDocuments = useSelector(selectAllDeletedDocuments);

  const { pages, isLoading } = useCurrentUserPages();

  const { handleTrashPage } = useMakeTrashPage();

  const { handleDeletePage } = useDeletePage();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [documentIdToDelete, setDocumentIdToDelete] = useState("");

  const handleDeleteDocument = async (documentId: any) => {
    console.log("handleDeleteDocument called");
    //setIsAvailable(false);

    setDocumentIdToDelete(documentId);
    setConfirmDialogOpen(true);
    console.log(confirmDialogOpen);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // const [deletedDocuments, setDeletedDocuments] = useState<DeletedDocument[]>([]);
  const user = useSelector((state: any) => state.auth.user);

  // useEffect(() => {
  //   dispatch(fetchDeletedDocuments(user._id));
  // }, [dispatch, user._id]);

  // const handleRestore = async (documentId: string) => {
  //   try {
  //     const res = await axios.put(
  //       `http://localhost:3001/document/restoreDocument/${documentId}`
  //     );
  //     dispatch(fetchNotes(user._id));
  //     dispatch(fetchDeletedDocuments(user._id));
  //   } catch (error) {
  //     console.error("Error restoring document:", error);
  //   }
  // };

  // const permenantDeleteDocument = async () => {
  //   try {
  //     const res = await axios.delete(
  //       `http://localhost:3001/document/permanentDeleteDocument/${documentIdToDelete}`
  //     );
  //     console.log("res : ", res);
  //     dispatch(fetchNotes(user._id));
  //     dispatch(fetchDeletedDocuments(user._id));
  //   } catch (error) {
  //     console.error("Error deleting document:", error);
  //   } finally {
  //     setConfirmDialogOpen(false);
  //   }
  // };

  const trashedPages = pages.filter((page: any) => page.isTrashed);

  return (
    <>
      <button
        onClick={showModal}
        className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
      >
        <span className="text-sm font-medium pl-4">Trash</span>
      </button>
      <Modal
        title="Deleted Items"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ul>
          {trashedPages.length > 0 ? (
            trashedPages.map(
              (page: {
                _id: string;
                name:
                  | string
                  | number
                  | bigint
                  | boolean
                  | React.ReactElement<
                      any,
                      string | React.JSXElementConstructor<any>
                    >
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | Promise<React.AwaitedReactNode>
                  | null
                  | undefined;
                isTrashed: boolean;
              }) => (
                <li
                  key={`${page._id}-${page.isTrashed}`}
                  className="border border-gray-300 rounded-lg p-3 flex justify-between items-center"
                >
                  <span>{page.name}</span>
                    <RestorePageIcon
                      className="cursor-pointer"
                      onClick={() => handleTrashPage(page._id, true)}
                    />
                    <BsTrash
                      className="ml-2 cursor-pointer"
                      onClick={() => handleDeletePage(page._id)}
                    />
                </li>
              )
            )
          ) : (
            <p>No deleted items</p>
          )}
          {confirmDialogOpen && (
            <ConfirmationDialog
              open={confirmDialogOpen}
              handleClose={() => setConfirmDialogOpen(false)}
              handleConfirm={permenantDeleteDocument}
            />
          )}
        </ul>
      </Modal>
    </>
  );
};

export default TrashWindow;
