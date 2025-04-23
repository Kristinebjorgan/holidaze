// src/components/VenueCard.jsx
import { Link } from "react-router-dom";

export default function VenueCard({ venue, heightClass }) {
  return (
    <Link
      to={`/venues/${venue.id}`}
      className={`block bg-white ${heightClass} overflow-hidden`}
    >
      <img
        src={venue.media[0]?.url}
        alt={venue.media[0]?.alt || venue.name}
        className="w-full h-full object-cover transform transition duration-200 hover:scale-105"
      />
    </Link>
  );
}
