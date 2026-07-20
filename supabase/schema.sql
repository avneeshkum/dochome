-- Run this in Supabase SQL Editor (Project -> SQL Editor -> New query)

create table if not exists enquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null,
  city text not null,
  specialty text not null,
  message text,
  status text default 'New' check (status in ('New','Contacted','Converted','Not Interested')),
  created_at timestamptz default now()
);

-- Helpful index for the dashboard's default "newest first" sort
create index if not exists enquiries_created_at_idx on enquiries (created_at desc);

-- Enable realtime updates so the admin dashboard refreshes instantly
alter publication supabase_realtime add table enquiries;

-- Row Level Security
alter table enquiries enable row level security;

-- Anyone (including anonymous patients on the public form) can create an enquiry
create policy "Anyone can insert enquiry"
  on enquiries for insert
  to anon
  with check (true);

-- Only logged-in admin users can view enquiries
create policy "Authenticated can read"
  on enquiries for select
  to authenticated
  using (true);

-- Only logged-in admin users can update status
create policy "Authenticated can update"
  on enquiries for update
  to authenticated
  using (true);

-- ---------------------------------------------------------------------
-- After running this, create your admin login:
-- Supabase Dashboard -> Authentication -> Users -> Add User
-- (use email + password; this is the shared login for the team)
-- ---------------------------------------------------------------------
