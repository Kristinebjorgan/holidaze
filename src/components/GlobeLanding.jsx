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
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#fefefe] text-[#7A92A7]">
      <Globe3D onCountryClick={handleCountryClick} />

      <button
        onClick={handleExploreClick}
        className="text-xs mt-6 lowercase opacity-70 absolute bottom-6"
      >
        explore
      </button>
    </div>
  );
}
