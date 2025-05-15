import { useEffect, useRef, useState } from "react";
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

  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

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

      let updatedDescription = formData.description || "";
      if (!updatedDescription.toLowerCase().includes("kribji")) {
        updatedDescription = `${updatedDescription} kribji`;
      }

      const updatedData = {
        ...formData,
        description: updatedDescription,
      };

      const res = await fetch(
        `${NOROFF_API_BASE_URL}/holidaze/venues/${venue.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": NOROFF_API_KEY,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!res.ok) throw new Error("Failed to update venue");
      const updatedVenue = await res.json();

      onUpdate(updatedVenue.data); // Refresh the parent
      onClose(); // Close the modal
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#FEFEFE]/60 backdrop-blur-sm z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="bg-[#FEFEFE]/80 backdrop-blur-md p-6 w-full max-w-2xl text-[#7A92A7] lowercase tracking-wide relative overflow-y-auto max-h-[90vh]"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-2 right-4 text-xl hover:underline"
        >
          ×
        </button>

        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full p-2 border-b bg-transparent mb-4 outline-none"
          placeholder="venue name"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className="w-full p-2 border-b bg-transparent mb-4 outline-none"
          placeholder="description"
        />

        <div className="flex gap-3 mb-4">
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            className="w-1/2 p-2 border-b bg-transparent outline-none"
            placeholder="price"
          />
          <input
            name="maxGuests"
            type="number"
            value={formData.maxGuests}
            onChange={handleInputChange}
            className="w-1/2 p-2 border-b bg-transparent outline-none"
            placeholder="max guests"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mb-6">
          {Object.entries(formData.meta).map(([key, val]) => (
            <label
              key={key}
              className="flex justify-between items-center border-b py-1 px-2 bg-transparent"
            >
              <span>{key}</span>
              <input
                type="checkbox"
                checked={val}
                onChange={() => handleMetaToggle(key)}
                className="appearance-none w-4 h-4 border border-[#7A92A7] checked:bg-[#7A92A7] checked:border-[#7A92A7]"
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
            className="w-1/2 p-2 border-b bg-transparent outline-none"
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
            className="w-1/2 p-2 border-b bg-transparent outline-none"
            placeholder="country"
          />
        </div>

        <p className="text-xs mb-2">drag to reorder</p>
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
          className="text-xs hover:underline hover:opacity-80 block mx-auto"
        >
          save
        </button>
      </div>
    </div>
  );
}
