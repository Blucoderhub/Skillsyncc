import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                retro: {
                    black: "#0a0a0a",
                    dark: "#121212",
                    gold: "#d4af37",
                    amber: "#ffbf00",
                    cream: "#f5f5dc",
                    glass: "rgba(255, 255, 255, 0.05)",
                },
            },
            backgroundImage: {
                "gradient-retro": "linear-gradient(135deg, #121212 0%, #0a0a0a 100%)",
                "glass-gradient": "linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
            },
            boxShadow: {
                "retro-glow": "0 0 20px rgba(212, 175, 55, 0.3)",
                "premium-glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
            },
        },
    },
    plugins: [],
    // Performance optimizations
    corePlugins: {
        // Disable unused core plugins
        preflight: true, // Keep preflight for normalize/reset
    },
    // Optimize build
    safelist: [
        // Add classes that might be dynamically generated
        'bg-emerald-500',
        'bg-teal-500',
        'text-emerald-600',
        'border-emerald-200',
        'bg-emerald-50',
        'hover:bg-emerald-600',
        'hover:to-teal-600',
    ],
};
export default config;
