// =============================================================
// 예약 데이터 저장소 (프리미엄 기능: 문의 DB 저장 + 조회)
//
// 우선순위:
//   1) Supabase 환경변수가 설정되어 있으면 → Supabase(Postgres)에 저장
//   2) 없으면 → 로컬 JSON 파일(data/reservations.json)에 저장 (개발용)
//
// Vercel 등 서버리스 환경에서는 파일 저장이 유지되지 않으므로,
// 실제 운영 시 반드시 Supabase 환경변수를 설정하세요. (README 참고)
// =============================================================

import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const TABLE = "reservations";

const useSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

const DATA_FILE = path.join(process.cwd(), "data", "reservations.json");

// ---------- 로컬 JSON 폴백 ----------
async function readLocal() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeLocal(rows) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(rows, null, 2), "utf8");
}

// ---------- Supabase REST helper ----------
async function sb(pathname, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathname}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase error ${res.status}: ${text}`);
  }
  return res;
}

// ---------- Public API ----------
export async function createReservation(input) {
  const row = {
    id: crypto.randomUUID(),
    name: input.name,
    phone: input.phone,
    visit_date: input.date,
    visit_time: input.time,
    status: "new", // new | contacted | visited | done
    source: input.source || "landing",
    created_at: new Date().toISOString(),
  };

  if (useSupabase) {
    const res = await sb(TABLE, {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(row),
    });
    const [saved] = await res.json();
    return saved || row;
  }

  const rows = await readLocal();
  rows.unshift(row);
  await writeLocal(rows);
  return row;
}

export async function listReservations({ limit = 200 } = {}) {
  if (useSupabase) {
    const res = await sb(
      `${TABLE}?select=*&order=created_at.desc&limit=${limit}`,
      { method: "GET" }
    );
    return res.json();
  }
  const rows = await readLocal();
  return rows.slice(0, limit);
}

// 전화번호로 본인 예약 조회 (문의 내역 조회 기능)
export async function findReservationsByPhone(phone) {
  const digits = phone.replace(/[^0-9]/g, "");
  if (useSupabase) {
    const res = await sb(
      `${TABLE}?select=*&phone=eq.${encodeURIComponent(digits)}&order=created_at.desc`,
      { method: "GET" }
    );
    return res.json();
  }
  const rows = await readLocal();
  return rows.filter((r) => r.phone.replace(/[^0-9]/g, "") === digits);
}

export const storageMode = useSupabase ? "supabase" : "local-file";
