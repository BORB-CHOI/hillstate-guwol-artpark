import localFont from "next/font/local";
import { Nanum_Pen_Script } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { site } from "@/lib/site";

// 본문/헤드라인: Pretendard 하나로 통일 — 국내 대다수 브랜드·분양 사이트가 쓰는
// 표준 한글 웹폰트. 굵기 대비만으로 위계를 만든다 (세리프 혼용 금지).
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  weight: "45 920",
  variable: "--font-pretendard",
  display: "swap",
});

// 히어로의 브러시 태그라인 한 줄에만 쓰는 손글씨 액센트 폰트
const nanumPenScript = Nanum_Pen_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} 홍보관 방문예약`,
    template: `%s | ${site.name}`,
  },
  description:
    "구월동 중심 브랜드 신축 주거공간, 힐스테이트 구월아트파크. 분양가, 계약금, 타입, 교통 등 궁금한 정보를 확인하고 홍보관 방문을 예약하세요. 예약 고객 우선 안내.",
  keywords: [
    "힐스테이트 구월아트파크",
    "구월동 신축 아파트",
    "인천 구월동 분양",
    "예술회관역 아파트",
    "GTX-B 구월동",
    "홍보관 방문예약",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: site.url,
    siteName: site.name,
    title: `${site.name} 홍보관 방문예약`,
    description:
      "구월동 중심 브랜드 신축 주거공간. 궁금한 정보를 확인하고 홍보관 방문을 예약하세요.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: site.url },
};

export const viewport = {
  themeColor: "#1C1917",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${nanumPenScript.variable}`}>
      <body className="font-sans">
        {children}
        {/* 우측 하단 챗봇 위젯 (kittychat) */}
        <Script
          src="https://www.kittychat.ai/chatbot/chatbot.js"
          strategy="afterInteractive"
          chatbotId="qYADyQ=="
        />
      </body>
    </html>
  );
}
