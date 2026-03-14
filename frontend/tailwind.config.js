/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f4f6ff',
          100: '#e7ecff',
          500: '#4361ee',
          600: '#3a0ca3',
          700: '#3f37c9',
          900: '#231942',
        },
        surface: {
          50: '#ffffff',
          100: '#f8f9fa',
          200: '#e9ecef',
          800: '#343a40',
          900: '#212529',
        }
      },
      boxShadow: {
        'bento': '0px 8px 24px rgba(149, 157, 165, 0.1)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      }
    },
  },
  plugins: [],
}
