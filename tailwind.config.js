/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Untuk warna
      colors: {
        background: '#f6f6f6', //Untuk background 
        color_primary: '#297BFF',
        color_black_200: '#666C77',
        white: '#ffffff',
      },

      //Untuk space
      spacing: {
        '20px': '20px',
        '8xl': '80px',
      },

      //Font
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans']
      }
    },
  },
  plugins: [],
};

