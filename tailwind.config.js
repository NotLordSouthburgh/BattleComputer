const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
    colors: {
      ...colors,
      tileboard: '#ab9177',
      tilebackground: '#926d44',
      mainbackground: '#A18D76',
      workbackground: '#776553',
      regionLight: '#ffffff44',
      regionDark: '#919191',
      regionDarkX: '#36271744',
      disabled: '#00000022',
    },
    // colors: {
    // },
  },
  plugins: [],
};
