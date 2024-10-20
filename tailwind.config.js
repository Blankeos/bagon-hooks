/** @type {import('tailwindcss').Config} */
export default {
  content: ['./dev/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: 'hsl(var(--background) / <alpha-value>)',
        },
        muted: 'hsl(var(--muted) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        typography: 'hsl(var(--typography) / <alpha-value>)',
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
        },
        static: {
          white: 'hsl(var(--static-white) / <alpha-value>)',
        },
      },
      fontFamily: {
        geist: ['Geist', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
