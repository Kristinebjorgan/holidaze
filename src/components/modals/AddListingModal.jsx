import { useState, useEffect, useRef } from "react";
import {
  CLOUDINARY_UPLOAD_PRESET,
  NOROFF_API_BASE_URL,
  NOROFF_API_KEY,
  APP_VENUE_TAG,
} from "../../config";
import { useContinentFromCountry } from "../../hooks/useContinentFromCountry";


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
const continent = useContinentFromCountry(country);
  const [price, setPrice] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [description, setDescription] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [amenities, setAmenities] = useState({
    wifi: false,
    breakfast: false,
    parking: false,
    pets: false,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef(null);

useEffect(() => {
  function handleClickOutside(e) {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  }

  function handleEscapeKey(e) {
    if (e.key === "Escape") {
      onClose();
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleEscapeKey);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("keydown", handleEscapeKey);
  };
}, [onClose]);


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
    if (!res.ok || !data.secure_url) throw new Error("Image upload failed");
    return { url: data.secure_url, alt: venueName || "venue image" };
  }

  async function uploadAllImages(files) {
    const results = await Promise.allSettled(
      files.map(uploadImageToCloudinary)
    );
    return results.filter((r) => r.status === "fulfilled").map((r) => r.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (
      !venueName ||
      !location ||
      !country ||
      !continent ||
      !price ||
      !maxGuests ||
      !description ||
      mediaFiles.length === 0
    ) {
      setError("All fields are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated.");

      const uploadedMedia = await uploadAllImages(mediaFiles);
      if (!uploadedMedia.length) throw new Error("No images uploaded.");

      const payload = {
        name: venueName,
        description: `${description} ${APP_VENUE_TAG}`,
        media: uploadedMedia,
        price: parseFloat(price),
        maxGuests: parseInt(maxGuests),
        meta: { ...amenities },
        location: { address: location, country, continent },
      };

      const res = await fetch(`${NOROFF_API_BASE_URL}/holidaze/venues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": NOROFF_API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.errors?.[0]?.message || "Venue creation failed");

      resetForm();
      onVenueCreated?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setVenueName("");
    setLocation("");
    setCountry("");
    setPrice("");
    setMaxGuests("");
    setDescription("");
    setMediaFiles([]);
    setAmenities({
      wifi: false,
      breakfast: false,
      parking: false,
      pets: false,
    });
    setError("");
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
      <div
        ref={modalRef}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#FEFEFE]/70 backdrop-blur-md p-6 text-[#7A92A7] relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl hover:underline"
        >
          ×
        </button>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          {[
            { label: "venue name", value: venueName, setter: setVenueName },
            { label: "address or city", value: location, setter: setLocation },
            { label: "country", value: country, setter: setCountry },
          ].map(({ label, value, setter }) => (
            <input
              key={label}
              type="text"
              value={value}
              onChange={(e) => setter(e.target.value)}
              placeholder={label}
              className="w-full p-2 border-b bg-transparent outline-none"
              required
            />
          ))}

          <select
            value={continent}
            disabled
            className="w-full p-2 border-b bg-transparent outline-none text-gray-400 cursor-not-allowed"
          >
            <option value="">{continent || "autofill"}</option>
          </select>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="price per night"
            className="w-full p-2 border-b bg-transparent outline-none"
            required
          />

          <input
            type="number"
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
            placeholder="max guests"
            className="w-full p-2 border-b bg-transparent outline-none"
            required
          />

          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="description"
            className="w-full p-2 border-b bg-transparent outline-none"
            required
          />

          <div className="flex flex-col items-center gap-2 py-4">
            <input
              type="file"
              multiple
              accept="image/*"
              id="mediaUpload"
              onChange={(e) =>
                setMediaFiles((prev) => [
                  ...prev,
                  ...Array.from(e.target.files || []),
                ])
              }
              className="hidden"
              required
            />

            <label
              htmlFor="mediaUpload"
              className="text-sm text-[#7A92A7] px-4 py-1 cursor-pointer hover:underline"
            >
              files
            </label>

            <span className="text-[11px] text-[#7A92A7]">
              {mediaFiles.length
                ? `${mediaFiles.length} file(s) selected`
                : "No file chosen"}
            </span>
          </div>

          {!!mediaFiles.length && (
            <div className="grid grid-cols-3 gap-2">
              {mediaFiles.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setMediaFiles((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="absolute top-0 right-0 bg-white/70 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between flex-wrap gap-2 text-xs mt-4">
            {Object.entries(amenities).map(([key, val]) => (
              <label key={key} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={val}
                  onChange={(e) =>
                    setAmenities((prev) => ({
                      ...prev,
                      [key]: e.target.checked,
                    }))
                  }
                />
                {key}
              </label>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="text-sm hover:underline"
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-sm hover:underline"
            >
              {isSubmitting ? "adding..." : "add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
