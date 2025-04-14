// src/components/VenueCard.jsx
export default function VenueCard({ venue, heightClass }) {
  return (
    <div className={`bg-white ${heightClass} overflow-hidden`}>
      <img
        src={venue.media[0]?.url}
        alt={venue.media[0]?.alt || venue.name}
        className="w-full h-full object-cover transform transition duration-200 hover:scale-105"
      />
      {/* 
        Optionally, you can add a subtle overlay for details,
        for example:
        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-40 text-white p-2 text-sm">
          {venue.name}
        </div>
      */}
    </div>
  );
}
