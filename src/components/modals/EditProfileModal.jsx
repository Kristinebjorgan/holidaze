import { useEffect, useRef } from "react";
import EditProfileForm from "../profiles/EditProfileForm";

export default function EditProfileModal({ onClose }) {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="max-w-md w-full bg-white/80 backdrop-blur-md p-6 rounded-md text-[#7A92A7] relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl leading-none text-[#7A92A7] hover:underline"
        >
          &times;
        </button>

        {/* Form inside the modal */}
        <EditProfileForm />
      </div>
    </div>
  );
}
