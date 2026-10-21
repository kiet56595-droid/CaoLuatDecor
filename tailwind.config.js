/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          50: '#FBF9F6',
          100: '#F5EFE6',
          200: '#E7DCce',
          300: '#D5C3AF',
          400: '#9C7855',
          500: '#654329', // Main brand wood
          600: '#533722',
          700: '#432C1B',
          800: '#322114',
          900: '#21160D',
        },
        cream: {
          50: '#FCFBF9',
          100: '#FAF8F5',
          200: '#F7F3ED', // Main brand cream
          300: '#EFE8DC',
          400: '#E5D8C5',
          500: '#D8C5AB',
        },
        charcoal: {
          50: '#F5F4F3',
          100: '#E5E3E0',
          200: '#C7C3BD',
          300: '#9E978F',
          400: '#6E665E',
          500: '#473E37',
          600: '#3A322C',
          700: '#29231F', // Main brand text
          800: '#1D1916',
          900: '#120F0D',
        },
        gold: {
          DEFAULT: '#C5A880',
          light: '#DFC7A7',
          dark: '#A68457',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(41, 35, 31, 0.08)',
        'card': '0 4px 20px -2px rgba(41, 35, 31, 0.06)',
        'elevated': '0 20px 40px -15px rgba(41, 35, 31, 0.15)',
      }
    },
  },
  plugins: [],
}
