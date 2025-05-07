import { useEffect, useRef } from "react";

export default function ViewBookingModal({ booking, onClose }) {
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
      className="fixed inset-0 bg-white/40 backdrop-blur-sm z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="bg-white/80 backdrop-blur-md p-6 w-full max-w-md text-[#7A92A7] relative"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-2 right-4 text-xl hover:underline"
        >
          ×
        </button>

        <p>
          <strong>Venue</strong> {booking.venue?.name}
        </p>
        <p>
          <strong>Date</strong>{" "}
          {new Date(booking.dateFrom).toLocaleDateString()} →{" "}
          {new Date(booking.dateTo).toLocaleDateString()}
        </p>
        <p>
          <strong>Guests</strong> {booking.guests}
        </p>
        <p className="text-[#7A92A7] mt-4">
          Booked {new Date(booking.created).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
