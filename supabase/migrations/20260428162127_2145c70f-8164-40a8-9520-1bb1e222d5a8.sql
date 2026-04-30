
-- =========================================
-- PROFILES
-- =========================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  plan text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by their owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can delete their own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================
-- RECIPES
-- =========================================
create table public.recipes (
  id text primary key,
  title text not null,
  theme text not null,
  emoji text not null default '🍳',
  difficulty text not null default 'Easy',
  time text not null default '20 min',
  topics text[] not null default '{}',
  ingredients text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.recipes enable row level security;

create policy "Recipes are viewable by everyone"
  on public.recipes for select
  using (true);

create policy "Authenticated users can insert recipes"
  on public.recipes for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update recipes"
  on public.recipes for update
  to authenticated
  using (true);

create policy "Authenticated users can delete recipes"
  on public.recipes for delete
  to authenticated
  using (true);

create trigger recipes_set_updated_at
  before update on public.recipes
  for each row execute function public.set_updated_at();

-- =========================================
-- RECIPE STEPS
-- =========================================
create table public.recipe_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id text not null references public.recipes(id) on delete cascade,
  position int not null,
  title text not null,
  detail text not null,
  learn text not null,
  created_at timestamptz not null default now(),
  unique (recipe_id, position)
);

create index recipe_steps_recipe_id_idx on public.recipe_steps(recipe_id);

alter table public.recipe_steps enable row level security;

create policy "Recipe steps are viewable by everyone"
  on public.recipe_steps for select
  using (true);

create policy "Authenticated users can insert recipe steps"
  on public.recipe_steps for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update recipe steps"
  on public.recipe_steps for update
  to authenticated
  using (true);

create policy "Authenticated users can delete recipe steps"
  on public.recipe_steps for delete
  to authenticated
  using (true);

-- =========================================
-- USER PROGRESS
-- =========================================
create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id text not null references public.recipes(id) on delete cascade,
  completed boolean not null default false,
  current_step int not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, recipe_id)
);

create index user_progress_user_id_idx on public.user_progress(user_id);

alter table public.user_progress enable row level security;

create policy "Users can view their own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete their own progress"
  on public.user_progress for delete
  using (auth.uid() = user_id);

create trigger user_progress_set_updated_at
  before update on public.user_progress
  for each row execute function public.set_updated_at();
