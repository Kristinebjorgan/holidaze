import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CONTINENT_COUNTRY_MAP } from "../lib/continentCountryMap"; // Update path if needed

export default function SearchPanel({ onClose }) {
  const [selectedContinent, setSelectedContinent] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const navigate = useNavigate();


  const handleContinentClick = (continent) => {
    setSelectedContinent(continent);
    setSelectedCountry(""); // Reset selected country when switching continent
  };

  return (
    <div className="w-full bg-white/60 backdrop-blur-md border-b border-[#7A92A7]/20 px-6 py-10 text-[#7A92A7] lowercase tracking-wide">
      {/* Close Button */}
      <div className="flex justify-end mb-4">
        <button onClick={onClose} className="text-sm hover:underline">
          x
        </button>
      </div>

      {/* Top Section: Filter Label + Search */}
      <div className="text-left mb-10">
        <input
          type="text"
          placeholder="search"
          className="w-full bg-transparent border-none border-b border-[#7A92A7]/30 text-sm focus:outline-none text-center"
        />
      </div>

      {/* Continent Selection */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-sm text-center mb-10">
        {Object.keys(CONTINENT_COUNTRY_MAP).map((continentKey) => {
          const label = continentKey.replace("-", " ");
          return (
            <button
              key={continentKey}
              onClick={() => handleContinentClick(continentKey)}
              className={`bg-[#dfeaf1] py-6 hover:opacity-90 ${
                selectedContinent === continentKey
                  ? "outline outline-1 outline-[#7A92A7]"
                  : ""
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Country Selection */}
      {selectedContinent && CONTINENT_COUNTRY_MAP[selectedContinent] && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-center">
          {CONTINENT_COUNTRY_MAP[selectedContinent].map((country) => (
            <button
              key={country}
              onClick={() => {
                setSelectedCountry(country);
                navigate(`/venues?country=${encodeURIComponent(country)}`);
              }}
            >
              {country}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
