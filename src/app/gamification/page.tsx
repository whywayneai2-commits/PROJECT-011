import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import GamificationClient from './GamificationClient';

export default async function GamificationPage() {
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

    return <GamificationClient initialTodos={todos || []} user={user} />;
}
