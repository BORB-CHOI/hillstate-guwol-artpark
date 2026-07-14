// =============================================================
// 담당자 알림 — 신규 문의(관심고객 등록 · 방문예약) 발생 시 담당자에게
// "누가 어떤 경로로 무엇을 신청했는지" 알린다. 고객에게는 보내지 않는다.
//
// 지원 채널 (설정된 것만 자동 사용, 여러 개면 모두 발송):
//   - 텔레그램 봇: 무료, 실제 푸시 알림이 확실히 울린다.
//     → lib/telegram.js (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)
//   - 문자(SMS, Solapi): 건당 과금. 발신번호 등록 필요.
//     → SOLAPI_API_KEY, SOLAPI_API_SECRET, SOLAPI_SENDER, ADMIN_PHONE
//
// 환경변수가 하나도 없으면 콘솔 로그만 남기고 정상 통과한다(개발/데모 안전).
// =============================================================

import crypto from "node:crypto";
import { telegramConfigured, sendTelegramNotification } from "./telegram";

const API_KEY = process.env.SOLAPI_API_KEY;
const API_SECRET = process.env.SOLAPI_API_SECRET;
const SENDER = process.env.SOLAPI_SENDER; // 등록된 발신번호
const ADMIN_PHONE = process.env.ADMIN_PHONE; // 담당자(사장님) 수신번호

const smsConfigured = Boolean(API_KEY && API_SECRET && SENDER && ADMIN_PHONE);

function authHeader() {
  const date = new Date().toISOString();
  const salt = crypto.randomBytes(32).toString("hex");
  const signature = crypto
    .createHmac("sha256", API_SECRET)
    .update(date + salt)
    .digest("hex");
  return `HMAC-SHA256 apiKey=${API_KEY}, date=${date}, salt=${salt}, signature=${signature}`;
}

async function sendSms(text) {
  const res = await fetch("https://api.solapi.com/messages/v4/send", {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: {
        to: ADMIN_PHONE.replace(/\D/g, ""),
        from: SENDER.replace(/\D/g, ""),
        text,
      },
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Solapi send failed ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

// 신규 문의 발생 시 담당자에게 알림. 실패해도 접수 자체는 막지 않음(호출부에서 .catch).
export async function notifyNewReservation(r) {
  const 경로 = r.source || "홍보관 방문예약폼";
  const utm = [r.utm_source, r.utm_medium, r.utm_campaign].filter(Boolean).join(" / ");
  const 유입 = utm ? `\n유입: ${utm}` : "";
  const text = `[힐스테이트 구월아트파크] 새 문의 접수\n경로: ${경로}${유입}\n이름: ${r.name}\n연락처: ${r.phone}\n희망방문일시: ${r.visit_date || "-"} ${r.visit_time || ""}`;

  if (!smsConfigured && !telegramConfigured) {
    console.log("[notify] 알림 미설정 — 콘솔 로그로 대체:", {
      경로,
      이름: r.name,
      연락처: r.phone,
      희망일시: r.visit_date || "-",
    });
    return { skipped: true, reason: "not_configured" };
  }

  const results = {};

  if (telegramConfigured) {
    try {
      results.telegram = await sendTelegramNotification(text);
    } catch (e) {
      results.telegramError = e.message;
    }
  }

  if (smsConfigured) {
    try {
      results.sms = await sendSms(text);
    } catch (e) {
      results.smsError = e.message;
    }
  }

  return results;
}
