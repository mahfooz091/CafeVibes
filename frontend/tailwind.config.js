/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#0F766E',
          dark: '#0B5C56',
          light: '#14A89B',
        },
        coffee: '#6F4E37',
        cream: '#FFF8E7',
        gold: '#D4A373',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient':
          'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(15, 118, 110, 0.15)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        steam: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.6' },
          '100%': { transform: 'translateY(-40px) scale(1.4)', opacity: '0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        steam: 'steam 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
