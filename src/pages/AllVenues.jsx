import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import VenueCard from "../components/venues/VenueCard";
import FilterModal from "../components/modals/FilterModal";
import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "../config";

const breakpointColumnsObj = {
  default: 3,
  1024: 3,
  768: 2,
  480: 1,
};

const defaultFilters = {
  price: 100,
  guests: 1,
  wifi: false,
  breakfast: false,
  parking: false,
  pets: false,
};

export default function AllVenues() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState(defaultFilters);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${NOROFF_API_BASE_URL}/holidaze/venues?limit=100&sort=created&_bookings=true`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-Noroff-API-Key": NOROFF_API_KEY,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.errors?.[0]?.message || "Failed to load venues."
          );
        }

        const kribjiTagged = data.data.filter((venue) =>
          venue.description?.toLowerCase().includes("kribji")
        );

        setVenues(kribjiTagged);
        setFilteredVenues(kribjiTagged);
      } catch (err) {
        console.error("Error fetching venues:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function applyFilters(filters) {
    setActiveFilters(filters);
    setShowFilterModal(false);

    const result = venues.filter((venue) => {
      return (
        venue.price <= filters.price &&
        venue.maxGuests >= filters.guests &&
        (!filters.wifi || venue.meta?.wifi) &&
        (!filters.breakfast || venue.meta?.breakfast) &&
        (!filters.parking || venue.meta?.parking) &&
        (!filters.pets || venue.meta?.pets)
      );
    });

    setFilteredVenues(result);
  }

  if (loading) return <p className="text-center py-8">Loading venues...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;
  if (!filteredVenues.length)
    return <p className="text-center py-8">No venues found.</p>;

  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-10 max-w-screen-xl mx-auto mt-8">
      <div className="flex justify-start mb-6">
        <button
          onClick={() => setShowFilterModal(true)}
          className="text-sm hover:underline text-[#7A92A7] lowercase"
        >
          filter
        </button>
      </div>

      {showFilterModal && (
        <FilterModal
          filters={activeFilters}
          onClose={() => setShowFilterModal(false)}
          onApply={applyFilters}
        />
      )}

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4"
      >
        {filteredVenues.map((venue) => (
          <div key={venue.id} className="mb-4 opacity-0 animate-fadeInSlow">
            <VenueCard venue={venue} />
          </div>
        ))}
      </Masonry>
    </section>
  );
}
