"use client";

import { Todo } from '@/types/todo';
import AppLayout from '@/components/layout/AppLayout';
import styles from './Gamification.module.css';
import { Trophy, Flame, Star, Gift, Search, Share2 } from 'lucide-react';

export default function GamificationClient({ initialTodos, user }: { initialTodos: Todo[], user: any }) {

    // --- Logic for Gamification Stats ---

    // 1. Calculate XP and Level
    // Simple formula: 1 Task = 100 XP. Level Up every 1000 XP.
    const completedTasksCount = initialTodos.filter(t => t.completed).length;
    const totalXP = completedTasksCount * 100;
    const level = Math.floor(totalXP / 1000) + 1;
    const currentLevelXP = totalXP % 1000;
    const nextLevelXP = 1000;
    const progressPercent = (currentLevelXP / nextLevelXP) * 100;

    // SVG Circle Calculations
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    // 2. Calculate Streak
    // Logic: Count consecutive days ending yesterday or today where at least one task was completed.
    // For now, we default to 0 until we have a proper history table.
    const streakDays = 0;

    // 3. Badges System
    const badges = [
        {
            id: 'beginner',
            name: 'Getting Started',
            desc: 'Complete your first task',
            icon: '🌱',
            condition: completedTasksCount >= 1
        },
        {
            id: 'warrior',
            name: 'Task Warrior',
            desc: 'Complete 10 tasks',
            icon: '⚔️',
            condition: completedTasksCount >= 10
        },
        {
            id: 'master',
            name: 'Productivity Master',
            desc: 'Complete 50 tasks',
            icon: '👑',
            condition: completedTasksCount >= 50
        },
        {
            id: 'streak_3',
            name: 'On Fire',
            desc: 'Reach a 3-day streak',
            icon: '🔥',
            condition: streakDays >= 3
        },
        {
            id: 'planner',
            name: 'Planner',
            desc: 'Create 20 tasks',
            icon: '📅',
            condition: initialTodos.length >= 20
        },
        {
            id: 'focus',
            name: 'Deep Focus',
            desc: 'Complete 5 High Priority items',
            icon: '🧠',
            condition: initialTodos.filter(t => t.completed && t.priority === 'high').length >= 5
        }
    ];

    return (
        <AppLayout user={user}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Your Journey</h1>
                    <p className={styles.subtitle}>Level up your productivity.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Level Card */}
                    <div className={styles.levelCard}>
                        <div className={styles.levelCircleOuter}>
                            <svg className={styles.levelCircleSvg} viewBox="0 0 200 200">
                                <circle className={styles.levelCircleBg} cx="100" cy="100" r={radius} />
                                <defs>
                                    <linearGradient id="gradientLevel" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#7c3aed" />
                                        <stop offset="100%" stopColor="#db2777" />
                                    </linearGradient>
                                </defs>
                                <circle
                                    className={styles.levelCircleProgress}
                                    cx="100"
                                    cy="100"
                                    r={radius}
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                />
                            </svg>
                            <div className={styles.currentLevel}>
                                <span className={styles.levelLabel}>Current Level</span>
                                <span className={styles.levelNumber}>{level}</span>
                            </div>
                        </div>
                        <div className={styles.xpText}>{currentLevelXP} / {nextLevelXP} XP</div>
                        <p style={{ fontSize: '0.9rem', color: '#a1a1aa', marginTop: '0.5rem' }}>
                            {nextLevelXP - currentLevelXP} XP to next level
                        </p>
                    </div>

                    {/* Streak Card */}
                    <div className={styles.streakCard}>
                        <div className={styles.streakInfo}>
                            <div className={styles.streakTitle}>
                                <Flame size={24} /> Daily Streak
                            </div>
                            <div className={styles.streakValue}>{streakDays} Days</div>
                            <p style={{ opacity: 0.9, marginTop: '0.5rem' }}>Complete tasks daily to build your streak!</p>
                        </div>
                        <div className={styles.fireBg}>🔥</div>
                    </div>
                </div>

                {/* Badges Section */}
                <div className={styles.badgesSection}>
                    <h2 className={styles.sectionTitle}>Badges</h2>
                    <div className={styles.badgesGrid}>
                        {badges.map(badge => (
                            <div key={badge.id} className={`${styles.badgeCard} ${badge.condition ? styles.unlocked : ''}`}>
                                <div className={styles.badgeIcon}>{badge.icon}</div>
                                <div>
                                    <div className={styles.badgeName}>{badge.name}</div>
                                    <div className={styles.badgeDesc}>{badge.desc}</div>
                                </div>
                                {badge.condition && (
                                    <div style={{ marginTop: 'auto', padding: '4px 8px', background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                                        UNLOCKED
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rewards Section (Mocked) */}
                <div className={styles.badgesSection}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 className={styles.sectionTitle}>Rewards Shop</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', padding: '0.5rem 1rem', borderRadius: '12px', color: '#f59e0b', fontWeight: 600 }}>
                            <Star size={18} fill="#f59e0b" />
                            <span>{Math.floor(totalXP / 10)} Coins</span>
                        </div>
                    </div>

                    <div className={styles.rewardsGrid}>
                        <div className={styles.rewardCard}>
                            <div className={styles.rewardIcon}><Gift size={24} /></div>
                            <div className={styles.rewardInfo}>
                                <div className={styles.rewardTitle}>Premium Theme</div>
                                <div className={styles.rewardCost}>500 Coins</div>
                            </div>
                            <button style={{ padding: '0.5rem 1rem', background: 'var(--surface-hover)', borderRadius: '8px', color: '#a1a1aa', border: 'none', cursor: 'pointer' }}>
                                Unlock
                            </button>
                        </div>

                        <div className={styles.rewardCard}>
                            <div className={styles.rewardIcon}><Share2 size={24} /></div>
                            <div className={styles.rewardInfo}>
                                <div className={styles.rewardTitle}>Social Profile Badge</div>
                                <div className={styles.rewardCost}>1000 Coins</div>
                            </div>
                            <button style={{ padding: '0.5rem 1rem', background: 'var(--surface-hover)', borderRadius: '8px', color: '#a1a1aa', border: 'none', cursor: 'pointer' }}>
                                Unlock
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
