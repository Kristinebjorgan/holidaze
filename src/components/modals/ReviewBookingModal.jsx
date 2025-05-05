// src/components/modals/ReviewBookingModal.jsx
import { useEffect, useRef, useState } from "react";

export default function ReviewBookingModal({ booking, onClose, onReviewed }) {
  const [review, setReview] = useState("");
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

    // Placeholder for future POST request
    console.log("Review submitted for venue:", booking.venue?.name);
    console.log("Review:", review);

    setSubmitted(true);
    setTimeout(() => {
      onReviewed?.(); // Trigger reload if needed
      onClose(); // Close the modal
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 bg-[#fefefe]/60 backdrop-blur-sm z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="bg-[#fefefe]/90 backdrop-blur-md p-6 w-full max-w-md text-[#7A92A7] text-sm lowercase relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl hover:underline"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-sm mb-4">
          leave a review for {booking.venue?.name}
        </h2>

        {submitted ? (
          <p className="text-xs text-center mt-4">thank you for your review</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="write your review"
              rows={4}
              className="w-full bg-transparent border-b p-2 outline-none"
              required
            />
            <button
              type="submit"
              className="text-sm hover:underline block mx-auto"
            >
              submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
