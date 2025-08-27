/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/*.js",
    "./css/*.css"
  ],
  safelist: [
    'primary',
    'secondary', 
    'main',
    'accent',
    'display',
    'float',
    'float-small'
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Caprasimo', 'serif'],
        'sans': ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#72473e',
        secondary: '#f2ebdb',
        main: '#374233',
        accent: '#72473e',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-small': 'float 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.6' },
          '25%': { transform: 'translateY(-15px) rotate(2deg)', opacity: '0.8' },
          '50%': { transform: 'translateY(-25px) rotate(0deg)', opacity: '1' },
          '75%': { transform: 'translateY(-15px) rotate(-2deg)', opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
