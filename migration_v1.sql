-- 1. Add columns to 'todos' table if not exists (existing migration)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'todos' AND column_name = 'description') THEN
        ALTER TABLE todos ADD COLUMN description text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'todos' AND column_name = 'tags') THEN
        ALTER TABLE todos ADD COLUMN tags text[] DEFAULT '{}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'todos' AND column_name = 'subtasks') THEN
        ALTER TABLE todos ADD COLUMN subtasks jsonb[] DEFAULT '{}';
    END IF;
END $$;

-- 2. Create 'avatars' storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up Storage Policies for 'avatars'
-- Allow public read access
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK ( bucket_id = 'avatars' );

-- Allow users to update their own avatars (assuming file name contains user id, or just general auth write for this bucket for simplicity in this demo)
CREATE POLICY "Authenticated users can update avatars"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING ( bucket_id = 'avatars' );
