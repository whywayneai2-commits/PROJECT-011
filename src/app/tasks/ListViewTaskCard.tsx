"use client";

import { Todo } from '@/types/todo';
import styles from './Tasks.module.css';
import { Edit2, Trash2, Calendar, Tag } from 'lucide-react';

interface ListViewTaskCardProps {
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onClick: (todo: Todo) => void;
}

export default function ListViewTaskCard({ todo, onToggle, onDelete, onClick }: ListViewTaskCardProps) {
    const priorityColor = {
        high: '#ef4444',
        medium: '#f59e0b',
        low: '#22c55e'
    }[todo.priority] || '#a1a1aa';

    return (
        <div className={styles.taskRow} onClick={() => onClick(todo)}>
            <div className={styles.tasksPriorityStrip} style={{ background: priorityColor }} />

            <div className={styles.taskContent}>
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) => {
                        e.stopPropagation();
                        onToggle(todo.id);
                    }}
                    className={styles.checkbox}
                />

                <div className={styles.taskInfo}>
                    <span className={styles.taskTitle} style={{
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        opacity: todo.completed ? 0.5 : 1
                    }}>
                        {todo.text}
                    </span>
                    <div className={styles.taskMeta}>
                        {todo.tags && todo.tags.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {todo.tags.map(tag => (
                                    <span key={tag} className={styles.tag}>#{tag}</span>
                                ))}
                            </div>
                        )}
                        {todo.dueDate && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Calendar size={12} />
                                {new Date(todo.dueDate).toLocaleDateString()}
                            </span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Tag size={12} />
                            {todo.category}
                        </span>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(todo.id);
                        }}
                    >
                        <Trash2 size={16} />
                    </button>
                    <button className={styles.actionBtn}>
                        <Edit2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
