/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#414A4D', hover: '#2D3436', light: '#F0F2F3' },
        secondary: { DEFAULT: '#A8845A', hover: '#8f6e4a', light: '#FFF8F2' },
        tertiary:  { DEFAULT: '#A9B8A8', light: '#F0F5F0' },
        surface:   { DEFAULT: '#FFFFFF', bg: '#F5F6FA', border: '#E5E9EE' },
        ink:       { DEFAULT: '#1A1A2E', muted: '#6B7280', faint: '#9CA3AF' },
        el: {
          primary:   '#1A4D6D',
          secondary: '#546E7A',
          tertiary:  '#00897B',
          neutral:   '#455A64',
          bg:        '#DCE9F0',
          surface:   '#EEF5F9',
          border:    '#B8D0DE',
        },
      },
      borderRadius: {
        card: '12px',
        xl2: '16px',
        xl3: '20px',
      },
      boxShadow: {
        card:  '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
        sidebar: '2px 0 16px rgba(0,0,0,0.12)',
      },
      fontSize: {
        'h1': ['24px', { fontWeight: '600', lineHeight: '1.3' }],
        'h2': ['20px', { fontWeight: '600', lineHeight: '1.35' }],
        'h3': ['16px', { fontWeight: '500', lineHeight: '1.4' }],
        'body': ['14px', { fontWeight: '400', lineHeight: '1.5' }],
        'caption': ['12px', { fontWeight: '400', lineHeight: '1.4', color: '#6B7280' }],
      },
      fontFamily: {
        sans:    ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
        inter:   ['Inter', 'sans-serif'],
      },
      animation: {
        blob: 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          '0%':   { transform: 'translate(0px, 0px) scale(1)' },
          '33%':  { transform: 'translate(30px, -20px) scale(1.1)' },
          '66%':  { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.animation-delay-2000': { 'animation-delay': '2s' },
        '.animation-delay-4000': { 'animation-delay': '4s' },
      })
    },
  ],
}
