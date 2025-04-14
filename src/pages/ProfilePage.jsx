 // src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

// Component to render customer profile
function CustomerProfile({ user }) {
  return (
    <div className="max-w-xl mx-auto p-4 text-center">
      <h1 className="text-2xl mb-2">hello, {user.name}</h1>
      <img
        src={user.avatar?.url || "/default-avatar.jpg"}
        alt={user.avatar?.alt || "profile avatar"}
        className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
      />
      <p>your upcoming trips</p>
    </div>
  );
}

// Component to render manager profile
function ManagerProfile({ user, venues }) {
  return (
    <div className="max-w-xl mx-auto p-4 text-center">
      <h1 className="text-2xl mb-2">hello, {user.name}</h1>
      <img
        src={user.avatar?.url || "/default-avatar.jpg"}
        alt={user.avatar?.alt || "profile avatar"}
        className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
      />
      <button
        className="underline mb-4"
        onClick={() => {
          // Implement add listing navigation here.
        }}
      >
        add listing
      </button>
      <div className="space-y-4">
        {venues.length > 0 ? (
          venues.map((venue) => (
            <div key={venue.id} className="p-4 border border-gray-200">
              <p className="font-bold">{venue.name}</p>
              <p>{venue.location}</p>
              <div className="flex justify-center space-x-4 mt-2">
                <button onClick={() => { /* view handler */ }}>view</button>
                <button onClick={() => { /* edit handler */ }}>edit</button>
                <button onClick={() => { /* delete handler */ }}>delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>no listings</p>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Fetch the user's full profile with extra properties.
        const profileData = await apiFetch("/holidaze/profiles/me?_holidaze=true");
        console.log("Profile data received:", profileData);
        setUser(profileData);

        // If the API response indicates a manager, fetch the manager's venues.
        if (profileData.venueManager) {
          const venuesData = await apiFetch(
            "/holidaze/venues?owner=" + encodeURIComponent(profileData.name)
          );
          console.log("Venues data received:", venuesData);
          setVenues(venuesData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  function handleLogout() {
    localStorage.removeItem("holidazeToken");
    localStorage.removeItem("userRole");
    navigate("/auth");
  }

  if (loading) return <p className="text-center mt-8">loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!user) return <p className="text-center mt-8">no user data</p>;

  // Retrieve stored role as a fallback.
  const storedRole = localStorage.getItem("userRole");
  // Use the API response if available; otherwise, fall back to the stored role.
  const isManager = user.venueManager || storedRole === "manager";

  return (
    <div>
      {isManager ? (
        <ManagerProfile user={user} venues={venues} />
      ) : (
        <CustomerProfile user={user} />
      )}
      <div className="text-center mt-8">
        <button onClick={handleLogout} className="underline text-sm text-[#7A92A7]">
          logout
        </button>
      </div>
    </div>
  );
}
