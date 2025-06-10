/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {},
      colors: {
        red: {
          100: '#FFE0E0',
          200: '#EA2038',
          300: '#D30000',
        },
      
        blue: {
          50: '#E3F2FF',
          100: '#CCE6FF',
          200: '#027FF5',
          300: '#004484',
        },
      
        yellow: {
          100: '#FFECCC',
          200: '#FFC73F',
          300: '#965E00',
        },
      
        green: {
          100: '#CDFFCD',
          200: '#37B16D',
          300: '#007F00',
        },
      
        dark: {
          100: '#4B4B4B',
          200: '#2B2B2B',
          300: '#000000',
        },
        'soft-dark': '#1D1D1D',
      
        light: '#FFFFFF',
        'light-100': "#F6F6F6",
      
        gray: {
          100: '#DADADA',
          200: '#AFAFAF',
          300: '#7B7B7B',
        },
      },
      width:{
        '1259': '1259px',
        '419':'419px',
      },
      height: {
        '823': '823px',
        '102':'102px',
        '410': '410px'
      },
      maxWidth:{
        '600': '600px',
        '695': '695px',
        '410': '410px',
      },
      maxHeight: {
        '410': '410px',
      }
    },
  },
  plugins: [],
}

