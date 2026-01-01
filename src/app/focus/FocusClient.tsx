"use client";

import { useState, useEffect, useRef } from 'react';
import { Todo } from '@/types/todo';
import AppLayout from '@/components/layout/AppLayout';
import styles from './Focus.module.css';
import { Play, Pause, RotateCcw, ChevronDown, CheckCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function FocusClient({ initialTodos, user }: { initialTodos: Todo[], user: any }) {
    // Timer State
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins in seconds
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');

    // Task State
    const [selectedTask, setSelectedTask] = useState<Todo | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Filter pending tasks
    const pendingTodos = initialTodos.filter(t => !t.completed);

    const supabase = createClient();

    useEffect(() => {
        if (pendingTodos.length > 0 && !selectedTask) {
            setSelectedTask(pendingTodos[0]);
        }
    }, [pendingTodos, selectedTask]);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // Timer just finished
            setIsActive(false);
            if (timerRef.current) clearInterval(timerRef.current);

            // Play Notification Sound
            const audio = new Audio('/notification.mp3'); // We'll need a sound file, but this is placeholder
            audio.play().catch(e => console.log('Audio play failed', e));

            // Save Session if it was a FOCUS session
            if (mode === 'focus') {
                const duration = 25 * 60; // 25 mins
                const saveSession = async () => {
                    await supabase.from('focus_sessions').insert({
                        user_id: user.id,
                        duration_seconds: duration,
                        task_id: selectedTask?.id || null
                    });
                    alert(`🎉 Session Complete! You focused for ${duration / 60} minutes.`);
                };
                saveSession();
            } else {
                alert('Break is over! Time to focus.');
            }
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft, mode, selectedTask, user.id]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        if (mode === 'focus') setTimeLeft(25 * 60);
        else if (mode === 'short') setTimeLeft(5 * 60);
        else setTimeLeft(15 * 60);
    };

    const changeMode = (newMode: 'focus' | 'short' | 'long') => {
        setMode(newMode);
        setIsActive(false);
        if (newMode === 'focus') setTimeLeft(25 * 60);
        else if (newMode === 'short') setTimeLeft(5 * 60);
        else setTimeLeft(15 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Circular Progress
    const initialTime = mode === 'focus' ? 25 * 60 : mode === 'short' ? 5 * 60 : 15 * 60;
    const progress = ((initialTime - timeLeft) / initialTime) * 100;
    const radius = 140;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - ((100 - progress) / 100) * circumference;

    return (
        <AppLayout user={user}>
            <div className={styles.container}>
                <div className={styles.modeToggle}>
                    <button className={`${styles.modeBtn} ${mode === 'focus' ? styles.active : ''}`} onClick={() => changeMode('focus')}>Focus</button>
                    <button className={`${styles.modeBtn} ${mode === 'short' ? styles.active : ''}`} onClick={() => changeMode('short')}>Short Break</button>
                    <button className={`${styles.modeBtn} ${mode === 'long' ? styles.active : ''}`} onClick={() => changeMode('long')}>Long Break</button>
                </div>

                <div className={styles.timerCircle}>
                    <svg className={styles.timerSvg}>
                        <circle className={styles.timerBg} cx="150" cy="150" r={radius} />
                        <circle
                            className={styles.timerProgress}
                            cx="150"
                            cy="150"
                            r={radius}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                        />
                    </svg>
                    <div className={styles.timeDisplay}>
                        {formatTime(timeLeft)}
                    </div>
                </div>
                <div className={styles.statusText}>
                    {isActive ? (mode === 'focus' ? 'Focusing...' : 'Resting...') : 'Ready to start'}
                </div>

                <div className={styles.controls}>
                    <button className={styles.controlBtn} onClick={resetTimer}>
                        <RotateCcw size={24} />
                    </button>
                    <button className={`${styles.controlBtn} ${styles.mainBtn}`} onClick={toggleTimer}>
                        {isActive ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
                    </button>
                    <button className={styles.controlBtn} onClick={() => {
                        // Mark task complete logic could go here
                        alert('Task Completed!');
                    }}>
                        <CheckCircle size={24} />
                    </button>
                </div>

                {mode === 'focus' && (
                    <div className={styles.taskSelector}>
                        <div className={styles.selectorLabel}>Focusing on:</div>
                        <div className={styles.selectedTask} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                            {selectedTask ? selectedTask.text : 'Select a task...'}
                            <ChevronDown size={20} />
                        </div>

                        {isDropdownOpen && (
                            <div className={styles.dropdown}>
                                {pendingTodos.map(todo => (
                                    <div
                                        key={todo.id}
                                        className={styles.dropdownItem}
                                        onClick={() => {
                                            setSelectedTask(todo);
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        {todo.text}
                                    </div>
                                ))}
                                {pendingTodos.length === 0 && <div style={{ color: '#a1a1aa' }}>No pending tasks!</div>}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
