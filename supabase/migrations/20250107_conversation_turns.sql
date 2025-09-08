create table if not exists conversation_turns (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  user_id text,
  role text not null check (role in ('user','assistant')),
  content text not null,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists conversation_turns_session_time_idx
on conversation_turns (session_id, created_at);
