import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // tailwind.config.js

        cream: "#fdf8f2",
        primary: "#0f6e6c", // Adjust to match your theme
      },
    },
  },
  plugins: [],
} satisfies Config;
