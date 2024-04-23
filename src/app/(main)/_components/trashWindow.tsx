// components/TrashWindow.tsx
"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal } from 'antd';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import { fetchDeletedDocuments, fetchNotes, selectAllDeletedDocuments } from '@/redux_store/slices/notesSlice';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { BsTrash } from 'react-icons/bs';
import ConfirmationDialog from './confirmationDialog';


interface DeletedDocument {
  _id: string;
  title: string;
}



const TrashWindow: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deletedDocuments = useSelector(selectAllDeletedDocuments);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [documentIdToDelete, setDocumentIdToDelete] = useState("");

  const handleDeleteDocument = async (documentId) => {
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
  const user = useSelector((state: any) => state.auth.user.user);

  useEffect(() => {
    dispatch(fetchDeletedDocuments(user._id))
  }, [dispatch, user._id]);

  const handleRestore = async (documentId: string) => {
    try {
      const res = await axios.put(`http://localhost:3001/document/restoreDocument/${documentId}`);
      dispatch(fetchNotes(user._id));
      dispatch(fetchDeletedDocuments(user._id));

    } catch (error) {
      console.error('Error restoring document:', error);
    }
  };

  const permenantDeleteDocument = async () => {
    try {
      const res = await axios.delete(`http://localhost:3001/document/permanentDeleteDocument/${documentIdToDelete}`);
      console.log("res : ", res);
      dispatch(fetchNotes(user._id));
      dispatch(fetchDeletedDocuments(user._id));

    } catch (error) {
      console.error('Error deleting document:', error);
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  return (
    <>
      <button onClick={showModal} className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
        <span className="text-sm font-medium pl-4">Trash</span>
      </button>
      <Modal title="Deleted Items" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <ul>
          {deletedDocuments.length>0 ?
          deletedDocuments.map((document) => (
            <li key={document._id} className="border border-gray-300 rounded-lg p-3 flex justify-between items-center">
              <span>{document.title}</span>
              <div>
                <RestorePageIcon className='cursor-pointer' onClick={() => handleRestore(document._id)} />
                <BsTrash className="ml-2 cursor-pointer" onClick={() => handleDeleteDocument(document._id)} />
              </div>
            </li>
          )) : <p>No deleted items</p>
        }
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
