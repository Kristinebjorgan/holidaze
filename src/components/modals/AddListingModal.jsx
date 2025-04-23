import { useState, useEffect, useRef } from "react";
import {
  CLOUDINARY_UPLOAD_PRESET,
  NOROFF_API_BASE_URL,
  NOROFF_API_KEY,
  APP_VENUE_TAG,
} from "../../config";

const continents = [
  "Africa",
  "Antarctica",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

export default function AddListingModal({ onClose, onVenueCreated }) {
  const [venueName, setVenueName] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [continent, setContinent] = useState("");
  const [price, setPrice] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [description, setDescription] = useState("");
  const [wifi, setWifi] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [parking, setParking] = useState(false);
  const [pets, setPets] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  function handleFocus(e) {
    e.target.dataset.placeholder = e.target.placeholder;
    e.target.placeholder = "";
  }

  function handleBlur(e) {
    if (e.target.value.trim() === "") {
      e.target.placeholder = e.target.dataset.placeholder;
    }
  }

  async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/kribji/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok || !data.secure_url) {
      console.error("Cloudinary response error:", data);
      throw new Error("Failed to upload image to Cloudinary.");
    }

    return data.secure_url;
  }

  function resetForm() {
    setVenueName("");
    setLocation("");
    setCountry("");
    setContinent("");
    setPrice("");
    setMaxGuests("");
    setDescription("");
    setWifi(false);
    setBreakfast(false);
    setParking(false);
    setPets(false);
    setMediaFile(null);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (
      venueName.trim() === "" ||
      location.trim() === "" ||
      country.trim() === "" ||
      continent.trim() === "" ||
      price === "" ||
      maxGuests === "" ||
      description.trim() === "" ||
      !mediaFile
    ) {
      setError("All fields are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const mediaUrl = await uploadImageToCloudinary(mediaFile);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not logged in. Please log in again.");
      }

      const payload = {
        name: venueName,
        description: `${description} ${APP_VENUE_TAG}`,
        media: [{ url: mediaUrl, alt: venueName }],
        price: parseFloat(price),
        maxGuests: parseInt(maxGuests, 10),
        meta: {
          wifi,
          breakfast,
          parking,
          pets,
        },
        location: {
          address: location,
          country,
          continent,
        },
      };

      console.log("Submitting venue payload:", payload);

      const response = await fetch(`${NOROFF_API_BASE_URL}/holidaze/venues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": NOROFF_API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage =
          result.errors?.[0]?.message || "Failed to create venue.";
        throw new Error(errorMessage);
      }

      const currentUser = JSON.parse(localStorage.getItem("user"));

      const apiOwnerEmail = result?.data?.owner?.email?.trim().toLowerCase();
      const localUserEmail = currentUser?.email?.trim().toLowerCase();

      if (apiOwnerEmail !== localUserEmail) {
        console.log("→ API returned:", apiOwnerEmail);
        console.log("→ Expected:", localUserEmail);
      }

      resetForm();
      onVenueCreated?.();
      onClose();
    } catch (err) {
      console.error("Venue creation error:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
      <div
        ref={modalRef}
        className="w-full max-w-md mx-auto bg-white p-6 rounded-md relative text-[#7A92A7]"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-[#7A92A7] text-xl hover:underline"
        >
          &times;
        </button>

        <h2 className="text-2xl mb-4 lowercase">add listing</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <input
            type="text"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="venue name"
            className="w-full p-2 border-b border-gray-300 bg-transparent outline-none"
            required
          />

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="address or city"
            className="w-full p-2 border-b border-gray-300 bg-transparent outline-none"
            required
          />

          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="country"
            className="w-full p-2 border-b border-gray-300 bg-transparent outline-none"
            required
          />

          <select
            value={continent}
            onChange={(e) => setContinent(e.target.value)}
            className="w-full p-2 border-b border-gray-300 bg-transparent outline-none"
            required
          >
            <option value="">choose continent</option>
            {continents.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="price per night"
            className="w-full p-2 border-b border-gray-300 bg-transparent outline-none"
            required
          />

          <input
            type="number"
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
            placeholder="max guests"
            className="w-full p-2 border-b border-gray-300 bg-transparent outline-none"
            required
          />

          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="description"
            className="w-full p-2 border-b border-gray-300 bg-transparent outline-none"
            required
          />

          <div className="w-full flex justify-center py-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
              className="w-full"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={wifi}
                onChange={(e) => setWifi(e.target.checked)}
              />
              <span>wifi</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={breakfast}
                onChange={(e) => setBreakfast(e.target.checked)}
              />
              <span>breakfast</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={parking}
                onChange={(e) => setParking(e.target.checked)}
              />
              <span>parking</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={pets}
                onChange={(e) => setPets(e.target.checked)}
              />
              <span>pets</span>
            </label>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-[#7A92A7] hover:underline"
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-sm text-[#7A92A7] hover:underline"
            >
              {isSubmitting ? "adding..." : "add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
