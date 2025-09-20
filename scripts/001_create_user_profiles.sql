-- Create user profiles table with role-based access
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null check (role in ('government', 'community')) default 'community',
  organization text,
  phone text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- RLS policies for user profiles
create policy "Users can view their own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Government users can view all community profiles for supervision
create policy "Government can view community profiles"
  on public.user_profiles for select
  using (
    exists (
      select 1 from public.user_profiles gov_profile
      where gov_profile.id = auth.uid() 
      and gov_profile.role = 'government'
    )
    and role = 'community'
  );

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, email, full_name, role, organization)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'community'),
    coalesce(new.raw_user_meta_data ->> 'organization', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger to auto-create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
