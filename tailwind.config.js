module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.{js,ts,vue}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-yellow': '#FED801',
        'custom-gray': '#E5E5E5',
        'custom-gray-text': '#7A7A7A',
      },
      boxShadow: {
        'custom-shadow': '0px 3px 4px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        google: ['Noto Sans TC', 'sans-serif'],
      },
      letterSpacing: {
        'custom-spacing': '0.88em',
      },
      fontSize: {
        'custom-size': '16px',
      },
      lineHeight: {
        'custom-height': '19px',
      },
    },
  },
  plugins: [],
};
