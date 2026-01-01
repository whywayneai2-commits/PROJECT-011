-- Create the table
create table todos (
  id uuid default gen_random_uuid() primary key,
  text text not null,
  completed boolean default false,
  priority text check (priority in ('low', 'medium', 'high')),
  category text check (category in ('personal', 'work', 'shopping', 'health', 'finance')),
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null
);

-- Enable RLS
alter table todos enable row level security;

-- Create policies
create policy "Individuals can create their own todos." on todos for
    insert with check (auth.uid() = user_id);

create policy "Individuals can view their own todos." on todos for
    select using (auth.uid() = user_id);

create policy "Individuals can update their own todos." on todos for
    update using (auth.uid() = user_id);

create policy "Individuals can delete their own todos." on todos for
    delete using (auth.uid() = user_id);
