import { NextResponse } from "next/server";
import { telegramTokenSet, telegramConfigured, sendTelegramNotification } from "@/lib/telegram";

export const dynamic = "force-dynamic";

// 텔레그램 알림 진단용 — 관리자 토큰으로만 접근.
// /api/telegram/test?token=관리자토큰 접속 시 실제로 테스트 메시지를 보내고,
// 성공/실패 여부와 텔레그램이 돌려준 원본 응답을 그대로 화면에 보여준다.
export async function GET(req) {
  const token = new URL(req.url).searchParams.get("token");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ message: "권한이 없습니다." }, { status: 401 });
  }

  const env = {
    TELEGRAM_BOT_TOKEN: telegramTokenSet,
    TELEGRAM_CHAT_ID: Boolean(process.env.TELEGRAM_CHAT_ID),
    telegramConfigured,
  };

  if (!telegramConfigured) {
    return NextResponse.json(
      { ok: false, env, message: "TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID 가 비어 있습니다." },
      { status: 400 }
    );
  }

  try {
    const result = await sendTelegramNotification(
      "[힐스테이트 구월아트파크] 텔레그램 알림 테스트입니다. 이 메시지가 보이면 정상입니다."
    );
    return NextResponse.json({ ok: true, env, result });
  } catch (e) {
    // 텔레그램이 돌려준 실제 오류를 그대로 노출 (chat_id 오류, 봇 차단 등)
    return NextResponse.json({ ok: false, env, error: e.message }, { status: 500 });
  }
}
