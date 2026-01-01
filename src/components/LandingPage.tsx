'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, Smartphone, Zap, Shield, Layout, Menu, X, Calendar } from 'lucide-react';
import styles from './LandingPage.module.css';

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
                <div className={styles.navContainer}>
                    <Link href="/" className={styles.logo}>
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
                        TaskIt
                    </Link>

                    {/* Desktop Nav */}
                    <nav className={`${styles.navLinks} hidden md:flex`}>
                        <a href="#features" className={styles.navLink}>Features</a>
                        <a href="#how-it-works" className={styles.navLink}>How it Works</a>
                        <a href="#pricing" className={styles.navLink}>Pricing</a>
                    </nav>

                    <div className={styles.authButtons}>
                        <Link href="/login" className={styles.loginBtn}>
                            Log in
                        </Link>
                        <Link href="/signup" className={styles.signupBtn}>
                            Start for free
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.badge}>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        v2.0 is now live
                    </div>

                    <h1 className={styles.headline}>
                        Organize your life,<br />
                        <span className="text-gradient">master your time.</span>
                    </h1>

                    <p className={styles.subheadline}>
                        The all-in-one workspace for your tasks, notes, and calendar.
                        Designed for focus, built for speed.
                    </p>

                    <div className={styles.heroButtons}>
                        <Link href="/signup" className={styles.primaryBtn}>
                            Get Started <ArrowRight size={18} />
                        </Link>
                        <Link href="#features" className={styles.secondaryBtn}>
                            View Features
                        </Link>
                    </div>
                </div>

                <div className={styles.heroImageContainer}>
                    <div className="relative aspect-[16/9] w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
                        {/* Abstract UI Representation/Placeholder for Screenshot */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800">
                            <div className="flex h-full">
                                {/* Sidebar */}
                                <div className="w-64 border-r border-slate-700/50 p-4 hidden md:block">
                                    <div className="h-4 w-24 bg-slate-700/50 rounded mb-8"></div>
                                    <div className="space-y-3">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="h-3 w-full bg-slate-700/30 rounded"></div>
                                        ))}
                                    </div>
                                </div>
                                {/* Main Content */}
                                <div className="flex-1 p-8">
                                    <div className="h-8 w-48 bg-slate-700/50 rounded mb-8"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-32 bg-slate-700/30 rounded-lg border border-slate-600/20"></div>
                                        ))}
                                    </div>
                                    <div className="mt-8 space-y-3">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="h-12 w-full bg-slate-700/20 rounded border border-slate-600/10 flex items-center px-4">
                                                <div className="h-4 w-4 rounded-full border border-slate-500 mr-4"></div>
                                                <div className="h-3 w-1/2 bg-slate-700/30 rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Overlay Text only if image missing */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-slate-500 font-medium tracking-widest">APP DASHBOARD PREVIEW</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section id="features" className={styles.features}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Built for modern achievers</h2>
                    <p className={styles.sectionDesc}>Everything you need to manage your workflow effectively, without the clutter.</p>
                </div>

                <div className={styles.featuresGrid}>
                    <FeatureCard
                        icon={<Layout className="w-6 h-6" />}
                        title="Smart Organization"
                        desc="Automatically categorize tasks with projects, tags, and intelligent filters."
                    />
                    <FeatureCard
                        icon={<Calendar className="w-6 h-6" />}
                        title="Unified Calendar"
                        desc="See your to-dos alongside your events. Never miss a deadline again."
                    />
                    <FeatureCard
                        icon={<Zap className="w-6 h-6" />}
                        title="Focus Mode"
                        desc="Eliminate distractions with a dedicated focus timer and block interrupting apps."
                    />
                    <FeatureCard
                        icon={<Smartphone className="w-6 h-6" />}
                        title="Cross-Platform"
                        desc="Seamlessly sync between web, mobile, and desktop. Your data, everywhere."
                    />
                    <FeatureCard
                        icon={<Shield className="w-6 h-6" />}
                        title="Data Privacy"
                        desc="Your data is encrypted and secure. We don't sell your information."
                    />
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div>
                        <div className="text-xl font-bold mb-4">TaskIt</div>
                        <p className={styles.copyright}>© 2024 TaskIt Inc. All rights reserved.</p>
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="text-sm text-slate-400 hover:text-white">Privacy</a>
                        <a href="#" className="text-sm text-slate-400 hover:text-white">Terms</a>
                        <a href="#" className="text-sm text-slate-400 hover:text-white">Twitter</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
            <p className="text-slate-400 leading-relaxed">{desc}</p>
        </div>
    );
}
