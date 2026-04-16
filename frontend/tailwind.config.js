/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          800: '#1a2744',
          900: '#111d36',
          950: '#0a1322',
        },
      },
    },
  },
  plugins: [],
}
