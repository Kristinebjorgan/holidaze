import React, { useState } from "react";
import GlobeSVG from "../components/GlobeSVG";
import { CONTINENT_COUNTRY_MAP } from "../lib/continentCountryMap";

export default function GlobeLanding() {
  const [hoveredContinent, setHoveredContinent] = useState(null);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#fefefe] text-[#7A92A7]">
      <div className="globe-container w-[80vmin] max-w-[600px] aspect-square animate-spin-slow">
        <GlobeSVG setHoveredContinent={setHoveredContinent} />

      </div>

      <p className="text-xs mt-4 lowercase opacity-70">explore</p>

      {hoveredContinent && (
        <div className="absolute bottom-10 bg-white/80 backdrop-blur p-4 rounded-md text-sm shadow">
          <h4 className="mb-2 font-semibold capitalize">{hoveredContinent}</h4>
          <ul className="grid grid-cols-2 gap-1 text-xs max-h-40 overflow-y-auto">
            {CONTINENT_COUNTRY_MAP[hoveredContinent]?.map((country) => (
              <li key={country}>{country}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
