"use client";

import styles from './Dashboard.module.css';

interface OverviewStats {
    total: number;
    completed: number;
    pending: number;
}

export default function OverviewCards({ stats, focusSeconds = 0 }: { stats: OverviewStats, focusSeconds?: number }) {
    const focusHours = Math.floor(focusSeconds / 3600);
    const focusMinutes = Math.floor((focusSeconds % 3600) / 60);

    return (
        <div className={styles.overviewGrid}>
            <div className={styles.statCard}>
                <span className={styles.statLabel}>Tasks Today</span>
                <span className={styles.statValue}>{stats.total}</span>
                <span className={styles.statChange}>vs Yesterday</span>
            </div>

            <div className={styles.statCard}>
                <span className={styles.statLabel}>Completed</span>
                <span className={styles.statValue}>{stats.completed}</span>
                <span className={styles.statChange} style={{ color: '#22c55e' }}>
                    {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% rate
                </span>
            </div>

            <div className={styles.statCard}>
                <span className={styles.statLabel}>Pending</span>
                <span className={styles.statValue}>{stats.pending}</span>
                <span className={styles.statChange} style={{ color: '#eab308' }}>Keep going</span>
            </div>

            <div className={styles.statCard} style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
                <span className={styles.statLabel} style={{ color: 'rgba(255,255,255,0.8)' }}>Focus Time</span>
                <span className={styles.statValue} style={{ color: 'white' }}>{focusHours}h {focusMinutes}m</span>
                <span className={styles.statChange} style={{ color: 'rgba(255,255,255,0.8)' }}>Target: 4h</span>
            </div>
        </div>
    );
}
