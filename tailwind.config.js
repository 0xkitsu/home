/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      'sans': [ 'Roboto', 'sans-serif' ],
      'mono': [ 'Roboto Mono', 'monospace' ],
    },
    extend: {
      width: {
        '120': '30rem',
        '128': '32rem',
      }
    },
  },
  plugins: [],
};
