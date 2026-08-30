import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // F1 Brand Colors
        'f1-red': '#E10600',
        'f1-dark': '#0b0c10',
        // Team Colors
        'mercedes-teal': '#00A19B',
        'redbull-blue': '#3671C2',
        'ferrari-red': '#E80020',
        'mclaren-orange': '#FF8000',
        'aston-green': '#229971',
        // UI Palette (Slate Dark Mode)
        'slate-950': '#020617',
        'steel-blue': '#38BDF8',
        // Tyre Compounds
        'tyre-soft': '#ff2e93',
        'tyre-medium': '#ffd300',
        'tyre-hard': '#f0f0f0',
        'tyre-inter': '#39b54a',
        'tyre-wet': '#00aeef',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        racing: ['Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'f1-gradient': 'radial-gradient(circle at top right, #1f2833 0%, #0b0c10 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
