set check_function_bodies = off;

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  google_sub text not null unique,
  name text,
  email text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (project_id, name)
);

create table if not exists public.invite_codes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  code text not null unique,
  expires_at timestamptz,
  max_uses int not null check (max_uses > 0),
  used_count int not null default 0 check (used_count >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  role text not null check (role in ('worker', 'lead', 'manager')),
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, project_id, team_id)
);

alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.teams enable row level security;
alter table public.invite_codes enable row level security;
alter table public.memberships enable row level security;

create policy "Users manage own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users update own profile" on public.users
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users insert self" on public.users
  for insert with check (auth.uid() = id);

create policy "Active invite codes readable" on public.invite_codes
  for select using (
    (expires_at is null or expires_at > now())
    and used_count < max_uses
  );

create policy "Members read own membership" on public.memberships
  for select using (auth.uid() = user_id);

create policy "Leads manage project memberships" on public.memberships
  for select using (
    exists (
      select 1
      from public.memberships m2
      where m2.project_id = memberships.project_id
        and m2.user_id = auth.uid()
        and m2.role in ('lead', 'manager')
    )
  );

