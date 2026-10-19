/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#002B49',
          'navy-light': '#004578',
          'navy-dark': '#001A2C',
          orange: '#E8734A',
          'orange-hover': '#D05C33',
          'orange-light': '#FFF5F0',
        },
        clinical: {
          normal: '#10B981',
          warning: '#F59E0B',
          alert: '#EF4444',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
