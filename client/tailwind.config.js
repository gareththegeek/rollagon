module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'transparent': 'transparent',
      'black': 'var(--colour-text)',
      'teal': 'var(--colour-accent)',
      'grey': {
        100: 'var(--colour-background)',
        200: 'var(--colour-button-hover)',
        DEFAULT: 'var(--colour-heading-background)',
        300: 'var(--colour-button)',
        500: 'var(--colour-disabled)'
      }
    },
    fontSize: {
      'xs': 'var(--font-size-xs)',
      'sm': 'var(--font-size-sm)',
      'base': 'var(--font-size-base)',
      'xl': 'var(--font-size-xl)',
      '2xl': 'var(--font-size-2xl)',
      '4xl': 'var(--font-size-4xl)'
    },
    letterSpacing: {
      'tight': 'var(--letter-spacing-tight)',
      'normal': 'var(--letter-spacing-normal)'
    },
    lineHeight: {
      'none': 'var(--line-height-none)',
      'tight': 'var(--line-height-tight)',
      'normal': 'var(--line-height-normal)'
    },
    extend: {
      fontFamily: {
        'calluna': 'var(--font-body)',
        'trajan': 'var(--font-heading)'
      }
    },
  },
  plugins: [],
}
