import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "../config"; // adjust path as needed

export default function BookingForm({ venue }) {
  const [booking, setBooking] = useState({
    dateFrom: "",
    dateTo: "",
    guests: 1,
  });

  const navigate = useNavigate();

  async function handleBookingSubmit(e) {
    e.preventDefault();

    // Redirect if user is not logged in
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/auth");
    }

    // Optional: Validate date logic here
    if (new Date(booking.dateFrom) > new Date(booking.dateTo)) {
      return alert("End date must be after start date.");
    }

    try {
      const res = await fetch(`${NOROFF_API_BASE_URL}/holidaze/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": NOROFF_API_KEY,
        },
        body: JSON.stringify({
          dateFrom: booking.dateFrom,
          dateTo: booking.dateTo,
          guests: booking.guests,
          venueId: venue.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || "Booking failed");
      }

      alert("Booking successful!");
      // Optional: navigate to bookings page, reload venue, etc.
    } catch (err) {
      console.error("Booking error:", err);
      alert(err.message || "An error occurred during booking.");
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-md border border-[#7A92A7]/20 p-6 mt-10 max-w-md mx-auto text-sm">
      <h3 className="text-md mb-4">book this venue</h3>
      <form onSubmit={handleBookingSubmit} className="space-y-4">
        <div className="flex gap-3">
          <input
            type="date"
            value={booking.dateFrom}
            onChange={(e) =>
              setBooking({ ...booking, dateFrom: e.target.value })
            }
            className="flex-1 p-2 border border-[#7A92A7]/30 bg-transparent text-sm text-center"
            required
          />
          <input
            type="date"
            value={booking.dateTo}
            onChange={(e) => setBooking({ ...booking, dateTo: e.target.value })}
            className="flex-1 p-2 border border-[#7A92A7]/30 bg-transparent text-sm text-center"
            required
          />
        </div>

        <input
          type="number"
          min={1}
          max={venue.maxGuests}
          value={booking.guests}
          onChange={(e) => setBooking({ ...booking, guests: +e.target.value })}
          className="w-full p-2 border border-[#7A92A7]/30 bg-transparent text-sm text-center"
          required
        />

        <button
          type="submit"
          className="text-xs hover:underline hover:opacity-80"
        >
          book
        </button>
      </form>
    </div>
  );
}
