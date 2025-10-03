/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brutal: {
          black: '#000000',
          white: '#FFFFFF',
          pink: '#FF00FF',
          lime: '#00FF00', 
          yellow: '#FFFF00',
          cyan: '#00FFFF',
          red: '#FF0000',
        }
      },
      fontFamily: {
        'brutal': ['Arial Black', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '8px 8px 0px #000000',
        'brutal-sm': '4px 4px 0px #000000',
        'brutal-lg': '12px 12px 0px #000000',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '6': '6px',
      }
    },
  },
  plugins: [],
}
