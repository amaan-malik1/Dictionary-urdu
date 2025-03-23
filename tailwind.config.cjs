/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-color': '#2c3e50',
                'secondary-color': '#3498db',
                'accent-color': '#e74c3c',
            },
            fontFamily: {
                'urdu': ['Noto Nastaliq Urdu', 'serif'],
            },
        },
    },
    plugins: [],
} 