-- Familiemat v28: opprett/synkroniser faste handlevarer trygt
create extension if not exists pgcrypto;

create table if not exists public.fixed_shopping (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null,
  qty numeric not null default 1,
  unit text not null default 'stk',
  category text not null default 'Annet',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.fixed_shopping enable row level security;

drop policy if exists "Family members can read fixed shopping" on public.fixed_shopping;
drop policy if exists "Family members can insert fixed shopping" on public.fixed_shopping;
drop policy if exists "Family members can update fixed shopping" on public.fixed_shopping;
drop policy if exists "Family members can delete fixed shopping" on public.fixed_shopping;

create policy "Family members can read fixed shopping" on public.fixed_shopping for select to authenticated using (exists (select 1 from public.family_members fm where fm.family_id = fixed_shopping.family_id and fm.user_id = auth.uid()));
create policy "Family members can insert fixed shopping" on public.fixed_shopping for insert to authenticated with check (exists (select 1 from public.family_members fm where fm.family_id = fixed_shopping.family_id and fm.user_id = auth.uid()));
create policy "Family members can update fixed shopping" on public.fixed_shopping for update to authenticated using (exists (select 1 from public.family_members fm where fm.family_id = fixed_shopping.family_id and fm.user_id = auth.uid())) with check (exists (select 1 from public.family_members fm where fm.family_id = fixed_shopping.family_id and fm.user_id = auth.uid()));
create policy "Family members can delete fixed shopping" on public.fixed_shopping for delete to authenticated using (exists (select 1 from public.family_members fm where fm.family_id = fixed_shopping.family_id and fm.user_id = auth.uid()));

do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='fixed_shopping') then
    alter publication supabase_realtime add table public.fixed_shopping;
  end if;
end $$;

notify pgrst, 'reload schema';
