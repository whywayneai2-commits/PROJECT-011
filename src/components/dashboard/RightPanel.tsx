"use client";

import styles from './Dashboard.module.css';

export default function RightPanel() {
    const today = new Date();
    const currentDay = today.getDate();

    // Simple calendar generation
    const days = Array.from({ length: 35 }, (_, i) => i + 1).map(d => {
        const dayNum = (d % 31) || 31;
        return dayNum;
    });

    return (
        <aside className={styles.rightPanel}>
            <div className={styles.calendarCard}>
                <h3 className={styles.calendarTitle}>
                    {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className={styles.miniCalendar}>
                    <div className={styles.weekDays}>
                        <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                    </div>
                    <div className={styles.daysGrid}>
                        {days.map((day, i) => (
                            <div
                                key={i}
                                className={`${styles.day} ${day === currentDay ? styles.currentDay : ''}`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.quoteCard}>
                <p className={styles.quoteText}>
                    "The only way to do great work is to love what you do."
                </p>
                <span className={styles.quoteAuthor}>- Steve Jobs</span>
            </div>
        </aside>
    );
}
