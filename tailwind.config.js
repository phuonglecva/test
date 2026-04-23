/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './global.css'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#0F0F0F',
        surface: '#151515',
        surface2: '#1D1D1D',
        line: '#252525',
        neon: '#00FF85',
        neon2: '#FF9500',
        text: '#F5F5F5',
        muted: '#A1A1A1'
      },
      boxShadow: {
        neon: '0 0 24px rgba(0, 255, 133, 0.35)',
        neonSoft: '0 0 40px rgba(0, 255, 133, 0.18)',
        orange: '0 0 28px rgba(255, 149, 0, 0.24)',
        glass: '0 12px 50px rgba(0, 0, 0, 0.45)'
      },
      borderRadius: {
        '3xl': '1.75rem'
      }
    }
  },
  plugins: []
};
