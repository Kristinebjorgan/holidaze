// src/pages/AllVenues.jsx
import dummyVenues from "../lib/dummyVenues";
import VenueCard from "../components/VenueCard";
import Masonry from "react-masonry-css";

// Define breakpoints for the masonry grid
const breakpointColumnsObj = {
  default: 3,   // 3 columns on large screens by default
  1024: 3,      // 3 columns for screens 1024px and up
  768: 2,       // 2 columns for screens 768px and up
  480: 1        // 1 column for screens 480px and up
};

export default function AllVenues() {
  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-10 max-w-screen-xl mx-auto mt-8">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex -ml-4 w-auto"      // Adjusts left margin for gap compensation
        columnClassName="pl-4"            // Adds left padding to each column
      >
        {dummyVenues.map((venue) => (
          <div key={venue.id} className="mb-4">
            <VenueCard venue={venue} heightClass={venue.heightClass} />
          </div>
        ))}
      </Masonry>
    </section>
  );
}
