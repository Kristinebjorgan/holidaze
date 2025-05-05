import { useState, useEffect, useRef } from "react";

export default function FilterModal({ filters, onClose, onApply }) {
  const [localFilters, setLocalFilters] = useState(filters);
  const modalRef = useRef();

  const handleChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggle = (key) => {
    setLocalFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-white/40 backdrop-blur-sm flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white/80 border border-[#7A92A7]/20 text-[#7A92A7] w-full max-w-md p-8 text-sm lowercase tracking-wide relative"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-xl leading-none hover:underline"
          aria-label="Close filter modal"
        >
          ×
        </button>

        {/* Price Slider */}
        <div className="mb-8 text-center">
          <div className="flex justify-between text-xs mb-1">
            <span>min</span>
            <span>{localFilters.price}€ pr night</span>
            <span>max</span>
          </div>
          <input
            type="range"
            min={0}
            max={1000}
            step={10}
            value={localFilters.price}
            onChange={(e) => handleChange("price", +e.target.value)}
            className="w-full slider"
          />
        </div>

        {/* Guests Slider */}
        <div className="mb-8 text-center">
          <div className="flex justify-between text-xs mb-1">
            <span>min</span>
            <span>{localFilters.guests} guest</span>
            <span>max</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={localFilters.guests}
            onChange={(e) => handleChange("guests", +e.target.value)}
            className="w-full slider"
          />
        </div>

        {/* Meta Options */}
        <div className="flex flex-col items-center text-xs mt-10">
          {["wifi", "breakfast", "parking", "pets"].map((key) => (
            <label
              key={key}
              className="flex justify-between items-center w-40 mb-4 cursor-pointer"
            >
              <span className="tracking-wide">{key}</span>
              <input
                type="checkbox"
                checked={localFilters[key]}
                onChange={() => toggle(key)}
                className="w-5 h-5 shrink-0 border border-[#7A92A7] rounded-none appearance-none checked:border-[#7A92A7] checked:bg-[#7A92A7] focus:outline-none"
              />
            </label>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="mt-10 mb-6 text-center">
          <label className="block mb-2 text-xs">sort by</label>
          <select
            value={localFilters.sort}
            onChange={(e) => handleChange("sort", e.target.value)}
            className="w-full bg-transparent border border-[#7A92A7]/30 p-2 text-xs focus:outline-none"
          >
            <option value="none">none</option>
            <option value="price-asc">price: low to high</option>
            <option value="price-desc">price: high to low</option>
          </select>
        </div>

        {/* Apply */}
        <button
          onClick={() => onApply(localFilters)}
          className="mt-10 block mx-auto text-xs hover:underline"
        >
          apply
        </button>
      </div>
    </div>
  );
}
