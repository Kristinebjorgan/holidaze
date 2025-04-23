import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../modals/EditProfileModal";

function CustomerProfile() {
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
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
    </div>
  );
}

export default CustomerProfile;
