/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}", // Add src if you have it
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        SfPro: ["SfPro", "sans-serif"],
        SfProBold: ["SfProBold", "sans-serif"],
        SfProMedium: ["SfProMedium", "sans-serif"],
        SfProSemibold: ["SfProSemibold", "sans-serif"],
      },
      colors: {
        background: "#F3F3F3",
        foreground: "#F8F8F8",
        primary: { DEFAULT: "#000000", accent: "#EBE2FF", text: "#0F0F0F" },
        neutral: {
          accent: "#C8C8C8",
        },
        secondary: {
          DEFAULT: "#9E76F8",
          text: "#6F6D6D",
        },
      },
    },
  },
  plugins: [],
  // Add web-specific configuration
  corePlugins: {
    // Ensure these are enabled for web
    preflight: true,
  },
};
