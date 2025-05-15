// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      keyframes: {
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
        fadeInSlow: "fadeInSlow 0.5s ease-out forwards",
        spinGlobe: "spinGlobe 180s linear infinite", 
      },
    },
  },
  plugins: [],
};
