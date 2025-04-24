// src/pages/About.jsx
export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white/60 backdrop-blur-sm text-[#7A92A7] px-4">
      <div className="bg-white/80 p-8 rounded-xl shadow-lg max-w-xl text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#D94C4C] lowercase">
          about holidaze
        </h1>
        <p className="text-sm leading-relaxed">
          Holidaze is a fictional booking platform built for demonstration
          purposes. Users can browse venues, create listings, and book stays —
          just like a real travel site. This project showcases modern frontend
          development using React, TailwindCSS, and Noroff’s custom API.
        </p>
        <p className="text-sm italic">Built by a frontend developer.</p>
      </div>
    </div>
  );
}
