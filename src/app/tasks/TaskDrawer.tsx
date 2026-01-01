"use client";

import { useState, useEffect } from 'react';
import { Todo, Subtask } from '@/types/todo';
import { createClient } from '@/utils/supabase/client';
import styles from './Tasks.module.css';
import { X, Check, Trash2, Plus, Calendar, Clock, AlertCircle } from 'lucide-react';

interface TaskDrawerProps {
    todo: Todo | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedTodo: Todo) => void;
}

export default function TaskDrawer({ todo, isOpen, onClose, onUpdate }: TaskDrawerProps) {
    const supabase = createClient();
    const [description, setDescription] = useState('');
    const [subtasks, setSubtasks] = useState<Subtask[]>([]);

    useEffect(() => {
        if (todo) {
            setDescription(todo.description || '');
            setSubtasks(todo.subtasks || []);
        }
    }, [todo]);

    const handleSaveDescription = async () => {
        if (!todo) return;
        const updated = { ...todo, description };
        onUpdate(updated);
        await supabase.from('todos').update({ description }).eq('id', todo.id);
    };

    const addSubtask = async () => {
        if (!todo) return;
        const newSubtask: Subtask = {
            id: crypto.randomUUID(),
            text: '',
            completed: false
        };
        const updatedSubtasks = [...subtasks, newSubtask];
        setSubtasks(updatedSubtasks);

        // Immediate save for UX? Or wait? 
        // Let's optimistic update locally first
        const updated = { ...todo, subtasks: updatedSubtasks };
        onUpdate(updated);
        await supabase.from('todos').update({ subtasks: updatedSubtasks }).eq('id', todo.id);
    };

    const updateSubtask = async (id: string, updates: Partial<Subtask>) => {
        if (!todo) return;
        const updatedSubtasks = subtasks.map(s => s.id === id ? { ...s, ...updates } : s);
        setSubtasks(updatedSubtasks);

        const updated = { ...todo, subtasks: updatedSubtasks };
        onUpdate(updated);
        await supabase.from('todos').update({ subtasks: updatedSubtasks }).eq('id', todo.id);
    };

    const deleteSubtask = async (id: string) => {
        if (!todo) return;
        const updatedSubtasks = subtasks.filter(s => s.id !== id);
        setSubtasks(updatedSubtasks);

        const updated = { ...todo, subtasks: updatedSubtasks };
        onUpdate(updated);
        await supabase.from('todos').update({ subtasks: updatedSubtasks }).eq('id', todo.id);
    };

    if (!todo) return null;

    return (
        <>
            <div className={`${styles.drawerOverlay} ${isOpen ? styles.open : ''}`} onClick={onClose} />
            <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
                <div className={styles.drawerHeader}>
                    <div className={styles.taskStatus}>
                        <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            background: todo.completed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                            color: todo.completed ? '#22c55e' : '#eab308',
                            fontSize: '0.85rem',
                            fontWeight: 600
                        }}>
                            {todo.completed ? 'Completed' : 'In Progress'}
                        </span>
                    </div>
                    <button className={styles.drawerClose} onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.drawerContent}>
                    <div>
                        <h2 className={styles.sectionTitle} style={{ color: 'var(--foreground)', fontSize: '1.5rem', marginBottom: '1rem', textTransform: 'none' }}>
                            {todo.text}
                        </h2>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {todo.dueDate && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', fontSize: '0.9rem' }}>
                                    <Calendar size={16} />
                                    {new Date(todo.dueDate).toDateString()}
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', fontSize: '0.9rem' }}>
                                <AlertCircle size={16} />
                                <span style={{ textTransform: 'capitalize' }}>{todo.priority} Priority</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.drawerSection}>
                        <h3 className={styles.sectionTitle}>Notes</h3>
                        <textarea
                            className={styles.descriptionInput}
                            placeholder="Add details, notes, or links..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={handleSaveDescription}
                        />
                    </div>

                    <div className={styles.drawerSection}>
                        <h3 className={styles.sectionTitle}>Subtasks</h3>
                        <div className={styles.subtaskList}>
                            {subtasks.map(subtask => (
                                <div key={subtask.id} className={styles.subtaskItem}>
                                    <input
                                        type="checkbox"
                                        checked={subtask.completed}
                                        onChange={(e) => updateSubtask(subtask.id, { completed: e.target.checked })}
                                        className={styles.checkbox}
                                        style={{ width: '16px', height: '16px' }}
                                    />
                                    <input
                                        type="text"
                                        value={subtask.text}
                                        onChange={(e) => updateSubtask(subtask.id, { text: e.target.value })}
                                        placeholder="Subtask name..."
                                        className={styles.subtaskInput}
                                        style={{ textDecoration: subtask.completed ? 'line-through' : 'none', opacity: subtask.completed ? 0.6 : 1 }}
                                    />
                                    <button onClick={() => deleteSubtask(subtask.id)} style={{ color: '#ef4444', opacity: 0.6 }}>
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className={styles.addSubtaskBtn} onClick={addSubtask}>
                            <Plus size={16} /> Add Subtask
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
