/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Anciennes couleurs (gardées pour compatibilité)
        'tilkapp-green': '#00A690',
        'tilkapp-beige': '#FFFFF0',
        'tilkapp-orange': '#F75C00',
        'kapkurtar-verdigris': '#00A690',
        'kapkurtar-teal': '#00615F',
        'kapkurtar-orange': '#F75C00',
        'kapkurtar-cream': '#FFFFF0',
        // Identité "Taze Gece"
        kk: {
          night: '#0D0E12',
          surface: '#17191F',
          surface2: '#21242C',
          paper: '#F4F2EC',
          lime: '#D7FF3C',
          'lime-dark': '#B8E01F',
          mint: '#00E0B8',
          'mint-deep': '#00A690',
          'mint-text': '#00796B',
          coral: '#FF5B3A',
          'coral-text': '#C2341A',
          lilac: '#A79BFF',
          ink: '#0D0E12',
          muted: '#A3A7B3',
          line: 'rgba(255,255,255,0.10)',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
