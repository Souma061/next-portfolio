-- Blog posts for souma.dev
-- Run once in the Supabase SQL editor (Dashboard -> SQL -> New query).

create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  excerpt      text not null default '',
  content      jsonb not null default '{"type":"doc","content":[]}'::jsonb,
  tags         text[] not null default '{}',
  status       text not null default 'draft' check (status in ('draft', 'published')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists posts_status_published_at_idx
  on public.posts (status, published_at desc);

create index if not exists posts_slug_idx
  on public.posts (slug);

-- Keep updated_at honest without relying on the client.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at
  before update on public.posts
  for each row execute function public.touch_updated_at();

-- Row Level Security.
-- The anon key (used in the browser) may only ever read published rows.
-- Writes go through the server with service_role, which bypasses RLS.
alter table public.posts enable row level security;

drop policy if exists "published posts are publicly readable" on public.posts;
create policy "published posts are publicly readable"
  on public.posts
  for select
  to anon, authenticated
  using (status = 'published');

-- No insert/update/delete policies for anon or authenticated on purpose.
-- Revoke write access from the exposed roles as a second line of defence.
revoke insert, update, delete on public.posts from anon, authenticated;
