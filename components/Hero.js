import fs from "node:fs";
import path from "node:path";
import { site, project } from "@/lib/site";
import { PhoneIcon, CalendarIcon, MapPinIcon } from "./Icons";

// public/images/hero.jpg 가 실제로 존재하면 자동으로 배경 사진을 사용하고,
// 없으면 스켈레톤 그라데이션을 보여준다 (파일 존재 여부는 서버에서 직접 확인).
const hasHeroImage = fs.existsSync(path.join(process.cwd(), "public", "images", "hero.jpg"));

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-brand text-white">
      {hasHeroImage ? (
        <>
          <div
            className="animate-hero-zoom absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/images/hero.jpg)" }}
            aria-hidden="true"
          />
          {/* 사진 위 텍스트 가독성 확보용 어둡게 깔기 */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"
            aria-hidden="true"
          />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#100E0D] via-[#241D18] to-[#4A3524]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 opacity-40"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 10%, rgba(216,195,154,.45), transparent 50%), radial-gradient(circle at 10% 90%, rgba(92,28,29,.4), transparent 50%)",
            }}
          />
          {/* 도심 스카이라인 실루엣 (실제 사진 대체 전 분위기용) */}
          <svg
            className="absolute inset-x-0 bottom-0 h-40 w-full text-black/25 sm:h-56"
            viewBox="0 0 1440 220"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M0 220V140l60-10V90l50 5V60l70 10V40l60 15V80l90-25V30l55 20V10l70 5v40l60-20v50l80-10v60l50-5v40l100-15V90l60 10v40l90-20v60l70-10v30l90-5v-50l60 15v55H0Z"
            />
          </svg>
          {/* 스켈레톤 표시 배지 (실제 배경 사진 넣으면 자동으로 사라짐) */}
          <div className="absolute right-4 top-4 z-20 rounded-md border border-dashed border-white/40 bg-black/25 px-2.5 py-1 font-mono text-[10px] text-white/75">
            BG 이미지: 야경 조감도 → public/images/hero.jpg
          </div>
        </>
      )}

      <div className="container-content relative z-10 flex min-h-[88vh] flex-col justify-center py-20 sm:min-h-[90vh]">
        <div className="stagger">
          <span className="animate-fade-up mb-6 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium tracking-wide text-gold-light">
            <MapPinIcon className="h-4 w-4" />
            {project.developer} 인천 남동구 구월동
          </span>

          <p className="font-script text-3xl leading-none text-gold-light sm:text-4xl">
            일상, 예술이 되다
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl md:text-6xl">
            변화의 중심에서
            <br />
            힐스테이트<br className="sm:hidden" /> 구월아트파크
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">
            옛 롯데백화점 그 자리, 구월동 중심에 다시 세우는 브랜드 신축.
            <br />
            홍보관에서 직접 확인하세요.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#reserve" className="btn-cta text-lg sm:px-8">
              <CalendarIcon className="h-5 w-5" />
              홍보관 방문예약
            </a>
            <a
              href={`tel:${site.phoneRaw}`}
              className="btn border border-white/40 bg-white/10 text-white hover:bg-white/20 sm:px-8"
            >
              <PhoneIcon className="h-5 w-5" />
              전화상담
            </a>
          </div>

          <p className="mt-6 text-sm text-white/55">
            예약 고객 우선 안내, 방문 소요 약 40~60분
          </p>
        </div>
      </div>

      {/* 하단 요약 스트립 */}
      <div className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="container-content stagger grid grid-cols-2 divide-x divide-white/10 py-4 text-center sm:grid-cols-4">
          {[
            ["브랜드", "힐스테이트"],
            ["규모", "총 496세대"],
            ["타입", "84, 101㎡"],
            ["교통", "예술회관역 지하 직결"],
          ].map(([k, v]) => (
            <div key={k} className="px-2">
              <p className="text-[11px] tracking-wide text-white/55">{k}</p>
              <p className="mt-0.5 text-sm font-semibold text-white sm:text-base">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
