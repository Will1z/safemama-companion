create table if not exists conversation_summaries (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  user_id text,
  summary text not null,
  sent_email_to text,
  sent_whatsapp_to text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists conversation_summaries_session_idx
on conversation_summaries (session_id, created_at desc);
