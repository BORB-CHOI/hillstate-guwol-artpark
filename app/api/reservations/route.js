import { NextResponse } from "next/server";
import { createReservation, listReservations, deleteReservation } from "@/lib/db";
import { notifyNewReservation } from "@/lib/notify";

export const dynamic = "force-dynamic";

const validPhone = (p) => /^01[016789][0-9]{7,8}$/.test((p || "").replace(/[^0-9]/g, ""));
const validTime = (t) => /^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(t || "");

// 방문예약 접수
export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "잘못된 요청입니다." }, { status: 400 });
  }

  const { name, phone, date, time, agree, company, source, tracking } = body || {};

  // 허니팟: 봇이 채우는 숨김 필드에 값이 있으면 스팸으로 간주 (조용히 성공 응답)
  if (company) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !String(name).trim()) {
    return NextResponse.json({ message: "이름을 입력해 주세요." }, { status: 400 });
  }
  if (!validPhone(phone)) {
    return NextResponse.json({ message: "휴대폰 번호를 정확히 입력해 주세요." }, { status: 400 });
  }
  if (!date) {
    return NextResponse.json({ message: "희망 방문일을 선택해 주세요." }, { status: 400 });
  }
  if (!validTime(time)) {
    return NextResponse.json({ message: "희망 방문 시간을 분 단위로 선택해 주세요." }, { status: 400 });
  }
  if (!agree) {
    return NextResponse.json({ message: "개인정보 수집, 이용에 동의해 주세요." }, { status: 400 });
  }

  try {
    const saved = await createReservation({
      name: String(name).trim(),
      phone: phone.replace(/[^0-9]/g, ""),
      date,
      time: time || "",
      source: source || "홍보관 방문예약폼",
      tracking: tracking || {},
    });

    // 카카오/문자 알림은 접수 성공을 막지 않도록 실패해도 무시
    notifyNewReservation(saved).catch((e) => console.error("[notify]", e.message));

    return NextResponse.json({ ok: true, id: saved.id });
  } catch (e) {
    console.error("[reservations:POST]", e.message);
    return NextResponse.json(
      { message: "예약 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}

// 예약 목록 조회 (관리자용 — 토큰 필요)
export async function GET(req) {
  const token = req.headers.get("x-admin-token") || new URL(req.url).searchParams.get("token");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ message: "권한이 없습니다." }, { status: 401 });
  }
  try {
    const rows = await listReservations({ limit: 500 });
    return NextResponse.json({ ok: true, count: rows.length, reservations: rows });
  } catch (e) {
    console.error("[reservations:GET]", e.message);
    return NextResponse.json({ message: "조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}

// 예약 1건 삭제 (관리자용 — 토큰 필요)
export async function DELETE(req) {
  const token = req.headers.get("x-admin-token") || new URL(req.url).searchParams.get("token");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ message: "권한이 없습니다." }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "id가 필요합니다." }, { status: 400 });
  }
  try {
    const removed = await deleteReservation(id);
    if (!removed) {
      return NextResponse.json({ message: "해당 기록을 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, removed });
  } catch (e) {
    console.error("[reservations:DELETE]", e.message);
    return NextResponse.json({ message: "삭제 중 오류가 발생했습니다." }, { status: 500 });
  }
}
