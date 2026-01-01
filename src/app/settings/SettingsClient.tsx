"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import AppLayout from '@/components/layout/AppLayout';
import styles from './Settings.module.css';
import { User, Bell, Moon, Shield, Database, LogOut } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { logout } from '@/app/login/actions';

export default function SettingsClient({ user }: { user: any }) {
    const supabase = createClient();

    // Local State for settings forms
    const [fullName, setFullName] = useState(user.user_metadata?.full_name || '');
    const [loading, setLoading] = useState(false);

    // Mock States for toggles
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [pushNotifs, setPushNotifs] = useState(true);
    const [autoBackup, setAutoBackup] = useState(true);

    const handleUpdateProfile = async () => {
        setLoading(true);
        const { error } = await supabase.auth.updateUser({
            data: { full_name: fullName }
        });
        setLoading(false);
        if (error) {
            alert('Error updating profile');
        } else {
            alert('Profile updated successfully!');
            window.location.reload(); // Refresh to see changes in sidebar etc
        }
    };

    const handlePasswordReset = async () => {
        const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
            redirectTo: `${window.location.origin}/auth/update-password`,
        });
        if (error) alert('Error sending reset email');
        else alert('Password reset email sent!');
    };

    const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
        <div className={`${styles.toggle} ${active ? styles.active : ''}`} onClick={onToggle}>
            <div className={styles.toggleHandle} />
        </div>
    );

    return (
        <AppLayout user={user}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Settings</h1>
                    <p className={styles.subtitle}>Manage your account preferences and configurations.</p>
                </div>

                {/* Profile Settings */}
                <div className={styles.section}>
                    <div className={styles.sectionTitle} style={{ justifyContent: 'space-between', border: 'none', padding: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <User size={20} /> Profile Settings
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)', marginBottom: '1rem' }} />

                    <div className={styles.row}>
                        <div className={styles.settingInfo}>
                            <div className={styles.settingLabel}>Profile Picture</div>
                            <div className={styles.settingDesc}>Upload a new avatar. Max 2MB.</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                background: 'var(--surface-hover)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid var(--glass-border)'
                            }}>
                                {user.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#a1a1aa' }}>
                                        {user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <label className={`${styles.button} ${styles.secondaryBtn}`} style={{ cursor: 'pointer', display: 'inline-block' }}>
                                Upload
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        if (file.size > 2 * 1024 * 1024) {
                                            alert('File too large. Max 2MB.');
                                            return;
                                        }

                                        setLoading(true);
                                        const fileExt = file.name.split('.').pop();
                                        const filePath = `${user.id}.${fileExt}`;

                                        const { error: uploadError } = await supabase.storage
                                            .from('avatars')
                                            .upload(filePath, file, { upsert: true });

                                        if (uploadError) {
                                            console.error(uploadError);
                                            if (uploadError.message.includes("Bucket not found")) {
                                                alert('⚠️ Setup Required: Please run the SQL in "migration_v1.sql" in your Supabase Dashboard to create the "avatars" bucket.');
                                            } else {
                                                alert(`Error: ${uploadError.message}`);
                                            }
                                            setLoading(false);
                                            return;
                                        }

                                        const { data: { publicUrl } } = supabase.storage
                                            .from('avatars')
                                            .getPublicUrl(filePath);

                                        // Force cache bust to immediately see update if replacing same filename
                                        const publicUrlWithTimestamp = `${publicUrl}?t=${Date.now()}`;

                                        const { error: updateError } = await supabase.auth.updateUser({
                                            data: { avatar_url: publicUrlWithTimestamp }
                                        });

                                        if (updateError) {
                                            alert('Error updating profile with avatar.');
                                        } else {
                                            window.location.reload();
                                        }
                                        setLoading(false);
                                    }}
                                />
                            </label>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.settingInfo}>
                            <div className={styles.settingLabel}>Full Name</div>
                            <div className={styles.settingDesc}>Visible to other users and on your profile.</div>
                        </div>
                        <input
                            type="text"
                            className={styles.input}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.settingInfo}>
                            <div className={styles.settingLabel}>Email Address</div>
                            <div className={styles.settingDesc}>Used for logging in and notifications.</div>
                        </div>
                        <input
                            type="text"
                            className={styles.input}
                            value={user.email}
                            disabled
                            style={{ opacity: 0.6, cursor: 'not-allowed' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button className={`${styles.button} ${styles.primaryBtn}`} onClick={handleUpdateProfile} disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {/* Theme Settings */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <Moon size={20} /> Appearance
                    </h2>
                    <div className={styles.row}>
                        <div className={styles.settingInfo}>
                            <div className={styles.settingLabel}>Theme Preference</div>
                            <div className={styles.settingDesc}>Switch between dark and light mode.</div>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>

                {/* Notifications */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <Bell size={20} /> Notifications
                    </h2>

                    <div className={styles.row}>
                        <div className={styles.settingInfo}>
                            <div className={styles.settingLabel}>Email Notifications</div>
                            <div className={styles.settingDesc}>Receive daily summaries and critical alerts.</div>
                        </div>
                        <Toggle active={emailNotifs} onToggle={() => setEmailNotifs(!emailNotifs)} />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.settingInfo}>
                            <div className={styles.settingLabel}>Push Notifications</div>
                            <div className={styles.settingDesc}>Real-time updates for tasks and mentions.</div>
                        </div>
                        <Toggle active={pushNotifs} onToggle={() => setPushNotifs(!pushNotifs)} />
                    </div>
                </div>

                {/* Backup & Sync */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <Database size={20} /> Data & Storage
                    </h2>

                    <div className={styles.row}>
                        <div className={styles.settingInfo}>
                            <div className={styles.settingLabel}>Auto-Backup</div>
                            <div className={styles.settingDesc}>Automatically backup your tasks daily.</div>
                        </div>
                        <Toggle active={autoBackup} onToggle={() => setAutoBackup(!autoBackup)} />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.settingInfo}>
                            <div className={styles.settingLabel}>Export Data</div>
                            <div className={styles.settingDesc}>Download a personalized copy of your data (JSON).</div>
                        </div>
                        <button className={`${styles.button} ${styles.secondaryBtn}`}>
                            Download Data
                        </button>
                    </div>
                </div>

                {/* Security */}
                <div className={styles.section} style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                    <h2 className={styles.sectionTitle} style={{ color: '#ef4444' }}>
                        <Shield size={20} /> Security
                    </h2>

                    <div className={styles.row}>
                        <div className={styles.settingInfo}>
                            <div className={styles.settingLabel}>Change Password</div>
                            <div className={styles.settingDesc}>We'll send you an email to reset your password.</div>
                        </div>
                        <button className={`${styles.button} ${styles.secondaryBtn}`} onClick={handlePasswordReset}>
                            Reset Password
                        </button>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.settingInfo}>
                            <div className={styles.settingLabel}>Sign Out</div>
                            <div className={styles.settingDesc}>Log out of your account on this device.</div>
                        </div>
                        <form action={logout}>
                            <button type="submit" className={`${styles.button} ${styles.dangerBtn}`}>
                                <LogOut size={16} style={{ marginRight: '0.5rem' }} />
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
