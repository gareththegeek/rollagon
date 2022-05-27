module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'transparent': 'transparent',
      'black': '#001819',
      'white': '#e5e5e5',
      'teal': '#026469',
      'grey': {
        100: '#f5f7f7',
        200: '#dbe5e5',
        DEFAULT: '#cad8dc',
        300: '#cad8dc',
        400: '#a7c3c3',
        500: '#8eb2b2'
      }
    },
    extend: {
      fontFamily: {
        'calluna': ['calluna'],
        'trajan': ['trajan-pro-3', 'serif']
      }
    },
  },
  plugins: [],
}
