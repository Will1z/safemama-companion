import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Fetch all facilities from the database
    const { data: facilities, error } = await supabase
      .from('facilities')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching facilities:', error);
      return NextResponse.json(
        { error: 'Failed to fetch facilities' },
        { status: 500 }
      );
    }

    return NextResponse.json(facilities || []);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
