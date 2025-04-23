import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import VenueCard from "../components/venues/VenueCard";
import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "../config";

const breakpointColumnsObj = {
  default: 3,
  1024: 3,
  768: 2,
  480: 1,
};

export default function AllVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        // 🧪 Log all venue names and descriptions
        console.log("API returned:", data.data.length, "venues");
        data.data.forEach((v) => {
          console.log(`[${v.name}] →`, JSON.stringify(v.description));
        });

        // filter for 'kribji' tagged venues
        const filtered = data.data.filter((venue) =>
          venue.description?.toLowerCase().includes("kribji")
        );

        console.log(
          "Descriptions with kribji:",
          filtered.map((v) => v.description)
        );

        console.log(
          "Filtered venues:",
          filtered.map((v) => v.name)
        );
        setVenues(filtered);
      } catch (err) {
        console.error("Error fetching venues:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-center py-8">Loading venues...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;
  if (!venues.length)
    return <p className="text-center py-8">No venues found.</p>;

  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-10 max-w-screen-xl mx-auto mt-8">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4"
      >
        {venues.map((venue) => (
          <div key={venue.id} className="mb-4">
            <VenueCard venue={venue} />
          </div>
        ))}
      </Masonry>
    </section>
  );
}
