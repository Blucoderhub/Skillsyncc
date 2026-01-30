import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        template: '%s | Skillsyncc - AI Career Copilot',
        default: 'Skillsyncc | AI Career Copilot for the Expert Era',
    },
    description: "The world's most powerful AI job application assistant. Align, tailored, and land your dream role with expert precision.",
    // SEO enhancements
    keywords: ["AI", "career", "job application", "resume optimization", "ATS optimization", "job search", "interview prep", "networking", "professional", "employment", "recruitment", "hiring", "talent acquisition"],
    authors: [{ name: "Skillsyncc Team" }],
    creator: "Skillsyncc",
    publisher: "Skillsyncc",
    generator: "Next.js",
    applicationName: "Skillsyncc",
    referrer: "origin-when-cross-origin",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: "Skillsyncc | AI Career Copilot for the Expert Era",
        description: "The world's most powerful AI job application assistant. Align, tailored, and land your dream role with expert precision.",
        url: "https://skillsyncc.com",
        siteName: "Skillsyncc",
        images: [
            {
                url: "/og-image.jpg", // Add your og image
                width: 1200,
                height: 630,
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Skillsyncc | AI Career Copilot for the Expert Era",
        description: "The world's most powerful AI job application assistant.",
        images: ["/twitter-image.jpg"], // Add your twitter image
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'google-site-verification-code',
        yandex: 'yandex-verification-code',
        yahoo: 'yahoo-site-verification-code',
        other: {
            'msvalidate.01': 'bing-verification-code',
        },
    },
    alternates: {
        canonical: 'https://skillsyncc.com',
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-white to-teal-50 pointer-events-none -z-10" />
                {children}
            </body>
        </html>
    );
}
