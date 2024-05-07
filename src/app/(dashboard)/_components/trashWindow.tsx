// components/TrashWindow.tsx
"use client";
import { useCurrentUserPages } from "@/app/(dashboard)/page/hooks/useCurrentUserPages";
import { useDeletePage } from "@/app/(dashboard)/page/hooks/useDeletePage";
import { useMakeTrashPage } from "@/app/(dashboard)/page/hooks/useMakeTrashPage";
import { getUser } from "@/redux_store/slices/authSlice";
import { getPagesByUserId } from "@/store/features/page";
import RestorePageIcon from "@mui/icons-material/RestorePage";
import { Modal } from "antd";
import React, { useState } from "react";
import { BsTrash } from "react-icons/bs";
import { useSelector } from "react-redux";

const TrashWindow: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = useSelector(getUser);

  const pagesStore = useSelector((state: any) => state);

  const pages = getPagesByUserId(pagesStore, user?._id);

  const { handleTrashPage } = useMakeTrashPage();

  const { handleDeletePage } = useDeletePage();

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

  const trashedPages = pages?.filter((d: any) => d?.isTrashed) || [];

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
                  <div>
                    <RestorePageIcon
                      className="cursor-pointer"
                      onClick={() => handleTrashPage(page._id, true)}
                    />
                    <BsTrash
                      className="ml-2 cursor-pointer"
                      onClick={() => handleDeletePage(page._id)}
                    />
                  </div>
                </li>
              )
            )
          ) : (
            <p>No deleted items</p>
          )}
          {/* {confirmDialogOpen && (
            <ConfirmationDialog
              open={confirmDialogOpen}
              handleClose={() => setConfirmDialogOpen(false)}
              handleConfirm={permenantDeleteDocument}
            />
          )} */}
        </ul>
      </Modal>
    </>
  );
};

export default TrashWindow;
