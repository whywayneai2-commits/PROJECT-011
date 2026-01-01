import Link from 'next/link';

export default function AuthCodeError() {
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
            <h2 style={{ fontSize: '2rem', fontWeight: 600, color: '#ef4444' }}>Authentication Error</h2>
            <p style={{ color: '#a1a1aa' }}>
                There was a problem authenticating your account. The link may have expired or is invalid.
            </p>

            <Link href="/login" style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                color: 'var(--foreground)',
                textDecoration: 'none'
            }}>
                Return to Login
            </Link>
        </div>
    );
}
