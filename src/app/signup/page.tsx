"use client";

import styles from './signup.module.css';
import { signup } from '../login/actions';
import Link from 'next/link';
import { useState } from 'react';

export default function SignupPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        const formData = new FormData(event.currentTarget);
        await signup(formData);
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {/* Left Column: Illustration & Quote */}
                <div className={styles.leftColumn}>
                    <img
                        src="/auth-illustration.png"
                        alt="Productivity"
                        className={styles.illustration}
                    />
                    <div className={styles.quoteContainer}>
                        <p className={styles.quote}>
                            "The future depends on what you do today."
                        </p>
                        <span className={styles.author}>- Mahatma Gandhi</span>
                    </div>
                </div>

                {/* Right Column: Signup Form */}
                <div className={styles.rightColumn}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Create Account</h1>
                        <p className={styles.subtitle}>Start organizing your life today.</p>
                    </div>

                    {error && (
                        <div style={{
                            color: '#ef4444',
                            background: 'rgba(239, 68, 68, 0.1)',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="full_name" className={styles.label}>Full Name</label>
                            <input
                                id="full_name"
                                name="full_name"
                                type="text"
                                placeholder="John Doe"
                                required
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                required
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                required
                                className={styles.input}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className={styles.primaryButton}>Sign Up</button>
                    </form>

                    <div className={styles.footer}>
                        Already have an account?
                        <Link href="/login" className={styles.link}>Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
