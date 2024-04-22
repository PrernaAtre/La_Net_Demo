import { Modal, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import IosShareIcon from '@mui/icons-material/IosShare';
import { useDispatch } from 'react-redux';
import { fetchUsers, users } from '@/redux_store/slices/authSlice';

interface ShareDocumentProps {
    // Define props here if needed
}

const ShareDocument: React.FC<ShareDocumentProps> = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    // const users = useSelector()

    const dispatch = useDispatch();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    useEffect(() => {
        dispatch(fetchUsers())
      }, [dispatch]);

    function handleShare(): void {
        throw new Error('Function not implemented.');
    }

    return (
        <>
            <button onClick={showModal}><IosShareIcon /></button>
            <Modal title="Share Document" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Input placeholder="Search users..." value={searchValue} onChange={handleSearchChange} />
                {/* Here you can render search results based on searchValue */}
            </Modal>
        </>
    );
};

export default ShareDocument;
