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
  const [localPublishStatus, setLocalPublishStatus] = useState({});
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (user?.name) fetchManagerVenues(user.name);
  }, [user]);

  const fetchManagerVenues = async (username) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${NOROFF_API_BASE_URL}/holidaze/profiles/${username}/venues?_owner=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": NOROFF_API_KEY,
          },
        }
      );
      const data = await response.json();
      const venuesData = data.data || [];
      setVenues(venuesData);

      // Initialize local publish status (default to true)
      const publishState = {};
      venuesData.forEach((v) => {
        publishState[v.id] = true;
      });
      setLocalPublishStatus(publishState);
    } catch (error) {
      console.error("Failed to fetch venues:", error);
    }
  };

  useEffect(() => {
    const handleProfileUpdate = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(updatedUser);
    };

    window.addEventListener("profile-updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdate);
    };
  }, []);

  const handleVenueCreated = () => {
    setTimeout(() => {
      if (user?.name) fetchManagerVenues(user.name);
    }, 500);
    setShowCreateModal(false);
    setEditingVenue(null);
  };

  const handleVenueUpdated = () => {
    fetchManagerVenues(user.name);
    setEditingVenue(null);
  };

  const handleDeleteVenue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this venue?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${NOROFF_API_BASE_URL}/holidaze/venues/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": NOROFF_API_KEY,
        },
      });
      if (!res.ok) throw new Error("Delete failed");
      fetchManagerVenues(user.name);
    } catch (err) {
      alert("Could not delete venue.");
    }
  };

  const togglePublish = (venueId) => {
    setLocalPublishStatus((prev) => ({
      ...prev,
      [venueId]: !prev[venueId],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const filteredVenues = venues.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) return <p>Loading...</p>;

  return (
    <section className="px-4 py-10 text-[#7A92A7] max-w-5xl mx-auto text-center">
      <div className="mb-6">
        <h1 className="text-sm mb-4 lowercase text-[#7A92A7]">
          hello, {user.name}!
        </h1>
        {user.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt={user.avatar.alt || "avatar"}
            className="w-24 h-32 mx-auto object-cover mb-1"
          />
        ) : (
          <div className="w-16 h-16 mx-auto bg-[#7A92A7]/10 rounded-full mb-1" />
        )}
        {user.bio && (
          <p className="text-xs text-[#7A92A7] mt-4 mb-2 max-w-xs mx-auto">
            {user.bio}
          </p>
        )}
        <button
          className="text-[10px] text-[#7A92A7]/70 hover:underline hover:opacity-60 lowercase"
          onClick={() => setShowEditProfile(true)}
        >
          edit
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm mb-6">
        <div className="bg-[#C6DAE7] p-4 border border-white/10 text-white">
          <p className="text-xs">listings</p>
          <p className="text-base">{venues.length}</p>
        </div>
        <div className="bg-[#C6DAE7] p-4 border border-white/10 text-white">
          <p className="text-xs">bookings</p>
          <p>{venues.reduce((sum, v) => sum + (v._count?.bookings || 0), 0)}</p>
        </div>
        <div className="bg-[#C6DAE7] p-4 border border-white/10 text-white">
          <p className="text-xs">occupancy</p>
          <p>
            {(() => {
              let totalBookedDays = 0;
              let totalSpanDays = 0;

              venues.forEach((venue) => {
                const bookings = venue.bookings || [];
                bookings.forEach((b) => {
                  const start = new Date(b.dateFrom);
                  const end = new Date(b.dateTo);
                  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                  totalBookedDays += days;
                });

                if (bookings.length) {
                  const first = new Date(
                    Math.min(...bookings.map((b) => new Date(b.dateFrom)))
                  );
                  const last = new Date(
                    Math.max(...bookings.map((b) => new Date(b.dateTo)))
                  );
                  const span = Math.ceil(
                    (last - first) / (1000 * 60 * 60 * 24)
                  );
                  totalSpanDays += span;
                }
              });

              const percentage =
                totalSpanDays > 0
                  ? Math.round((totalBookedDays / totalSpanDays) * 100)
                  : 0;
              return `${percentage}%`;
            })()}
          </p>
        </div>
        <div className="bg-[#C6DAE7] p-4 border border-white/10 text-white">
          <p className="text-xs">avg. price</p>
          <p>
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

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowCreateModal(true)}
          className="text-sm text-[#7A92A7] hover:underline"
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
        <EditProfileModal onClose={() => setShowEditProfile(false)} />
      )}

      <div className="grid gap-12">
        {filteredVenues.length === 0 ? (
          <p className="text-[#7A92A7]/70 text-sm">
            no listings match your search
          </p>
        ) : (
          filteredVenues.map((venue) => {
            const isPublished = localPublishStatus[venue.id];

            return (
              <div
                key={venue.id}
                className="text-left text-sm text-[#7A92A7] bg-[#C6DAE7] p-4 mb-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm text-s">{venue.name}</h3>
                </div>

                <p className="text-xs mb-1">{venue.location?.address}</p>
                <p className="text-xs mb-2">€{venue.price}</p>

                {venue.media?.[0]?.url && (
                  <img
                    src={venue.media[0].url}
                    alt={venue.media[0].alt}
                    className="w-full h-40 object-cover mb-4"
                  />
                )}

                <div className="flex justify-center gap-4 text-xs">
                  <button
                    className="hover:underline"
                    onClick={() => setViewingVenue(venue)}
                  >
                    view
                  </button>
                  <button
                    className="hover:underline"
                    onClick={() => setEditingVenue(venue)}
                  >
                    edit
                  </button>
                  <button
                    className="hover:underline"
                    onClick={() => handleDeleteVenue(venue.id)}
                  >
                    delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-20">
        <button
          onClick={handleLogout}
          className="text-xs text-[#7A92A7] hover:text-gray-600"
        >
          log out
        </button>
      </div>
    </section>
  );
}

export default ManagerProfile;
