-- Familiemat v87: robust cross-device state for checkboxes
-- Run this entire script once in the Supabase SQL Editor before deploying v87.
--
-- This table is the single source of truth for:
--   pantry:<normalized item name>                (checked = "Går tom")
--   shopping:<ISO week key>:<normalized item>     (checked = "Kjøpt")
--   fixed:<fixed_shopping row id>                (checked = included in Fast handel)

create table if not exists public.family_item_checks (
  family_id uuid not null references public.families(id) on delete cascade,
  state_key text not null,
  checked boolean not null,
  updated_at timestamptz not null,
  device_id text not null,
  updated_by uuid,
  primary key (family_id, state_key)
);

create index if not exists family_item_checks_family_id_idx
  on public.family_item_checks (family_id);

alter table public.family_item_checks enable row level security;

drop policy if exists "Family members can read checkbox state" on public.family_item_checks;
drop policy if exists "Family members can insert checkbox state" on public.family_item_checks;
drop policy if exists "Family members can update checkbox state" on public.family_item_checks;
drop policy if exists "Family members can delete checkbox state" on public.family_item_checks;

create policy "Family members can read checkbox state"
  on public.family_item_checks for select to authenticated
  using (
    exists (
      select 1 from public.family_members fm
      where fm.family_id = family_item_checks.family_id
        and fm.user_id = auth.uid()
    )
  );

create policy "Family members can insert checkbox state"
  on public.family_item_checks for insert to authenticated
  with check (
    exists (
      select 1 from public.family_members fm
      where fm.family_id = family_item_checks.family_id
        and fm.user_id = auth.uid()
    )
  );

create policy "Family members can update checkbox state"
  on public.family_item_checks for update to authenticated
  using (
    exists (
      select 1 from public.family_members fm
      where fm.family_id = family_item_checks.family_id
        and fm.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.family_members fm
      where fm.family_id = family_item_checks.family_id
        and fm.user_id = auth.uid()
    )
  );

create policy "Family members can delete checkbox state"
  on public.family_item_checks for delete to authenticated
  using (
    exists (
      select 1 from public.family_members fm
      where fm.family_id = family_item_checks.family_id
        and fm.user_id = auth.uid()
    )
  );

grant select, insert, update, delete on public.family_item_checks to authenticated;

-- Atomic last-write-wins update. The timestamp is created by the acting device;
-- device_id provides a deterministic tie-break if two changes have the same millisecond.
create or replace function public.set_family_item_check(
  p_family_id uuid,
  p_state_key text,
  p_checked boolean,
  p_updated_at timestamptz,
  p_device_id text
)
returns setof public.family_item_checks
language sql
security invoker
set search_path = public
as $$
  insert into public.family_item_checks
    (family_id, state_key, checked, updated_at, device_id, updated_by)
  values
    (p_family_id, p_state_key, p_checked, p_updated_at, p_device_id, auth.uid())
  on conflict (family_id, state_key) do update
    set checked = excluded.checked,
        updated_at = excluded.updated_at,
        device_id = excluded.device_id,
        updated_by = excluded.updated_by
    where
      (public.family_item_checks.updated_at, public.family_item_checks.device_id)
      < (excluded.updated_at, excluded.device_id)
  returning *;
$$;

grant execute on function public.set_family_item_check(uuid, text, boolean, timestamptz, text) to authenticated;

-- One-time-compatible backfill of existing checkbox values.
-- ON CONFLICT DO NOTHING means re-running this migration never overwrites newer choices.
insert into public.family_item_checks
  (family_id, state_key, checked, updated_at, device_id, updated_by)
select
  p.family_id,
  'pantry:' || lower(regexp_replace(btrim(p.name), '\s+', ' ', 'g')),
  coalesce(p.low, false),
  now() - interval '1 second',
  'migration-seed',
  null
from public.pantry p
on conflict (family_id, state_key) do nothing;

insert into public.family_item_checks
  (family_id, state_key, checked, updated_at, device_id, updated_by)
select
  wp.family_id,
  'shopping:' || wp.week_key || ':' ||
    lower(regexp_replace(btrim(item.value->>'name'), '\s+', ' ', 'g')),
  coalesce((item.value->>'done')::boolean, false),
  now() - interval '1 second',
  'migration-seed',
  null
from public.week_plans wp
cross join lateral jsonb_array_elements(
  case
    when jsonb_typeof(wp.days->'shopping') = 'array' then wp.days->'shopping'
    else '[]'::jsonb
  end
) as item(value)
where nullif(btrim(item.value->>'name'), '') is not null
on conflict (family_id, state_key) do nothing;

do $$
begin
  if to_regclass('public.fixed_shopping') is not null then
    execute $seed$
      insert into public.family_item_checks
        (family_id, state_key, checked, updated_at, device_id, updated_by)
      select
        f.family_id,
        'fixed:' || f.id::text,
        coalesce(f.active, true),
        now() - interval '1 second',
        'migration-seed',
        null
      from public.fixed_shopping f
      on conflict (family_id, state_key) do nothing
    $seed$;
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'family_item_checks'
  ) then
    alter publication supabase_realtime add table public.family_item_checks;
  end if;
end
$$;

notify pgrst, 'reload schema';
