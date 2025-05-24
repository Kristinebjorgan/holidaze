import React from "react";
import Globe3D from "../components/Globe3D";
import { useNavigate } from "react-router-dom";

export default function GlobeLanding() {
  const navigate = useNavigate();

  const handleCountryClick = (country) => {
    if (!country) return;
    const formatted = encodeURIComponent(country.toLowerCase());
    navigate(`/venues?country=${formatted}`);
  };

  const handleExploreClick = () => {
    navigate("/venues");
  };

  return (
    <div className="relative w-full h-screen bg-[#fefefe] text-[#7A92A7] overflow-hidden">
      {/* Globe container with responsive sizing */}
      <div className="w-full h-full flex items-center justify-center">
        <Globe3D onCountryClick={handleCountryClick} />
      </div>

      {/* Explore button */}
      <div className="absolute bottom-6 w-full text-center px-4 z-10">
        {" "}
        <button
          onClick={handleExploreClick}
          className="text-xs lowercase opacity-70 hover:opacity-100 transition"
        >
          explore
        </button>
      </div>
    </div>
  );
}
