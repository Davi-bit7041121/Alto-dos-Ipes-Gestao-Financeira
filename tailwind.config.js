/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2a9d69',
          light: '#3bb87f',
          dark: '#1e7a4f',
          50: '#e8f7f0',
          100: '#d1f0e1',
          200: '#a3e1c3',
          300: '#75d2a5',
          400: '#47c387',
          500: '#2a9d69',
          600: '#1e7a4f',
          700: '#165838',
        },
      },
    },
  },
  plugins: [],
}
