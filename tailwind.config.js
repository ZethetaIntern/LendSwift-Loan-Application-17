/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1F4E79',
          light: '#2E6BA3',
          dark: '#153A5B',
        },
        accent: {
          DEFAULT: '#27AE60',
          light: '#3FC978',
        },
        danger: '#E74C3C',
        warning: '#F39C12',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
