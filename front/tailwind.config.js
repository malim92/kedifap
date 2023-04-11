/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kedifapgreen': {
          100: '#c3d9c7',
          200: '#94bb9b',
          300: '#82b68d',
          400: '#719e7b'
        },
        'kedifapred': {
          700: '#931a1d'
        }
      },
      boxShadow: {
        'top': ' 0px -4px 1px 0px rgba(113,158,62,0.75)'
      }
    },
    container: {
      center: true,
    },
  },
  plugins: [],
}
