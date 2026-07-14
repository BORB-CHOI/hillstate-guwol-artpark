// =============================================================
// 텔레그램 봇 알림 — 완전 무료, 실제 푸시 알림이 확실히 울린다.
//
// 준비 (최초 1회):
//   1) 텔레그램에서 @BotFather 검색 → /newbot → 봇 생성 후 받은 토큰을
//      TELEGRAM_BOT_TOKEN 에 저장
//   2) 만든 봇과의 채팅을 열어 아무 메시지나 한 번 보낸다
//      (여러 명이 받으려면: 그룹방을 만들고 봇을 초대한 뒤 그 방에서 한 마디)
//   3) chat id 확인: 브라우저에서
//      https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getUpdates 를 열어
//      result[].message.chat.id 값을 TELEGRAM_CHAT_ID 에 저장
//      (또는 @userinfobot / @RawDataBot 에게 말을 걸어 id 확인)
// 이후 접수마다 그 chat(개인 또는 그룹)으로 알림이 발송된다.
// =============================================================

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export const telegramConfigured = Boolean(BOT_TOKEN && CHAT_ID);

export async function sendTelegramNotification(text) {
  if (!telegramConfigured) {
    return { skipped: true, reason: "not_configured" };
  }
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
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
