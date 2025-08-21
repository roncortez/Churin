/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
        fontFamily: {
          anton: ["Anton", "sans-serif"],
          raleway: ["Raleway", "sans-serif"],
          paytone: ['"Paytone One"', 'sans-serif'],
          comfortaa: ['Comfortaa', 'cursive']
        }
    },
   
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
}

