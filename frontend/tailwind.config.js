/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      borderWidth: {
        1.5: "1.5px",
      },
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    fontSize: {
      "title-1": ["32px", "40px"],
      "title-1-mobile": ["28px", "32px"],
      "title-2": ["16px", "21px"],
      "body-1": ["14px", "16px"],
      "body-2": ["11px", "16px"],
    },
    fontWeight: {
      book: 450,
      medium: 500,
    },

    // borderRadius: {},
    colors: {
      accent: {
        100: "#FE4F32",
        200: "#AAB6E5",
      },
      white: {
        DEFAULT: "#ffffff",
      },
      black: {
        DEFAULT: "#000000",
      },
      background: {
        100: "#fff",
        200: "#f7f5fa",
        300: "#e1e4f0",
      },
      text: {
        100: "#202331",
        200: "#5E6376",
      },
      silver: {
        DEFAULT: "#C4C4E3",
        700: "#8D95B4",
      },
      success: {
        DEFAULT: "#009D65",
      },
    },
  },
};
