import { NextResponse } from "next/server";
import { telegramTokenSet, getTelegramChats } from "@/lib/telegram";

export const dynamic = "force-dynamic";

// 텔레그램 chat_id 조회용 — 관리자 토큰으로만 접근.
// 봇에게(또는 봇을 초대한 그룹방에서) 아무 메시지나 한 번 보낸 뒤 이 URL을 열면
// 최근 대화의 chat 정보와 id가 표시된다. 그 id를 TELEGRAM_CHAT_ID 에 저장하면 끝.
export async function GET(req) {
  const token = new URL(req.url).searchParams.get("token");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ message: "권한이 없습니다." }, { status: 401 });
  }
  if (!telegramTokenSet) {
    return NextResponse.json(
      { ok: false, message: "TELEGRAM_BOT_TOKEN 을 먼저 설정하고 재배포하세요." },
      { status: 400 }
    );
  }
  try {
    const chats = await getTelegramChats();
    return NextResponse.json({
      ok: true,
      hint:
        chats.length === 0
          ? "표시된 chat이 없습니다. 봇과의 채팅(또는 봇을 초대한 그룹방)에서 아무 메시지나 한 번 보낸 뒤 다시 열어보세요."
          : "알림 받을 chat의 id를 TELEGRAM_CHAT_ID 에 저장하세요.",
      chats,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
