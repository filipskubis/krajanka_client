/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  darkMode: "class",
  theme: {
    colors: {
      white: "#FFFFFF",
      yellow: "#FAEEFF",
      orange: "#f4976c",
      darkBlue: "#303c6c",
      blue: "#B4DFE5",
      lightBlue: "#D2FDFF",
      coral: "#f28a72",
      slate: "#6b7a8f",
    },
    extend: {
      boxShadow: {
        "inner-strong": "inset 0 0 4px rgba(0, 0, 0, 0.2)",
      },
      screens: {
        tablet: "600px",
      },
    },
  },
  plugins: [],
};
