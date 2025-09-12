-- Gestational age (weeks) from due date
create or replace function ga_weeks_from_due(due_date date, as_of timestamptz default now())
returns numeric language sql immutable as $$
  with days_to_due as (
    select (due_date - (as_of at time zone 'UTC')::date) as d
  )
  select greatest(0, least(42, 40 - (extract(day from d)::numeric / 7.0)))
  from days_to_due;
$$;

-- Trimester from GA
create or replace function trimester_from_ga(ga numeric)
returns int language sql immutable as $$
  select case
    when ga < 13 then 1
    when ga < 28 then 2
    else 3
  end;
$$;

-- Convenience view (one row per user)
create or replace view pregnancy_status_v as
select
  p.user_id,
  p.due_date,
  p.lmp_date,
  coalesce(p.due_date, set_due_from_lmp(p.lmp_date)) as effective_due_date,
  round(ga_weeks_from_due(coalesce(p.due_date, set_due_from_lmp(p.lmp_date))), 1) as ga_weeks,
  trimester_from_ga(ga_weeks_from_due(coalesce(p.due_date, set_due_from_lmp(p.lmp_date)))) as trimester,
  (coalesce(p.due_date, set_due_from_lmp(p.lmp_date)) - current_date) as days_to_due
from user_profiles p;
