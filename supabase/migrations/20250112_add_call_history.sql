-- Create call_history table to store voice conversation summaries
CREATE TABLE IF NOT EXISTS call_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  summary TEXT NOT NULL,
  patient_name TEXT,
  patient_phone TEXT,
  recipient_email TEXT,
  whatsapp_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient user queries
CREATE INDEX IF NOT EXISTS idx_call_history_user_id ON call_history(user_id);
CREATE INDEX IF NOT EXISTS idx_call_history_created_at ON call_history(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE call_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own call history
CREATE POLICY "Users can view their own call history" ON call_history
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow system to insert call history
CREATE POLICY "System can insert call history" ON call_history
  FOR INSERT WITH CHECK (true);

-- Create policy to allow system to update call history
CREATE POLICY "System can update call history" ON call_history
  FOR UPDATE USING (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_call_history_updated_at 
  BEFORE UPDATE ON call_history 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
