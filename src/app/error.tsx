"use client"; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
            textAlign: 'center',
            gap: '1.5rem',
            padding: '2rem'
        }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Something went wrong!</h2>
            <p style={{ color: '#a1a1aa' }}>An unexpected error occurred. Please try again.</p>

            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    borderRadius: '12px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                Try again
            </button>
        </div>
    );
}
