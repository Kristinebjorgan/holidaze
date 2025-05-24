import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddListingModal from "../modals/AddListingModal";
import EditVenueModal from "../modals/EditListingModal";
import ViewVenueModal from "../modals/ViewVenueModal";
import EditProfileModal from "../modals/EditProfileModal";
import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "../../config";

function ManagerProfile() {
  const [user, setUser] = useState(null);
  const [venues, setVenues] = useState([]);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [viewingVenue, setViewingVenue] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [localPublishStatus, setLocalPublishStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (user?.name) fetchManagerVenues(user.name);
  }, [user]);

  const fetchManagerVenues = async (username) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${NOROFF_API_BASE_URL}/holidaze/profiles/${username}/venues?_owner=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": NOROFF_API_KEY,
          },
        }
      );
      const data = await res.json();
      const venuesData = data.data || [];
      setVenues(venuesData);

      const publishState = {};
      venuesData.forEach((v) => {
        publishState[v.id] = true;
      });
      setLocalPublishStatus(publishState);
    } catch (err) {
      console.error("Venue fetch failed:", err);
    }
  };

  const handleVenueCreated = () => {
    if (user?.name) fetchManagerVenues(user.name);
    setShowCreateModal(false);
  };

  const handleVenueUpdated = () => {
    if (user?.name) fetchManagerVenues(user.name);
    setEditingVenue(null);
  };

  const handleDeleteVenue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this venue?")) return;
    const token = localStorage.getItem("token");
    try {
      await fetch(`${NOROFF_API_BASE_URL}/holidaze/venues/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": NOROFF_API_KEY,
        },
      });
      fetchManagerVenues(user.name);
    } catch (err) {
      alert("Could not delete venue.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const filteredVenues = venues.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="px-4 py-10 text-[#7A92A7] max-w-7xl mx-auto text-center">
      <div className="mb-10">
        <h1 className="text-sm mb-4 lowercase">hello, {user?.name}!</h1>
        {user?.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt={user.avatar.alt || "avatar"}
            className="w-16 h-16 mx-auto object-cover mb-1"
          />
        ) : (
          <div className="w-16 h-16 mx-auto bg-[#7A92A7]/10 mb-1" />
        )}
        <div className="flex justify-center gap-6 mt-2 text-xs">
          <button
            onClick={() => setShowEditProfile(true)}
            className="hover:underline hover:opacity-80"
          >
            update
          </button>
          <button
            onClick={() => alert("Messaging coming soon")}
            className="hover:underline hover:opacity-80 flex items-center gap-1"
          >
            messages
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-10">
        <div className="bg-[#D4E9F7]/60 backdrop-blur-md p-4">
          <p className="text-xs">listings</p>
          <p className="text-base font-light">{venues.length}</p>
        </div>
        <div className="bg-[#D4E9F7]/60 backdrop-blur-md p-4">
          <p className="text-xs">bookings</p>
          <p className="text-base font-light">
            {venues.reduce((sum, v) => sum + (v._count?.bookings || 0), 0)}
          </p>
        </div>
        <div className="bg-[#D4E9F7]/60 backdrop-blur-md p-4">
          <p className="text-xs">occupancy</p>
          <p className="text-base font-light">
            {(() => {
              let booked = 0,
                span = 0;
              venues.forEach((venue) => {
                const bookings = venue.bookings || [];
                bookings.forEach((b) => {
                  booked +=
                    (new Date(b.dateTo) - new Date(b.dateFrom)) /
                    (1000 * 60 * 60 * 24);
                });
                if (bookings.length) {
                  const first = new Date(
                    Math.min(...bookings.map((b) => new Date(b.dateFrom)))
                  );
                  const last = new Date(
                    Math.max(...bookings.map((b) => new Date(b.dateTo)))
                  );
                  span += (last - first) / (1000 * 60 * 60 * 24);
                }
              });
              return span ? `${Math.round((booked / span) * 100)}%` : "0%";
            })()}
          </p>
        </div>
        <div className="bg-[#D4E9F7]/60 backdrop-blur-md p-4">
          <p className="text-xs">avg. price</p>
          <p className="text-base font-medium">
            €
            {venues.length
              ? Math.round(
                  venues.reduce((sum, v) => sum + (v.price || 0), 0) /
                    venues.length
                )
              : 0}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={() => setShowCreateModal(true)}
          className="text-sm hover:underline"
        >
          add
        </button>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="search"
          className="text-sm bg-transparent text-right focus:outline-none placeholder:text-[#7A92A7]"
        />
      </div>

      {/* Venue Cards */}
      <div className="grid gap-10 text-left">
        {filteredVenues.length === 0 ? (
          <p className="text-sm text-[#7A92A7]/70">
            no listings match your search
          </p>
        ) : (
          filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="text-sm text-[#7A92A7] bg-[#D4E9F7]/60 backdrop-blur-md p-6 shadow-sm"
            >
              <h3 className="text-base font-medium mb-1">{venue.name}</h3>
              <p className="text-xs mb-1">{venue.location?.address}</p>
              <p className="text-xs mb-4">€{venue.price}</p>

              {venue.media?.[0]?.url && (
                <div className="relative overflow-hidden mb-4">
                  <img
                    src={venue.media[0].url}
                    alt={venue.media[0].alt}
                    className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                  />
                </div>
              )}

              <div className="flex justify-center gap-4 text-xs">
                <button
                  onClick={() => setViewingVenue(venue)}
                  className="hover:underline"
                >
                  view
                </button>
                <button
                  onClick={() => setEditingVenue(venue)}
                  className="hover:underline"
                >
                  edit
                </button>
                <button
                  onClick={() => handleDeleteVenue(venue.id)}
                  className="hover:underline"
                >
                  delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-20">
        <button
          onClick={handleLogout}
          className="text-xs hover:underline hover:text-gray-600"
        >
          log out
        </button>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <AddListingModal
          onClose={() => setShowCreateModal(false)}
          onVenueCreated={handleVenueCreated}
        />
      )}
      {editingVenue && (
        <EditVenueModal
          venue={editingVenue}
          onClose={() => setEditingVenue(null)}
          onUpdate={handleVenueUpdated}
        />
      )}
      {viewingVenue && (
        <ViewVenueModal
          venue={viewingVenue}
          onClose={() => setViewingVenue(null)}
        />
      )}
      {showEditProfile && (
        <EditProfileModal
          onClose={() => setShowEditProfile(false)}
          onProfileUpdated={() => {
            const updated = localStorage.getItem("user");
            if (updated) setUser(JSON.parse(updated));
          }}
        />
      )}
    </section>
  );
}

export default ManagerProfile;