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
  <div className="flex flex-col items-center text-[#445667] font-sans text-[20px] lowercase min-h-screen pt-[250px]">
    <h1 className="mb-10">hello, {user.name}</h1>

    {user.avatar?.url && (
      <>
        <img
          src={user.avatar.url}
          alt={user.avatar.alt}
          className="w-[120px] h-[120px] object-cover mb-2"
        />
        <button
          onClick={() => setShowEditModal(true)}
          className="text-[10px] underline mb-10"
        >
          update
        </button>
      </>
    )}

    {showEditModal && (
      <EditProfileModal onClose={() => setShowEditModal(false)} />
    )}

    <h2 className="mt-[316px] mb-[80px]">upcoming trips</h2>

    <div className="flex flex-col gap-16">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="relative w-[900px] h-[420px] overflow-hidden group mx-[270px]"
          style={{
            backgroundImage: `url(${booking.venue?.media?.[0]?.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Hover overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#ffffff88] backdrop-blur-sm flex items-end justify-center">
            <div className="flex gap-8 pb-6">
              <button
                onClick={() => setViewingBooking(booking)}
                className="text-xs underline hover:opacity-90"
              >
                view
              </button>
              <button
                onClick={() => setEditingBooking(booking)}
                className="text-xs underline hover:opacity-90"
              >
                edit
              </button>
              <button
                onClick={() => handleDelete(booking)}
                className="text-xs underline hover:opacity-90"
              >
                delete
              </button>
            </div>
          </div>

          {/* Info row */}
          <div className="absolute bottom-0 left-0 right-0 px-[10px] py-3 flex justify-between bg-white/80 text-xs">
            <div>
              {booking.venue?.name?.toLowerCase()}, {booking.venue?.location?.city?.toLowerCase()}, {booking.venue?.location?.country?.toLowerCase()}
            </div>
            <div>
              {new Date(booking.dateFrom).toLocaleDateString()} -{" "}
              {new Date(booking.dateTo).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>

    <button
      onClick={handleLogout}
      className="mt-20 text-[12px] hover:underline"
    >
      log out
    </button>

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
