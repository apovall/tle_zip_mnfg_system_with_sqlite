/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      "zip-light": "#2DB5B4",
      "zip-dark": "#1986A4",
      "white": "#FFFFFF",
      "cancel": "#C34A4A",
      "disabled": "#D9D9D9",
      "main": "#3D3D3D",
      "medium-gray": "#AFAFAF",
      "orange": "#FFC700",
      "lime": "#E9EC49",
      "acceptable-green": "#35B942",
      "black": "#000000",
      "table-highlight": "#F5F5F5",

    },
    extend: {
      fontFamily: {
        jost: ["Jost"], 
        roboto: ["Roboto"], 
      }
    },
  },
  plugins: [],
}
