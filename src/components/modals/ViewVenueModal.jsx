import { useEffect, useRef, useState } from "react";
import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "../../config";

export default function ViewVenueModal({ venue, onClose }) {
  const [bookings, setBookings] = useState([]);
  const modalRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchBookings() {
      try {
        const res = await fetch(
          `${NOROFF_API_BASE_URL}/holidaze/venues/${venue.id}?_bookings=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": NOROFF_API_KEY,
            },
          }
        );
        const data = await res.json();
        setBookings(data.data?.bookings || []);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    }

    fetchBookings();
  }, [venue.id]);

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
      className="fixed inset-0 bg-white/60 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="max-w-md w-full bg-white/80 backdrop-blur-md p-6 text-[#7A92A7] relative"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-2 right-3 text-xl leading-none hover:underline"
        >
          &times;
        </button>

        <h2 className="text-l mb-2">{venue.name}</h2>
        <p className="text-sm mb-1">{venue.description}</p>
        <p className="text-sm underline mb-2">{venue.location?.address}</p>
        <p className="text-sm mb-4">Price €{venue.price} / night</p>

        {venue.media?.[0]?.url && (
          <img
            src={venue.media[0].url}
            alt={venue.media[0].alt}
            className="rounded w-full h-40 object-cover mb-4"
          />
        )}

        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          {venue.meta?.wifi && (
            <span className="px-2 py-1 bg-gray-100">WiFi</span>
          )}
          {venue.meta?.breakfast && (
            <span className="px-2 py-1 bg-gray-100">Breakfast</span>
          )}
          {venue.meta?.parking && (
            <span className="px-2 py-1 bg-gray-100">Parking</span>
          )}
          {venue.meta?.pets && (
            <span className="px-2 py-1 bg-gray-100">Pets</span>
          )}
        </div>

        <h3 className="text-sm mb-1">Bookings</h3>
        {bookings.length === 0 ? (
          <p className="text-sm">No bookings yet.</p>
        ) : (
          <ul className="text-xs text-left max-h-40 overflow-y-auto space-y-2">
            {bookings.map((b) => (
              <li key={b.id} className="bg-gray-100 p-2 rounded">
                <div>
                  <strong>From</strong>{" "}
                  {new Date(b.dateFrom).toLocaleDateString()}
                </div>
                <div>
                  <strong>To</strong> {new Date(b.dateTo).toLocaleDateString()}
                </div>
                <div>
                  <strong>Guests</strong> {b.guests}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
