module.exports = {
  content: ["./develop/**/*.{html,js,ts,tsx}"],
  plugins: [
    require("daisyui"),
    require('@tailwindcss/typography'),
  ],
  daisyui: {
    themes: [
      "night",
      "winter",
    ],
  },
}