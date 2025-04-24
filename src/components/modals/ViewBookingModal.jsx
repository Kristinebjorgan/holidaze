// src/components/modals/ViewBookingModal.jsx
import { useEffect, useRef } from "react";

export default function ViewBookingModal({ booking, onClose }) {
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
    <div className="fixed inset-0 bg-white/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white/80 backdrop-blur-md rounded p-6 w-full max-w-md text-[#7A92A7] relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-xl text-[#7A92A7] hover:underline"
        >
          ×
        </button>

        <h2 className="text-lg mb-4">Booking Details</h2>

        <p>
          <strong>Venue:</strong> {booking.venue?.name}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(booking.dateFrom).toLocaleDateString()} →{" "}
          {new Date(booking.dateTo).toLocaleDateString()}
        </p>
        <p>
          <strong>Guests:</strong> {booking.guests}
        </p>
        <p className="text-xs text-gray-500 mt-4">
          Booked on: {new Date(booking.created).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
