"use client";

import { useState } from 'react';
import { Todo } from '@/types/todo';
import AppLayout from '@/components/layout/AppLayout';
import styles from './Calendar.module.css';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import ListViewTaskCard from '@/app/tasks/ListViewTaskCard'; // reuse
import TaskDrawer from '@/app/tasks/TaskDrawer'; // reuse
import { createClient } from '@/utils/supabase/client';

export default function CalendarClient({ initialTodos, user }: { initialTodos: Todo[], user: any }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [todos, setTodos] = useState<Todo[]>(initialTodos);
    const [selectedTask, setSelectedTask] = useState<Todo | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Calendar Generation Logic
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun

        // Adjust for Monday start if desired, but let's stick to Sun=0 for standard grid
        const paddingDays = firstDayOfMonth;

        const days = [];

        // Padding days from prev month
        for (let i = 0; i < paddingDays; i++) {
            days.push({ day: null, fullDate: null });
        }

        // Active days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                fullDate: new Date(year, month, i)
            });
        }

        // Suffix padding to complete row
        while (days.length % 7 !== 0) {
            days.push({ day: null, fullDate: null });
        }

        return days;
    };

    const days = getDaysInMonth(currentDate);

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    // Filter tasks for a specific date
    const getTasksForDate = (date: Date | null) => {
        if (!date) return [];
        return todos.filter(t => {
            if (!t.dueDate) return false;
            const tDate = new Date(t.dueDate);
            return tDate.getDate() === date.getDate() &&
                tDate.getMonth() === date.getMonth() &&
                tDate.getFullYear() === date.getFullYear();
        });
    };

    // Handlers
    const supabase = createClient();
    const handleToggle = async (id: string) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;
        const newCompleted = !todo.completed;
        setTodos(todos.map(t => t.id === id ? { ...t, completed: newCompleted } : t));
        await supabase.from('todos').update({ completed: newCompleted }).eq('id', id);
    };

    const handleDelete = async (id: string) => {
        setTodos(todos.filter(t => t.id !== id));
        await supabase.from('todos').delete().eq('id', id);
    };

    const handleUpdateTask = (updated: Todo) => {
        setTodos(todos.map(t => t.id === updated.id ? updated : t));
        setSelectedTask(updated);
    };

    const priorityColors: Record<string, string> = {
        high: '#ef4444',
        medium: '#f59e0b',
        low: '#22c55e'
    };

    return (
        <AppLayout user={user}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.controls}>
                        <button className={styles.navBtn} onClick={() => changeMonth(-1)}>
                            <ChevronLeft size={20} />
                        </button>
                        <h2 className={styles.title}>
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h2>
                        <button className={styles.navBtn} onClick={() => changeMonth(1)}>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className={styles.calendarGrid}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className={styles.dayHeader}>{d}</div>
                    ))}

                    {days.map((d, i) => {
                        const isToday = d.fullDate && new Date().toDateString() === d.fullDate.toDateString();
                        const dayTasks = getTasksForDate(d.fullDate);

                        if (!d.day || !d.fullDate) return <div key={i} className={`${styles.dayCell} ${styles.otherMonth}`} />;

                        return (
                            <div
                                key={i}
                                className={`${styles.dayCell} ${isToday ? styles.today : ''}`}
                                onClick={() => setSelectedDate(d.fullDate)}
                            >
                                <div className={styles.dayNumber}>{d.day}</div>
                                {dayTasks.slice(0, 3).map(task => (
                                    <div
                                        key={task.id}
                                        className={styles.taskBar}
                                        style={{
                                            background: priorityColors[task.priority] || '#a1a1aa',
                                            opacity: task.completed ? 0.5 : 1
                                        }}
                                    >
                                        {task.text}
                                    </div>
                                ))}
                                {dayTasks.length > 3 && (
                                    <div className={styles.moreTasks}>+{dayTasks.length - 3} more</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Selected Date Modal/Panel */}
            {selectedDate && (
                <>
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 40, backdropFilter: 'blur(4px)' }} onClick={() => setSelectedDate(null)} />
                    <div className={styles.detailsPanel} style={{ zIndex: 50, width: '500px', height: 'auto', maxHeight: '80vh', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <div className={styles.detailsHeader}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                                Tasks for {selectedDate.toLocaleDateString()}
                            </h3>
                            <button className={styles.navBtn} onClick={() => setSelectedDate(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {getTasksForDate(selectedDate).length > 0 ? (
                                getTasksForDate(selectedDate).map(task => (
                                    <ListViewTaskCard
                                        key={task.id}
                                        todo={task}
                                        onToggle={handleToggle}
                                        onDelete={handleDelete}
                                        onClick={(t) => {
                                            setSelectedTask(t);
                                            setIsDrawerOpen(true);
                                        }}
                                    />
                                ))
                            ) : (
                                <p style={{ color: '#a1a1aa', textAlign: 'center', padding: '1rem' }}>No tasks for this day.</p>
                            )}
                        </div>
                    </div>
                </>
            )}

            <TaskDrawer
                todo={selectedTask}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onUpdate={handleUpdateTask}
            />
        </AppLayout>
    );
}
