import { useEffect, useState } from "react";
import AddListingModal from "./AddListingModal";
import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "../config";

function ManagerProfile() {
  const [user, setUser] = useState(null);
  const [venues, setVenues] = useState([]);
  const [showModal, setShowModal] = useState(false);

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
    console.log("🔍 Venue fetch response:", data); // 👈 LOG HERE
    setVenues(data.data || []);
  } catch (error) {
    console.error("Failed to fetch venues:", error);
  }
};


  const handleVenueCreated = () => {
    if (user?.name) {
      fetchManagerVenues(user.name);
    }
    setShowModal(false);
    console.log("Venue created and refreshed.");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 text-center">
      <h1 className="text-xl font-bold mb-4 text-[#D94C4C]">
        welcome, {user.name}
      </h1>

      <button
        onClick={() => setShowModal(true)}
        className="text-blue-600 underline text-sm mb-6"
      >
        + Add listing
      </button>

      {showModal && (
        <AddListingModal
          onClose={() => setShowModal(false)}
          onVenueCreated={handleVenueCreated}
        />
      )}

      {/* Venue List */}
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManagerProfile;
