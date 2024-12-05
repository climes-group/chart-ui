/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "linen-bkg": "#F0EFE3",
        "golden-accent": "#E2B046",
        "moss-primary": "#345800",
      },
      backgroundImage: {
        "intake-bg": "url('/images/daniel-gonzalez-KeiUIl9Lzo4-unsplash.jpg')",
      },
    },
  },
  plugins: [],
};
