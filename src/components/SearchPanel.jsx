import { useState } from "react";

const CONTINENTS = [
  "Europe",
  "Asia",
  "Australia",
  "Africa",
  "North America",
  "South America",
];

export default function SearchPanel({ onClose }) {
  const [selectedContinent, setSelectedContinent] = useState("");

  return (
    <div className="fixed inset-0 bg-white/60 backdrop-blur-md z-50 p-6 flex items-center justify-center">
      <div className="bg-white/80 p-6 rounded-xl w-full max-w-3xl shadow-lg text-center text-[#7A92A7]">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl lowercase">search</h2>
          <button
            onClick={onClose}
            className="text-sm text-red-500 hover:underline"
          >
            close
          </button>
        </div>

        <input
          type="text"
          placeholder="search venues..."
          className="w-full p-2 mb-6 border border-gray-300 rounded bg-transparent text-sm text-center"
        />

        <div className="flex flex-wrap justify-center gap-4 text-sm mb-6">
          {CONTINENTS.map((continent) => (
            <button
              key={continent}
              onClick={() => setSelectedContinent(continent)}
              className={`px-3 py-1 rounded hover:bg-slate-200 ${
                selectedContinent === continent ? "bg-slate-300" : ""
              }`}
            >
              {continent.toLowerCase()}
            </button>
          ))}
        </div>

        {selectedContinent && (
          <div className="text-xs italic text-slate-500">
            You selected: <strong>{selectedContinent}</strong>
          </div>
        )}

        {/* Optional: Add country + city filtering here */}
      </div>
    </div>
  );
}
