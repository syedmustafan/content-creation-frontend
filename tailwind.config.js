/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0A0A0A',
        'secondary': '#171717',
        'accent': '#6941C6',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A3A3A3',
        'border': '#404040',
        'input-bg': '#1F1F1F',
        'card-bg': '#121212',
        'hover': '#2E2E2E',
        'success': '#10B981',
        'error': '#EF4444',
        'warning': '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(0, 0, 0, 0.25)',
        'glow': '0 0 15px rgba(105, 65, 198, 0.3)',
      },
    },
  },
  plugins: [],
}