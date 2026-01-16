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
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e3a5f',
          900: '#0f172a',
          950: '#0a1628',
        },
        terminal: {
          bg: '#0a1628',
          card: '#0f1f36',
          border: '#1e3a5f',
          text: '#e2e8f0',
          muted: '#94a3b8',
        }
      },
    },
  },
  plugins: [],
}
