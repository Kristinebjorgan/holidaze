// src/components/modals/FilterModal.jsx
import { useState } from "react";

export default function FilterModal({ filters, onClose, onApply }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggle = (key) => {
    setLocalFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-white/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded p-6 w-full max-w-md text-sm text-[#7A92A7] relative">
        <button onClick={onClose} className="absolute top-2 right-4 text-xl">
          ×
        </button>

        <h2 className="text-xl mb-4 lowercase">filter venues</h2>

        <div>
          <label>Price: {localFilters.price}</label>
          <input
            type="range"
            min={0}
            max={1000}
            step={10}
            value={localFilters.price}
            onChange={(e) => handleChange("price", +e.target.value)}
            className="w-full"
          />
        </div>

        <div className="mt-4">
          <label>Guests: {localFilters.guests}</label>
          <input
            type="range"
            min={1}
            max={10}
            value={localFilters.guests}
            onChange={(e) => handleChange("guests", +e.target.value)}
            className="w-full"
          />
        </div>

        <div className="mt-4 space-y-2">
          {["wifi", "breakfast", "parking", "pets"].map((key) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localFilters[key]}
                onChange={() => toggle(key)}
              />
              {key}
            </label>
          ))}
        </div>

        <button
          onClick={() => onApply(localFilters)}
          className="mt-6 block ml-auto text-blue-600 underline"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
