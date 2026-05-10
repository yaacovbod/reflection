import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-heebo)', 'system-ui', 'sans-serif'],
      },
      colors: {
        accent: '#0891B2',
        'accent-light': '#E0F2FE',
      },
    },
  },
  plugins: [],
}

export default config
