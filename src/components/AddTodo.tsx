"use client";

import { useState } from 'react';
import { Priority, Category } from '@/types/todo';
import styles from './AddTodo.module.css';

interface AddTodoProps {
    onAdd: (text: string, priority: Priority, category: Category, dueDate: string) => void;
}

export default function AddTodo({ onAdd }: AddTodoProps) {
    const [text, setText] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');
    const [category, setCategory] = useState<Category>('personal');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        onAdd(text, priority, category, dueDate);
        setText('');
        setDueDate('');
        // Keep last used priority/category or reset? Let's keep them for quick entry.
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="What needs to be done?"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" className={styles.addButton} disabled={!text.trim()}>
                        Add Task
                    </button>
                </div>

                <div className={styles.optionsRow}>
                    <select
                        className={styles.select}
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as Priority)}
                    >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                    </select>

                    <select
                        className={styles.select}
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                    >
                        <option value="personal">Personal</option>
                        <option value="work">Work</option>
                        <option value="shopping">Shopping</option>
                        <option value="health">Health</option>
                        <option value="finance">Finance</option>
                    </select>

                    <input
                        type="date"
                        className={styles.select}
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>
            </form>
        </div>
    );
}
