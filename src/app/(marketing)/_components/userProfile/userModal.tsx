import { ReactNode, useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    // Close modal when pressing Escape key
    const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    // useEffect(() => {
    //     if (isOpen) {
    //         document.addEventListener("keydown", handleEscapeKey);
    //         // Clean up event listener when component unmounts
    //         return () => {
    //             document.removeEventListener("keydown", handleEscapeKey);
    //         };
    //     }
    // }, [isOpen]);

    // Close modal when clicking outside of it
    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return isOpen ? (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                {/* <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button> */}
                <div onClick={handleOutsideClick}>
                    {children}
                </div>
            </div>
        </div>
    ) : null;
};

export default Modal;
