import { useEffect, useState } from "react";
import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "../../config";

export default function EditProfileForm() {
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const profileName = user?.name;
  const token = localStorage.getItem("token");

  // fetch profile
  useEffect(() => {
    if (!profileName) return;

    async function fetchProfile() {
      try {
        const res = await fetch(
          `${NOROFF_API_BASE_URL}/holidaze/profiles/${profileName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": NOROFF_API_KEY,
            },
          }
        );

        const data = await res.json();
        setBio(data.data.bio || "");
        setAvatarUrl(data.data.avatar?.url || "");
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }

    fetchProfile();
  }, [profileName]);

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const payload = {
      bio,
      avatar: avatarUrl
        ? { url: avatarUrl, alt: `${profileName}'s avatar` }
        : undefined,
    };

    try {
      const res = await fetch(
        `${NOROFF_API_BASE_URL}/holidaze/profiles/${profileName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": NOROFF_API_KEY,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.errors?.[0]?.message || "Profile update failed.");

      setMessage("profile updated successfully!");

      // update localStorage if avatar changed
      const updatedUser = { ...user, ...data.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("update failed:", err);
      setMessage(` ${err.message}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 text-sm text-[#7A92A7] max-w-md mx-auto"
    >
      <h2 className="text-lg font-semibold mb-2">Edit Profile</h2>

      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Update your bio"
        className="w-full p-2 border border-gray-300 rounded"
      />

      <input
        type="url"
        value={avatarUrl}
        onChange={(e) => setAvatarUrl(e.target.value)}
        placeholder="Avatar image URL"
        className="w-full p-2 border border-gray-300 rounded"
      />

      {message && <p className="text-sm mt-2">{message}</p>}

      <button
        type="submit"
        className="bg-[#3C6FF0] text-white px-4 py-2 rounded uppercase tracking-wide"
      >
        save changes
      </button>
    </form>
  );
}
