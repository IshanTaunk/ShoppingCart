import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial':
                'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            backgroundColor: {
                footer: '#D1E2EB',
            },
            screens: { sm: { max: '460px' } },
            fontFamily: {
                lato: 'Lato',
            },
        },
    },
    plugins: [],
}
export default config;
