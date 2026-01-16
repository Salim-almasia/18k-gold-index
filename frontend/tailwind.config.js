/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#faf8f3',
          100: '#f5f0e1',
          200: '#e8dfc0',
          300: '#dbc99a',
          400: '#C9A961',
          500: '#b89850',
          600: '#a08040',
          700: '#7d6432',
          800: '#5f4c28',
          900: '#403320',
        },
        forest: {
          700: '#2d4a3e',
          800: '#243b32',
          900: '#1d3029',
        },
        terminal: {
          bg: '#0d1117',
          card: '#161b22',
          border: '#30363d',
          text: '#c9d1d9',
          muted: '#8b949e',
        }
      },
    },
  },
  plugins: [],
}
