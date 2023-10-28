module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'transparent': 'transparent',
      'black': 'var(--colour-black)',
      'white': 'var(--colour-white)',
      'teal': 'var(--colour-teal)',
      'grey': {
        100: 'var(--colour-grey-100)',
        200: 'var(--colour-grey-200)',
        DEFAULT: 'var(--colour-grey-default)',
        300: 'var(--colour-grey-300)',
        400: 'var(--colour-grey-400)',
        500: 'var(--colour-grey-500)'
      }
    },
    spacing: {
      '0': '0',
      '0.5': '0.1rem', /* 2px */
      '1': '0.2rem', /* 4px */
      '1.5': '0.3rem', /* 6px */
      '2': '0.4rem', /* 8px */
      '2.5': '0.5rem', /* 10px */
      '3': '0.6rem', /* 12px */
      '3.5': '0.7rem', /* 14px */
      '4': '0.8rem', /* 16px */
      '5': '1rem', /* 20px */
      '6': '1.2rem', /* 24px */
      '7': '1.4rem', /* 28px */
      '8': '1.6rem', /* 32px */
      '9': '1.8rem', /* 36px */
      '10': '2rem', /* 40px */
      '11': '2.2rem', /* 44px */
      '12': '2.4rem', /* 48px */
      '14': '2.8rem', /* 56px */
      '16': '3.2rem', /* 64px */
      '20': '4rem', /* 80px */
      '24': '4.8rem', /* 96px */
      '28': '5.6rem', /* 112px */
      '32': '6.4rem', /* 128px */
      '36': '7.2rem', /* 144px */
      '40': '8rem', /* 160px */
      '44': '8.8rem', /* 176px */
      '48': '9.6rem', /* 192px */
      '52': '10.4rem', /* 208px */
      '56': '11.2rem', /* 224px */
      '60': '12rem', /* 240px */
      '64': '12.8rem', /* 256px */
      '72': '14.4rem', /* 288px */
      '80': '16rem', /* 320px */
      '96': '19.2rem' /* 384px */
    },
    fontSize: {
      'xs': '0.8rem',
      'sm': '0.9rem',
      'base': '1rem',
      'xl': '1.6rem',
      '2xl': '2rem',
      '4xl': '3.2rem'
    },
    letterSpacing: {
      'tight': '-0.02em',
      'normal': '0em'
    },
    lineHeight: {
      'none': '1',
      'tight': '1.2',
      'normal': '1.5'
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
