const { scopedPreflightStyles } = require("tailwindcss-scoped-preflight");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  plugins: [
    // ... other plugins
    scopedPreflightStyles({
      cssSelector: ".qzqroot", // or .tailwind-preflight or even [data-twp=true] - any valid CSS selector of your choice
      mode: "matched only", // it's the default
    }),
  ],
  // corePlugins: {
  //   preflight: false,
  // },
  important: ".qzqroot",
};
