const preset = require('../../packages/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [preset],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/components/src/**/*.{js,ts,jsx,tsx}',
  ],
};
