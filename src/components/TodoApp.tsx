"use client";

import { useState, useEffect } from 'react';
import { Todo, Priority, Category, FilterType } from '@/types/todo';
import AddTodo from '@/components/AddTodo';
import TodoItem from '@/components/TodoItem';
import { createClient } from '@/utils/supabase/client';
import styles from '@/app/page.module.css';

interface TodoAppProps {
    initialTodos: Todo[];
    user: any;
}

export default function TodoApp({ initialTodos, user }: TodoAppProps) {
    const [todos, setTodos] = useState<Todo[]>(initialTodos);
    const [filter, setFilter] = useState<FilterType>('all');
    const [search, setSearch] = useState('');
    const supabase = createClient();

    const addTodo = async (text: string, priority: Priority, category: Category, dueDate: string) => {
        const newTodoLocal: Todo = {
            id: crypto.randomUUID(),
            text,
            priority,
            category,
            dueDate: dueDate || undefined,
            completed: false,
            createdAt: Date.now(),
        };

        // Optimistic update
        setTodos([newTodoLocal, ...todos]);

        const { data, error } = await supabase.from('todos').insert({
            text,
            priority,
            category,
            due_date: dueDate || null,
            user_id: user.id
        }).select().single();

        if (error) {
            console.error('Error adding todo:', error);
            // Rollback? Or just alert.
        } else if (data) {
            // Update temporary ID with real ID if needed, though UUIDs matching is hard with optimistics without real ID from start.
            // Actually, let's just re-fetch or let subscription handle it.
            // For now, simple standard fetch:
            const { data: refresh } = await supabase.from('todos').select('*').order('created_at', { ascending: false });
            if (refresh) setTodos(refresh as any);
        }
    };

    const toggleTodo = async (id: string) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        const newCompleted = !todo.completed;
        setTodos(todos.map(t => t.id === id ? { ...t, completed: newCompleted } : t));

        await supabase.from('todos').update({ completed: newCompleted }).eq('id', id);
    };

    const deleteTodo = async (id: string) => {
        setTodos(todos.filter(t => t.id !== id));
        await supabase.from('todos').delete().eq('id', id);
    };

    const filteredTodos = todos
        .filter(t => {
            if (filter === 'active') return !t.completed;
            if (filter === 'completed') return t.completed;
            return true;
        })
        .filter(t => t.text.toLowerCase().includes(search.toLowerCase()));

    const stats = {
        total: todos.length,
        active: todos.filter(t => !t.completed).length,
        completed: todos.filter(t => t.completed).length,
    };

    return (
        <>
            <div className="container" style={{ maxWidth: '800px' }}>

                <AddTodo onAdd={addTodo} />

                <div className="glass-card" style={{ padding: '1.5rem', marginTop: '2rem' }}>
                    <div className={styles.controls}>
                        <div className={styles.tabs}>
                            {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
                                <button
                                    key={f}
                                    className={`${styles.tab} ${filter === f ? styles.activeTab : ''}`}
                                    onClick={() => setFilter(f)}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                    <span className={styles.badge}>{
                                        f === 'all' ? stats.total : f === 'active' ? stats.active : stats.completed
                                    }</span>
                                </button>
                            ))}
                        </div>

                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className={styles.searchInput}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className={styles.list}>
                        {filteredTodos.length > 0 ? (
                            filteredTodos.map(todo => (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    onToggle={toggleTodo}
                                    onDelete={deleteTodo}
                                />
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                <p>No tasks found. Time to relax? 🌴</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </>
    );
}
