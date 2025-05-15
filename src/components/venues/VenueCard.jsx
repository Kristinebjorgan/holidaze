import { Link } from "react-router-dom";

export default function VenueCard({ venue, heightClass }) {
  return (
    <Link
      to={`/venues/${venue.id}`}
      className={`relative block w-full ${heightClass || ""}`}
    >
      {venue.location?.country && (
        <span className="absolute bottom-2 left-2 bg-white/40 backdrop-blur-sm text-[10px] px-2 py-0.5 uppercase text-white font-light tracking-wider z-10">
          {venue.location.country}
        </span>
      )}

      <div className="w-full h-full overflow-hidden">
        <img
          src={venue.media?.[0]?.url}
          alt={venue.media?.[0]?.alt || venue.name}
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
        />
      </div>
    </Link>
  );
}
