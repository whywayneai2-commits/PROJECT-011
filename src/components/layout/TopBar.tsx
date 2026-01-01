"use client";

import { useState } from 'react';
import styles from './Layout.module.css';
import { Search, Bell, Plus } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import CreateTaskModal from '@/components/modals/CreateTaskModal';

export default function TopBar({ user }: { user?: any }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Get initials for topbar avatar as well
    const initials = user?.user_metadata?.full_name
        ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
        : user?.email?.substring(0, 2).toUpperCase() || 'U';

    const handleTaskCreated = (newTask: any) => {
        // Simple reload for MVP to reflect changes
        window.location.reload();
    };

    return (
        <>
            <header className={styles.topbar}>
                <div className={styles.searchContainer}>
                    <Search className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search tasks, categories..."
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.topbarActions}>
                    <button className={styles.primaryActionBtn} onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} />
                        <span>New Task</span>
                    </button>

                    <ThemeToggle />

                    <button className={styles.actionBtn}>
                        <Bell size={18} />
                    </button>

                    <div className={styles.topbarAvatar} title={user?.email}>
                        {user.user_metadata?.avatar_url ? (
                            <img src={user.user_metadata.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            initials
                        )}
                    </div>
                </div>
            </header>

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={user}
                onTaskCreated={handleTaskCreated}
            />
        </>
    );
}
