import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                obsidian: {
                    black: "#0A0A0B",
                    card: "#161618",
                    border: "rgba(255, 255, 255, 0.08)",
                },
                accent: {
                    gold: "#FFD700",
                    silver: "#F5F5F7",
                },
            },
            backgroundImage: {
                "founders-gradient": "linear-gradient(to right, #FFD700, #FDB931, #FFD700)",
                "obsidian-glass": "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))",
            },
            boxShadow: {
                "obsidian-glow": "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
                "founders-glow": "0 0 30px rgba(255, 215, 0, 0.2)",
            },
            animation: {
                "spin-slow": "spin 8s linear infinite",
            },
        },
    },
    plugins: [],
};

export default config;
