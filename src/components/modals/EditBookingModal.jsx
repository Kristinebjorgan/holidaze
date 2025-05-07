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
    <div
      className="fixed inset-0 bg-[#FEFEFE]/60 backdrop-blur-sm z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-[#FEFEFE]/80 backdrop-blur-md text-[#7A92A7] p-6 text-sm relative"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-2 right-4 text-xl hover:underline"
        >
          &times;
        </button>

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="block mb-1 lowercase">date from</span>
            <input
              type="date"
              value={form.dateFrom}
              onChange={(e) =>
                setForm((p) => ({ ...p, dateFrom: e.target.value }))
              }
              className="w-full p-2 border-b bg-transparent outline-none"
              required
            />
          </label>

          <label className="block">
            <span className="block mb-1 lowercase">date to</span>
            <input
              type="date"
              value={form.dateTo}
              onChange={(e) =>
                setForm((p) => ({ ...p, dateTo: e.target.value }))
              }
              className="w-full p-2 border-b bg-transparent outline-none"
              required
            />
          </label>

          <label className="block">
            <span className="block mb-1 lowercase">guests</span>
            <input
              type="number"
              min={1}
              value={form.guests}
              onChange={(e) =>
                setForm((p) => ({ ...p, guests: +e.target.value }))
              }
              className="w-full p-2 border-b bg-transparent outline-none"
              required
            />
          </label>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="text-xs hover:underline"
            >
              cancel
            </button>
            <button type="submit" className="text-xs hover:underline">
              save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
