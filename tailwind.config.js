/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette — all custom, no Tailwind defaults
        ink:     '#0C0B0F',   // near-black with purple undertone
        surface: '#13121A',   // slightly lifted surface
        raised:  '#1C1B28',   // card/elevated surface
        border:  '#ffffff0d', // 5% white border
        accent:  '#5B4FE9',   // electric indigo (not Tailwind's #6366F1 or #4F46E5)
        'accent-light': '#7B70F5',
        'accent-dim':   '#5B4FE91f',
        cream:   '#F7F3EC',   // warm off-white
        'cream-muted': '#C2BDB4',
        muted:   '#7A7A96',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans:    ['DM Sans', 'sans-serif'],
      },
      letterSpacing: {
        display: '-0.03em',
        tight:   '-0.02em',
        wide:    '0.12em',
        wider:   '0.18em',
      },
      animation: {
        'float-slow': 'float 14s ease-in-out infinite',
        'float-med':  'float  9s ease-in-out infinite reverse',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%':      { transform: 'translate(24px, -18px) scale(1.05)' },
          '66%':      { transform: 'translate(-16px, 14px) scale(0.97)' },
        },
      },
    },
  },
  plugins: [],
}
