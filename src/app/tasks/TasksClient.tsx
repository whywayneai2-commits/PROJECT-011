"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Todo, FilterType } from '@/types/todo';
import AppLayout from '@/components/layout/AppLayout';
import styles from './Tasks.module.css';
import ListViewTaskCard from './ListViewTaskCard';
import TaskDrawer from './TaskDrawer';
import AddTodo from '@/components/AddTodo'; // Reusing this but might need styling tweaks

export default function TasksPage({ initialTodos, user }: { initialTodos: Todo[], user: any }) {
    const [todos, setTodos] = useState<Todo[]>(initialTodos);
    const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'high'>('all'); // Custom filters for this page
    const [sort, setSort] = useState<'date' | 'priority'>('date');
    const [selectedTask, setSelectedTask] = useState<Todo | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const supabase = createClient();

    // -- Todo Operations (Duplicate logic, ideally moved to hook or context) --
    // For now, implementing directly to ensure functionality

    const addTodo = async (text: string, priority: any, category: any, dueDate: string) => {
        const newTemp: Todo = {
            id: crypto.randomUUID(),
            text, priority, category, dueDate, completed: false, createdAt: Date.now()
        };
        setTodos([newTemp, ...todos]);

        const { data } = await supabase.from('todos').insert({
            text, priority, category, due_date: dueDate || null, user_id: user.id
        }).select().single();

        if (data) {
            const { data: refresh } = await supabase.from('todos').select('*').order('created_at', { ascending: false });
            if (refresh) setTodos(refresh as any);
        }
    };

    const toggleTodo = async (id: string) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;
        const newCompleted = !todo.completed;
        const updated = todos.map(t => t.id === id ? { ...t, completed: newCompleted } : t);
        setTodos(updated);

        // Also update selected task if it's the one open
        if (selectedTask?.id === id) {
            setSelectedTask({ ...selectedTask, completed: newCompleted });
        }

        await supabase.from('todos').update({ completed: newCompleted }).eq('id', id);
    };

    const deleteTodo = async (id: string) => {
        setTodos(todos.filter(t => t.id !== id));
        if (selectedTask?.id === id) {
            setIsDrawerOpen(false);
            setSelectedTask(null);
        }
        await supabase.from('todos').delete().eq('id', id);
    };

    const openDrawer = (todo: Todo) => {
        setSelectedTask(todo);
        setIsDrawerOpen(true);
    };

    const handleUpdateTask = (updated: Todo) => {
        setTodos(todos.map(t => t.id === updated.id ? updated : t));
        setSelectedTask(updated);
    };

    // -- Filtering & Sorting --
    let processedTodos = [...todos];

    if (filter === 'today') {
        const todayStr = new Date().toDateString();
        processedTodos = processedTodos.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === todayStr);
    } else if (filter === 'week') {
        // Simple "Next 7 days" logic
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);
        processedTodos = processedTodos.filter(t => t.dueDate && new Date(t.dueDate) <= nextWeek && new Date(t.dueDate) >= now);
    } else if (filter === 'high') {
        processedTodos = processedTodos.filter(t => t.priority === 'high');
    }

    if (sort === 'priority') {
        const pMap = { high: 3, medium: 2, low: 1 };
        processedTodos.sort((a, b) => pMap[b.priority] - pMap[a.priority]);
    } else {
        // Date (created or due?) - Let's stick to created descending (default) or Due Date ascending
        // Default is created desc from DB.
        // If sorting by Due Date:
        processedTodos.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
    }

    return (
        <AppLayout user={user}>
            <div className={styles.container}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--foreground)' }}>My Tasks</h1>
                    <p style={{ color: '#a1a1aa' }}>Manage and organize your daily work.</p>
                </div>

                <div className={styles.controls}>
                    <div className={styles.filterGroup}>
                        <button className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`} onClick={() => setFilter('all')}>All Tasks</button>
                        <button className={`${styles.filterBtn} ${filter === 'today' ? styles.active : ''}`} onClick={() => setFilter('today')}>Today</button>
                        <button className={`${styles.filterBtn} ${filter === 'week' ? styles.active : ''}`} onClick={() => setFilter('week')}>Week</button>
                        <button className={`${styles.filterBtn} ${filter === 'high' ? styles.active : ''}`} onClick={() => setFilter('high')}>High Priority</button>
                    </div>

                    <div className={styles.filterGroup}>
                        <button className={`${styles.filterBtn} ${sort === 'date' ? styles.active : ''}`} onClick={() => setSort('date')}>Date</button>
                        <button className={`${styles.filterBtn} ${sort === 'priority' ? styles.active : ''}`} onClick={() => setSort('priority')}>Priority</button>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <AddTodo onAdd={addTodo} />
                </div>

                <div className={styles.taskList}>
                    {processedTodos.length > 0 ? (
                        processedTodos.map(todo => (
                            <ListViewTaskCard
                                key={todo.id}
                                todo={todo}
                                onToggle={toggleTodo}
                                onDelete={deleteTodo}
                                onClick={openDrawer}
                            />
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#a1a1aa' }}>
                            No tasks found matching current filters.
                        </div>
                    )}
                </div>

                <TaskDrawer
                    todo={selectedTask}
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    onUpdate={handleUpdateTask}
                />
            </div>
        </AppLayout>
    );
}
