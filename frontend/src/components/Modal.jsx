import React, { useEffect } from "react";

const Modal = ({ onClose, title, children }) => {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[1000] backdrop-blur-sm"
      onClick={onClose} // Close when clicking outside the modal
    >
      {/* Prevent clicks inside modal from closing */}
      <div
        className="bg-[#121212] p-6 rounded-lg w-[400px] text-white shadow-xl relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1} // Makes modal focusable for accessibility
      >
        {/* Header with Title and Close Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button className="text-gray-400 text-lg hover:text-white" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
