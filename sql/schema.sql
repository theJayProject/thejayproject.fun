-- Run in Supabase SQL Editor. Add ONLY your auth user UUID to owner_users after creating your account.
create table if not exists owner_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text not null default '',
  category text not null default 'Other',
  status text not null default 'Active',
  created_at timestamptz not null default now()
);
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete set null,
  title text not null,
  slug text unique not null,
  body text not null,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  confirmed boolean not null default false,
  consent_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table owner_users enable row level security;
alter table projects enable row level security;
alter table posts enable row level security;
alter table subscribers enable row level security;

-- Public reads of published posts and projects. Authenticated owner has CRUD rights.
create policy "Public can view published posts" on posts for select using (published = true);
create policy "Owner manages posts" on posts for all to authenticated
  using (exists(select 1 from owner_users where user_id = auth.uid()))
  with check (exists(select 1 from owner_users where user_id = auth.uid()));
create policy "Public can read projects" on projects for select using (true);
create policy "Owner manages projects" on projects for all to authenticated
  using (exists(select 1 from owner_users where user_id = auth.uid()))
  with check (exists(select 1 from owner_users where user_id = auth.uid()));
-- Subscriber addresses are private. Do not expose SELECT to anonymous visitors.
create policy "Owner can read subscribers" on subscribers for select to authenticated
  using (exists(select 1 from owner_users where user_id = auth.uid()));
create policy "Owner can manage subscribers" on subscribers for all to authenticated
  using (exists(select 1 from owner_users where user_id = auth.uid()))
  with check (exists(select 1 from owner_users where user_id = auth.uid()));
