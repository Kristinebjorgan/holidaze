import React, { useState } from "react";
import Globe3D from "../components/Globe3D";

export default function GlobeLanding() {
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const handleCountryClick = (country) => {
    console.log("Clicked:", country);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#fefefe] text-[#7A92A7]">
      <Globe3D
        onCountryHover={setHoveredCountry}
        onCountryClick={handleCountryClick}
      />

      <p className="text-xs mt-6 lowercase opacity-70 absolute bottom-6">
        explore
      </p>

      {hoveredCountry && (
        <div className="absolute bottom-16 bg-white/80 backdrop-blur p-4 rounded-md text-sm shadow">
          <h4 className="font-semibold capitalize">{hoveredCountry}</h4>
        </div>
      )}
    </div>
  );
}
