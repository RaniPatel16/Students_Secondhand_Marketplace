/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0F3A2E",
          primaryHover: "#0A2820",
          primaryLight: "#1B4F40",
          accent: "#C5A059",
          accentHover: "#B38E46",
          accentLight: "#F8F3E8",
          canvas: "#FBF9F5",
          surface: "#FFFFFF",
          border: "#E7E2D6",
          textMain: "#13221C",
          textMuted: "#617169",
        },
      },
    },
  },
  plugins: [],
};
