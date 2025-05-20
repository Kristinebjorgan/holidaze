import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "../config";
import ImageCarousel from "../components/ImageCarousel";
import { getReviewsForVenue } from "../components/useReview"; // Adjust path if needed

export default function VenueDetails() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState({
    dateFrom: "",
    dateTo: "",
    guests: 1,
  });
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingError, setBookingError] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCountry = queryParams.get("country");

  const amenityLabels = {
    wifi: "Wi-Fi",
    breakfast: "Breakfast",
    parking: "Parking",
    pets: "Pets allowed",
    pool: "Pool",
    sauna: "Sauna",
    bathtub: "Bathtub",
    seaview: "Sea view",
    fireplace: "Fireplace",
    airConditioning: "Air conditioning",
    balcony: "Balcony",
    garden: "Garden",
  };

  useEffect(() => {
    (async () => {
      try {
        const venueRes = await fetch(
          `${NOROFF_API_BASE_URL}/holidaze/venues/${id}`,
          {
            headers: { "X-Noroff-API-Key": NOROFF_API_KEY },
          }
        );
        const venueData = await venueRes.json();
        if (!venueRes.ok)
          throw new Error(
            venueData.errors?.[0]?.message || "Failed to load venue"
          );
        setVenue(venueData.data);

        // Load local reviews
        const venueReviews = getReviewsForVenue(id);
        const sorted = venueReviews.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setReviews(sorted);
      } catch (err) {
        console.error("Error loading venue or reviews:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError("");
    setBookingSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setBookingError("Please log in to book.");
      return;
    }

    const formatToISO = (dateStr) => new Date(dateStr).toISOString();

    const payload = {
      venueId: id,
      dateFrom: formatToISO(booking.dateFrom),
      dateTo: formatToISO(booking.dateTo),
      guests: booking.guests,
    };

    try {
      const res = await fetch(`${NOROFF_API_BASE_URL}/holidaze/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": NOROFF_API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.errors?.[0]?.message || "Booking failed.");

      setBookingSuccess("Booking successful!");
      setBooking({ dateFrom: "", dateTo: "", guests: 1 });
    } catch (err) {
      console.error("Booking error:", err);
      setBookingError(err.message);
    }
  };

  if (loading) return <p className="text-center py-8">Loading venue...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;
  if (!venue) return <p className="text-center py-8">Venue not found.</p>;

  const firstThreeImages = venue.media?.slice(0, 3) || [];
  const remainingImages = venue.media?.slice(3) || [];

  return (
    <section className="max-w-4xl mx-auto px-4 py-10 text-[#7A92A7] lowercase tracking-wide text-center">
      {/* Breadcrumb */}
      <div className="text-left text-xs mb-6 text-[#7A92A7] lowercase">
        <Link to="/venues" className="hover:underline">
          all venues
        </Link>
        {selectedCountry && (
          <>
            {" / "}
            <Link
              to={`/venues?country=${encodeURIComponent(selectedCountry)}`}
              className="hover:underline"
            >
              {selectedCountry.toLowerCase()}
            </Link>
          </>
        )}
        {" / "}
        {venue.name?.toLowerCase()}
      </div>

      {/* Hero Image */}
      {firstThreeImages[0] && (
        <img
          src={firstThreeImages[0].url}
          alt={firstThreeImages[0].alt || "venue hero image"}
          className="w-full h-[400px] object-cover mb-6"
        />
      )}

      {/* Title + Location */}
      <h1 className="text-xl font-light mb-1">{venue.name}</h1>
      <p className="text-xs mb-6">
        {venue.location?.address}, {venue.location?.country}
      </p>

      {/* Description */}
      <p className="whitespace-pre-line text-sm leading-relaxed mb-8 max-w-prose mx-auto">
        {venue.description}
      </p>

      {/* Second Image */}
      {firstThreeImages[1] && (
        <img
          src={firstThreeImages[1].url}
          alt={firstThreeImages[1].alt || "venue image"}
          className="w-full h-[400px] object-cover mb-10"
        />
      )}

      {/* Latest Review */}
      {reviews.length > 0 ? (
        <div className="mb-10 text-sm italic text-slate-500 lowercase">
          “{reviews[0].quote || reviews[0].text?.slice(0, 100)}”
          <div className="text-xs text-slate-400 mt-1">
            – {new Date(reviews[0].date).toLocaleDateString("en-GB")}
          </div>
        </div>
      ) : (
        <div className="mb-10 text-sm italic text-slate-400 lowercase">
          no reviews yet
        </div>
      )}

      {/* Amenities */}
      <div className="grid grid-cols-2 gap-y-4 text-sm mb-10 mx-auto w-max">
        {Object.entries(amenityLabels).map(([key, label]) => (
          <React.Fragment key={key}>
            <span>{label.toLowerCase()}</span>
            <span>{venue.meta?.[key] ? "yes" : "no"}</span>
          </React.Fragment>
        ))}
      </div>

      {/* Third Image */}
      {firstThreeImages[2] && (
        <img
          src={firstThreeImages[2].url}
          alt={firstThreeImages[2].alt || "venue image"}
          className="w-full h-[400px] object-cover mb-10"
        />
      )}

      {/* Carousel */}
      {remainingImages.length > 0 && <ImageCarousel images={remainingImages} />}

      {/* Booking Form */}
      <div className="bg-white/80 backdrop-blur-md border border-[#7A92A7]/20 p-6 mt-10 max-w-md mx-auto text-sm">
        <h3 className="text-md mb-4">book this venue</h3>
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="date"
              value={booking.dateFrom}
              onChange={(e) =>
                setBooking({ ...booking, dateFrom: e.target.value })
              }
              className="flex-1 p-2 border border-[#7A92A7]/30 bg-transparent text-sm text-center"
              required
            />
            <input
              type="date"
              value={booking.dateTo}
              onChange={(e) =>
                setBooking({ ...booking, dateTo: e.target.value })
              }
              className="flex-1 p-2 border border-[#7A92A7]/30 bg-transparent text-sm text-center"
              required
            />
          </div>

          <input
            type="number"
            min={1}
            max={venue.maxGuests}
            value={booking.guests}
            onChange={(e) =>
              setBooking({ ...booking, guests: +e.target.value })
            }
            className="w-full p-2 border border-[#7A92A7]/30 bg-transparent text-sm text-center"
            required
          />

          <button
            type="submit"
            className="text-xs hover:underline hover:opacity-80"
          >
            book
          </button>

          {bookingSuccess && (
            <p className="text-green-600 text-xs mt-2">{bookingSuccess}</p>
          )}
          {bookingError && (
            <p className="text-red-600 text-xs mt-2">{bookingError}</p>
          )}
        </form>
      </div>
    </section>
  );
}
