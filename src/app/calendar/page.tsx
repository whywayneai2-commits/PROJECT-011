import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import CalendarClient from './CalendarClient';

export default async function CalendarPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch all tasks for now. In a real app with thousands of tasks, you'd filter by date range (month start/end)
    const { data: todos } = await supabase
        .from('todos')
        .select('*')
        .order('due_date', { ascending: true });

    const mappedTodos = (todos || []).map((t: any) => ({
        ...t,
        createdAt: t.created_at ? new Date(t.created_at).getTime() : Date.now(),
        dueDate: t.due_date,
    }));

    return <CalendarClient initialTodos={mappedTodos} user={user} />;
}
