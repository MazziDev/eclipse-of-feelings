/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        night: '#040510',
        midnight: '#0a1030',
        moonlight: '#c8d3ff',
        eclipse: '#5b3c76',
      },
      boxShadow: {
        glow: '0 0 40px 10px rgba(155, 153, 255, 0.35)',
      },
    },
  },
  plugins: [],
}
