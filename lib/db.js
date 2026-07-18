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
// 준비도 체크 결과는 예약과 성격이 다르므로 별도 리스트에 쌓는다.
const SELF_CHECK_KEY = "self_checks";

const DATA_FILE = path.join(process.cwd(), "data", "reservations.json");
const SELF_CHECK_FILE = path.join(process.cwd(), "data", "self-checks.json");

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
async function readLocal(file = DATA_FILE) {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeLocal(rows, file = DATA_FILE) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(rows, null, 2), "utf8");
}

// ---------- Public API ----------
// UTM은 유입 경로 확인 용도만 저장한다. 예상한 키와 길이만 허용한다.
function cleanTrackingOf(input) {
  const tracking = input.tracking && typeof input.tracking === "object" ? input.tracking : {};
  return Object.fromEntries(
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
      .map((key) => [key, typeof tracking[key] === "string" ? tracking[key].trim().slice(0, 120) : ""])
      .filter(([, value]) => value)
  );
}

export async function createReservation(input) {
  const cleanTracking = cleanTrackingOf(input);
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

// id로 예약 1건 삭제. 삭제된 건수를 반환한다.
export async function deleteReservation(id) {
  if (!id) return 0;
  if (useRedis) {
    // 리스트에서 id가 일치하는 원본 문자열을 찾아 그 값 그대로 LREM 한다.
    const items = await redis(["LRANGE", LIST_KEY, "0", "-1"]);
    let removed = 0;
    for (const raw of items || []) {
      const str = typeof raw === "string" ? raw : JSON.stringify(raw);
      let parsed;
      try {
        parsed = JSON.parse(str);
      } catch {
        continue;
      }
      if (parsed.id === id) {
        // count 1: 앞에서부터 이 값과 일치하는 항목 1개 제거
        removed += Number(await redis(["LREM", LIST_KEY, "1", str])) || 0;
      }
    }
    return removed;
  }
  const rows = await readLocal();
  const next = rows.filter((r) => r.id !== id);
  const removed = rows.length - next.length;
  if (removed) await writeLocal(next);
  return removed;
}

// ---------- 준비도 체크(self-check) ----------
// 저장 구조는 예약과 동일하되 리스트만 분리한다. 답변은 선택지 코드값으로만
// 저장해서, 나중에 문구를 바꿔도 집계가 깨지지 않게 한다.

export async function createSelfCheck(input) {
  const row = {
    id: crypto.randomUUID(),
    name: input.name,
    phone: input.phone,
    // 방문예약과 같은 필드명을 쓴다. 담당자가 두 목록을 같은 눈으로 본다.
    visit_date: input.date || "",
    visit_time: input.time || "",
    answers: input.answers,
    result_type: input.resultType,
    status: "new",
    source: input.source || "준비도 체크 상담신청",
    ...cleanTrackingOf(input),
    created_at: new Date().toISOString(),
  };

  if (useRedis) {
    await redis(["LPUSH", SELF_CHECK_KEY, JSON.stringify(row)]);
    return row;
  }

  const rows = await readLocal(SELF_CHECK_FILE);
  rows.unshift(row);
  await writeLocal(rows, SELF_CHECK_FILE);
  return row;
}

export async function listSelfChecks({ limit = 200 } = {}) {
  if (useRedis) {
    const items = await redis(["LRANGE", SELF_CHECK_KEY, "0", String(limit - 1)]);
    return (items || []).map((s) => (typeof s === "string" ? JSON.parse(s) : s));
  }
  const rows = await readLocal(SELF_CHECK_FILE);
  return rows.slice(0, limit);
}

export async function deleteSelfCheck(id) {
  if (!id) return 0;
  if (useRedis) {
    const items = await redis(["LRANGE", SELF_CHECK_KEY, "0", "-1"]);
    let removed = 0;
    for (const raw of items || []) {
      const str = typeof raw === "string" ? raw : JSON.stringify(raw);
      let parsed;
      try {
        parsed = JSON.parse(str);
      } catch {
        continue;
      }
      if (parsed.id === id) {
        removed += Number(await redis(["LREM", SELF_CHECK_KEY, "1", str])) || 0;
      }
    }
    return removed;
  }
  const rows = await readLocal(SELF_CHECK_FILE);
  const next = rows.filter((r) => r.id !== id);
  const removed = rows.length - next.length;
  if (removed) await writeLocal(next, SELF_CHECK_FILE);
  return removed;
}

export const storageMode = useRedis ? "upstash-redis" : "local-file";
