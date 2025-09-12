-- Create user_profiles table for pregnancy tracking
create table if not exists user_profiles (
  user_id text primary key,
  due_date date,
  lmp_date date,
  timezone text default 'Africa/Lagos',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- If both lmp_date and due_date exist, prefer due_date; otherwise you can derive due_date from lmp_date = lmp + 280 days.
create or replace function set_due_from_lmp(lmp date)
returns date language sql immutable as $$
  select lmp + interval '280 days'
$$;

-- Updated_at trigger
create or replace function touch_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_user_profiles_touch on user_profiles;
create trigger trg_user_profiles_touch
before update on user_profiles
for each row execute function touch_updated_at();
