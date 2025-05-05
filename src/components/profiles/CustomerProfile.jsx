import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../modals/EditProfileModal";
import ViewBookingModal from "../modals/ViewBookingModal";
import EditBookingModal from "../modals/EditBookingModal";
import ConfirmCancelModal from "../modals/ConfirmCancelModal";
import ReviewBookingModal from "../modals/ReviewBookingModal";
import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "../../config";

export default function CustomerProfile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewingBooking, setViewingBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [cancelBooking, setCancelBooking] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const fetchBookings = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token || !user?.name) return;

    try {
      const res = await fetch(
        `${NOROFF_API_BASE_URL}/holidaze/profiles/${user.name}/bookings?_venue=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": NOROFF_API_KEY,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.[0]?.message || "Could not load bookings.");
      setBookings(data.data.sort((a, b) => new Date(b.dateFrom) - new Date(a.dateFrom)));
    } catch (err) {
      console.error("Booking fetch error:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const today = new Date();

  return (
    <section className="px-4 py-10 text-[#7A92A7] max-w-5xl mx-auto text-center">
      <div className="mb-6">
        <h1 className="text-sm mb-4 lowercase">hello, {user?.name}</h1>
        {user?.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt={user.avatar.alt || "avatar"}
            className="w-16 h-16 mx-auto object-cover rounded-full mb-1"
          />
        ) : (
          <div className="w-16 h-16 mx-auto bg-[#7A92A7]/10 mb-1" />
        )}
        <button
          onClick={() => setShowEditModal(true)}
          className="text-xs hover:underline hover:opacity-80"
        >
          update
        </button>
      </div>

      <h2 className="text-sm mb-10">upcoming trips</h2>

      <div className="grid gap-12 text-left">
        {bookings.length === 0 ? (
          <p className="text-gray-400 text-sm">no trips yet</p>
        ) : (
          bookings.map((booking) => {
            const isPast =
              new Date(booking.dateTo).getTime() < today.setHours(0, 0, 0, 0);
            const formattedFrom = new Date(booking.dateFrom).toLocaleDateString(
              "en-GB"
            );
            const formattedTo = new Date(booking.dateTo).toLocaleDateString(
              "en-GB"
            );

return (
  <div key={booking.id} className="space-y-3 relative">
    {/* Venue Image with optional sheer overlay */}
    <div
      className="h-64 bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${booking.venue?.media?.[0]?.url})`,
      }}
    >
      {isPast && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm transition-opacity duration-300 pointer-events-none" />
      )}
    </div>

    {/* Info Row */}
    <div className="flex justify-between text-sm">
      <p>
        {booking.venue?.name?.toLowerCase()},{" "}
        {booking.venue?.location?.city?.toLowerCase()},{" "}
        {booking.venue?.location?.country?.toLowerCase()}
      </p>
      <span className="text-right text-xs text-[#7A92A7]/70">
        {formattedFrom} – {formattedTo}
      </span>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-wrap gap-6 text-xs mt-2 justify-center sm:justify-start">
      <button
        onClick={() => setViewingBooking(booking)}
        className="hover:underline"
      >
        view
      </button>

      {isPast ? (
        <>
          <button
            onClick={() => setReviewBooking(booking)}
            className="hover:underline"
          >
            leave review
          </button>
          <button
            onClick={() => navigate(`/venues/${booking.venue?.id}`)}
            className="hover:underline"
          >
            book again
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => setEditingBooking(booking)}
            className="hover:underline"
          >
            edit
          </button>
          <button
            onClick={() => setCancelBooking(booking)}
            className="hover:underline"
          >
            cancel
          </button>
        </>
      )}
    </div>
  </div>
);

          })
        )}
      </div>

      <button
        onClick={handleLogout}
        className="mt-20 text-xs underline hover:text-gray-600"
      >
        log out
      </button>

      {/* Modals */}
      {showEditModal && (
        <EditProfileModal onClose={() => setShowEditModal(false)} />
      )}
      {viewingBooking && (
        <ViewBookingModal
          booking={viewingBooking}
          onClose={() => setViewingBooking(null)}
        />
      )}
      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onUpdated={fetchBookings}
        />
      )}
      {cancelBooking && (
        <ConfirmCancelModal
          type="booking"
          target={cancelBooking}
          onClose={() => setCancelBooking(null)}
          onConfirm={fetchBookings}
        />
      )}
      {reviewBooking && (
        <ReviewBookingModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onReviewed={fetchBookings}
        />
      )}
    </section>
  );
}
