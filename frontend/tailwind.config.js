/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        primary: 'rgb(var(--primary))',
        'primary-dark': 'rgb(var(--primary-dark))',
        accent: 'rgb(var(--accent))',
        'neutral-light': 'rgb(var(--neutral-light))',
        'neutral-mid': 'rgb(var(--neutral-mid))',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
    },
  },
  plugins: [],
}
