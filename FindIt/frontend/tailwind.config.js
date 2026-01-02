/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#000814',
        navy: '#001D3D',
        deepBlue: '#003566',
        golden: '#FFC300',
        sunshine: '#FFD60A',
      },
    },
  },
  plugins: [],
}