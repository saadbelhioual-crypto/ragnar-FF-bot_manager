/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'border-flow': 'borderFlow 3s ease infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 0, 0, 0.7)' },
        },
        borderFlow: {
          '0%, 100%': { borderColor: '#ff0040' },
          '50%': { borderColor: '#00ffff' },
        },
      },
      backgroundImage: {
        'conic-360': 'conic-gradient(from 0deg, red, blue, cyan, red)',
      },
    },
  },
  plugins: [],
};