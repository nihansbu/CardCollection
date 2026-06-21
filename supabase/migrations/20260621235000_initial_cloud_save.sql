create extension if not exists pgcrypto with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.game_saves (
  user_id uuid not null references auth.users(id) on delete cascade,
  save_id text not null default 'primary',
  save_data jsonb not null default '{}'::jsonb,
  save_version bigint not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, save_id)
);

create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_id text not null,
  title text not null,
  quantity numeric not null default 0,
  unit text not null default 'units',
  rap_earned numeric not null default 0,
  activity_type text not null default 'General',
  occurred_at timestamptz not null,
  client_event_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.save_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  event_data jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  client_event_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.client_sync_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  device_id text not null,
  last_synced_at timestamptz,
  last_save_version bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, device_id)
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists game_saves_set_updated_at on public.game_saves;
create trigger game_saves_set_updated_at
  before update on public.game_saves
  for each row execute function public.set_updated_at();

drop trigger if exists client_sync_state_set_updated_at on public.client_sync_state;
create trigger client_sync_state_set_updated_at
  before update on public.client_sync_state
  for each row execute function public.set_updated_at();

create index if not exists activity_events_user_occurred_idx
  on public.activity_events (user_id, occurred_at desc);

create index if not exists save_events_user_occurred_idx
  on public.save_events (user_id, occurred_at desc);

alter table public.profiles enable row level security;
alter table public.game_saves enable row level security;
alter table public.activity_events enable row level security;
alter table public.save_events enable row level security;
alter table public.client_sync_state enable row level security;

create policy "profiles owner read"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "profiles owner insert"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "profiles owner update"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "game saves owner read"
  on public.game_saves for select
  using (auth.uid() = user_id);

create policy "game saves owner insert"
  on public.game_saves for insert
  with check (auth.uid() = user_id);

create policy "game saves owner update"
  on public.game_saves for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "activity events owner read"
  on public.activity_events for select
  using (auth.uid() = user_id);

create policy "activity events owner insert"
  on public.activity_events for insert
  with check (auth.uid() = user_id);

create policy "save events owner read"
  on public.save_events for select
  using (auth.uid() = user_id);

create policy "save events owner insert"
  on public.save_events for insert
  with check (auth.uid() = user_id);

create policy "client sync owner read"
  on public.client_sync_state for select
  using (auth.uid() = user_id);

create policy "client sync owner insert"
  on public.client_sync_state for insert
  with check (auth.uid() = user_id);

create policy "client sync owner update"
  on public.client_sync_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
