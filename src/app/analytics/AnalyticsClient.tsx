"use client";

import { Todo } from '@/types/todo';
import AppLayout from '@/components/layout/AppLayout';
import styles from './Analytics.module.css';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Trophy, Clock, Target, TrendingUp } from 'lucide-react';

export default function AnalyticsClient({ initialTodos, user }: { initialTodos: Todo[], user: any }) {
    // --- Data Processing ---

    // 1. Completion Rate
    const totalTasks = initialTodos.length;
    const completedTasks = initialTodos.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 2. Productivity Score (weighted by priority)
    // High = 3 pts, Medium = 2 pts, Low = 1 pt
    const getPoints = (priority: string) => ({ high: 3, medium: 2, low: 1 }[priority] || 1);
    const earnedPoints = initialTodos
        .filter(t => t.completed)
        .reduce((acc, t) => acc + getPoints(t.priority), 0);
    const totalPossiblePoints = initialTodos
        .reduce((acc, t) => acc + getPoints(t.priority), 0);

    const productivityScore = totalPossiblePoints > 0 ? Math.round((earnedPoints / totalPossiblePoints) * 100) : 0;

    // 3. Weekly Activity (Mocked using created_at distribution for demo, since we don't have completed_at history yet)
    // We will group tasks by day of week
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyDataMap = new Array(7).fill(0).map((_, i) => ({
        name: days[i],
        completed: 0,
        created: 0,
        focus: 0
    }));

    initialTodos.forEach(todo => {
        const date = new Date(todo.createdAt); // timestamp
        const dayIndex = date.getDay();
        weeklyDataMap[dayIndex].created += 1;
        if (todo.completed) {
            // For now, assume completed on same day as created for this visualization if no separate timestamp
            // or better, just visualize distribution of ALL tasks
            weeklyDataMap[dayIndex].completed += 1;
        }
    });

    // 4. Tasks by Category
    const categoryDataMap: Record<string, number> = {};
    initialTodos.forEach(t => {
        const cat = t.category || 'Uncategorized';
        categoryDataMap[cat] = (categoryDataMap[cat] || 0) + 1;
    });
    const pieData = Object.keys(categoryDataMap).map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: categoryDataMap[key]
    }));

    const COLORS = ['#7c3aed', '#db2777', '#22d3ee', '#22c55e', '#f59e0b'];

    return (
        <AppLayout user={user}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Analytics</h1>
                    <p className={styles.subtitle}>Track your progress and productivity habits.</p>
                </div>

                {/* KPI Cards */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <span className={styles.statTitle}>Productivity Score</span>
                            <Trophy size={20} color="#f59e0b" />
                        </div>
                        <span className={styles.statValue}>{productivityScore}</span>
                        <div className={styles.statSubtext}>Based on task priority weighting</div>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: `${productivityScore}%`, height: '4px', background: '#f59e0b', transition: 'width 1s' }} />
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <span className={styles.statTitle}>Completion Rate</span>
                            <Target size={20} color="#22c55e" />
                        </div>
                        <span className={styles.statValue}>{completionRate}%</span>
                        <div className={styles.statSubtext}>{completedTasks} / {totalTasks} tasks completed</div>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: `${completionRate}%`, height: '4px', background: '#22c55e', transition: 'width 1s' }} />
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <span className={styles.statTitle}>Focus Time</span>
                            <Clock size={20} color="#7c3aed" />
                        </div>
                        <span className={styles.statValue}>0h 0m</span>
                        <div className={styles.statSubtext}>Start a session in Focus Mode</div>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '0%', height: '4px', background: '#7c3aed' }} />
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <span className={styles.statTitle}>Streak</span>
                            <TrendingUp size={20} color="#db2777" />
                        </div>
                        <span className={styles.statValue}>0 Days</span>
                        <div className={styles.statSubtext}>Complete tasks daily to build streak!</div>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '0%', height: '4px', background: 'linear-gradient(90deg, #db2777, #7c3aed)' }} />
                    </div>
                </div>

                {/* Charts */}
                <div className={styles.chartsGrid}>
                    <div className={`${styles.chartCard} ${styles.fullWidth}`}>
                        <h3 className={styles.chartTitle}>Use Activity (Tasks Created vs Completed)</h3>
                        <div className={styles.chartContent}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyDataMap}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                    <XAxis dataKey="name" stroke="#a1a1aa" tick={{ fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#a1a1aa" tick={{ fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="created" name="Created" fill="#7c3aed" radius={[4, 4, 0, 0]} opacity={0.5} />
                                    <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Task Distribution by Category</h3>
                        <div className={styles.chartContent}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.2)" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Legend */}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                                {pieData.map((entry, index) => (
                                    <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#a1a1aa' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[index % COLORS.length] }} />
                                        {entry.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Focus Trend</h3>
                        <div className={styles.chartContent}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weeklyDataMap}>
                                    <defs>
                                        <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                    <XAxis dataKey="name" stroke="#a1a1aa" tick={{ fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#a1a1aa" tick={{ fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    {/* Mocking focus data based on created tasks count * random multiplier for visualization */}
                                    <Area type="monotone" dataKey="focus" name="Focus Minutes" stroke="#22d3ee" fillOpacity={1} fill="url(#colorFocus)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
