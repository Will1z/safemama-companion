-- Comprehensive RLS hardening for all user tables
-- This migration is idempotent - it only creates policies if they don't exist

-- Enable RLS on all user tables (skip silently if table doesn't exist)
DO $$
BEGIN
  -- Enable RLS on conversation tables
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='conversation_summaries') THEN
    ALTER TABLE public.conversation_summaries ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='conversation_turns') THEN
    ALTER TABLE public.conversation_turns ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- Enable RLS on medication tables
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='medication_intakes') THEN
    ALTER TABLE public.medication_intakes ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- Enable RLS on report tables
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='reports') THEN
    ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- Enable RLS on health data tables
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='pregnancies') THEN
    ALTER TABLE public.pregnancies ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='vitals') THEN
    ALTER TABLE public.vitals ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='symptoms') THEN
    ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- Enable RLS on user tables
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_profiles') THEN
    ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END$$;

-- Helper function to check if a policy exists
CREATE OR REPLACE FUNCTION public._policy_exists(tbl regclass, polname text)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = split_part(tbl::text, '.', 2) 
    AND schemaname = split_part(tbl::text, '.', 1) 
    AND policyname = $2
  );
$$;

-- Create comprehensive RLS policies for user-scoped tables
DO $$
DECLARE
  t RECORD;
BEGIN
  -- Loop through all user tables that need RLS policies
  FOR t IN
    SELECT unnest(ARRAY[
      'public.conversation_summaries',
      'public.conversation_turns', 
      'public.medication_intakes',
      'public.reports',
      'public.pregnancies',
      'public.vitals',
      'public.symptoms'
    ]) AS tbl
  LOOP
    -- Only create policies if table exists
    IF EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = split_part(t.tbl, '.', 1) 
      AND table_name = split_part(t.tbl, '.', 2)
    ) THEN
      -- SELECT policy: users can only see their own rows
      IF NOT public._policy_exists(t.tbl::regclass, 'own_rows_select') THEN
        EXECUTE format(
          'CREATE POLICY own_rows_select ON %s FOR SELECT USING (auth.uid() = user_id)',
          t.tbl
        );
      END IF;
      
      -- INSERT policy: users can only insert rows with their own user_id
      IF NOT public._policy_exists(t.tbl::regclass, 'own_rows_insert') THEN
        EXECUTE format(
          'CREATE POLICY own_rows_insert ON %s FOR INSERT WITH CHECK (auth.uid() = user_id)',
          t.tbl
        );
      END IF;
      
      -- UPDATE policy: users can only update their own rows
      IF NOT public._policy_exists(t.tbl::regclass, 'own_rows_update') THEN
        EXECUTE format(
          'CREATE POLICY own_rows_update ON %s FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)',
          t.tbl
        );
      END IF;
      
      -- DELETE policy: users can only delete their own rows
      IF NOT public._policy_exists(t.tbl::regclass, 'own_rows_delete') THEN
        EXECUTE format(
          'CREATE POLICY own_rows_delete ON %s FOR DELETE USING (auth.uid() = user_id)',
          t.tbl
        );
      END IF;
    END IF;
  END LOOP;
END$$;

-- Special handling for user_profiles table (uses 'id' instead of 'user_id')
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_profiles') THEN
    -- SELECT policy: users can view their own profile
    IF NOT public._policy_exists('public.user_profiles'::regclass, 'profiles_select_own') THEN
      CREATE POLICY profiles_select_own ON public.user_profiles
        FOR SELECT USING (auth.uid() = id);
    END IF;
    
    -- UPDATE policy: users can update their own profile
    IF NOT public._policy_exists('public.user_profiles'::regclass, 'profiles_update_own') THEN
      CREATE POLICY profiles_update_own ON public.user_profiles
        FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
    END IF;
    
    -- INSERT policy: users can insert their own profile (handled by trigger)
    IF NOT public._policy_exists('public.user_profiles'::regclass, 'profiles_insert_own') THEN
      CREATE POLICY profiles_insert_own ON public.user_profiles
        FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
  END IF;
END$$;

-- Grant necessary permissions for authenticated users
DO $$
BEGIN
  -- Grant usage on schema
  GRANT USAGE ON SCHEMA public TO authenticated;
  
  -- Grant table permissions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_profiles') THEN
    GRANT ALL ON public.user_profiles TO authenticated;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='conversation_summaries') THEN
    GRANT ALL ON public.conversation_summaries TO authenticated;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='conversation_turns') THEN
    GRANT ALL ON public.conversation_turns TO authenticated;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='medication_intakes') THEN
    GRANT ALL ON public.medication_intakes TO authenticated;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='reports') THEN
    GRANT ALL ON public.reports TO authenticated;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='pregnancies') THEN
    GRANT ALL ON public.pregnancies TO authenticated;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='vitals') THEN
    GRANT ALL ON public.vitals TO authenticated;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='symptoms') THEN
    GRANT ALL ON public.symptoms TO authenticated;
  END IF;
END$$;
