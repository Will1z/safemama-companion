-- Add frequency configuration to medications table
alter table medications
  add column if not exists frequency_type text check (frequency_type in ('daily','interval')) default 'daily',
  add column if not exists interval_hours int check (interval_hours between 1 and 168), -- 1 hour to 7 days
  add column if not exists timezone text default 'Africa/Lagos';

-- Create medication intake log table
create table if not exists medication_intakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  medication_id uuid not null references medications(id) on delete cascade,
  taken_at timestamptz not null default now()
);

-- Create index for efficient queries
create index if not exists idx_med_intakes_user_med_taken_at on medication_intakes (user_id, medication_id, taken_at desc);

-- RLS policies for medication_intakes
alter table medication_intakes enable row level security;

-- Users can only access their own intake records
create policy "Users can view their own medication intakes" on medication_intakes
  for select using (auth.uid() = user_id);

create policy "Users can insert their own medication intakes" on medication_intakes
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own medication intakes" on medication_intakes
  for delete using (auth.uid() = user_id);
