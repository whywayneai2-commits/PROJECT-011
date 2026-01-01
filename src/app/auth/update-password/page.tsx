"use client";

import styles from './update-password.module.css';
import { updatePassword } from '@/app/login/actions';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function UpdatePasswordForm() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Reset Password</h1>
                    <p className={styles.subtitle}>Enter your new password below.</p>
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
                        <label htmlFor="password" className={styles.label}>New Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            minLength={6}
                            className={styles.input}
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
                            minLength={6}
                            className={styles.input}
                        />
                    </div>

                    <button formAction={updatePassword} className={styles.primaryButton}>Update Password</button>
                </form>
            </div>
        </div>
    );
}

export default function UpdatePasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UpdatePasswordForm />
        </Suspense>
    );
}
