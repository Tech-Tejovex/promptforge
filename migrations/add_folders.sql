CREATE TABLE IF NOT EXISTS folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE prompts ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES folders(id);
CREATE INDEX IF NOT EXISTS idx_prompts_folder_id ON prompts(folder_id);
