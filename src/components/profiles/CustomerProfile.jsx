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
      if (!res.ok)
        throw new Error(
          data.errors?.[0]?.message || "Could not load bookings."
        );
      setBookings(
        data.data.sort((a, b) => new Date(b.dateFrom) - new Date(a.dateFrom))
      );
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

  return (
    <section className="px-4 py-10 text-[#7A92A7] max-w-7xl mx-auto text-center">
      <div className="mb-10">
        <h1 className="tracking-wid25 text-sm mb-4 lowercase">hello, {user?.name}</h1>
        {user?.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt={user.avatar.alt || "avatar"}
            className="w-16 h-16 mx-auto object-cover mb-1"
          />
        ) : (
          <div className="w-16 h-16 mx-auto bg-[#7A92A7]/10 mb-1" />
        )}
        <div className="flex justify-center gap-6 mt-2 text-xs mb-10">
          <button
            onClick={() => setShowEditModal(true)}
            className="tracking-wide25 hover:underline hover:opacity-80"
          >
            update
          </button>
          <button
            onClick={() => alert("Messaging coming soon")}
            className="tracking-wide25 hover:underline hover:opacity-80 flex items-center gap-1"
          >
            messages
          </button>
        </div>

        {/* Metrics */}
        <div className="tracking-wide25 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-10">
          <div className="bg-[#D4E9F7]/60 backdrop-blur-md p-4">
            <p className="tracking-wide25 text-xs">bookings</p>
            <p className="text-base font-light">{bookings.length}</p>
          </div>
          <div className="bg-[#D4E9F7]/60 backdrop-blur-md p-4">
            <p className="tracking-wide25 text-xs">nights</p>
            <p className="text-base font-light">
              {bookings.reduce((sum, b) => {
                const from = new Date(b.dateFrom);
                const to = new Date(b.dateTo);
                return sum + Math.ceil((to - from) / (1000 * 60 * 60 * 24));
              }, 0)}
            </p>
          </div>
          <div className="bg-[#D4E9F7]/60 backdrop-blur-md p-4">
            <p className="tracking-wide25 text-xs">favorite country</p>
            <p className="text-base font-light">
              {(() => {
                const counts = {};
                bookings.forEach((b) => {
                  const c = b.venue?.location?.country;
                  if (c) counts[c] = (counts[c] || 0) + 1;
                });
                const favorite = Object.entries(counts).sort(
                  (a, b) => b[1] - a[1]
                )[0];
                return favorite ? favorite[0] : "N/A";
              })()}
            </p>
          </div>
          <div className="bg-[#D4E9F7]/60 backdrop-blur-md p-4">
            <p className="tracking-wide25 text-xs">reviews given</p>
            <p className="text-base font-light">
              {
                bookings.filter((b) => b.meta?.reviewed || b._reviewed === true)
                  .length
              }
            </p>
          </div>
        </div>
      </div>

      <h2 className="tracking-wide25 text-sm mb-10">upcoming trips</h2>

      <div className="grid gap-10 text-left">
        {bookings.length === 0 ? (
          <p className="text-gray-400 text-sm">no trips yet</p>
        ) : (
          bookings.map((booking) => {
            const isPast =
              new Date() >= new Date(booking.dateTo).setHours(12, 0, 0, 0);
            const isReviewed =
              booking.meta?.reviewed || booking._reviewed === true;

            const formattedFrom = new Date(booking.dateFrom).toLocaleDateString(
              "en-GB"
            );
            const formattedTo = new Date(booking.dateTo).toLocaleDateString(
              "en-GB"
            );

            return (
              <div
                key={booking.id}
                className="text-sm text-[#7A92A7] bg-[#D4E9F7]/60 backdrop-blur-md p-6 shadow-sm"
              >
                <h3 className="text-base mb-1">
                  {booking.venue?.name?.toLowerCase()}
                </h3>
                <p className="text-xs mb-1">
                  {booking.venue?.location?.address?.toLowerCase()},{" "}
                  {booking.venue?.location?.country?.toLowerCase()}
                </p>
                <p className="text-xs mb-4 text-[#7A92A7]/70">
                  {formattedFrom} – {formattedTo}
                </p>

                {booking.venue?.media?.[0]?.url && (
                  <div className="relative overflow-hidden mb-4">
                    <img
                      src={booking.venue.media[0].url}
                      alt={booking.venue.media[0].alt || "venue"}
                      className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                    />
                  </div>
                )}

                <div className="flex justify-center gap-4 text-xs">
                  <button
                    onClick={() => setViewingBooking(booking)}
                    className="tracking-wide25 hover:underline"
                  >
                    view
                  </button>

                  {/* Keep cancel/edit only for future bookings */}
                  {!isPast && (
                    <>
                      <button
                        onClick={() => setEditingBooking(booking)}
                        className="tracking-wide25 hover:underline"
                      >
                        edit
                      </button>
                      <button
                        onClick={() => setCancelBooking(booking)}
                        className="tracking-wide25 hover:underline"
                      >
                        cancel
                      </button>
                    </>
                  )}

                  {/* Only show review button if it's past and not reviewed */}
                  {isPast && !isReviewed && (
                    <button
                      onClick={() => setReviewBooking(booking)}
                      className="tracking-wide25 hover:underline"
                    >
                      review
                    </button>
                  )}

                  <button
                    onClick={() => navigate(`/venues/${booking.venue?.id}`)}
                    className="tracking-wide25 hover:underline"
                  >
                    book again
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <button
        onClick={handleLogout}
        className="mt-20 text-xs hover:underline hover:text-gray-600"
      >
        log out
      </button>

      {showEditModal && (
        <EditProfileModal
          onClose={() => setShowEditModal(false)}
          onProfileUpdated={() => {
            const updated = localStorage.getItem("user");
            if (updated) setUser(JSON.parse(updated));
          }}
        />
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
