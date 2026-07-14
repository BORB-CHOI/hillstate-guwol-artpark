import { NextResponse } from "next/server";
import { kakaoSelfConfigured, sendSelfNotification } from "@/lib/kakaoSelf";

export const dynamic = "force-dynamic";

// 카카오 "나에게 보내기" 진단용 — 관리자 토큰으로만 접근.
// /api/kakao/test?token=관리자토큰 접속 시 실제로 테스트 알림을 보내고,
// 성공/실패 여부와 카카오가 돌려준 원본 응답을 그대로 화면에 보여준다.
// (알림이 안 오는 원인을 눈으로 확인하기 위한 임시 엔드포인트)
export async function GET(req) {
  const token = new URL(req.url).searchParams.get("token");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ message: "권한이 없습니다." }, { status: 401 });
  }

  const env = {
    KAKAO_REST_API_KEY: Boolean(process.env.KAKAO_REST_API_KEY),
    KAKAO_REFRESH_TOKEN: Boolean(process.env.KAKAO_REFRESH_TOKEN),
    kakaoSelfConfigured,
  };

  if (!kakaoSelfConfigured) {
    return NextResponse.json(
      { ok: false, env, message: "KAKAO_REST_API_KEY 또는 KAKAO_REFRESH_TOKEN 이 비어 있습니다." },
      { status: 400 }
    );
  }

  try {
    const result = await sendSelfNotification(
      "[힐스테이트 구월아트파크] 알림 연동 테스트입니다. 이 메시지가 보이면 정상입니다."
    );
    return NextResponse.json({ ok: true, env, result });
  } catch (e) {
    // 카카오가 돌려준 실제 오류 메시지를 그대로 노출 (scope 부족, 팀원 아님 등)
    return NextResponse.json({ ok: false, env, error: e.message }, { status: 500 });
  }
}
