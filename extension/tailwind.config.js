/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './popup.html',
        './src/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {
            backgroundImage: {
                'logo-gradient':'linear-gradient(to right, #9656f0, #d77c8c, #f88e55);',
            },
            keyframes:{
                spinning: {
                    from: { transform: 'rotate(0deg)' },
                    to: { transform: 'rotate(360deg)' },
                  }
            },
            animation: {
                'spinning': 'sspinning 2s linear infinite',
            }
        },
    },
    plugins: [
        require('daisyui'),
    ],
    daisyui: {
        themes: ["light"],
    },
};
