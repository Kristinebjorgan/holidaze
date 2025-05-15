import { useEffect, useRef } from "react";
import EditProfileForm from "../profiles/EditProfileForm";

export default function EditProfileModal({ onClose, onProfileUpdated }) {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-[#FEFEFE]/60 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="max-w-md w-full bg-[#FEFEFE]/80 backdrop-blur-md p-6 text-[#7A92A7] relative"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-2 right-3 text-xl leading-none hover:underline"
        >
          &times;
        </button>

        <EditProfileForm
          onSuccess={() => {
            onProfileUpdated?.();
            onClose();
          }}
        />
      </div>
    </div>
  );
}
