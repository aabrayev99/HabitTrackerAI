import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'cosmic-bg': '#030014', // Deep space black/blue
                'cosmic-purple': '#7000ff', // Vibrant purple accent
                'cosmic-light': '#b48aff', // Lighter purple for glows
                'cosmic-card': 'rgba(255, 255, 255, 0.03)',
                'cosmic-border': 'rgba(255, 255, 255, 0.1)',
            },
            fontFamily: {
                sans: ['var(--font-jakarta)', 'sans-serif'],
            },
            backgroundImage: {
                'cosmic-gradient': 'radial-gradient(circle at 50% 0%, #2a0e4a 0%, #030014 60%)',
                'grid-pattern': "linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
            },
        },
    },
    plugins: [
        require('daisyui'),
    ],
    // @ts-ignore
    daisyui: {
        themes: [
            {
                cosmic: {
                    "primary": "#7000ff",
                    "secondary": "#b48aff",
                    "accent": "#ffffff",
                    "neutral": "#030014",
                    "base-100": "#030014",
                    "base-200": "#0f0518",
                    "info": "#7000ff",
                    "success": "#36d399",
                    "warning": "#fbbd23",
                    "error": "#f87272",
                },
            },
        ],
    },
};

export default config;
