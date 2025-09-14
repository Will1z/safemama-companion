import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';

export const createClient = () => {
  try {
    return createClientComponentClient<Database>();
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    throw new Error('Failed to initialize authentication client');
  }
};
