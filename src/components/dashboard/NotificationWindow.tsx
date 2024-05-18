"use client";

import { useCurrentUser } from "@/modules/hooks";
import { socket } from "@/socket";
import RestorePageIcon from "@mui/icons-material/RestorePage";
import { Modal } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { useSelector } from "react-redux";
import Person2Icon from '@mui/icons-material/Person2';
import { useGetSharedPagesQuery } from "@/store/features/page";

const NotificationWindow: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, error, isLoading } = useGetSharedPagesQuery("");
  const { user } = useCurrentUser();
  const [sender, setSender] = useState(null);
  const [url, setUrl] = useState(null);

  const pagesStore = useSelector((state: any) => state);

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");


  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(user?._id, handleNotification);


    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };


  }, []);

  const handleNotification = (data: any) => {
    const notificationData = JSON.parse(data);
    setSender(notificationData.senderName);
    setUrl(notificationData.message)
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  return (
    <>
      <div className="w-full">
        <div
          onClick={showModal}
          className="flex flex-row w-full items-center h-10 rounded-sm text-muted-foreground cursor-pointer"
        >
          <span className="text-sm font-medium">Notification</span>
        </div>
        <Modal
          title="Notifications"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okButtonProps={{ style: { backgroundColor: 'black', borderColor: 'black' } }} // Change the color here
        >
          <ul>

            {data && data.map((notification : any, index : any) => (
              <li key={index} className="border border-gray-300 rounded-lg p-3 flex flex-col">
                <div className="flex flex-row items-center">
                  <Person2Icon /><span className="pl-2">{notification.senderName}</span>
                </div>
                <div className="pt-2">
                  <span className="text-sm font-medium">
                    <span>Document Url</span>
                    <Link href={notification.message} passHref>
                      {notification.message}
                    </Link>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Modal>
      </div>
    </>
  );
};

export default NotificationWindow;
