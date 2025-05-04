// src/components/modals/EditVenueModal.jsx
import { useState } from "react";
import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "../../config";

export default function EditVenueModal({ venue, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: venue.name,
    description: venue.description,
    price: venue.price,
    maxGuests: venue.maxGuests,
    meta: {
      wifi: venue.meta?.wifi || false,
      parking: venue.meta?.parking || false,
      breakfast: venue.meta?.breakfast || false,
      pets: venue.meta?.pets || false,
    },
    location: {
      address: venue.location?.address || "",
      country: venue.location?.country || "",
    },
    media: [...venue.media],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMetaToggle = (key) => {
    setFormData((prev) => ({
      ...prev,
      meta: { ...prev.meta, [key]: !prev.meta[key] },
    }));
  };

  const handleDrag = (e, index) => {
    e.dataTransfer.setData("imgIndex", index);
  };

  const handleDrop = (e, targetIndex) => {
    const fromIndex = e.dataTransfer.getData("imgIndex");
    if (fromIndex === "") return;

    const updated = [...formData.media];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(targetIndex, 0, moved);

    setFormData((prev) => ({ ...prev, media: updated }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${NOROFF_API_BASE_URL}/holidaze/venues/${venue.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": NOROFF_API_KEY,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Failed to update venue");
      const updatedVenue = await res.json();
      onUpdate(updatedVenue.data);
      onClose();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/80 p-6 w-full max-w-2xl border border-[#7A92A7]/20 text-[#7A92A7] lowercase tracking-wide relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-2 right-4 text-xl">
          ×
        </button>
        <h2 className="text-md mb-6 text-center">edit venue</h2>

        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full p-2 border mb-4 bg-transparent"
          placeholder="venue name"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className="w-full p-2 border mb-4 bg-transparent"
          placeholder="description"
        />

        <div className="flex gap-3 mb-4">
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            className="w-1/2 p-2 border bg-transparent"
            placeholder="price"
          />
          <input
            name="maxGuests"
            type="number"
            value={formData.maxGuests}
            onChange={handleInputChange}
            className="w-1/2 p-2 border bg-transparent"
            placeholder="max guests"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {Object.keys(formData.meta).map((key) => (
            <label
              key={key}
              className="flex justify-between items-center border p-2 bg-transparent cursor-pointer"
            >
              {key}
              <input
                type="checkbox"
                checked={formData.meta[key]}
                onChange={() => handleMetaToggle(key)}
              />
            </label>
          ))}
        </div>

        <div className="flex gap-3 mb-6">
          <input
            name="address"
            value={formData.location.address}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, address: e.target.value },
              }))
            }
            className="w-1/2 p-2 border bg-transparent"
            placeholder="address"
          />
          <input
            name="country"
            value={formData.location.country}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, country: e.target.value },
              }))
            }
            className="w-1/2 p-2 border bg-transparent"
            placeholder="country"
          />
        </div>

        <p className="text-xs mb-2">drag to reorder images</p>
        <div className="flex flex-wrap gap-3 mb-6">
          {formData.media.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt={`image-${idx}`}
              draggable
              onDragStart={(e) => handleDrag(e, idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, idx)}
              className="w-24 h-24 object-cover border"
            />
          ))}
        </div>

        <button
          onClick={handleUpdate}
          className="text-xs underline hover:opacity-80 block mx-auto"
        >
          save changes
        </button>
      </div>
    </div>
  );
}
