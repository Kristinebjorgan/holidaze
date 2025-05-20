import { useEffect, useRef, useState } from "react";
import { addReviewToVenue } from "../../components/useReview";

export default function ReviewBookingModal({ booking, onClose, onReviewed }) {
  const [review, setReview] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(3);
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!review.trim()) return;

    addReviewToVenue(booking.venue.id, {
      rating,
      text: review,
      quote: quote.trim(),
      date: new Date().toISOString(),
    });

    setSubmitted(true);
    setTimeout(() => {
      onReviewed?.();
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white/40 backdrop-blur-sm flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white/80 border border-[#7A92A7]/20 text-[#7A92A7] w-full max-w-md p-8 text-sm lowercase tracking-wide relative"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-xl leading-none hover:underline"
          aria-label="Close review modal"
        >
          ×
        </button>

        <h2 className="text-sm mb-6 text-center">
          leave a review for {booking.venue?.name}
        </h2>

        {submitted ? (
          <p className="text-xs text-center mt-4">thank you for your review</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Rating slider */}
            <div className="text-center">
              <div className="flex justify-between text-xs mb-1">
                <span>
                  {rating} star{rating > 1 ? "s" : ""}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full slider"
              />
            </div>
            {/* review */}
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="review"
              rows={4}
              className="w-full bg-transparent p-2 outline-none"
              required
            />

            {/* Short quote */}
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="final quote"
              className="w-full bg-transparent p-2 outline-none"
            />

            <button
              type="submit"
              className="mt-4 block mx-auto text-xs hover:underline"
            >
              submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
