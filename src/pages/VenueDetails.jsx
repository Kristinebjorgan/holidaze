import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "../config";

export default function VenueDetails() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState({
    dateFrom: "",
    dateTo: "",
    guests: 1,
  });
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${NOROFF_API_BASE_URL}/holidaze/venues/${id}`,
          {xcode-select --install

            headers: {
              "X-Noroff-API-Key": NOROFF_API_KEY,
            },
          }
        );

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.errors?.[0]?.message || "Failed to load venue");

        setVenue(data.data);
      } catch (err) {
        console.error("Error fetching venue:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError("");
    setBookingSuccess("");

    const token = localStorage.getItem("token");

    if (!token) {
      setBookingError("Please log in to book.");
      return;
    }

    // 🔁 Convert form date values (yyyy-mm-dd) to ISO 8601
    const formatToISO = (dateStr) => {
      try {
        return new Date(dateStr).toISOString();
      } catch {
        return "";
      }
    };

    const payload = {
      venueId: id,
      dateFrom: formatToISO(booking.dateFrom),
      dateTo: formatToISO(booking.dateTo),
      guests: booking.guests,
    };

    console.log("Booking payload:", payload);

    try {
      const res = await fetch(`${NOROFF_API_BASE_URL}/holidaze/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": NOROFF_API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || "Booking failed.");
      }

      setBookingSuccess("Booking successful!");
      setBooking({ dateFrom: "", dateTo: "", guests: 1 });
    } catch (err) {
      console.error("Booking error:", err);
      setBookingError(err.message);
    }
  };

  if (loading) return <p className="text-center py-8">Loading venue...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;
  if (!venue) return <p className="text-center py-8">Venue not found.</p>;

  return (
    <section className="max-w-4xl mx-auto px-4 py-10 text-[#7A92A7]">
      <h1 className="text-3xl font-light mb-2">{venue.name}</h1>
      <p className="text-sm text-gray-400 mb-4">
        {venue.location?.address}, {venue.location?.country}
      </p>

      {venue.media?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {venue.media.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={image.alt || `venue image ${index + 1}`}
              className="w-full h-64 object-cover rounded"
            />
          ))}
        </div>
      )}

      <p className="whitespace-pre-line text-sm leading-relaxed mb-6">
        {venue.description}
      </p>

      {/* Booking UI */}
      <div className="bg-gray-50 p-4 rounded shadow text-sm">
        <h3 className="text-lg mb-3">Book this venue</h3>
        <form onSubmit={handleBookingSubmit} className="space-y-3">
          <div className="flex gap-4">
            <div className="flex-1">
              <label>Date from</label>
              <input
                type="date"
                value={booking.dateFrom}
                onChange={(e) =>
                  setBooking((prev) => ({ ...prev, dateFrom: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="flex-1">
              <label>Date to</label>
              <input
                type="date"
                value={booking.dateTo}
                onChange={(e) =>
                  setBooking((prev) => ({ ...prev, dateTo: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>

          <div>
            <label>Guests</label>
            <input
              type="number"
              min={1}
              max={venue.maxGuests}
              value={booking.guests}
              onChange={(e) =>
                setBooking((prev) => ({ ...prev, guests: +e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Book now
          </button>

          {bookingSuccess && (
            <p className="text-green-600 mt-2">{bookingSuccess}</p>
          )}
          {bookingError && <p className="text-red-600 mt-2">{bookingError}</p>}
        </form>
      </div>
    </section>
  );
}
