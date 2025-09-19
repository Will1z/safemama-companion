/**
 * Medication database queries and operations
 */

import { getSupabaseAdmin } from './supabase/server';
import { computeDueStatus, getUserTimezone, type FrequencyType } from './medication-schedule';

export interface MedicationWithIntake {
  id: string;
  name: string;
  dosage: string;
  frequency_type: FrequencyType;
  interval_hours?: number;
  timezone: string;
  latest_intake_at?: string;
}

export interface MedicationStatus extends MedicationWithIntake {
  dueNow: boolean;
  nextDueAt: string;
  lastTakenAgo: string | null;
}

/**
 * Get medications with their latest intake for a user
 */
export async function getMedicationsWithLatestIntake(userId: string): Promise<MedicationWithIntake[]> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('medications')
    .select(`
      id,
      name,
      dosage,
      frequency_type,
      interval_hours,
      timezone,
      medication_intakes!inner(taken_at)
    `)
    .eq('user_id', userId)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching medications:', error);
    throw new Error('Failed to fetch medications');
  }

  // Group by medication and get latest intake
  const medicationMap = new Map<string, MedicationWithIntake>();
  
  data?.forEach((row: any) => {
    const medId = row.id;
    if (!medicationMap.has(medId)) {
      medicationMap.set(medId, {
        id: row.id,
        name: row.name,
        dosage: row.dosage,
        frequency_type: row.frequency_type,
        interval_hours: row.interval_hours,
        timezone: row.timezone,
        latest_intake_at: undefined
      });
    }
    
    // Keep track of latest intake
    const currentLatest = medicationMap.get(medId)!.latest_intake_at;
    const intakeTime = row.medication_intakes?.taken_at;
    if (intakeTime && (!currentLatest || new Date(intakeTime) > new Date(currentLatest))) {
      medicationMap.get(medId)!.latest_intake_at = intakeTime;
    }
  });

  return Array.from(medicationMap.values());
}

/**
 * Mark a medication as taken
 */
export async function markMedicationTaken(userId: string, medicationId: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  
  const { error } = await supabase
    .from('medication_intakes')
    .insert({
      user_id: userId,
      medication_id: medicationId,
      taken_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error marking medication as taken:', error);
    throw new Error('Failed to mark medication as taken');
  }
}

/**
 * Get medications with computed due status
 */
export async function getMedicationsWithStatus(userId: string, userTimezone?: string): Promise<MedicationStatus[]> {
  const medications = await getMedicationsWithLatestIntake(userId);
  const tz = getUserTimezone(userTimezone);
  
  return medications.map(med => {
    const status = computeDueStatus({
      now: new Date(),
      tz: med.timezone || tz,
      frequencyType: med.frequency_type,
      intervalHours: med.interval_hours,
      latestIntakeAt: med.latest_intake_at
    });

    return {
      ...med,
      dueNow: status.dueNow,
      nextDueAt: status.nextDueAt,
      lastTakenAgo: status.lastTakenAgo
    };
  });
}

/**
 * Undo the latest medication intake (only for daily medications on the same day)
 */
export async function undoLatestIntake(userId: string, medicationId: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  
  // Get the latest intake for this medication
  const { data: latestIntake, error: fetchError } = await supabase
    .from('medication_intakes')
    .select('id, taken_at')
    .eq('user_id', userId)
    .eq('medication_id', medicationId)
    .order('taken_at', { ascending: false })
    .limit(1)
    .single();

  if (fetchError || !latestIntake) {
    throw new Error('No intake found to undo');
  }

  // Delete the latest intake
  const { error: deleteError } = await supabase
    .from('medication_intakes')
    .delete()
    .eq('id', latestIntake.id);

  if (deleteError) {
    console.error('Error undoing medication intake:', deleteError);
    throw new Error('Failed to undo medication intake');
  }
}
