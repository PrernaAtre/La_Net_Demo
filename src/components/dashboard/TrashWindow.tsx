"use client";

import { useDeletePage } from "@/modules/editor/hooks/useDeletePage";
import { useMakeTrashPage } from "@/modules/editor/hooks/useMakeTrashPage";
import { useCurrentUser } from "@/modules/hooks";
import { getPagesByUserId } from "@/store/features/page";
import RestorePageIcon from "@mui/icons-material/RestorePage";
import { Modal } from "antd";
import React, { useState } from "react";
import { BsTrash } from "react-icons/bs";
import { useSelector } from "react-redux";

const TrashWindow: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useCurrentUser();

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

  const trashedPages = pages?.filter((d: any) => d?.isTrashed) || [];

  return (
    <div className="w-full">
      <div
        onClick={showModal}
        className="flex flex-row w-full items-center h-10 rounded-sm text-muted-foreground cursor-pointer"
      >
        <span className="text-sm font-medium">Trash</span>
      </div>
      <Modal
        title="Deleted Items"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ style: { backgroundColor: 'black', borderColor: 'black' } }} // Change the color here
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
                  <div className="flex gap-3 mr-2">
                    <RestorePageIcon
                      className="cursor-pointer size-4"
                      onClick={() => handleTrashPage(page._id, true)}
                    />
                    <BsTrash
                      className=" cursor-pointer size-5 mt-1"
                      onClick={() => handleDeletePage(page._id)}
                    />
                  </div>
                </li>
              )
            )
          ) : (
            <p>No deleted items</p>
          )}
        </ul>
      </Modal>
    </div>
  );
};

export default TrashWindow;
