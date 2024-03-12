/** @type {import('tailwindcss').Config} */

// eslint-disable-next-line
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: 'Roboto Mono, monospace',
    },

    extend: {
      fontSize: {
        huge: ['80rem', { lineHeight: '1' }],
      },

      //       So screen should now no longer be 100 V.H.,
      // but 100 D.V.H
      // which stands for dynamic viewport height units.
      // And so with this, we no longer have the problem
      // that on mobile browsers sometimes the viewport type
      // is not really 100%.
      height: {
        screen: '100dvh',
      },
    },
  },
  plugins: [],
};

/////////////
// https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js
