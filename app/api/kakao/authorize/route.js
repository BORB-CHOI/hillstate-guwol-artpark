import { NextResponse } from "next/server";
import { kakaoAuthorizeUrl } from "@/lib/kakaoSelf";

// 최초 1회 설정용 — 관리자 토큰으로만 접근 가능.
// 접속하면 카카오 로그인 동의 화면으로 이동하고, 동의하면 /api/kakao/callback 으로 돌아온다.
export async function GET(req) {
  const token = new URL(req.url).searchParams.get("token");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ message: "권한이 없습니다." }, { status: 401 });
  }
  if (!process.env.KAKAO_REST_API_KEY || !process.env.KAKAO_REDIRECT_URI) {
    return NextResponse.json(
      { message: "KAKAO_REST_API_KEY, KAKAO_REDIRECT_URI 환경변수를 먼저 설정하세요." },
      { status: 400 }
    );
  }
  return NextResponse.redirect(kakaoAuthorizeUrl());
}
