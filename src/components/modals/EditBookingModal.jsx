// src/components/modals/EditBookingModal.jsx
import { useEffect, useRef, useState } from "react";
import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "../../config";

export default function EditBookingModal({ booking, onClose, onUpdated }) {
  const [form, setForm] = useState({
    dateFrom: booking.dateFrom,
    dateTo: booking.dateTo,
    guests: booking.guests,
  });
  const [error, setError] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${NOROFF_API_BASE_URL}/holidaze/bookings/${booking.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": NOROFF_API_KEY,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || "Update failed.");
      }

      onUpdated?.();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

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

        <h2 className="text-lg mb-4">Edit Booking</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <label className="block">
            Date From
            <input
              type="date"
              value={form.dateFrom}
              onChange={(e) =>
                setForm((p) => ({ ...p, dateFrom: e.target.value }))
              }
              className="w-full border p-2 mt-1"
              required
            />
          </label>
          <label className="block">
            Date To
            <input
              type="date"
              value={form.dateTo}
              onChange={(e) =>
                setForm((p) => ({ ...p, dateTo: e.target.value }))
              }
              className="w-full border p-2 mt-1"
              required
            />
          </label>
          <label className="block">
            Guests
            <input
              type="number"
              min={1}
              value={form.guests}
              onChange={(e) =>
                setForm((p) => ({ ...p, guests: +e.target.value }))
              }
              className="w-full border p-2 mt-1"
              required
            />
          </label>

          <div className="text-right mt-4">
            <button type="submit" className="text-sm text-blue-600 underline">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
