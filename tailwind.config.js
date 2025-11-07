/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#3498DB",
        secondary: "#2ECC71",
        background: "#F8F9FA",
        textPrimary: "#2C3E50",
        textSecondary: "#7F8C8D",
        borderPrimary: "#CDD5E0",
        buttonBackground: "#516BF4"
      }
    },
  },
  plugins: [],
}