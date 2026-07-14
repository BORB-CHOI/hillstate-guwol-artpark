import { ArrowRightIcon } from "./Icons";
import Reveal from "./Reveal";

// 고객이 가장 궁금해하는 질문 6가지.
// 가격(분양가/계약금/중도금)은 금액을 노출하지 않고 "홍보관 개별 안내"로 자연스럽게 연결합니다.
const faqs = [
  {
    q: "분양가는 얼마인가요?",
    a: "분양가는 타입(84㎡, 101㎡)과 층, 향, 세대 위치에 따라 달라집니다. 개별 조건에 맞춰 홍보관에서 상담해 드리고, 방문 예약 시 우선 안내해 드립니다.",
  },
  {
    q: "계약금은 어떻게 되나요?",
    a: "계약금과 납부 일정 등 자금 계획은 청약 결과와 개인 상황에 따라 달라집니다. 무리 없는 자금 계획을 함께 세우실 수 있도록 홍보관에서 1:1로 안내해 드립니다.",
  },
  {
    q: "중도금 조건이 궁금해요.",
    a: "중도금 납부 방식과 일정은 계약 조건과 함께 안내해 드립니다. 상담 때 전체 자금 흐름을 한눈에 보실 수 있도록 정리해 드리니 편하게 문의해 주세요.",
  },
  {
    q: "GTX 영향은 어느 정도인가요?",
    a: "단지는 인천 1호선 예술회관역과 지하로 바로 연결됩니다. 한 정거장 거리의 인천시청역에는 GTX-B 노선이 2030년 개통을 목표로 추진 중입니다. 개통하면 서울 주요 업무지구까지 이동 시간이 크게 줄어듭니다.",
  },
  {
    q: "타입 차이는 무엇인가요?",
    a: "전용 84A, 84B, 101 세 가지 타입으로 구성됩니다. 84B와 101은 맞통풍 구조로 환기가 잘 되고, 101은 파우더룸이 따로 있습니다. 실제 유니트를 보시면 우리 가족에게 맞는 타입을 쉽게 고르실 수 있습니다.",
  },
  {
    q: "실거주하기 어떤가요?",
    a: "구월동 생활권 중심으로 롯데백화점, 홈플러스, 가천대 길병원 등 생활 인프라가 가깝고, 약 1.6만세대 규모의 구월아이시티 개발이 계획된 지역입니다. 브랜드 아파트의 관리와 커뮤니티까지, 실거주 만족도를 직접 확인해 보시길 권합니다.",
  },
];

export default function InfoFAQ() {
  return (
    <section id="info" className="bg-ivory py-20 sm:py-28">
      <div className="container-content">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="section-label">Q &amp; A</span>
          <h2 className="section-title">궁금한 점을 먼저 확인하세요</h2>
          <p className="mt-4 text-base leading-relaxed text-ink/65 sm:text-lg">
            방문 전에 자주 묻는 질문을 정리했습니다.
            <br className="hidden sm:block" />
            더 자세한 안내는 홍보관에서 도와드립니다.
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-12 max-w-3xl">
        <div className="divide-y divide-black/8 border-t border-black/8">
          {faqs.map(({ q, a }, i) => (
            <details key={i} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left">
                <span className="flex items-baseline gap-3 font-semibold text-ink">
                  <span className="text-base font-extrabold text-gold">Q{i + 1}</span>
                  {q}
                </span>
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-ink/40 transition-transform group-open:rotate-45" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </summary>
              <p className="pb-6 pr-8 text-[15px] leading-relaxed text-ink/65">{a}</p>
            </details>
          ))}
        </div>
        </Reveal>

        {/* 예약 유도 */}
        <Reveal className="mx-auto mt-14 max-w-3xl">
        <div className="flex flex-col items-center justify-between gap-5 border-t border-black/8 pt-8 sm:flex-row">
          <div>
            <p className="text-lg font-bold text-ink">자세한 안내는 홍보관에서 가능합니다</p>
            <p className="mt-1 text-sm text-ink/55">
              방문 예약으로 실제 유니트와 타입별 구조를 직접 확인하세요.
            </p>
          </div>
          <a href="#reserve" className="btn-cta w-full shrink-0 sm:w-auto">
            방문예약
            <ArrowRightIcon className="h-4 w-4" />
          </a>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
