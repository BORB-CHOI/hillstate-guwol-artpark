import { visitInfo } from "@/lib/site";
import { CheckIcon, CalendarIcon } from "./Icons";
import Photo from "./Photo";
import Reveal from "./Reveal";

const reasons = [
  {
    title: "실제 유니트 관람 가능",
    desc: "카탈로그가 아닌 실제 공간에서 구조와 동선을 직접 확인하세요.",
  },
  {
    title: "타입별 비교 가능",
    desc: "84㎡와 101㎡, 우리 가족에게 맞는 타입을 나란히 비교합니다.",
  },
  {
    title: "옵션 안내",
    desc: "마감재, 수납, 확장 등 선택 가능한 옵션을 상세히 안내드립니다.",
  },
  {
    title: "계약 절차 안내",
    desc: "청약부터 계약까지, 궁금한 절차를 전문 상담으로 정리해 드립니다.",
  },
];

export default function WhyVisit() {
  return (
    <section id="why" className="bg-brand py-20 text-white sm:py-28">
      <div className="container-content">
        <Reveal className="max-w-2xl">
          <span className="section-label !text-gold-light">WHY VISIT</span>
          <h2 className="section-title !text-white">
            왜 홍보관에
            <br />
            직접 방문해야 할까요?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">
            화면으로는 알 수 없는 것들이 있습니다. 방문하시면 이런 점을
            직접 확인하실 수 있습니다.
          </p>
        </Reveal>

        <Reveal className="mt-10">
          <div className="overflow-hidden rounded-3xl">
            <Photo
              ratio="2162/898"
              tone="gold"
              hint="unit-tour.jpg"
              alt="유니트 실내 투어"
            />
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-2xl font-extrabold text-white sm:text-4xl">
              카탈로그가 아닌, 실제 유니트로
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              마감재, 수납, 확장 옵션까지 홍보관에서 직접 확인하실 수 있습니다.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {reasons.map(({ title, desc }, i) => (
            <Reveal key={title} delay={i * 70}>
            <div className="lift-card flex gap-4 rounded-2xl border border-white/12 bg-white/[0.06] p-6 hover:bg-white/[0.1]">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-light/15 text-gold-light">
                <CheckIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">{desc}</p>
              </div>
            </div>
            </Reveal>
          ))}
        </div>

        {/* 방문 안내 요약 바 */}
        <Reveal className="mt-8">
        <div className="rounded-2xl bg-white/10 p-6 sm:p-8">
          <ul className="grid gap-2 sm:grid-cols-3">
            {visitInfo.benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm font-medium text-white/90">
                <CheckIcon className="h-4 w-4 shrink-0 text-gold-light" />
                {b}
              </li>
            ))}
            <li className="flex items-center gap-2 text-sm font-medium text-white/90">
              <CheckIcon className="h-4 w-4 shrink-0 text-gold-light" />
              방문 소요시간 {visitInfo.duration}
            </li>
          </ul>
        </div>
        </Reveal>

        {/* 대표 CTA: 눈에 확 들어오게 크게, 가운데 */}
        <Reveal className="mt-8 text-center">
          <a
            href="#reserve"
            className="btn-cta mx-auto w-full justify-center bg-gold-light px-10 py-5 text-lg font-extrabold !text-brand shadow-xl hover:!bg-gold sm:w-auto sm:text-xl"
          >
            <CalendarIcon className="h-6 w-6" />
            지금 홍보관 방문 예약하기
          </a>
          <p className="mt-3 text-sm text-white/60">예약 고객 우선 안내, 상담은 무료입니다</p>
        </Reveal>
      </div>
    </section>
  );
}
