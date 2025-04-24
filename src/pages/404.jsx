// src/pages/404.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white/60 backdrop-blur-sm text-[#7A92A7] px-4">
      <div className="text-center bg-white/80 p-10 rounded-xl shadow-lg max-w-md">
        <h1 className="text-5xl font-bold mb-4 text-[#D94C4C]">404</h1>
        <p className="text-md mb-6">
          Sorry, the page you’re looking for doesn’t exist.
        </p>
        <Link to="/" className="underline text-sm text-blue-600">
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
