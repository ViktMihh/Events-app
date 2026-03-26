/* eslint-disable quotes */
module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue'] },
  darkMode: false, // or 'media' or 'class'
  important: true,
  corePlugins: {
    preflight: false,
  },
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'corporate-dark': '#1890ff',
        'corporate-light': '#9ABBE6',
        'light-blue': '#ebf5ff',
      },
      gridTemplateColumns: {
        // eslint-disable-next-line quote-props
        'full': '0.3fr 6fr auto 0.75fr',
        // eslint-disable-next-line quote-props
        'small': '0.75fr 490px 2fr 2fr 1.25fr 1fr',
      },
    },
    screens: {
      '2xl': {'max': '1535px'},
      // => @media (max-width: 1535px) { ... }

      'xl': {'max': '1279px'},
      // => @media (max-width: 1279px) { ... }

      'lg': {'max': '1023px'},
      // => @media (max-width: 1023px) { ... }

      'md': {'max': '767px'},
      // => @media (max-width: 767px) { ... }

      'sm': {'max': '639px'},
      // => @media (max-width: 639px) { ... }
    },
  },
};
