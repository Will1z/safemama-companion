-- Create reports table for voice check-ins
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  transcript text not null,
  summary jsonb not null,
  triage jsonb not null,
  created_at timestamptz not null default now()
);

-- Add RLS policy
alter table public.reports enable row level security;

-- Policy: Users can only see their own reports
create policy "Users can view own reports" on public.reports
  for select using (auth.uid()::text = user_id);

-- Policy: Users can insert their own reports
create policy "Users can insert own reports" on public.reports
  for insert with check (auth.uid()::text = user_id);

-- Policy: Clinicians can view all reports (if you have a clinicians table)
-- create policy "Clinicians can view all reports" on public.reports
--   for select using (
--     exists (
--       select 1 from public.user_profiles 
--       where id = auth.uid() and role = 'clinician'
--     )
--   );

-- Create index for better performance
create index if not exists idx_reports_user_id on public.reports(user_id);
create index if not exists idx_reports_created_at on public.reports(created_at desc);
create index if not exists idx_reports_triage_tier on public.reports using gin ((triage->>'tier'));
