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

  // Close modal if clicking outside
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

        {/* Venue info */}
        <h2 className="text-xl font-semibold mb-2">{venue.name}</h2>
        <p className="text-sm mb-1">{venue.description}</p>
        <p className="text-xs text-gray-500 mb-2">{venue.location?.address}</p>
        <p className="text-sm mb-4">Price: ${venue.price} / night</p>

        {venue.media?.[0]?.url && (
          <img
            src={venue.media[0].url}
            alt={venue.media[0].alt}
            className="rounded w-full h-40 object-cover mb-4"
          />
        )}

        {/* Meta flags */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          {venue.meta?.wifi && (
            <span className="px-2 py-1 bg-gray-100 rounded">WiFi</span>
          )}
          {venue.meta?.breakfast && (
            <span className="px-2 py-1 bg-gray-100 rounded">Breakfast</span>
          )}
          {venue.meta?.parking && (
            <span className="px-2 py-1 bg-gray-100 rounded">Parking</span>
          )}
          {venue.meta?.pets && (
            <span className="px-2 py-1 bg-gray-100 rounded">Pets allowed</span>
          )}
        </div>

        {/* Bookings */}
        <h3 className="text-sm font-medium mb-1">Bookings</h3>
        {bookings.length === 0 ? (
          <p className="text-gray-400 text-sm">No bookings yet.</p>
        ) : (
          <ul className="text-xs text-left max-h-40 overflow-y-auto space-y-2">
            {bookings.map((b) => (
              <li key={b.id} className="bg-gray-100 p-2 rounded">
                <div>
                  <strong>From:</strong>{" "}
                  {new Date(b.dateFrom).toLocaleDateString()}
                </div>
                <div>
                  <strong>To:</strong> {new Date(b.dateTo).toLocaleDateString()}
                </div>
                <div>
                  <strong>Guests:</strong> {b.guests}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
