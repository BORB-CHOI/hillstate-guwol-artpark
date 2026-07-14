-- =============================================================
-- Supabase 예약 테이블 스키마
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- =============================================================

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  visit_date date not null,
  visit_time text,
  status text not null default 'new',      -- new | contacted | visited | done
  source text default 'landing',
  created_at timestamptz not null default now()
);

create index if not exists reservations_phone_idx on public.reservations (phone);
create index if not exists reservations_created_idx on public.reservations (created_at desc);

-- RLS 활성화: 서비스 롤 키(서버에서만 사용)로만 접근하도록 하고,
-- 익명(브라우저) 접근은 차단합니다. (앱은 서버 API에서 service_role 키로 접근)
alter table public.reservations enable row level security;
-- 별도 정책을 추가하지 않으면 anon/authenticated 역할은 접근 불가(안전),
-- service_role 키는 RLS를 우회하므로 서버 API는 정상 동작합니다.
