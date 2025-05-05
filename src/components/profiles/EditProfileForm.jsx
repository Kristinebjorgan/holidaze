import { useEffect, useState } from "react";
import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "../../config";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary";


export default function EditProfileForm() {
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const profileName = user?.name;
  const token = localStorage.getItem("token");
  const [avatarFile, setAvatarFile] = useState(null);


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
const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    let uploadedAvatarUrl = avatarUrl;

    if (avatarFile) {
      uploadedAvatarUrl = await uploadImageToCloudinary(avatarFile);
    }

    const payload = {
      bio,
      avatar: uploadedAvatarUrl
        ? { url: uploadedAvatarUrl, alt: `${profileName}'s avatar` }
        : undefined,
    };

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
    if (!res.ok) throw new Error(data.errors?.[0]?.message || "Update failed.");

    setMessage("profile updated successfully!");
    const updatedUser = { ...user, ...data.data };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("profile-updated"));
  } catch (err) {
    console.error("Update failed:", err);
    setMessage(err.message);
  }
};


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 text-sm text-[#7A92A7] max-w-md mx-auto text-center"
    >
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="edit bio"
        className="w-full bg-transparent p-2 outline-none text-center placeholder:text-[#7A92A7]"
      />

      <div className="text-center">
        <label className="inline-block text-xs hover:underline cursor-pointer hover:opacity-80 mb-1">
          choose
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
            className="hidden"
          />
        </label>
        <p className="text-[10px] mt-1 lowercase">
          {avatarFile?.name || "no file"}
        </p>
      </div>

      {message && <p className="text-xs">{message}</p>}

      <button
        type="submit"
        className="text-sm text-[#7A92A7] hover:underline hover:opacity-80"
      >
        save
      </button>
    </form>
  );
}
