module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gray: {
          light: "#DEDEDE",
        },
        green: {
          primary: "#5FEFC0",
        },
        blue: {
          primary: "#4A6DAC",
        },
      },
      boxShadow: {
        light: "0px 0px 20px 0px rgba(0,0,0,0.08)",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};

