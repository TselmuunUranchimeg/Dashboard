/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            gridTemplateColumns: {
                'custom': "repeat(auto-fill, minmax(270px, 1fr))"
            },
            screens: {
                "mobileL": "425px",
                "mobileM": "396px"
            }
        },
    },
    plugins: [],
};
