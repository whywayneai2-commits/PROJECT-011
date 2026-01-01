"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from './TaskModal.module.css';
import { X, Save, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Priority, Category } from '@/types/todo';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTaskCreated: (task: any) => void;
    user: any;
}

export default function CreateTaskModal({ isOpen, onClose, onTaskCreated, user }: CreateTaskModalProps) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');
    const [category, setCategory] = useState<Category>('personal');
    const [tagsInput, setTagsInput] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

        const { data, error } = await supabase.from('todos').insert({
            text: title,
            description,
            priority,
            category,
            due_date: dueDate || null,
            tags,
            user_id: user.id
            // completed: false (default), subtasks: [] (default)
        }).select().single();

        setLoading(false);

        if (error) {
            console.error(error);
            alert('Failed to create task');
            return;
        }

        if (data) {
            onTaskCreated(data);
            onClose();
            // Reset form
            setTitle('');
            setDescription('');
            setDueDate('');
            setTagsInput('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Create New Task</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                    <div className={styles.content}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Task Title</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="What needs to be done?"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                className={`${styles.input} ${styles.textarea}`}
                                placeholder="Add details..."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup} style={{ flex: 1 }}>
                                <label className={styles.label}>Due Date</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="datetime-local"
                                        className={styles.input}
                                        style={{ width: '100%' }}
                                        value={dueDate}
                                        onChange={e => setDueDate(e.target.value)}
                                    />
                                    <Calendar size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#a1a1aa' }} />
                                </div>
                            </div>

                            <div className={styles.formGroup} style={{ flex: 1 }}>
                                <label className={styles.label}>Priority</label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        className={`${styles.input} ${styles.select}`}
                                        style={{ width: '100%' }}
                                        value={priority}
                                        onChange={e => setPriority(e.target.value as Priority)}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                    <AlertCircle size={18} style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#a1a1aa' }} />
                                </div>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup} style={{ flex: 1 }}>
                                <label className={styles.label}>Category</label>
                                <select
                                    className={`${styles.input} ${styles.select}`}
                                    value={category}
                                    onChange={e => setCategory(e.target.value as Category)}
                                >
                                    <option value="personal">Personal</option>
                                    <option value="work">Work</option>
                                    <option value="shopping">Shopping</option>
                                    <option value="health">Health</option>
                                    <option value="finance">Finance</option>
                                </select>
                            </div>

                            <div className={styles.formGroup} style={{ flex: 1 }}>
                                <label className={styles.label}>Tags</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="urgent, project-x..."
                                        value={tagsInput}
                                        onChange={e => setTagsInput(e.target.value)}
                                    />
                                    <Tag size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#a1a1aa' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.saveBtn} disabled={loading}>
                            <Save size={18} />
                            {loading ? 'Saving...' : 'Save Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
