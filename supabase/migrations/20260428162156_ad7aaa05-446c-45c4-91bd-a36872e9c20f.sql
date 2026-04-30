
-- Fix search_path on functions
alter function public.set_updated_at() set search_path = public;
alter function public.handle_new_user() set search_path = public;

-- Revoke broad execute on internal trigger functions
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;

-- Drop overly-permissive write policies on content tables.
-- Content is managed via migrations / service role only.
drop policy if exists "Authenticated users can insert recipes" on public.recipes;
drop policy if exists "Authenticated users can update recipes" on public.recipes;
drop policy if exists "Authenticated users can delete recipes" on public.recipes;

drop policy if exists "Authenticated users can insert recipe steps" on public.recipe_steps;
drop policy if exists "Authenticated users can update recipe steps" on public.recipe_steps;
drop policy if exists "Authenticated users can delete recipe steps" on public.recipe_steps;
