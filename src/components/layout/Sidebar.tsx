"use client";

import styles from './Layout.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    CheckSquare,
    Calendar,
    Target,
    BarChart2,
    Trophy,
    Settings,
    LogOut
} from 'lucide-react';
import { logout } from '@/app/login/actions';

export default function Sidebar({ user }: { user: any }) {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
        { name: 'My Tasks', icon: CheckSquare, href: '/tasks' },
        { name: 'Calendar', icon: Calendar, href: '/calendar' },
        { name: 'Focus Mode', icon: Target, href: '/focus' },
        { name: 'Analytics', icon: BarChart2, href: '/analytics' },
        { name: 'Gamification', icon: Trophy, href: '/gamification' },
        { name: 'Settings', icon: Settings, href: '/settings' },
    ];

    // Get initials for avatar
    const initials = user.user_metadata?.full_name
        ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
        : user.email?.substring(0, 2).toUpperCase();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <span className="text-gradient">TaskIt</span>
            </div>

            <nav className={styles.nav}>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                        >
                            <Icon className={styles.navItemIcon} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.userSection}>
                <div className={styles.avatar}>
                    {user.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        initials
                    )}
                </div>
                <div className={styles.userInfo}>
                    <div className={styles.userName}>
                        {user.user_metadata?.full_name || 'User'}
                    </div>
                    <div className={styles.userEmail}>
                        {user.email}
                    </div>
                </div>
                <form action={logout}>
                    <button type="submit" className={styles.logoutBtn} title="Logout">
                        <LogOut size={18} />
                    </button>
                </form>
            </div>
        </aside>
    );
}
