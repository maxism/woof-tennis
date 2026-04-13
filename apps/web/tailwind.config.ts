import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        tg: {
          bg: 'var(--tg-theme-bg-color, var(--woof-bg))',
          text: 'var(--tg-theme-text-color, var(--woof-text))',
          hint: 'var(--tg-theme-hint-color, var(--woof-hint))',
          link: 'var(--tg-theme-link-color, var(--woof-accent))',
          button: 'var(--tg-theme-button-color, var(--woof-accent))',
          'button-text': 'var(--tg-theme-button-text-color, #ffffff)',
          'secondary-bg': 'var(--tg-theme-secondary-bg-color, var(--woof-secondary-bg))',
        },
        woof: {
          bg: 'var(--woof-bg)',
          'secondary-bg': 'var(--woof-secondary-bg)',
          text: 'var(--woof-text)',
          hint: 'var(--woof-hint)',
          border: 'var(--woof-border)',
          accent: 'var(--woof-accent)',
          warn: 'var(--woof-warn)',
          danger: 'var(--woof-danger)',
          success: 'var(--woof-success)',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
