import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google"; // SaaS Optimized Fonts
import "./globals.css";

// Primary UI Font: Inter (The gold standard for UI readability)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Heading/Brand Font: Plus Jakarta Sans (Modern, geometric, friendly)
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TaskIt | Master Your Day",
  description: "The ultimate task management app designed for productivity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <body className={`${inter.variable} ${jakarta.variable}`}>
        {children}
      </body>
    </html>
  );
}
