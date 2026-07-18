import { NextResponse } from "next/server";
import { createSelfCheck, listSelfChecks, deleteSelfCheck } from "@/lib/db";
import { notifyNewSelfCheck } from "@/lib/notify";
import { validateAnswers, resolveResult, results } from "@/lib/selfCheck";
import { isValidMobile, normalizeDigits } from "@/lib/phone";

export const dynamic = "force-dynamic";

// 방문예약 API와 같은 기준으로 시간 형식을 본다.
const validTime = (t) => /^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(t || "");

const requireAdmin = (req) => {
  const token = req.headers.get("x-admin-token") || new URL(req.url).searchParams.get("token");
  return Boolean(process.env.ADMIN_TOKEN) && token === process.env.ADMIN_TOKEN;
};

// 준비도 체크 접수
export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "잘못된 요청입니다." }, { status: 400 });
  }

  const { name, phone, date, time, answers, agree, company, tracking } = body || {};

  // 허니팟: 봇이 채우는 숨김 필드에 값이 있으면 조용히 성공 응답
  if (company) {
    return NextResponse.json({ ok: true, resultType: "ready" });
  }

  if (!name || !String(name).trim()) {
    return NextResponse.json({ message: "이름을 입력해 주세요." }, { status: 400 });
  }
  if (!isValidMobile(phone)) {
    return NextResponse.json({ message: "휴대폰 번호를 정확히 입력해 주세요." }, { status: 400 });
  }
  if (!date) {
    return NextResponse.json({ message: "희망 방문일을 선택해 주세요." }, { status: 400 });
  }
  if (!validTime(time)) {
    return NextResponse.json({ message: "희망 방문 시간을 분 단위로 선택해 주세요." }, { status: 400 });
  }
  if (!validateAnswers(answers)) {
    return NextResponse.json({ message: "답변을 모두 선택해 주세요." }, { status: 400 });
  }
  if (!agree) {
    return NextResponse.json({ message: "개인정보 수집, 이용에 동의해 주세요." }, { status: 400 });
  }

  // 결과 유형은 서버에서 다시 계산한다. 클라이언트가 보낸 값은 쓰지 않는다.
  const resultType = resolveResult(answers);

  try {
    const saved = await createSelfCheck({
      name: String(name).trim().slice(0, 40),
      phone: normalizeDigits(phone),
      date,
      time,
      answers,
      resultType,
      source: "준비도 체크 상담신청",
      tracking: tracking || {},
    });

    // 알림 실패가 고객의 접수를 실패시키지 않게 한다. (예약 API와 동일한 처리)
    try {
      const notification = await notifyNewSelfCheck(saved, results[resultType].headline);
      console.log("[notify] self-check notification completed", {
        selfCheckId: saved.id,
        resultType,
        telegram: notification.telegram ? "sent" : "not_sent",
        telegramError: notification.telegramError || undefined,
        sms: notification.sms ? "sent" : "not_sent",
        smsError: notification.smsError || undefined,
        skipped: notification.skipped || undefined,
      });
    } catch (e) {
      console.error("[notify] self-check notification crashed", {
        selfCheckId: saved.id,
        message: e.message,
      });
    }

    return NextResponse.json({ ok: true, id: saved.id, resultType });
  } catch (e) {
    console.error("[self-check:POST]", e.message);
    return NextResponse.json(
      { message: "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}

// 목록 조회 (관리자용 — 토큰 필요)
export async function GET(req) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ message: "권한이 없습니다." }, { status: 401 });
  }
  try {
    const rows = await listSelfChecks({ limit: 500 });
    return NextResponse.json({ ok: true, count: rows.length, selfChecks: rows });
  } catch (e) {
    console.error("[self-check:GET]", e.message);
    return NextResponse.json({ message: "조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}

// 1건 삭제 (관리자용 — 토큰 필요)
export async function DELETE(req) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ message: "권한이 없습니다." }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "id가 필요합니다." }, { status: 400 });
  }
  try {
    const removed = await deleteSelfCheck(id);
    if (!removed) {
      return NextResponse.json({ message: "해당 기록을 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, removed });
  } catch (e) {
    console.error("[self-check:DELETE]", e.message);
    return NextResponse.json({ message: "삭제 중 오류가 발생했습니다." }, { status: 500 });
  }
}
