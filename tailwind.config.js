/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Torchbearer Glowing Ring Brand Palette
        torch: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#FF7300', // Warm orange
          600: '#FF4D00', // Vibrant orange
          700: '#FF2400', // Deep red
          800: '#c2410c',
          900: '#7c2d12',
          950: '#431407',
          // Brand gradient stops
          red: '#FF2400',
          orangeVibrant: '#FF4D00',
          orangeWarm: '#FF7300',
          orangeLight: '#FF9D00',
          gold: '#FFC400',
          yellowSoft: '#FFE66D',
        },
        slate: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 12px 24px -6px rgba(255, 77, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'torch-glow': '0 0 35px -5px rgba(255, 77, 0, 0.25)',
        'torch-glow-lg': '0 0 70px -10px rgba(255, 77, 0, 0.35)',
        'torch-button': '0 4px 14px 0 rgba(255, 77, 0, 0.3)',
      },
      backgroundImage: {
        'torch-gradient': 'linear-gradient(135deg, #FF2400 0%, #FF5A00 30%, #FF9500 60%, #FFC400 82%, #FFE66D 100%)',
        'torch-gradient-subtle': 'linear-gradient(135deg, rgba(255, 36, 0, 0.06) 0%, rgba(255, 90, 0, 0.04) 50%, rgba(255, 196, 0, 0.08) 100%)',
        'torch-radial': 'radial-gradient(circle at center, rgba(255, 115, 0, 0.12) 0%, rgba(255, 36, 0, 0.03) 50%, transparent 70%)',
      }
    },
  },
  plugins: [],
}
