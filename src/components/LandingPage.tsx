import Link from 'next/link';
import styles from './LandingPage.module.css';

export default function LandingPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={`${styles.logo} text-gradient`}>TaskIt</div>
                <nav className={styles.nav}>
                    <Link href="/login" className={styles.link}>
                        Login
                    </Link>
                    <Link href="/login" className={styles.ctaButton} style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
                        Sign Up
                    </Link>
                </nav>
            </header>

            <main className={styles.hero}>
                <div className={styles.glow} />

                <h1 className={`${styles.headline} animate-slide-up`}>
                    Organize your life.<br />
                    <span className="text-gradient">One task at a time.</span>
                </h1>

                <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <Link href="/login" className={styles.ctaButton}>
                        Get Started Free
                    </Link>
                </div>

                <div className={`${styles.heroImage} animate-slide-up`} style={{ animationDelay: '0.2s' }}>
                    <img src="/landing-hero.png" alt="Dashboard Preview" />
                </div>

                <section className={styles.features}>
                    <div className={`${styles.featureCard} glass-card animate-slide-up`} style={{ animationDelay: '0.2s' }}>
                        <div className={styles.featureIcon}>✨</div>
                        <h3 className={styles.featureTitle}>Smart Tasks</h3>
                        <p className={styles.featureDesc}>
                            Automatically categorize and prioritize your daily tasks with intelligent sorting.
                        </p>
                    </div>

                    <div className={`${styles.featureCard} glass-card animate-slide-up`} style={{ animationDelay: '0.3s' }}>
                        <div className={styles.featureIcon}>🤖</div>
                        <h3 className={styles.featureTitle}>AI Planner</h3>
                        <p className={styles.featureDesc}>
                            Let AI schedule your day based on your habits and deadlines.
                        </p>
                    </div>

                    <div className={`${styles.featureCard} glass-card animate-slide-up`} style={{ animationDelay: '0.4s' }}>
                        <div className={styles.featureIcon}>☁️</div>
                        <h3 className={styles.featureTitle}>Cloud Sync</h3>
                        <p className={styles.featureDesc}>
                            Access your tasks from anywhere, on any device, instantly synced.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}
