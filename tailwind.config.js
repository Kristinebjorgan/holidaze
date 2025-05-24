// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      letterSpacing: {
        wide25: "0.25em",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeInSlow: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        spinGlobe: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(-360deg)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite linear",
        fadeInSlow: "fadeInSlow 0.5s ease-out forwards",
        spinGlobe: "spinGlobe 180s linear infinite",
      },
      maxWidth: {
        "screen-xl": "1280px",
        1400: "1400px",
        1500: "1500px",
        1600: "1600px",
        1700: "1700px",
        1800: "1800px",
      },
    },
  },
  plugins: [],
};
