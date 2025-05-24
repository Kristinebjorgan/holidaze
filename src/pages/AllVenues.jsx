import { useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import VenueCard from "../components/venues/VenueCard";
import FilterModal from "../components/modals/FilterModal";
import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "../config";
import { Link, useLocation } from "react-router-dom";
import VenueSkeleton from "../components/VenueSkeleton";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

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
  const [allFetchedVenues, setAllFetchedVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const loadMoreRef = useRef(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCountry = queryParams.get("country");
  const searchQuery = queryParams.get("search");

  useEffect(() => {
    let isCancelled = false;

async function fetchAllKribjiVenues() {
  let all = [];
  let currentPage = 1;
  let keepGoing = true;
  const lowerSearch = searchQuery?.toLowerCase() || "";

  try {
    while (keepGoing) {
      const res = await fetch(
        `${NOROFF_API_BASE_URL}/holidaze/venues?limit=100&page=${currentPage}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Noroff-API-Key": NOROFF_API_KEY,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.[0]?.message || "Fetch failed");

      const kribjiTagged = data.data.filter((venue) =>
        venue.description?.toLowerCase().includes("[kribji-v2]")
      );

      all = [...all, ...kribjiTagged];
      keepGoing = !data.meta?.isLastPage;
      currentPage++;
    }

    if (!isCancelled) {
      const countryFiltered = selectedCountry
        ? all.filter(
            (venue) =>
              venue.location?.country?.toLowerCase() ===
              selectedCountry.toLowerCase()
          )
        : all;

      const searchFiltered = lowerSearch
        ? countryFiltered.filter((venue) =>
            [
              venue.name,
              venue.description,
              venue.location?.address,
              venue.location?.city,
              venue.location?.country,
            ]
              .join(" ")
              .toLowerCase()
              .includes(lowerSearch)
          )
        : countryFiltered;

      setAllFetchedVenues(searchFiltered);

      const filtered = searchFiltered.filter((venue) => {
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
    }
  } catch (err) {
    console.error("Error fetching venues:", err);
    setError(err.message);
  } finally {
    if (!isCancelled) setLoading(false);
  }
}

    setLoading(true);
    fetchAllKribjiVenues();
    return () => {
      isCancelled = true;
    };
  }, [location.search]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollRange = 1200;
  const baseWidth = 1280;
  const maxWidth = 1920;
  const baseMargin = 8;
  const minMargin = 0;
  const baseScale = 1;
  const maxScale = 1.0;
  const clampedScroll = Math.min(scrollY, scrollRange);
  const containerWidth =
    baseWidth + (clampedScroll / scrollRange) * (maxWidth - baseWidth);
  const cardMargin =
    baseMargin - (clampedScroll / scrollRange) * (baseMargin - minMargin);
  const cardScale =
    baseScale + (clampedScroll / scrollRange) * (maxScale - baseScale);

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

  return (
    <section
      style={{
        maxWidth: containerWidth,
        transition: "max-width 1.2s ease-out",
      }}
      className="w-full mx-auto mt-8 px-0"
    >
      <style>
        {`
          .masonry-column {
            padding-left: 0 !important;
          }
          .masonry-column > div {
            margin: 0 !important;
          }
        `}
      </style>

      <div className="flex justify-start mb-6">
        <button
          onClick={() => setShowFilterModal(true)}
          className="text-sm tracking-wide25 hover:underline text-[#7A92A7] lowercase"
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
        className="flex w-full"
        columnClassName="masonry-column"
      >
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="transition-transform duration-700 ease-out"
                style={{
                  transform: `scale(${cardScale})`,
                  margin: `${cardMargin}px`,
                }}
              >
                <VenueSkeleton />
              </div>
            ))
          : filteredVenues.map((venue) => (
              <div
                key={venue.id}
                className="transition-transform duration-700 ease-out"
                style={{
                  transform: `scale(${cardScale})`,
                  margin: `${cardMargin}px`,
                }}
              >
                <VenueCard venue={venue} />
              </div>
            ))}
      </Masonry>

      {hasMore && (
        <div
          ref={loadMoreRef}
          className="h-10 flex justify-center items-center"
        >
          {loading && (
            <span className="text-xs text-[#7A92A7]/60 lowercase animate-pulse">
              loading venues
            </span>
          )}
        </div>
      )}

      <div className="flex justify-center mt-12">
        <Link to="/globe" title="View globe">
          <GlobeAltIcon className="w-6 h-6 text-[#7A92A7] hover:opacity-80 transition" />
        </Link>
      </div>

      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-white/70 text-[#7A92A7] px-3 py-1 text-xs lowercase hover:opacity-90 transition z-50"
        >
          top
        </button>
      )}
    </section>
  );
}
