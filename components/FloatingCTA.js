"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { PhoneIcon, ChatIcon, CalendarIcon } from "./Icons";

export default function FloatingCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* 하단 고정 바가 본문 마지막 줄을 가리지 않도록 그만큼의 스페이서를 둔다.
          고정 바를 쓰지 않는 화면에는 이 여백이 생기지 않는다. */}
      <div className="h-16 md:hidden" aria-hidden="true" />

      {/* 데스크톱: 우측 고정 캡슐 (스크롤 시 등장) */}
      <div
        className={`fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 items-start gap-3 transition-all duration-300 md:flex ${
          show ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-4 opacity-0"
        }`}
      >
        <div className="flex flex-col divide-y divide-white/15 overflow-hidden rounded-[28px] bg-cta shadow-soft">
          <a
            href={`tel:${site.phoneRaw}`}
            className="flex flex-col items-center gap-1 px-4 py-3.5 text-white transition-all duration-200 hover:scale-105 hover:bg-white/10"
          >
            <PhoneIcon className="h-5 w-5" />
            <span className="text-[11px] font-semibold">전화상담</span>
          </a>
          <a
            href={site.kakaoUrl}
            target="_blank"
            rel="noopener"
            className="flex flex-col items-center gap-1 px-4 py-3.5 text-white transition-all duration-200 hover:scale-105 hover:bg-white/10"
          >
            <ChatIcon className="h-5 w-5" />
            <span className="text-[11px] font-semibold">카카오톡</span>
          </a>
          <a
            href="#reserve"
            className="flex flex-col items-center gap-1 px-4 py-3.5 text-white transition-all duration-200 hover:scale-105 hover:bg-white/10"
          >
            <CalendarIcon className="h-5 w-5" />
            <span className="text-[11px] font-semibold">방문예약</span>
          </a>
          <a
            href="#top"
            className="flex flex-col items-center gap-1 px-4 py-3.5 text-white transition-all duration-200 hover:scale-105 hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[11px] font-semibold">Top</span>
          </a>
        </div>
      </div>

      {/* 모바일: 하단 고정 바 (항상 노출) */}
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-black/10 bg-white shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.15)] md:hidden">
        <a
          href={`tel:${site.phoneRaw}`}
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-brand transition-transform active:scale-95"
        >
          <PhoneIcon className="h-5 w-5" />
          <span className="text-xs font-semibold">전화</span>
        </a>
        <a
          href={site.kakaoUrl}
          target="_blank"
          rel="noopener"
          className="flex flex-col items-center justify-center gap-0.5 border-x border-black/5 bg-[#FEE500] py-2.5 text-[#191600] transition-transform active:scale-95"
        >
          <ChatIcon className="h-5 w-5" />
          <span className="text-xs font-semibold">카카오</span>
        </a>
        <a
          href="#reserve"
          className="flex flex-col items-center justify-center gap-0.5 bg-cta py-2.5 text-white transition-transform active:scale-95"
        >
          <CalendarIcon className="h-5 w-5" />
          <span className="text-xs font-semibold">예약</span>
        </a>
      </div>
    </>
  );
}
