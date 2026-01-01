"use client";

import { useEffect, useState } from 'react';

export default function ThemeToggle({ className, style }: { className?: string, style?: React.CSSProperties }) {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Check local storage or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'light') {
            setIsDark(false);
            document.documentElement.setAttribute('data-theme', 'light');
        } else if (savedTheme === 'dark') {
            setIsDark(true);
            document.documentElement.removeAttribute('data-theme');
        } else if (!prefersDark) {
            // Default to light if system prefers light and no save
            setIsDark(false);
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);

        if (newIsDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className={className}
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--glass-border)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                cursor: 'pointer',
                boxShadow: 'var(--glass-shadow)',
                transition: 'all 0.2s ease',
                color: 'var(--foreground)',
                ...style
            }}
            aria-label="Toggle Theme"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            {isDark ? '☀️' : '🌙'}
        </button>
    );
}
