import { useEffect, useRef } from "react";

export default function ContactModal({ onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-[#FEFEFE]/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="w-[400px] bg-[#FEFEFE]/80 backdrop-blur-md p-6 text-[#7A92A7] text-sm lowercase tracking-wide text-center relative"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-2 right-4 text-xl text-[#7A92A7] hover:underline"
        >
          &times;
        </button>

        <p className="mb-2">for inquiries</p>
        <a
          href="mailto:support@holidaze.com"
          className="underline hover:opacity-80"
        >
          support@holidaze.com
        </a>
      </div>
    </div>
  );
}
