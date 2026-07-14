// =============================================================
// 예약 데이터 저장소 — Upstash Redis(서버리스, 콜드스타트 없음) + 로컬 파일 폴백
//
// 우선순위:
//   1) Upstash Redis 환경변수가 있으면 → Redis 리스트에 JSON으로 저장
//   2) 없으면 → 로컬 JSON 파일(data/reservations.json)에 저장 (개발용)
//
// Vercel은 서버리스라 파일 쓰기가 유지되지 않으므로, 운영 시 반드시
// Upstash Redis 환경변수를 설정한다. (Vercel Marketplace에서 Upstash 연동 시
// 환경변수가 자동 주입됨. README 참고)
//
// 지원하는 환경변수명(둘 중 아무거나):
//   - UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN  (Upstash 직접 연동)
//   - KV_REST_API_URL        / KV_REST_API_TOKEN         (Vercel KV)
// =============================================================

import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const useRedis = Boolean(REDIS_URL && REDIS_TOKEN);
const LIST_KEY = "reservations";

const DATA_FILE = path.join(process.cwd(), "data", "reservations.json");

// ---------- Upstash Redis REST helper ----------
// 단일 커맨드를 ["LPUSH", key, value] 형태 JSON 배열 본문으로 POST 한다.
async function redis(command) {
  const res = await fetch(REDIS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Upstash error ${res.status}: ${await res.text()}`);
  }
  const { result } = await res.json();
  return result;
}

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

// ---------- Public API ----------
export async function createReservation(input) {
  const tracking = input.tracking && typeof input.tracking === "object" ? input.tracking : {};
  // UTM은 유입 경로 확인 용도만 저장한다. 예상한 키와 길이만 허용한다.
  const cleanTracking = Object.fromEntries(
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
      .map((key) => [key, typeof tracking[key] === "string" ? tracking[key].trim().slice(0, 120) : ""])
      .filter(([, value]) => value)
  );
  const row = {
    id: crypto.randomUUID(),
    name: input.name,
    phone: input.phone,
    visit_date: input.date,
    visit_time: input.time || "",
    status: "new", // new | contacted | visited | done
    source: input.source || "landing",
    ...cleanTracking,
    created_at: new Date().toISOString(),
  };

  if (useRedis) {
    // 최신 항목이 앞에 오도록 LPUSH (조회 시 LRANGE 0.. 로 최신순)
    await redis(["LPUSH", LIST_KEY, JSON.stringify(row)]);
    return row;
  }

  const rows = await readLocal();
  rows.unshift(row);
  await writeLocal(rows);
  return row;
}

export async function listReservations({ limit = 200 } = {}) {
  if (useRedis) {
    const items = await redis(["LRANGE", LIST_KEY, "0", String(limit - 1)]);
    return (items || []).map((s) => (typeof s === "string" ? JSON.parse(s) : s));
  }
  const rows = await readLocal();
  return rows.slice(0, limit);
}

export const storageMode = useRedis ? "upstash-redis" : "local-file";
