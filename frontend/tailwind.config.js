/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#2cd0d8',
                'secondary': '#f7f7f7',
            },
            maxWidth: {
                '7xl': '1280px',
                '8xl': '1440px',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.3s ease-out',
                scaleIn: 'scaleIn 0.3s ease-out',
                'fade-in-up': 'fade-in-up 0.25s ease-out',
            },
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
    ],
} 