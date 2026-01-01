-- Create focus_sessions table
CREATE TABLE IF NOT EXISTS focus_sessions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    task_id uuid REFERENCES todos(id),
    duration_seconds integer NOT NULL,
    created_at timestamptz DEFAULT now(),
    completed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own focus sessions"
    ON focus_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own focus sessions"
    ON focus_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);
