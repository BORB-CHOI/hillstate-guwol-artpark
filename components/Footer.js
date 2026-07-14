import { site, project } from "@/lib/site";
import { PhoneIcon, MapPinIcon } from "./Icons";
import Reveal from "./Reveal";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white/70">
      <div className="container-content py-14">
        <Reveal>
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-xl font-extrabold tracking-tight text-white">힐스테이트 구월아트파크</p>
            <p className="mt-3 text-sm leading-relaxed">
              {project.developer} {project.brand}
              <br />
              {project.scale}
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <p className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-light" />
              <span>
                <b className="text-white/90">홍보관(견본주택)</b>
                <br />
                {site.address}
                <br />
                운영시간 {site.hallHours}
              </span>
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <a href={`tel:${site.phoneRaw}`} className="flex items-center gap-2 text-white/90">
              <PhoneIcon className="h-5 w-5 text-gold-light" />
              <span className="text-lg font-bold">{site.phone}</span>
            </a>
            <p className="text-xs leading-relaxed text-white/50">
              본 페이지는 방문예약 안내용으로, 실제 분양 조건과 가격은 홍보관 상담 및 공식
              입주자모집공고를 통해 확인하시기 바랍니다.
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-1.5 border-t border-white/10 pt-6 text-[11px] leading-relaxed text-white/35">
          <p>
            ※ 본 페이지에 사용된 투시도, 조감도, 이미지, CG 등은 소비자의 이해를 돕기 위해 제작된 것으로
            실제와 차이가 있을 수 있으며, 실제 시공 및 인허가 과정에서 일부 변경될 수 있습니다.
          </p>
          <p>
            ※ 교통, 개발 계획 등은 관계 법령 및 정부, 지자체 정책에 따라 변경되거나 취소될 수 있습니다.
          </p>
          <p>
            ※ 본 페이지는 방문예약 안내를 위한 홍보 목적의 페이지로 법적 효력이 없으며, 실제 분양
            조건과 가격은 홍보관 상담 및 공식 입주자모집공고를 통해 확인하시기 바랍니다.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} 힐스테이트 구월아트파크 방문예약.</p>
          <a href="/lookup" className="font-medium text-white/60 hover:text-white/90">
            예약 내역 조회 →
          </a>
        </div>
        </Reveal>
      </div>
    </footer>
  );
}
