import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function VenueCard({ venue, heightClass }) {
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();
  const query = location.search;

  return (
    <Link
      to={`/venues/${venue.id}${query}`}
      className={`relative block w-full ${heightClass || ""}`}
    >
      {venue.location?.country && (
        <span className="absolute bottom-2 left-2 bg-white/40 backdrop-blur-sm text-[10px] px-2 py-0.5 uppercase text-white font-light tracking-wider z-10">
          {venue.location.country}
        </span>
      )}

      <div className="w-full h-full relative overflow-hidden">
        {/* placeholder */}
        {!loaded && (
          <div className="absolute inset-0 z-10 bg-white/30 backdrop-blur-md animate-pulse transition-opacity duration-300" />
        )}

        <img
          loading="lazy"
          src={venue.media?.[0]?.url}
          alt={venue.media?.[0]?.alt || venue.name}
          className={`w-full h-full object-cover transition-transform duration-200 hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
        />
      </div>
    </Link>
  );
}
