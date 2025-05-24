import { useState } from "react";

export default function ImageCarousel({ images }) {
  const [current, setCurrent] = useState(0);
  if (!images?.length) return null;

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full mb-10">
      <img
        src={images[current].url}
        alt={images[current].alt || `image ${current + 1}`}
        className="w-full h-[400px] object-cover rounded"
      />

      {/* arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:opacity-75 transition"
        aria-label="Previous image"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:opacity-75 transition"
        aria-label="Next image"
      >
        ›
      </button>

      {/* next */}
      <div className="flex justify-center gap-2 mt-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition ${
              current === index ? "bg-[#7A92A7]" : "bg-gray-300"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
