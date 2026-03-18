/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#fff5f5',
          100: '#ffe3e3',
          200: '#ffcdcd',
          300: '#ffaaaa',
          400: '#ff7e7e',
          500: '#ef2b2b',
          600: '#d81e1e',
          700: '#b51616',
          800: '#941414',
          900: '#7a1515',
          950: '#5c0d0d',
        },
      },
    },
  },
  plugins: [],
}