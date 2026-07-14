import { NextResponse } from "next/server";
import { findReservationsByPhone } from "@/lib/db";

export const dynamic = "force-dynamic";

const validPhone = (p) => /^01[016789][0-9]{7,8}$/.test((p || "").replace(/[^0-9]/g, ""));

// 전화번호로 본인 예약 내역 조회 (문의 내역 조회 기능)
export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "잘못된 요청입니다." }, { status: 400 });
  }

  const { phone } = body || {};
  if (!validPhone(phone)) {
    return NextResponse.json({ message: "휴대폰 번호를 정확히 입력해 주세요." }, { status: 400 });
  }

  try {
    const rows = await findReservationsByPhone(phone);
    // 개인정보 최소 노출: 필요한 필드만 반환
    const safe = rows.map((r) => ({
      visit_date: r.visit_date,
      visit_time: r.visit_time,
      status: r.status,
      created_at: r.created_at,
    }));
    return NextResponse.json({ ok: true, count: safe.length, reservations: safe });
  } catch (e) {
    console.error("[lookup]", e.message);
    return NextResponse.json({ message: "조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}
