import { navbar, nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./layout/**/*.{js,ts,jsx,tsx,mdx}",
    "./screens/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      container: "1280px",
      xl: { max: "1279px" },
      lg: { max: "900px" },
      md: { max: "768px" },
      sm: { max: "640px" },
      xs: { max: "440px" },
      ls: { max: "320px" },
    },
    extend: {
      colors: {
        grayRoot: "#333333",
        blackRoot: "#252525",
        milk: "#FDFFF5",
        lightGray: "#4d4d4d",
      },
      backgroundImage: {},
    },
  },
  plugins: [nextui()],
};
