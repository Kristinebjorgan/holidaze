import { Link } from "react-router-dom";

export default function VenueCard({ venue, heightClass }) {
  return (
    <div className={`relative w-full ${heightClass || ""}`}>
      {/* Country Label - bottom left floating glassmorphic tag */}
      {venue.location?.country && (
        <span className="absolute bottom-2 left-2 bg-white/40 backdrop-blur-sm text-[10px] px-2 py-0.5 uppercase text-white font-light tracking-wider z-10">
          {venue.location.country}
        </span>
      )}

      <Link to={`/venues/${venue.id}`} className="block w-full">
        <div className="w-full h-full overflow-hidden">
          <img
            src={venue.media?.[0]?.url}
            alt={venue.media?.[0]?.alt || venue.name}
            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
          />
        </div>
      </Link>
    </div>
  );
}
