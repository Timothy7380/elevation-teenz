-- =====================================================================
-- Elevation Teenz · Connect (mentors, teen friends, expression groups)
-- Run this whole file once in Supabase → SQL Editor → New query → Run.
-- Safe to re-run: it drops and recreates policies, functions and triggers.
-- =====================================================================

-- ---------- Expressions (all TEC expressions worldwide) ----------
create table if not exists public.expressions (
  id text primary key,
  name text not null,
  city text not null,
  country text not null
);
insert into public.expressions (id,name,city,country) values
  ('tec-jakande-lekki','TEC Jakande Lekki','Lekki, Lagos','Nigeria'),
  ('tec-maryland','TEC Maryland','Maryland, Lagos','Nigeria'),
  ('tec-ikoyi','TEC Ikoyi','Ikoyi, Lagos','Nigeria'),
  ('tec-greater-lekki','TEC Greater Lekki','Sangotedo, Lagos','Nigeria'),
  ('tec-ibeju-lekki','TEC Ibeju Lekki','Ibeju-Lekki, Lagos','Nigeria'),
  ('tec-ogba','TEC Ogba','Ogba, Lagos','Nigeria'),
  ('tec-ikorodu-west','TEC Ikorodu West','Ikorodu, Lagos','Nigeria'),
  ('tec-ikorodu-north','TEC Ikorodu North','Ikorodu, Lagos','Nigeria'),
  ('tec-alimosho','TEC Alimosho','Alimosho, Lagos','Nigeria'),
  ('tec-festac','TEC FESTAC','FESTAC, Lagos','Nigeria'),
  ('lifepointe-lekki','LifePointe Lekki','Lekki, Lagos','Nigeria'),
  ('lifepointe-yaba','LifePointe Yaba','Yaba, Lagos','Nigeria'),
  ('lifepointe-ojo','LifePointe Ojo','Ojo, Lagos','Nigeria'),
  ('lifepointe-greater-lekki','LifePointe Greater Lekki','Sangotedo, Lagos','Nigeria'),
  ('tec-ibadan','TEC Ibadan','Ibadan, Oyo','Nigeria'),
  ('tec-abeokuta','TEC Abeokuta','Abeokuta, Ogun','Nigeria'),
  ('tec-abuja','TEC Abuja','Jabi, Abuja','Nigeria'),
  ('tec-port-harcourt','TEC Port Harcourt','Port Harcourt, Rivers','Nigeria'),
  ('tec-london','TEC London','London','United Kingdom'),
  ('tec-manchester','TEC Manchester','Salford, Manchester','United Kingdom'),
  ('tec-leeds','TEC Leeds','Leeds','United Kingdom'),
  ('tec-bristol','TEC Bristol','Bristol','United Kingdom'),
  ('pistis-life-dallas','Pistis Life Church Dallas','Frisco, Texas','United States'),
  ('pistis-life-houston','Pistis Life Church Houston','Sugar Land, Texas','United States'),
  ('pistis-life-north-carolina','Pistis Life Church North Carolina','Chapel Hill, North Carolina','United States'),
  ('elevate-toronto','Elevate Community Church Toronto','Toronto, Ontario','Canada'),
  ('elevate-ottawa','Elevate Community Church Ottawa','Ottawa, Ontario','Canada'),
  ('elevate-halifax','Elevate Community Church Halifax','Halifax, Nova Scotia','Canada'),
  ('elevate-calgary','Elevate Community Church Calgary','Calgary, Alberta','Canada'),
  ('tec-brussels','TEC Brussels','Brussels','Belgium'),
  ('tec-online','TEC Online','Anywhere','Online')
on conflict (id) do update set name=excluded.name, city=excluded.city, country=excluded.country;

-- ---------- Profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('teen','counselor','admin')),
  display_name text not null check (char_length(display_name) between 2 and 40),
  expression text not null references public.expressions(id),
  bio text not null default '' check (char_length(bio) <= 400),
  focus_areas text[] not null default '{}',
  age_group text check (age_group in ('12-14','15-17','18-19','adult')),
  counselor_status text not null default 'n/a'
    check (counselor_status in ('n/a','pending','approved','rejected','suspended')),
  can_message boolean not null default false,   -- teens under 18: true only after an admin confirms parent consent
  suspended boolean not null default false,
  created_at timestamptz not null default now()
);

-- Private details: only the person and admins can read these.
create table if not exists public.profile_private (
  id uuid primary key references public.profiles(id) on delete cascade,
  birth_year int,
  parent_name text,
  parent_email text,
  phone text,
  safeguarding_note text,
  consent_confirmed_at timestamptz
);

-- ---------- Helper functions (security definer avoids RLS recursion) ----------
create or replace function public.my_role() returns text
language sql stable security definer set search_path = public as
$$ select role from public.profiles where id = auth.uid() $$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false) $$;

create or replace function public.role_of(uid uuid) returns text
language sql stable security definer set search_path = public as
$$ select role from public.profiles where id = uid $$;

create or replace function public.is_approved_counselor(uid uuid) returns boolean
language sql stable security definer set search_path = public as
$$ select coalesce((select role = 'counselor' and counselor_status = 'approved' and not suspended
                    from public.profiles where id = uid), false) $$;

create or replace function public.can_send(uid uuid) returns boolean
language sql stable security definer set search_path = public as
$$ select coalesce((select not suspended and can_message
                      and (role <> 'counselor' or counselor_status = 'approved')
                    from public.profiles where id = uid), false) $$;

-- ---------- New user → profile ----------
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as
$$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  r text := m->>'role';
  byear int := nullif(m->>'birth_year','')::int;
  age int := case when byear is null then null else extract(year from now())::int - byear end;
  grp text;
begin
  if r not in ('teen','counselor') then
    raise exception 'Choose teen or counselor';
  end if;
  if (m->>'expression') is null or not exists (select 1 from public.expressions where id = m->>'expression') then
    raise exception 'Choose a valid expression';
  end if;
  if r = 'teen' then
    if age is null or age < 12 or age > 19 then raise exception 'Teen accounts are for ages 12 to 19'; end if;
    if age < 18 and coalesce(m->>'parent_email','') = '' then raise exception 'A parent or guardian email is required under 18'; end if;
    grp := case when age <= 14 then '12-14' when age <= 17 then '15-17' else '18-19' end;
  else
    if age is null or age < 18 then raise exception 'Counselors must be 18 or older'; end if;
    grp := 'adult';
  end if;

  insert into public.profiles (id, role, display_name, expression, bio, focus_areas, age_group, counselor_status, can_message)
  values (
    new.id, r,
    left(trim(coalesce(m->>'display_name','Friend')), 40),
    m->>'expression',
    left(coalesce(m->>'bio',''), 400),
    coalesce(array(select jsonb_array_elements_text(m->'focus_areas')), '{}'),
    grp,
    case when r = 'counselor' then 'pending' else 'n/a' end,
    case when r = 'teen' and age >= 18 then true when r = 'counselor' then true else false end
  );
  insert into public.profile_private (id, birth_year, parent_name, parent_email, phone)
  values (new.id, byear, m->>'parent_name', lower(m->>'parent_email'), m->>'phone');
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Members can't promote themselves or approve themselves.
create or replace function public.guard_profile_update() returns trigger
language plpgsql security definer set search_path = public as
$$
begin
  if auth.uid() is null or public.is_admin() then return new; end if;
  new.role := old.role;
  new.counselor_status := old.counselor_status;
  new.can_message := old.can_message;
  new.suspended := old.suspended;
  new.age_group := old.age_group;
  return new;
end $$;
drop trigger if exists guard_profile on public.profiles;
create trigger guard_profile before update on public.profiles
  for each row execute function public.guard_profile_update();

create or replace function public.guard_private_update() returns trigger
language plpgsql security definer set search_path = public as
$$
begin
  if auth.uid() is null or public.is_admin() then return new; end if;
  new.birth_year := old.birth_year;
  new.parent_email := old.parent_email;
  new.safeguarding_note := old.safeguarding_note;
  new.consent_confirmed_at := old.consent_confirmed_at;
  return new;
end $$;
drop trigger if exists guard_private on public.profile_private;
create trigger guard_private before update on public.profile_private
  for each row execute function public.guard_private_update();

-- ---------- Mentorships (teen ↔ approved counselor) ----------
create table if not exists public.mentorships (
  id uuid primary key default gen_random_uuid(),
  teen_id uuid not null references public.profiles(id) on delete cascade,
  counselor_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'requested' check (status in ('requested','active','declined','ended')),
  note text not null default '' check (char_length(note) <= 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (teen_id, counselor_id)
);

create or replace function public.guard_mentorship() returns trigger
language plpgsql security definer set search_path = public as
$$
begin
  new.updated_at := now();
  if auth.uid() is null or public.is_admin() then return new; end if;
  if new.teen_id <> old.teen_id or new.counselor_id <> old.counselor_id then raise exception 'Not allowed'; end if;
  if auth.uid() = old.counselor_id and new.status in ('active','declined','ended') then return new; end if;
  if auth.uid() = old.teen_id and new.status = 'ended' then return new; end if;
  if auth.uid() = old.teen_id and old.status in ('declined','ended') and new.status = 'requested' then return new; end if;
  raise exception 'Not allowed';
end $$;
drop trigger if exists guard_mentorship on public.mentorships;
create trigger guard_mentorship before update on public.mentorships
  for each row execute function public.guard_mentorship();

-- ---------- Teen friendships ----------
create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester uuid not null references public.profiles(id) on delete cascade,
  addressee uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','declined','blocked')),
  blocked_by uuid,
  created_at timestamptz not null default now(),
  check (requester <> addressee)
);
create unique index if not exists friendships_pair on public.friendships (least(requester, addressee), greatest(requester, addressee));

create or replace function public.guard_friendship() returns trigger
language plpgsql security definer set search_path = public as
$$
begin
  if auth.uid() is null or public.is_admin() then return new; end if;
  if new.requester <> old.requester or new.addressee <> old.addressee then raise exception 'Not allowed'; end if;
  if old.status = 'blocked' then raise exception 'Not allowed'; end if;
  if new.status = 'blocked' then new.blocked_by := auth.uid(); return new; end if;
  if auth.uid() = old.addressee and old.status = 'pending' and new.status in ('accepted','declined') then return new; end if;
  raise exception 'Not allowed';
end $$;
drop trigger if exists guard_friendship on public.friendships;
create trigger guard_friendship before update on public.friendships
  for each row execute function public.guard_friendship();

-- ---------- Messages (in-app only, visible to admins) ----------
create table if not exists public.messages (
  id bigint generated always as identity primary key,
  mentorship_id uuid references public.mentorships(id) on delete cascade,
  friendship_id uuid references public.friendships(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now(),
  check ((mentorship_id is null) <> (friendship_id is null))
);
create index if not exists messages_m on public.messages (mentorship_id, created_at);
create index if not exists messages_f on public.messages (friendship_id, created_at);

-- Keep phone numbers, emails, links and social handles out of chats.
create or replace function public.guard_message() returns trigger
language plpgsql as
$$
begin
  if new.body ~* '[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}'
     or new.body ~ '[0-9]([ ().-]?[0-9]){6,}'
     or new.body ~* '(https?://|www\.|wa\.me|t\.me|snapchat|whatsapp|telegram|instagram\.com|tiktok\.com)'
  then
    raise exception 'For safety, please keep phone numbers, emails, links and social handles out of messages.';
  end if;
  return new;
end $$;
drop trigger if exists guard_message on public.messages;
create trigger guard_message before insert on public.messages
  for each row execute function public.guard_message();

-- ---------- Expression & global groups ----------
create table if not exists public.group_posts (
  id bigint generated always as identity primary key,
  group_key text not null,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 600),
  status text not null default 'pending' check (status in ('pending','approved','hidden')),
  created_at timestamptz not null default now()
);

create or replace function public.guard_post() returns trigger
language plpgsql security definer set search_path = public as
$$
begin
  if new.group_key <> 'global' and not exists (select 1 from public.expressions where id = new.group_key) then
    raise exception 'Unknown group';
  end if;
  if tg_op = 'INSERT' and not (auth.uid() is null or public.is_admin()) then
    new.status := 'pending';
    if new.body ~* '[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}'
       or new.body ~ '[0-9]([ ().-]?[0-9]){6,}'
       or new.body ~* '(https?://|www\.|wa\.me|t\.me)' then
      raise exception 'For safety, please keep phone numbers, emails and links out of posts.';
    end if;
  end if;
  if tg_op = 'UPDATE' and not (auth.uid() is null or public.is_admin()) then
    raise exception 'Only leaders can moderate posts';
  end if;
  return new;
end $$;
drop trigger if exists guard_post on public.group_posts;
create trigger guard_post before insert or update on public.group_posts
  for each row execute function public.guard_post();

-- ---------- Reports ----------
create table if not exists public.reports (
  id bigint generated always as identity primary key,
  reporter_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  reported_user uuid references public.profiles(id) on delete set null,
  message_id bigint references public.messages(id) on delete set null,
  post_id bigint references public.group_posts(id) on delete set null,
  reason text not null check (char_length(reason) between 3 and 500),
  status text not null default 'open' check (status in ('open','resolved')),
  created_at timestamptz not null default now()
);

-- =====================================================================
-- Row-level security
-- =====================================================================
alter table public.expressions     enable row level security;
alter table public.profiles        enable row level security;
alter table public.profile_private enable row level security;
alter table public.mentorships     enable row level security;
alter table public.friendships     enable row level security;
alter table public.messages        enable row level security;
alter table public.group_posts     enable row level security;
alter table public.reports         enable row level security;

do $$ declare p record; begin
  for p in select policyname, tablename from pg_policies where schemaname = 'public'
    and tablename in ('expressions','profiles','profile_private','mentorships','friendships','messages','group_posts','reports')
  loop execute format('drop policy %I on public.%I', p.policyname, p.tablename); end loop;
end $$;

-- Expressions: public list
create policy "expressions readable" on public.expressions for select using (true);

-- Profiles
create policy "profiles visible" on public.profiles for select to authenticated using (
  id = auth.uid()
  or public.is_admin()
  or (role = 'counselor' and counselor_status = 'approved' and not suspended)
  or (role = 'teen' and public.my_role() = 'teen' and not suspended)
  or exists (select 1 from public.mentorships m where m.teen_id = profiles.id and m.counselor_id = auth.uid())
);
create policy "profiles self update" on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());
create policy "profiles admin delete" on public.profiles for delete to authenticated using (public.is_admin());

-- Private details
create policy "private self or admin" on public.profile_private for select to authenticated
  using (id = auth.uid() or public.is_admin());
create policy "private self or admin update" on public.profile_private for update to authenticated
  using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

-- Mentorships
create policy "mentorships participants" on public.mentorships for select to authenticated
  using (teen_id = auth.uid() or counselor_id = auth.uid() or public.is_admin());
create policy "teens request mentors" on public.mentorships for insert to authenticated
  with check (teen_id = auth.uid() and public.my_role() = 'teen' and status = 'requested'
              and public.is_approved_counselor(counselor_id));
create policy "mentorships participants update" on public.mentorships for update to authenticated
  using (teen_id = auth.uid() or counselor_id = auth.uid() or public.is_admin());

-- Friendships (teens only)
create policy "friendships participants" on public.friendships for select to authenticated
  using (requester = auth.uid() or addressee = auth.uid() or public.is_admin());
create policy "teens add friends" on public.friendships for insert to authenticated
  with check (requester = auth.uid() and status = 'pending'
              and public.my_role() = 'teen' and public.role_of(addressee) = 'teen');
create policy "friendships participants update" on public.friendships for update to authenticated
  using (requester = auth.uid() or addressee = auth.uid() or public.is_admin());
create policy "friendships participants delete" on public.friendships for delete to authenticated
  using ((requester = auth.uid() or addressee = auth.uid()) and status <> 'blocked' or public.is_admin());

-- Messages
create policy "messages readable by participants and admins" on public.messages for select to authenticated using (
  public.is_admin()
  or exists (select 1 from public.mentorships m where m.id = messages.mentorship_id and auth.uid() in (m.teen_id, m.counselor_id))
  or exists (select 1 from public.friendships f where f.id = messages.friendship_id and auth.uid() in (f.requester, f.addressee))
);
create policy "messages send in open threads" on public.messages for insert to authenticated with check (
  sender_id = auth.uid() and public.can_send(auth.uid()) and (
    exists (select 1 from public.mentorships m where m.id = mentorship_id and m.status = 'active'
            and auth.uid() in (m.teen_id, m.counselor_id)
            and public.can_send(m.teen_id) and public.is_approved_counselor(m.counselor_id))
    or exists (select 1 from public.friendships f where f.id = friendship_id and f.status = 'accepted'
            and auth.uid() in (f.requester, f.addressee)
            and public.can_send(f.requester) and public.can_send(f.addressee))
  )
);
create policy "admins remove messages" on public.messages for delete to authenticated using (public.is_admin());

-- Group posts
create policy "posts approved or own" on public.group_posts for select to authenticated
  using (status = 'approved' or author_id = auth.uid() or public.is_admin());
create policy "members post" on public.group_posts for insert to authenticated
  with check (author_id = auth.uid() and public.can_send(auth.uid()));
create policy "admins moderate posts" on public.group_posts for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "authors or admins delete posts" on public.group_posts for delete to authenticated
  using (author_id = auth.uid() or public.is_admin());

-- Reports
create policy "report anything" on public.reports for insert to authenticated with check (reporter_id = auth.uid());
create policy "see own reports or admin" on public.reports for select to authenticated
  using (reporter_id = auth.uid() or public.is_admin());
create policy "admins resolve reports" on public.reports for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Realtime for chats
do $$ begin
  begin alter publication supabase_realtime add table public.messages; exception when duplicate_object then null; end;
end $$;

-- =====================================================================
-- Make yourself an admin (run once after you sign up on the site):
--   update public.profiles set role = 'admin', can_message = true, counselor_status = 'n/a'
--   where id = (select id from auth.users where email = 'YOUR-EMAIL@example.com');
-- =====================================================================
