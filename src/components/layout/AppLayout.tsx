"use client";

import styles from './Layout.module.css';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppLayout({
    children,
    user
}: {
    children: React.ReactNode;
    user: any;
}) {
    return (
        <div className={styles.container}>
            <Sidebar user={user} />
            <div className={styles.mainWrapper}>
                <TopBar user={user} />
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
}
