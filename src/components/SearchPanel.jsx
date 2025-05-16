import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CONTINENT_COUNTRY_MAP } from "../lib/continentCountryMap";

export default function SearchPanel({ onClose }) {
  const [selectedContinent, setSelectedContinent] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleContinentClick = (continent) => {
    setSelectedContinent(continent);
    setSelectedCountry("");
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/venues?search=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full bg-white/60 backdrop-blur-md border-b border-[#7A92A7]/20 px-6 py-10 text-[#7A92A7] lowercase tracking-wide">
      <div className="flex justify-end mb-4">
        <button onClick={onClose} className="text-sm hover:underline">
          x
        </button>
      </div>

      {/* Search Input */}
      <div className="text-left mb-10 flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="search"
          className="flex-1 bg-transparent border-none border-b border-[#7A92A7]/30 text-sm focus:outline-none text-center"
        />
        <button onClick={handleSearch} className="text-sm hover:underline">
          search
        </button>
      </div>

      {/* Continent Buttons */}
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

      {/* Country Buttons */}
      {selectedContinent && CONTINENT_COUNTRY_MAP[selectedContinent] && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-center">
          {CONTINENT_COUNTRY_MAP[selectedContinent].map((country) => (
            <button
              key={country}
              onClick={() => {
                setSelectedCountry(country);
                navigate(`/venues?country=${encodeURIComponent(country)}`);
                onClose();
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
