"use client";

import { useState } from 'react';
import { Todo } from '@/types/todo';
import { createClient } from '@/utils/supabase/client';
import styles from './Dashboard.module.css';
import OverviewCards from './OverviewCards';
import RightPanel from './RightPanel';
import TaskCard from './TaskCard';
import Link from 'next/link';

interface DashboardProps {
    initialTodos: Todo[];
    user: any;
    focusSeconds?: number;
}

export default function Dashboard({ initialTodos, user, focusSeconds = 0 }: DashboardProps) {
    const [todos, setTodos] = useState<Todo[]>(initialTodos);
    const supabase = createClient();

    const toggleTodo = async (id: string) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        const newCompleted = !todo.completed;
        setTodos(todos.map(t => t.id === id ? { ...t, completed: newCompleted } : t));
        await supabase.from('todos').update({ completed: newCompleted }).eq('id', id);
    };

    const stats = {
        total: todos.length,
        completed: todos.filter(t => t.completed).length,
        pending: todos.filter(t => !t.completed).length,
    };

    // Filter mainly for Today's tasks (mocking logic by just taking top 5 pending or incomplete)
    // In a real app, check due_date === today
    const todaysTasks = todos.slice(0, 5);

    return (
        <div className={styles.dashboardGrid}>
            <div className={styles.mainSection}>
                {/* A. Overview Cards */}
                <OverviewCards stats={stats} focusSeconds={focusSeconds} />

                {/* B. Today's Tasks */}
                <div style={{ marginTop: '1rem' }}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Today's Tasks</h2>
                        <Link href="/tasks" className={styles.seeAll}>See All</Link>
                    </div>

                    <div className={styles.taskList}>
                        {todaysTasks.length > 0 ? (
                            todaysTasks.map(todo => (
                                <TaskCard key={todo.id} todo={todo} onToggle={toggleTodo} />
                            ))
                        ) : (
                            <div style={{
                                padding: '2rem',
                                textAlign: 'center',
                                color: '#a1a1aa',
                                background: 'var(--surface)',
                                borderRadius: '12px',
                                border: '1px solid var(--glass-border)'
                            }}>
                                No tasks for today. Enjoy your day! ☀️
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* C. Right Panel */}
            <RightPanel />
        </div>
    );
}
