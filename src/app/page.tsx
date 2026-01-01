import { createClient } from '@/utils/supabase/server';

import ThemeToggle from '@/components/ThemeToggle';

import styles from './page.module.css';
import { logout } from './login/actions';

import LandingPage from '@/components/LandingPage';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/components/dashboard/Dashboard';


export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LandingPage />;
  }

  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  // Fetch Focus Sessions for Analytics
  const { data: focusSessions } = await supabase
    .from('focus_sessions')
    .select('duration_seconds')
    .eq('user_id', user.id)
    .gte('created_at', new Date().toISOString().split('T')[0]); // Only today

  const todayFocusSeconds = focusSessions?.reduce((acc, session: any) => acc + session.duration_seconds, 0) || 0;

  return (
    <AppLayout user={user}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--foreground)' }}>
          Welcome back, {user.user_metadata?.full_name?.split(' ')[0] || 'User'} 👋
        </h1>
        <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>Here's what you need to focus on today.</p>

        <Dashboard initialTodos={todos || []} user={user} focusSeconds={todayFocusSeconds} />
      </div>
    </AppLayout>
  );
}
