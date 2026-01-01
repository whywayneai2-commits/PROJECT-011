"use client";

import { Todo } from '@/types/todo';
import { Edit2 } from 'lucide-react';
import styles from './Dashboard.module.css';

interface TaskCardProps {
    todo: Todo;
    onToggle: (id: string) => void;
}

export default function TaskCard({ todo, onToggle }: TaskCardProps) {
    const priorityColor = {
        high: '#ef4444',
        medium: '#f59e0b',
        low: '#22c55e'
    }[todo.priority] || '#a1a1aa';

    return (
        <div className={styles.todayTaskCard}>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
                style={{
                    width: '20px',
                    height: '20px',
                    accentColor: 'var(--primary)',
                    cursor: 'pointer'
                }}
            />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{
                    color: 'var(--foreground)',
                    fontWeight: 500,
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    opacity: todo.completed ? 0.5 : 1
                }}>
                    {todo.text}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#a1a1aa' }}>
                    {todo.dueDate && (
                        <span>🕒 {new Date(todo.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: priorityColor }} />
                        <span style={{ textTransform: 'capitalize' }}>{todo.priority}</span>
                    </div>
                </div>
            </div>

            <button style={{ color: '#a1a1aa', padding: '8px', borderRadius: '8px' }} title="Edit">
                <Edit2 size={16} />
            </button>
        </div>
    );
}
