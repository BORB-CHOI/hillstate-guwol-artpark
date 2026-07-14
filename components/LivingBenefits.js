import Photo from "./Photo";
import Reveal from "./Reveal";
import CountUp from "./CountUp";
import { ArrowRightIcon } from "./Icons";
import { project, brandAwards, nearbyInfra, developments, transitCompare } from "@/lib/site";

// 대표 지표(브랜드평판지수 1위)용 어워드 씰 — 3D 트로피 이미지 대신
// 사이트 골드 톤에 맞춘 월계관 + No.1 엠블럼(순수 SVG).
function AwardSeal({ className = "" }) {
  const P0 = [60, 104], P1 = [4, 82], P2 = [30, 22]; // 왼쪽 가지 베지어
  const bez = (t) => { const u = 1 - t; return [u * u * P0[0] + 2 * u * t * P1[0] + t * t * P2[0], u * u * P0[1] + 2 * u * t * P1[1] + t * t * P2[1]]; };
  const dbez = (t) => { const u = 1 - t; return [2 * u * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0]), 2 * u * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1])]; };
  const leaves = [];
  for (let i = 0; i < 7; i++) {
    const t = 0.07 + i * 0.13;
    const [x, y] = bez(t);
    const [dx, dy] = dbez(t);
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    leaves.push(<ellipse key={i} cx={x} cy={y} rx="7.5" ry="3.2" transform={`rotate(${ang + 22} ${x} ${y})`} />);
  }
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" role="img" aria-label="브랜드평판지수 1위 엠블럼">
      <circle cx="60" cy="60" r="53" stroke="#D8C39A" strokeWidth="1.4" opacity="0.3" />
      <g fill="#D8C39A">
        {leaves}
        <g transform="translate(120,0) scale(-1,1)">{leaves}</g>
      </g>
      <path d="M60 33l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z" fill="#D8C39A" />
      <text x="60" y="80" textAnchor="middle" fontFamily="var(--font-pretendard), sans-serif" fontSize="23" fontWeight="800" fill="#fff">No.1</text>
    </svg>
  );
}

// 수상 로고 무한 롤링 벨트의 한 줄.
// 콘텐츠를 4벌 이어붙여 -50% 순환 시 끊김이 없게 한다. (globals.css .marquee 참고)
function AwardBelt({ awards, reverse = false }) {
  const repeated = [...awards, ...awards, ...awards, ...awards];
  return (
    <div className="marquee">
      <div className={`marquee-track py-1 ${reverse ? "reverse" : ""}`} aria-hidden={false}>
        {repeated.map((a, i) => (
          <div
            key={`${a.title}-${i}`}
            className="flex shrink-0 items-center gap-4 rounded-2xl border border-black/[0.07] bg-white py-3 pl-4 pr-6 shadow-sm"
            aria-hidden={i >= awards.length}
          >
            {/* 로고는 높이만 통일하고 폭은 원본 비율대로 (찌그러짐 방지) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/images/${a.hint}`}
              alt={i < awards.length ? a.title : ""}
              loading="lazy"
              className="h-12 w-auto max-w-[130px] shrink-0 rounded-md object-contain sm:h-14"
            />
            {a.lines ? (
              <ul className="space-y-0.5">
                {a.lines.map((line) => (
                  <li key={line} className="whitespace-nowrap text-[13px] font-semibold leading-snug text-ink/75">
                    {line}
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <p className="whitespace-nowrap text-[11px] font-bold tracking-wide text-gold">{a.period}</p>
                <p className="whitespace-nowrap text-[15px] font-extrabold leading-tight text-ink">
                  {a.title}
                  {a.detail && <span className="ml-1.5 text-[13px] font-medium text-ink/50">{a.detail}</span>}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LivingBenefits() {
  const heroAward = brandAwards.find((a) => a.hero);
  const otherAwards = brandAwards.filter((a) => !a.hero);
  const beltTop = otherAwards.slice(0, 3);
  const beltBottom = otherAwards.slice(3);

  return (
    <section id="benefits" className="bg-white py-20 sm:py-28">
      <div className="container-content">
        <Reveal className="section-head">
          <span className="section-label">WHY GUWOL</span>
          <h2 className="section-title">
            실거주로 살펴본
            <br />
            구월아트파크의 장점
          </h2>
          <p className="section-lead">
            입지, 브랜드, 인프라, 교통, 타입까지.
            <br />
            매일의 생활이 편해지는 이유를 하나씩 확인해 보세요.
          </p>
        </Reveal>

        {/* 구월동 중심입지: 조감도는 전체가 보여야 하므로 실측 비율 사용.
            문구는 사진 위 오버레이 대신 아래 캡션으로 둬서 사진을 가리지 않는다. */}
        <Reveal className="mt-14">
          <div className="overflow-hidden rounded-3xl">
            <Photo
              ratio="2384/1630"
              tone="charcoal"
              hint="aerial.jpg"
              label="단지 조감도, 전경 (건물 외관 전체가 보이는 컷)"
              alt="힐스테이트 구월아트파크 조감도"
            />
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-2xl font-extrabold text-ink sm:text-4xl">
              구월동, 인천의 상징적 도시 중심
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-ink/65 sm:text-lg">
              인천 경제, 행정, 문화의 중심 구월동 생활권 한가운데. 인천광역시청과 인천문화예술회관이
              가깝습니다.
            </p>
          </div>
        </Reveal>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-ink/40">
          ※ 본 CG는 소비자의 이해를 돕기 위해 제작된 것으로 실제와 차이가 있을 수 있으며, 실제
          시공 및 인허가 과정에서 일부 변경될 수 있습니다.
        </p>
      </div>

      {/* 브랜드 수상: 카운트업 히어로 지표 + 무한 롤링 로고 벨트.
          벨트는 컨테이너 밖 화면 폭 전체를 쓴다. */}
      {heroAward && (
        <div className="mt-8 bg-brand py-16 text-center text-white sm:py-24">
          <div className="container-content flex flex-col items-center">
            {/* 대표 지표 엠블럼 (월계관 + No.1) */}
            <AwardSeal className="mb-6 h-16 w-16 sm:h-20 sm:w-20" />
            <p className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              브랜드평판지수 <span className="text-gold-light">1위</span>
            </p>
            {heroAward.countUp && (
              <p className="mt-5 text-6xl font-black leading-none sm:text-8xl md:text-9xl">
                <CountUp end={heroAward.countUp} suffix={heroAward.countUpSuffix} />
                <span className="ml-3 align-middle text-2xl font-bold text-white/75 sm:text-4xl">
                  연속
                </span>
              </p>
            )}
            <p className="mt-5 text-xs text-white/45 sm:text-sm">
              2019~2026, {heroAward.org}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4 bg-ivory py-10">
        <AwardBelt awards={beltTop} />
        <AwardBelt awards={beltBottom} reverse />
      </div>

      <div className="container-content">
        {/* 03 생활 인프라: 원본이 거의 정사각형이라 폭을 줄여 잘림 없이 보여준다 */}
        <div className="mt-20 grid items-center gap-8 lg:grid-cols-2">
          <Reveal from="left" className="overflow-hidden rounded-3xl">
            <Photo
              ratio="887/796"
              tone="slate"
              hint="infra.jpg"
              label="주변 상권 거리뷰 (백화점, 마트 등)"
              alt="구월동 생활 인프라"
            />
          </Reveal>
          <Reveal from="right">
            <h3 className="text-2xl font-extrabold text-ink sm:text-4xl">
              반경 500m,
              <br />
              이미 다 있는 생활권
            </h3>
            <p className="mt-4 text-base leading-relaxed text-ink/65 sm:text-lg">
              백화점, 대형마트, 종합병원까지 걸어서 오갈 수 있는 생활 인프라.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {nearbyInfra.map((name) => (
                <span
                  key={name}
                  className="rounded-full bg-ivory px-4 py-2 text-sm font-bold text-ink/80"
                >
                  {name}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* 교통: 실측 비율(1672/941)로 상하 잘림 없이. 문구는 사진 아래 캡션. */}
        <Reveal className="mt-20">
          <div className="overflow-hidden rounded-3xl">
            <Photo
              ratio="1672/941"
              tone="gold"
              hint="transit.jpg"
              label="예술회관역 위치도, 지하 연결통로 사진"
              alt="예술회관역 지하 직결"
            />
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-2xl font-extrabold text-ink sm:text-4xl">
              예술회관역, 지하로 다이렉트 연결
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-ink/65 sm:text-lg">
              {project.station}. {project.gtx}로 서울 접근성도 함께 좋아집니다.
            </p>
          </div>
        </Reveal>

        {/* 구월 vs 송도 서울 접근성 비교: 가격 정보는 절대 포함하지 않음 */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[transitCompare.songdo, transitCompare.guwol].map((t, ti) => (
            <Reveal key={t.label} from={ti === 0 ? "left" : "right"} delay={ti * 100}>
            <div className="lift-card h-full rounded-2xl bg-ivory p-6">
              <div className="overflow-hidden rounded-xl">
                <Photo
                  ratio={t.ratio}
                  tone="slate"
                  hint={t.hint}
                  label={`${t.label} 위치도`}
                  alt={`${t.label} 위치도`}
                />
              </div>
              <p className="mt-4 text-base font-extrabold text-ink">{t.label}</p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {t.steps.map((s, i) => (
                  <span key={s.name} className="flex items-center gap-1.5">
                    {i > 0 && <ArrowRightIcon className="h-3.5 w-3.5 shrink-0 text-ink/30" />}
                    <span className="rounded-full bg-white px-3 py-1.5 text-sm">
                      <span className="font-bold text-ink">{s.name}</span>
                      <span className="ml-1.5 text-ink/50">{s.time}</span>
                    </span>
                  </span>
                ))}
              </div>
              <span className="mt-4 inline-block rounded-full bg-brand px-4 py-1.5 text-sm font-bold text-white">
                {t.badge}
              </span>
            </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-ink/40">{transitCompare.disclaimer}</p>

        {/* 다양한 타입: 실내 컷도 잘리지 않게 실측 비율. 문구는 사진 아래 캡션. */}
        <Reveal className="mt-10">
          <div className="overflow-hidden rounded-3xl">
            <Photo
              ratio="1934/1006"
              tone="charcoal"
              hint="unit.jpg"
              label="유니트 대표 컷 (거실 또는 침실)"
              alt="타입별 유니트"
            />
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-2xl font-extrabold text-ink sm:text-4xl">
              가족 구성에 맞는 두 가지 평면
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-ink/65 sm:text-lg">
              전 타입 4Bay 구조로 개방감과 채광을 확보했습니다. 84A, 84B, 101.
            </p>
          </div>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {project.types.map((t, i) => (
            <Reveal key={t.name} from="up" delay={i * 90}>
              <div className="lift-card h-full rounded-2xl bg-brand/[0.04] p-6">
                <span className="text-3xl font-extrabold text-brand">{t.name}</span>
                <p className="mt-3 text-base font-bold text-ink">{t.desc}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{t.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* 개발 호재: 세로 지그재그 배치로 크게. (기존 3열 그리드는 눈에 띄지 않아 폐기) */}
      <div className="mt-24 bg-ivory py-20 sm:py-24">
        <div className="container-content">
          <Reveal className="section-head">
            <span className="section-label">DEVELOPMENT</span>
            <h2 className="section-title">
              함께 살펴보면<br className="sm:hidden" /> 좋은 개발 계획
            </h2>
          </Reveal>

          <div className="mt-14 space-y-14 sm:space-y-20">
            {developments.map((d, i) => {
              const zig = i % 2 === 1; // 홀수 항목은 오른쪽 정렬
              return (
                <Reveal key={d.title} from={zig ? "right" : "left"}>
                  <div
                    className={`flex flex-col gap-4 sm:w-4/5 ${
                      zig ? "sm:ml-auto sm:items-end sm:text-right" : "sm:items-start"
                    }`}
                  >
                    <h3 className="text-2xl font-extrabold leading-tight text-ink sm:text-4xl">
                      {d.title}
                    </h3>
                    <p className="max-w-xl text-base leading-relaxed text-ink/65 sm:text-xl">
                      {d.desc}
                    </p>
                    {d.stat && (
                      <p className="text-3xl font-extrabold text-brand sm:text-5xl">
                        <span className="mr-2 align-middle text-sm font-bold text-ink/45 sm:text-base">
                          {d.stat.label}
                        </span>
                        {Number.isInteger(d.stat.value) ? (
                          <CountUp end={d.stat.value} suffix={d.stat.suffix} />
                        ) : (
                          `${d.stat.value}${d.stat.suffix}`
                        )}
                      </p>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>

          <p className="mt-14 text-center text-[11px] leading-relaxed text-ink/40">
            ※ 위 개발 계획은 관계 법령 및 정부, 지자체 정책에 따라 변경되거나 취소될 수 있으며,
            시행사, 시공사와는 무관합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
