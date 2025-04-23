import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddListingModal from "../modals/AddListingModal";
import ViewVenueModal from "../modals/ViewVenueModal";
import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "../../config"; 

function ManagerProfile() {
  const [user, setUser] = useState(null);
  const [venues, setVenues] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [viewingVenue, setViewingVenue] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user?.name) {
      fetchManagerVenues(user.name);
    }
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
      setVenues(data.data || []);
    } catch (error) {
      console.error("Failed to fetch venues:", error);
    }
  };

const handleVenueCreated = () => {
  setTimeout(() => {
    if (user?.name) {
      fetchManagerVenues(user.name); 
    }
  }, 500); 

  setShowCreateModal(false);
  setEditingVenue(null);
};

  const handleDeleteVenue = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this venue?"
    );
    if (!confirm) return;

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
      console.error("Delete failed:", err);
      alert("Could not delete venue.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 text-center">
      <h1 className="text-xl font-bold mb-2 text-[#D94C4C]">
        welcome, {user.name}
      </h1>

      <button
        onClick={handleLogout}
        className="text-sm text-red-500 underline mb-4"
      >
        Log out
      </button>

      <button
        onClick={() => setShowCreateModal(true)}
        className="text-blue-600 underline text-sm mb-6 block"
      >
        + Add listing
      </button>

      {showCreateModal && (
        <AddListingModal
          onClose={() => setShowCreateModal(false)}
          onVenueCreated={handleVenueCreated}
        />
      )}

      {editingVenue && (
        <AddListingModal
          initialData={editingVenue}
          mode="edit"
          onClose={() => setEditingVenue(null)}
          onVenueCreated={handleVenueCreated}
        />
      )}

      {viewingVenue && (
        <ViewVenueModal
          venue={viewingVenue}
          onClose={() => setViewingVenue(null)}
        />
      )}

      <div className="mt-6 space-y-4">
        {venues.length === 0 && (
          <p className="text-gray-400 text-sm">
            You haven't added any listings yet.
          </p>
        )}

        {venues.map((venue) => (
          <div
            key={venue.id}
            className="p-4 border border-gray-200 rounded text-left text-sm"
          >
            <h3 className="text-[#7A92A7] font-semibold">{venue.name}</h3>
            <p className="text-gray-500">{venue.location?.address}</p>
            <p className="text-gray-500">Price: ${venue.price}</p>

            {venue.media?.[0]?.url && (
              <img
                src={venue.media[0].url}
                alt={venue.media[0].alt}
                className="w-full h-40 object-cover mt-2 rounded"
              />
            )}

            <div className="flex gap-3 mt-3 text-xs text-blue-600 underline">
              <button onClick={() => setViewingVenue(venue)}>view</button>
              <button onClick={() => setEditingVenue(venue)}>edit</button>
              <button onClick={() => handleDeleteVenue(venue.id)}>
                delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManagerProfile;
