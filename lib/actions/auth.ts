'use server';

import { createServerClient } from '@/lib/supabase/server';
import { ensureProfile } from '@/lib/auth-utils';

export async function ensureUserProfile(userId: string, displayName?: string) {
  try {
    await ensureProfile(userId, displayName);
    return { success: true };
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    return { success: false, error: 'Failed to create user profile' };
  }
}
