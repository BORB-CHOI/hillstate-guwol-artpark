// =============================================================
// 텔레그램 봇 알림 — 완전 무료, 실제 푸시 알림이 확실히 울린다.
//
// 준비 (최초 1회):
//   1) 텔레그램에서 @BotFather 검색 → /newbot → 봇 생성 후 받은 토큰을
//      TELEGRAM_BOT_TOKEN 에 저장
//   2) 만든 봇과의 채팅을 열어 아무 메시지나 한 번 보낸다
//      (여러 명이 받으려면: 그룹방을 만들고 봇을 초대한 뒤 그 방에서 한 마디)
//   3) /api/telegram/chatid?token=관리자토큰 접속 → 표시된 chat id 를
//      TELEGRAM_CHAT_ID 에 저장
// 이후 접수마다 그 chat(개인 또는 그룹)으로 알림이 발송된다.
// =============================================================

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export const telegramTokenSet = Boolean(BOT_TOKEN);
export const telegramConfigured = Boolean(BOT_TOKEN && CHAT_ID);

const api = (method) => `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;

export async function sendTelegramNotification(text) {
  if (!telegramConfigured) {
    return { skipped: true, reason: "not_configured" };
  }
  const res = await fetch(api("sendMessage"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text, disable_web_page_preview: true }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    throw new Error(`텔레그램 발송 실패: ${JSON.stringify(data)}`);
  }
  return data;
}

// chat_id 조회용 — 봇에게 최근에 온 메시지들에서 chat 정보를 모아 반환한다.
export async function getTelegramChats() {
  if (!BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN 이 설정되지 않았습니다.");
  }
  const res = await fetch(api("getUpdates"));
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    throw new Error(`getUpdates 실패: ${JSON.stringify(data)}`);
  }
  const chats = [];
  for (const u of data.result || []) {
    const chat = u.message?.chat || u.channel_post?.chat || u.my_chat_member?.chat;
    if (chat) {
      chats.push({
        id: chat.id,
        type: chat.type,
        title: chat.title || [chat.first_name, chat.last_name].filter(Boolean).join(" "),
        username: chat.username,
      });
    }
  }
  // id 기준 중복 제거
  return [...new Map(chats.map((c) => [c.id, c])).values()];
}
