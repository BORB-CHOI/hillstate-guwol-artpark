// =============================================================
// 담당자 알림 연동 (프리미엄 기능)
//
// 신규 문의(관심고객 등록 · 방문예약) 발생 시 담당자에게
// "누가 어떤 경로로 무엇을 신청했는지" 알립니다. 고객에게는 보내지 않습니다.
//
// 두 채널을 지원하며, 설정된 채널만 자동으로 사용됩니다 (둘 다 설정하면 둘 다 발송):
//   - 카카오톡 "나에게 보내기": 카카오 공식 API만 쓰고 Solapi 등 중개 서비스
//     불필요, 알림톡 심사도 필요 없음. 최초 1회 OAuth 인증만 하면 됨.
//     → lib/kakaoSelf.js 참고 (KAKAO_REST_API_KEY, KAKAO_REFRESH_TOKEN)
//   - 문자(SMS, Solapi): 승인 절차 없이 즉시 발송되는 가장 단순한 방법.
//     → SOLAPI_API_KEY, SOLAPI_API_SECRET, SOLAPI_SENDER, ADMIN_PHONE
//
// 환경변수가 하나도 없으면 콘솔에 로그만 남기고 정상 통과합니다(개발/데모 안전).
// =============================================================

import crypto from "crypto";
import { kakaoSelfConfigured, sendSelfNotification } from "./kakaoSelf";

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
        to: ADMIN_PHONE.replace(/[^0-9]/g, ""),
        from: SENDER.replace(/[^0-9]/g, ""),
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

// 신규 문의(관심고객 등록 · 방문예약) 발생 시 담당자에게 알림.
// 실패해도 예약 접수 자체는 막지 않음 (호출부에서 .catch 로 무시).
export async function notifyNewReservation(r) {
  const 경로 = r.source || "홍보관 방문예약폼";
  const utm = [r.utm_source, r.utm_medium, r.utm_campaign].filter(Boolean).join(" / ");
  const text = `[힐스테이트 구월아트파크] 새 문의 접수\n경로: ${경로}${utm ? `\n유입: ${utm}` : ""}\n이름: ${r.name}\n연락처: ${r.phone}\n희망방문일시: ${r.visit_date || "-"} ${r.visit_time || ""}`;

  if (!smsConfigured && !kakaoSelfConfigured) {
    console.log("[notify] 알림 미설정 — 콘솔 로그로 대체:", {
      경로,
      이름: r.name,
      연락처: r.phone,
      희망일시: r.visit_date || "-",
    });
    return { skipped: true, reason: "not_configured" };
  }

  const results = {};

  if (kakaoSelfConfigured) {
    try {
      results.kakao = await sendSelfNotification(text);
    } catch (e) {
      results.kakaoError = e.message;
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

export const kakaoConfigured = smsConfigured || kakaoSelfConfigured;
