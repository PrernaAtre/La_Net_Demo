// components/TrashWindow.tsx
"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal } from 'antd';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import { fetchNotes } from '@/redux_store/slices/notesSlice';

interface DeletedDocument {
  _id: string;
  title: string;
}
// interface TrashWindowProps {
//     onClose: () => void;
//   }


const TrashWindow: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [deletedDocuments, setDeletedDocuments] = useState<DeletedDocument[]>([]);
  const user = useSelector((state: any) => state.auth.user.user);

  useEffect(() => {
    fetchDeletedDocuments();
  }, [deletedDocuments]);

  const fetchDeletedDocuments = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/document/fetchDeletedDocuments/${user._id}`)
      const deletedDocs = response.data;
      console.log(deletedDocs)
      setDeletedDocuments(deletedDocs);
    } catch (error) {
      console.error('Error fetching deleted documents:', error);
    }
  };

  const handleRestore = async (documentId: string) => {
    try {
      // Call your API endpoint to restore the document
      const res = await axios.put(`http://localhost:3001/document/restoreDocument/${documentId}`);
      // After successfully restoring, fetch the updated list of deleted documents
      dispatch(fetchNotes(user._id));
    } catch (error) {
      console.error('Error restoring document:', error);
    }
  };
  //   const closeTrashWindow = () => {
  //     // Implement the logic to close the trash window
  //     console.log('Close trash window');
  //   };

  return (
    <>
      <button onClick={showModal} className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
        <span className="text-sm font-medium pl-4">Trash</span>
      </button>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <ul>
          {deletedDocuments.map((document) => (
            <li key={document._id} className="border border-gray-300 rounded-lg p-3 flex justify-between items-center">
              <span>{document.title}</span>
              <RestorePageIcon className='ml-2 cursor-pointer' onClick={() => handleRestore(document._id)}  />
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
};

export default TrashWindow;
