/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './Frontend/templates/**/*.html',
    './Frontend/static/js/**/*.js',
    './node_modules/flowbite/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#06402B', // Explicit dark green
        'secondary-green': '#388E3C', // A slightly lighter green
        'accent-green': '#66BB6A', // A brighter green for accents
        'earth-brown': '#8B4513', // Earthy tone
        'light-gray': '#F5F5F5', // Lighter gray
        'cta-orange': '#FF8C00', // A vibrant orange for CTAs
        'forest-green': '#012d18', // New custom color
        'accent-dark-green': '#014421', // New custom color
        'wheat-gold': '#DAA520', // New custom color
        'soft-cream': '#F8F8F5', // New custom color
        'gold': '#DAA520', // Adding 'gold' alias for clarity
        'cream': '#F5F5DC', // Adding 'cream'
        'dark-green': '#012d18', // Adding 'dark-green' alias for clarity
      },
      fontFamily: {
        'sans': ['Montserrat', 'sans-serif'],
        'body': ['Lato', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'], // New custom font
      }
    }
  },
  plugins: [
      require('flowbite/plugin')
  ],
}