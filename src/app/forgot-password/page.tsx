"use client";

import styles from './forgot-password.module.css';
import { forgotPassword } from '../login/actions';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ForgotPasswordForm() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

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
                            "Success is not final, failure is not fatal: it is the courage to continue that counts."
                        </p>
                        <span className={styles.author}>- Winston Churchill</span>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div className={styles.rightColumn}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Forgot Password?</h1>
                        <p className={styles.subtitle}>Enter your email to receive reset instructions.</p>
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

                    <form className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                required
                                className={styles.input}
                            />
                        </div>

                        <button formAction={forgotPassword} className={styles.primaryButton}>Send Reset Link</button>
                    </form>

                    <div className={styles.footer}>
                        Remember your password?
                        <Link href="/login" className={styles.link}>Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ForgotPasswordForm />
        </Suspense>
    );
}
