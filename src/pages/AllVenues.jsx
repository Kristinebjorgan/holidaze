import { useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import VenueCard from "../components/venues/VenueCard";
import FilterModal from "../components/modals/FilterModal";
import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "../config";
import { Link, useLocation } from "react-router-dom";
import VenueSkeleton from "../components/VenueSkeleton";
import { GlobeAltIcon } from "@heroicons/react/24/outline"; // outlined version


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
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState(defaultFilters);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCountry = queryParams.get("country");

  const [allFetchedVenues, setAllFetchedVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false); // 🆕

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${NOROFF_API_BASE_URL}/holidaze/venues?limit=20&page=${page}&sort=created&_bookings=true`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-Noroff-API-Key": NOROFF_API_KEY,
            },
          }
        );

        const data = await res.json();

        console.log("Fetched venues:", data.data);
        console.log("Pagination meta:", data.meta);

        if (!res.ok) {
          throw new Error(
            data.errors?.[0]?.message || "Failed to load venues."
          );
        }

        if (data.meta?.isLastPage) {
          setHasMore(false);
        }

        const kribjiTagged = data.data.filter((venue) =>
          venue.description?.toLowerCase().includes("kribji")
        );

        const filteredByCountry = selectedCountry
          ? kribjiTagged.filter(
              (venue) =>
                venue.location?.country?.toLowerCase() ===
                selectedCountry.toLowerCase()
            )
          : kribjiTagged;

        const merged = [...allFetchedVenues, ...filteredByCountry];
        const uniqueById = Array.from(
          new Map(merged.map((v) => [v.id, v])).values()
        );

        setAllFetchedVenues(uniqueById);

        const filtered = uniqueById.filter((venue) => {
          return (
            venue.price <= activeFilters.price &&
            venue.maxGuests >= activeFilters.guests &&
            (!activeFilters.wifi || venue.meta?.wifi) &&
            (!activeFilters.breakfast || venue.meta?.breakfast) &&
            (!activeFilters.parking || venue.meta?.parking) &&
            (!activeFilters.pets || venue.meta?.pets)
          );
        });

        setFilteredVenues(filtered);
      } catch (err) {
        console.error("Error fetching venues:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [location.search, page]);

  useEffect(() => {
    let timeout;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !timeout) {
          timeout = setTimeout(() => {
            setPage((prev) => prev + 1);
            timeout = null;
          }, 300);
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
      if (timeout) clearTimeout(timeout);
    };
  }, [hasMore, loading]);

  // 🆕 Show scroll-to-top when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function applyFilters(filters) {
    setActiveFilters(filters);
    setShowFilterModal(false);

    const result = allFetchedVenues.filter((venue) => {
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

if (loading && page === 1) {
  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-10 max-w-screen-xl mx-auto mt-8">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4"
      >
        {Array.from({ length: 9 }).map((_, idx) => (
          <VenueSkeleton key={idx} />
        ))}
      </Masonry>
    </section>
  );
}

if (error)
  return <p className="text-center text-red-500 py-8">{error}</p>;

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

    {/* tiny scroll loader */}
    {hasMore && (
      <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
        {loading && (
          <span className="text-xs text-[#7A92A7]/60 lowercase animate-pulse">
            loading more venues...
          </span>
        )}
      </div>
    )}

    {/* globe icon link to homepage */}
    <div className="flex justify-center mt-12">
      <Link to="/globe" title="View globe">
        <GlobeAltIcon className="w-6 h-6 text-[#7A92A7] hover:opacity-80 transition" />
      </Link>
    </div>
    

    {/* scroll-to-top button */}
    {showScrollToTop && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-white/70 backdrop-blur-md text-[#7A92A7] px-3 py-1 text-xs lowercase shadow-md hover:opacity-90 transition z-50"
      >
        to top
      </button>
    )}
  </section>
);
}
