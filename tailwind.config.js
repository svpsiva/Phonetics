/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka One', 'Nunito', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      fontSize: {
        '10xl': '10rem',
        '12xl': '12rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-6deg)' },
          '50%': { transform: 'rotate(6deg)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        wiggle: 'wiggle 0.4s ease-in-out 2',
      },
      minHeight: { touch: '72px' },
      minWidth: { touch: '72px' },
    },
  },
}
