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
          primary: "#4A1525",
          primaryHover: "#3B101D",
          primaryLight: "#682035",
          accent: "#E0876A",
          accentHover: "#D27354",
          accentLight: "#FDECE7",
          canvas: "#FAF7F5",
          surface: "#FFFFFF",
          border: "#E8DFDC",
          textMain: "#24181B",
          textMuted: "#6E5D61",
        },
      },
    },
  },
  plugins: [],
};
