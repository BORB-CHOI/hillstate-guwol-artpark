import { NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/kakaoSelf";

// 카카오 로그인 동의 후 돌아오는 콜백. 인가코드를 토큰으로 교환해
// 화면에 한 번 보여준다 — refresh_token 을 복사해 .env.local 의
// KAKAO_REFRESH_TOKEN 에 저장하면 설정이 끝난다.
// (설정 완료 후에는 이 라우트를 지우거나 배포에서 제외해도 됩니다.)
export async function GET(req) {
  const code = new URL(req.url).searchParams.get("code");
  if (!code) {
    return NextResponse.json({ message: "인가코드가 없습니다." }, { status: 400 });
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    return new NextResponse(
      `<!doctype html><meta charset="utf-8">
      <body style="font-family:sans-serif;max-width:640px;margin:40px auto;line-height:1.6">
        <h2>카카오 연동 완료</h2>
        <p>아래 refresh_token 을 <b>.env.local</b> 의 <code>KAKAO_REFRESH_TOKEN</code> 에 저장하세요.
        저장 후에는 이 화면을 다시 볼 필요 없습니다.</p>
        <p><b>refresh_token</b></p>
        <textarea style="width:100%;height:80px">${tokens.refresh_token}</textarea>
        <p style="color:#888;font-size:13px">access_token 은 6시간 후 자동 만료되며,
        서버가 refresh_token 으로 알아서 갱신합니다. 이 값만 저장하면 됩니다.</p>
      </body>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
