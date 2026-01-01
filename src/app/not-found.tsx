import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
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
            <div style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                color: 'var(--primary)'
            }}>
                404
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 600 }}>Page Not Found</h2>

            <p style={{ color: '#a1a1aa', maxWidth: '400px' }}>
                Currently we only have: Dashboard, Tasks, Calendar, Focus, Analytics, Gamification, and Settings.
            </p>

            <Link href="/" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                color: 'var(--foreground)',
                marginTop: '1rem',
                transition: 'all 0.2s'
            }}>
                <Home size={20} />
                Return Home
            </Link>
        </div>
    );
}
