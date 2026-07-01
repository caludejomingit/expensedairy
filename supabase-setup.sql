-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income','expense')),
  amount numeric not null,
  category text not null,
  date date not null,
  note text,
  created_at timestamptz default now()
);

create table if not exists budgets (
  category text primary key,
  amount numeric not null
);

-- Row Level Security must be ON, with a policy that allows access.
-- This app has no login screen, so these policies allow anyone with
-- your site link + anon key to read/write. Fine for a private link
-- shared between the two of you; see README for tightening this later.
alter table transactions enable row level security;
alter table budgets enable row level security;

drop policy if exists "public access" on transactions;
create policy "public access" on transactions for all using (true) with check (true);

drop policy if exists "public access" on budgets;
create policy "public access" on budgets for all using (true) with check (true);
