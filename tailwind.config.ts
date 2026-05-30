import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        soft: '#FFF7FB',
        blush: '#FFEAF4',
        pink: {
          DEFAULT: '#EA4C89',
          dark: '#C73E74',
          border: '#F5C8E2',
        },
        lav: '#D8C1E8',
        ink: '#1A1A1A',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        xl2: '14px',
        xl3: '18px',
      },
      boxShadow: {
        card: '0 2px 16px 0 rgba(234,76,137,0.07)',
        glow: '0 0 24px 0 rgba(234,76,137,0.18)',
      },
    },
  },
  plugins: [],
}

export default config
