-- Add default_clinician_email field to profiles table
-- This allows users to set a default email address for their healthcare provider

-- Add the new column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS default_clinician_email TEXT;

-- Add a comment to document the field
COMMENT ON COLUMN profiles.default_clinician_email IS 'Default email address for the user''s healthcare provider/clinician';

-- Add an index for performance when looking up default emails
CREATE INDEX IF NOT EXISTS idx_profiles_default_clinician_email 
ON profiles(default_clinician_email) 
WHERE default_clinician_email IS NOT NULL;

-- The existing RLS policies will automatically apply to this new column
-- since they use "for all" on the profiles table
