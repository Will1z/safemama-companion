-- SafeMama Companion Tables Migration
-- Creates tables for emotional support, education, personalization, and community features

-- Profiles table for user information
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  due_date date,
  last_period_date date,
  language text default 'en',
  created_at timestamptz default now()
);

-- Pregnancy history for personalization
create table if not exists pregnancy_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  parity int default 0,
  previous_complications text,
  conditions text, -- comma list: hypertension, diabetes, etc
  created_at timestamptz default now()
);

-- Mood check-ins for emotional support
create table if not exists mood_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  mood text, -- calm, stressed, happy, sad, tired, nauseous
  note text,
  created_at timestamptz default now()
);

-- Education topics for learning modules
create table if not exists education_topics (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  trimester int check (trimester between 1 and 3),
  title text,
  summary text,
  content text, -- using text instead of markdown for compatibility
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- Daily tips for companion features
create table if not exists daily_tips (
  id uuid primary key default gen_random_uuid(),
  trimester int,
  risk_tags text[] default '{}', -- e.g. ["hypertension", "anemia"]
  message text,
  source text,
  locale text default 'en'
);

-- Micro communities for optional community features
create table if not exists micro_communities (
  id uuid primary key default gen_random_uuid(),
  title text,
  region text, -- broad region, no exact address
  trimester int,
  created_at timestamptz default now()
);

-- Community messages
create table if not exists community_messages (
  id uuid primary key default gen_random_uuid(),
  community_id uuid references micro_communities(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  body text,
  created_at timestamptz default now()
);

-- Row Level Security Policies

-- Profiles policies
alter table profiles enable row level security;
create policy "user can read and update own profile"
on profiles for all using (id = auth.uid()) with check (id = auth.uid());

-- Pregnancy history policies
alter table pregnancy_history enable row level security;
create policy "user can manage own pregnancy history"
on pregnancy_history for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Mood check-ins policies
alter table mood_checkins enable row level security;
create policy "own moods" on mood_checkins
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Education topics policies (public read)
alter table education_topics enable row level security;
create policy "anyone can read education topics"
on education_topics for select using (true);

-- Daily tips policies (public read)
alter table daily_tips enable row level security;
create policy "anyone can read daily tips"
on daily_tips for select using (true);

-- Micro communities policies (public read)
alter table micro_communities enable row level security;
create policy "anyone can read communities"
on micro_communities for select using (true);

-- Community messages policies
alter table community_messages enable row level security;
create policy "read by community"
on community_messages for select using (true);
create policy "write own"
on community_messages for insert with check (user_id = auth.uid());

-- Indexes for performance
create index if not exists idx_mood_checkins_user_id on mood_checkins(user_id);
create index if not exists idx_mood_checkins_created_at on mood_checkins(created_at desc);
create index if not exists idx_education_topics_trimester on education_topics(trimester);
create index if not exists idx_daily_tips_trimester on daily_tips(trimester);
create index if not exists idx_community_messages_community_id on community_messages(community_id);
create index if not exists idx_community_messages_created_at on community_messages(created_at desc);
