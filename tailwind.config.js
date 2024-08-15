const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", 
		"./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      fontFamily:  {
        display: ["Edu VIC WA NT Beginner", ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [],
}

