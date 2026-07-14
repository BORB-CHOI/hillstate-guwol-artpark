// =============================================================
// 카카오톡 "나에게 보내기" — Solapi 등 중개 서비스 없이, 카카오 공식
// 카카오톡 메시지 API(talk_message)를 그대로 사용해 담당자 본인의
// 카카오톡으로 알림을 보낸다. 알림톡 심사·채널 연동이 필요 없다.
//
// 준비 절차 (최초 1회, 담당자 본인 계정으로):
//   1) https://developers.kakao.com 에서 애플리케이션 생성
//   2) [앱 설정 > 카카오 로그인] 활성화, Redirect URI에
//      "{배포주소}/api/kakao/callback" 등록
//   3) [제품 설정 > 카카오 로그인 > 동의항목]에서
//      "카카오톡 메시지 전송(talk_message)" 항목을 활성화
//   4) .env.local 에 KAKAO_REST_API_KEY, KAKAO_REDIRECT_URI 설정
//   5) 브라우저로 /api/kakao/authorize?token=관리자토큰 접속 → 카카오 로그인
//      동의 → /api/kakao/callback 이 access_token/refresh_token 을 보여줌
//   6) refresh_token 을 .env.local 의 KAKAO_REFRESH_TOKEN 에 저장
// 이후에는 access_token 이 만료(6시간)돼도 refresh_token 으로 자동 갱신한다.
//
// ※ 카카오 디벨로퍼스 콘솔의 동의항목 심사/노출 정책은 수시로 바뀔 수 있으니,
//    실제 신청 화면에서 최신 안내를 확인하세요.
// =============================================================

const REST_API_KEY = process.env.KAKAO_REST_API_KEY;
const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
// 최초 1회 OAuth 인가 후 얻는 값. 이후 자동 갱신되지만, 카카오 정책상
// refresh_token 자체도 갱신될 수 있어 새 값이 오면 로그로 안내한다.
let REFRESH_TOKEN = process.env.KAKAO_REFRESH_TOKEN;

export const kakaoSelfConfigured = Boolean(REST_API_KEY && REFRESH_TOKEN);

async function refreshAccessToken() {
  const res = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: REST_API_KEY,
      refresh_token: REFRESH_TOKEN,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`카카오 토큰 갱신 실패: ${JSON.stringify(data)}`);
  }
  if (data.refresh_token) {
    // 카카오가 새 refresh_token 을 내려주는 경우 — .env.local 갱신 필요
    console.warn(
      "[kakaoSelf] 새 refresh_token 이 발급되었습니다. .env.local 의 KAKAO_REFRESH_TOKEN 을 갱신하세요:",
      data.refresh_token
    );
    REFRESH_TOKEN = data.refresh_token;
  }
  return data.access_token;
}

// 담당자 본인 카카오톡("나와의 채팅")으로 텍스트 알림 발송
export async function sendSelfNotification(text) {
  if (!kakaoSelfConfigured) {
    return { skipped: true, reason: "not_configured" };
  }

  const accessToken = await refreshAccessToken();

  const templateObject = {
    object_type: "text",
    text,
    link: { web_url: process.env.NEXT_PUBLIC_SITE_URL, mobile_web_url: process.env.NEXT_PUBLIC_SITE_URL },
  };

  const res = await fetch("https://kapi.kakao.com/v2/api/talk/memo/default/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: new URLSearchParams({ template_object: JSON.stringify(templateObject) }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`카카오 나에게 보내기 실패: ${JSON.stringify(data)}`);
  }
  return data;
}

export const kakaoAuthorizeUrl = () =>
  `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=talk_message`;

export async function exchangeCodeForTokens(code) {
  const res = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: REST_API_KEY,
      redirect_uri: REDIRECT_URI,
      code,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`카카오 토큰 발급 실패: ${JSON.stringify(data)}`);
  }
  return data; // { access_token, refresh_token, ... }
}
