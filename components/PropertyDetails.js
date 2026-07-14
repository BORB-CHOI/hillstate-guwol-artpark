import Photo from "./Photo";
import Reveal from "./Reveal";
import { CheckIcon } from "./Icons";

// 공식 브리핑북(상품안내) 기준 세대특화 시스템 항목
const smartHomeFeatures = [
  "주차장 통합관리 시스템 (재외치 안내, CCTV)",
  "무인 모바일 미니 택배함 (냉장/냉동)",
  "실별 온도조절기, 일괄소등 스위치",
  "Hi-IoT 서비스, Car to Home",
  "안심형 도어폰, 세대 침입 감지(동체감지기)",
  "0.3㎛ 초미세먼지 99% 이상 제거 헤파필터",
];

// 타입별 평면도. 도면은 절대 오버레이로 가리지 않는다.
// 설명은 이미지 옆(데스크톱) 또는 아래(모바일)에 큰 타이포로 배치한다.
const floorPlans = [
  {
    hint: "plan-84a.jpg",
    ratio: "1329/830",
    name: "84A",
    households: "248세대",
    features: ["4Bay 판상형 구조", "광폭(4.8m) 거실", "와이드 아일랜드 식탁"],
  },
  {
    hint: "plan-84b.jpg",
    ratio: "1337/851",
    name: "84B",
    households: "124세대",
    features: ["4Bay 맞통풍 판상형 구조", "개방감과 채광", "환기에 유리"],
  },
  {
    hint: "plan-101.jpg",
    ratio: "1353/847",
    name: "101",
    households: "124세대",
    features: ["4Bay 맞통풍 판상형 구조", "광폭(5.1m) 거실", "대형 드레스룸, 파우더룸"],
  },
];

export default function PropertyDetails() {
  return (
    <section className="bg-ivory py-20 sm:py-28">
      <div className="container-content">
        <Reveal className="section-head">
          <span className="section-label">SITE DETAILS</span>
          <h2 className="section-title">
            단지 배치와 평면,
            <br />
            자세히 살펴보세요
          </h2>
          <p className="section-lead">
            동 배치부터 조경, 커뮤니티, 타입별 평면까지. 방문 전에 미리 확인할 수 있습니다.
          </p>
        </Reveal>

        {/* 단지배치도: 도면이므로 잘리지 않게 contain, 오버레이 없이 설명은 아래에 */}
        <div className="mt-16 text-center">
          <span className="section-label">LAYOUT</span>
          <h3 className="text-2xl font-extrabold text-ink sm:text-4xl">단지 배치도</h3>
          <Reveal className="mt-6">
            <Photo
              ratio="1235/897"
              fit="contain"
              frame="diagram"
              tone="slate"
              hint="site-plan.jpg"
              label="단지 배치도 (동 배치, 조경 도면)"
              alt="단지 배치도"
            />
          </Reveal>
          <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-relaxed text-ink/80 sm:text-lg">
            4개동, 총 496세대. 동별 위치와 포켓정원, 놀이터, 산책로 배치를 한눈에 확인하세요.
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-ink/40">
            ※ 본 이미지는 소비자의 이해를 돕기 위한 것으로 실제와 차이가 있을 수 있습니다.
          </p>
        </div>

        {/* 조경 2컷: 사진 카드. 원본 비율(1.43)에 맞춰 잘림 최소화 */}
        <div className="mt-20 text-center">
          <span className="section-label">LANDSCAPE</span>
          <h3 className="text-2xl font-extrabold text-ink sm:text-4xl">
            조경, 프라이빗 옥외공간
          </h3>
          <div className="mt-6 grid gap-5 text-left sm:grid-cols-2">
            <Reveal from="left" className="overflow-hidden">
              <Photo
                ratio="1333/932"
                tone="charcoal"
                hint="landscape-1.jpg"
                label="조경 사진 1 (중정, 휴게 광장)"
                alt="단지 내 조경 광장"
                caption="중정, 휴게 광장"
              />
            </Reveal>
            <Reveal from="right" className="overflow-hidden" delay={80}>
              <Photo
                ratio="1333/932"
                tone="gold"
                hint="landscape-2.jpg"
                label="조경 사진 2 (놀이, 운동 공간)"
                alt="단지 내 조경 휴게공간"
                caption="놀이, 운동 공간"
              />
            </Reveal>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-ink/40">
            ※ 본 이미지는 소비자의 이해를 돕기 위한 것으로 실제와 차이가 있을 수 있습니다.
          </p>
        </div>

        {/* 커뮤니티 3컷: 피트니스는 원본 비율(1536x834)에 맞춰 상하 잘림 제거 */}
        <div className="mt-20 text-center">
          <span className="section-label">COMMUNITY</span>
          <h3 className="text-2xl font-extrabold text-ink sm:text-4xl">
            커뮤니티, B1 스포츠존과 4F 퍼블릭존
          </h3>
          <div className="mt-6 text-left">
            <Reveal className="overflow-hidden rounded-2xl">
              <Photo
                ratio="1536/834"
                tone="slate"
                hint="community-fitness.jpg"
                label="B1 피트니스 GX룸 사진"
                alt="B1 피트니스 GX룸"
                caption="B1 피트니스 GX룸"
              />
            </Reveal>
          </div>
          <div className="mt-5 grid gap-5 text-left sm:grid-cols-2">
            <Reveal className="overflow-hidden rounded-2xl" delay={60}>
              <Photo
                ratio="612/466"
                tone="charcoal"
                hint="community-clubhouse.jpg"
                label="4F 클럽하우스 사진"
                alt="4F 클럽하우스"
                caption="4F 클럽하우스"
              />
            </Reveal>
            <Reveal className="overflow-hidden rounded-2xl" delay={120}>
              <Photo
                ratio="612/466"
                tone="gold"
                hint="community-kids.jpg"
                label="4F 키즈라운지 사진"
                alt="4F 키즈라운지"
                caption="4F 키즈라운지"
              />
            </Reveal>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-ink/40">
            ※ 커뮤니티시설 내 관리 및 운영을 위한 가구, 비품, 스탠드, 각종 집기류는 실 시공 시
            설치되지 않을 수 있습니다. 소비자의 이해를 돕기 위한 이미지로써 제작된 것입니다.
          </p>
        </div>

        {/* 스마트홈 */}
        <div className="mt-20 border-t border-black/8 pt-12 text-center">
          <span className="section-label">SMART HOME</span>
          <h3 className="text-2xl font-extrabold text-ink sm:text-4xl">
            안전에서 안심까지, 세대특화 스마트홈
          </h3>
          <div className="mx-auto mt-8 grid max-w-3xl gap-3 text-left sm:grid-cols-2">
            {smartHomeFeatures.map((f) => (
              <div key={f} className="lift-card flex items-start gap-2 rounded-xl px-2 py-1.5">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <p className="text-sm text-ink/70">{f}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 타입별 평면도: 도면 위에 아무것도 얹지 않는다.
            도면과 설명을 지그재그(좌/우 교차)로 배치해 리듬을 준다. */}
        <div className="mt-20 text-center">
          <span className="section-label">FLOOR PLAN</span>
          <h3 className="text-2xl font-extrabold text-ink sm:text-4xl">타입별 평면도</h3>
          <div className="mt-10 space-y-14 text-left">
            {floorPlans.map((p, i) => {
              const zig = i % 2 === 1;
              return (
                <Reveal key={p.name} from={zig ? "right" : "left"}>
                  <div
                    className={`grid items-center gap-6 lg:grid-cols-[3fr,2fr] ${
                      zig ? "lg:[direction:rtl]" : ""
                    }`}
                  >
                    <div className="lg:[direction:ltr]">
                      <Photo
                        ratio={p.ratio}
                        fit="contain"
                        frame="diagram"
                        tone="slate"
                        hint={p.hint}
                        label={`${p.name} 평면도`}
                        alt={`${p.name} 타입 평면도`}
                      />
                    </div>
                    <div className="lg:[direction:ltr]">
                      <p className="text-4xl font-extrabold text-brand sm:text-6xl">{p.name}</p>
                      <p className="mt-1 text-lg font-bold text-ink/70 sm:text-xl">
                        {p.households}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-base text-ink/70 sm:text-lg">
                            <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-gold" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <p className="mt-6 text-[11px] leading-relaxed text-ink/40">
            ※ 상기 수치는 상담자료 작성 과정에서 오기입 또는 오타가 있을 수 있으며, 참고용으로만
            사용해 주시기 바랍니다.
          </p>
        </div>
      </div>
    </section>
  );
}
