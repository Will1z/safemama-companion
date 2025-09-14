import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'inter': ['Inter', 'sans-serif'],
        'roboto-mono': ['Roboto Mono', 'monospace'],
      },
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",

        card: "rgb(var(--card) / <alpha-value>)",
        "card-foreground": "rgb(var(--card-foreground) / <alpha-value>)",

        popover: "rgb(var(--popover) / <alpha-value>)",
        "popover-foreground": "rgb(var(--popover-foreground) / <alpha-value>)",

        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-foreground": "rgb(var(--primary-foreground) / <alpha-value>)",

        secondary: "rgb(var(--secondary) / <alpha-value>)",
        "secondary-foreground": "rgb(var(--secondary-foreground) / <alpha-value>)",

        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-foreground": "rgb(var(--accent-foreground) / <alpha-value>)",

        success: "rgb(var(--success) / <alpha-value>)",
        "success-foreground": "rgb(var(--success-foreground) / <alpha-value>)",

        warning: "rgb(var(--warning) / <alpha-value>)",
        "warning-foreground": "rgb(var(--warning-foreground) / <alpha-value>)",

        info: "rgb(var(--info) / <alpha-value>)",
        "info-foreground": "rgb(var(--info-foreground) / <alpha-value>)",

        destructive: "rgb(var(--destructive) / <alpha-value>)",
        "destructive-foreground": "rgb(var(--destructive-foreground) / <alpha-value>)",

        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",

        chart1: "rgb(var(--chart-1) / <alpha-value>)",
        chart2: "rgb(var(--chart-2) / <alpha-value>)",
        chart3: "rgb(var(--chart-3) / <alpha-value>)",
        chart4: "rgb(var(--chart-4) / <alpha-value>)",
        chart5: "rgb(var(--chart-5) / <alpha-value>)",

        // Named pastel colors for easier use
        pastelMint: "rgb(var(--primary) / <alpha-value>)",
        pastelBlue: "rgb(var(--secondary) / <alpha-value>)",
        pastelPink: "rgb(var(--accent) / <alpha-value>)",
        pastelGreen: "rgb(var(--success) / <alpha-value>)",
        pastelYellow: "rgb(var(--warning) / <alpha-value>)",
        pastelLavender: "rgb(var(--info) / <alpha-value>)",
        pastelRed: "rgb(var(--destructive) / <alpha-value>)",
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '1rem',
        '2xl': '1.25rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.7)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 0 10px rgba(212, 175, 55, 0)',
            transform: 'scale(1.05)'
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow': 'pulse-glow 2s infinite',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;