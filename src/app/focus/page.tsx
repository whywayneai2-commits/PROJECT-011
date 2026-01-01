import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import FocusClient from './FocusClient';

export default async function FocusPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: todos } = await supabase
        .from('todos')
        .select('*');

    const mappedTodos = (todos || []).map((t: any) => ({
        ...t,
        createdAt: t.created_at ? new Date(t.created_at).getTime() : Date.now(),
        dueDate: t.due_date,
    }));

    return <FocusClient initialTodos={mappedTodos} user={user} />;
}
