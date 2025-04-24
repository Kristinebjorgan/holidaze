import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../modals/EditProfileModal";
import ViewBookingModal from "../modals/ViewBookingModal";
import EditBookingModal from "../modals/EditBookingModal";
import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "../../config";

function CustomerProfile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewingBooking, setViewingBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);

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
      setBookings(data.data);
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

  const handleDelete = async (booking) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${NOROFF_API_BASE_URL}/holidaze/bookings/${booking.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": NOROFF_API_KEY,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete booking");

      setBookings((prev) => prev.filter((b) => b.id !== booking.id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto text-center text-[#7A92A7]">
      <h1 className="text-xl font-bold mb-2 text-[#D94C4C]">
        hallo, {user.name}
      </h1>

      {user.avatar?.url && (
        <img
          src={user.avatar.url}
          alt={user.avatar.alt}
          className="w-20 h-20 mx-auto rounded-full object-cover mb-4"
        />
      )}

      <button
        onClick={() => setShowEditModal(true)}
        className="text-sm text-blue-600 underline mb-2 block"
      >
        Edit profile
      </button>

      <button onClick={handleLogout} className="text-sm text-red-500 underline">
        Log out
      </button>

      {showEditModal && (
        <EditProfileModal onClose={() => setShowEditModal(false)} />
      )}

      {bookings.length > 0 && (
        <div className="mt-6 text-left">
          <h2 className="text-md font-semibold mb-2">your bookings</h2>
          <ul className="space-y-3 text-sm">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="p-3 border rounded shadow-sm bg-white"
              >
                <strong>{booking.venue?.name}</strong>
                <div>
                  {new Date(booking.dateFrom).toLocaleDateString()} →{" "}
                  {new Date(booking.dateTo).toLocaleDateString()}
                </div>
                <div>Guests: {booking.guests}</div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setViewingBooking(booking)}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    View
                  </button>
                  <button
                    onClick={() => setEditingBooking(booking)}
                    className="text-yellow-600 hover:underline text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(booking)}
                    className="text-red-600 hover:underline text-xs"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
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
    </div>
  );
}

export default CustomerProfile;
