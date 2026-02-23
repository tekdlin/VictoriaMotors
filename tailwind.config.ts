import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        victoria: {
          navy: {
            50: '#f0f4f9',
            100: '#dce4ee',
            200: '#b8c9dd',
            300: '#8fa9c7',
            400: '#6482ab',
            500: '#4a6590',
            600: '#3b5174',
            700: '#324360',
            800: '#2c3a52',
            900: '#1e2a3d',
            950: '#131c2b',
          },
          gold: {
            50: '#fefce8',
            100: '#fef9c3',
            200: '#fef08a',
            300: '#fde047',
            400: '#facc15',
            500: '#e5a50d',
            600: '#ca8a04',
            700: '#a16207',
            800: '#854d0e',
            900: '#713f12',
          },
          slate: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          },
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        victoria: '0 4px 14px -3px rgba(30, 42, 61, 0.08), 0 2px 6px -2px rgba(30, 42, 61, 0.04)',
        'victoria-lg': '0 20px 50px -12px rgba(30, 42, 61, 0.12), 0 8px 20px -8px rgba(30, 42, 61, 0.06)',
        'victoria-xl': '0 25px 60px -15px rgba(30, 42, 61, 0.15)',
        'gold-glow': '0 0 24px -4px rgba(229, 165, 13, 0.35)',
        'inner-soft': 'inset 0 1px 2px 0 rgb(0 0 0 / 0.03)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'victoria-gradient': 'linear-gradient(160deg, #1e2a3d 0%, #2c3a52 45%, #324360 100%)',
        'victoria-gradient-hero': 'linear-gradient(165deg, #131c2b 0%, #1e2a3d 40%, #2c3a52 100%)',
        'gold-gradient': 'linear-gradient(135deg, #e5a50d 0%, #facc15 50%, #e5a50d 100%)',
        'mesh-subtle': 'radial-gradient(at 40% 20%, rgba(229, 165, 13, 0.06) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(30, 42, 61, 0.04) 0px, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
