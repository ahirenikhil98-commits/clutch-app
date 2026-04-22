-- ── CLUTCH schema ───────────────────────────────────────────────
-- Run this first in the Supabase SQL Editor

create table if not exists cars (
  id          integer      primary key,
  name        text         not null,
  brand       text         not null,
  segment     text         not null,
  fuel        text         not null,
  hue         text         not null,
  image_url   text,
  updated_at  timestamptz  default now()
);

create table if not exists variants (
  id          serial       primary key,
  car_id      integer      not null references cars(id) on delete cascade,
  name        text         not null,
  price       integer      not null,
  updated_at  timestamptz  default now()
);

create index if not exists variants_car_id_idx on variants(car_id);

-- Enable Row Level Security (public read-only)
alter table cars    enable row level security;
alter table variants enable row level security;

create policy "public read cars"
  on cars for select using (true);

create policy "public read variants"
  on variants for select using (true);
