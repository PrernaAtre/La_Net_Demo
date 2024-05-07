import { ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return isOpen ? (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div>{children}</div>
      </div>
    </div>
  ) : null;
};

export default Modal;
