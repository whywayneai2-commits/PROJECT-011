import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import TasksClient from './TasksClient';

export default async function TasksPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: todos } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

    return <TasksClient initialTodos={todos || []} user={user} />;
}
