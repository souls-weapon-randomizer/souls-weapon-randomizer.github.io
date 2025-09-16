/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Enhanced color palette with richer, more pleasant colors
      colors: {
        'background': '#1a1a1a', // Deep dark background
        'background-secondary': '#2d2d2d', // Slightly lighter background
        'element': '#3a3a3a',   // Component backgrounds with subtle warmth
        'element-light': '#4a4a4a', // Borders and hover states
        'element-hover': '#5a5a5a', // Enhanced hover states
        'text-main': '#f5f5f5',    // Crisp white for primary text
        'text-secondary': '#d1d5db', // Soft gray for secondary text
        'text-muted': '#9ca3af',   // Muted gray for tertiary text
        'accent': '#fbbf24',      // Bright golden accent
        'accent-hover': '#f59e0b', // Darker golden for hover
        'accent-light': '#fde68a', // Light golden for highlights
        'success': '#10b981',     // Emerald green for success states
        'warning': '#f59e0b',     // Amber for warnings
        'error': '#ef4444',       // Red for errors
        'info': '#3b82f6',        // Blue for info
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Orbitron', 'monospace'],
        'gothic': ['Cinzel', 'serif'],
        'gothic-blackletter': ['UnifrakturMaguntia', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(251, 191, 36, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(251, 191, 36, 0.8)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(24, 20, 10, 0.7)',
        'glow-lg': '0 0 30px rgba(29, 23, 10, 0.8)',
        'inner-glow': 'inset 0 0 20px rgba(31, 26, 14, 0.4)',
      },
    },
  },
  plugins: [],
}