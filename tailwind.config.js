/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f0f4ff',
          100: '#e5edff',
          200: '#cddbfe',
          300: '#a3beff',
          400: '#7597ff',
          500: '#4c6eff',
          600: '#4169e1', // Royal Blue
          700: '#3350c7',
          800: '#2a42a4',
          900: '#263b82',
        },
        primary: '#4ade80', // soft green
        accent: '#4169e1', // royal blue
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
